import { EventTicket } from "../event-ticket/event.ticket.model";
import { Payment } from "./payment.model";
import { BkashService } from "./bkash.service";
import { NagadService } from "./nagad.service";
import { SSLCommerzService } from "./sslcommerz.service";
import stripe from "../../utils/stripe";
import AppError from "../../errors/AppError";
import httpStatus from "http-status-codes";
import { Event } from "../event/event.model";
import { User } from "../user/user.model";
import { generateTicketNumber } from "../../utils/generateTicketNumber";
import { generateQRCode } from "../../utils/generateQRCode";

export const PaymentService = {
  createPaymentIntent: async (
    userId: string,
    eventId: string,
    quantity: number,
    method: "bkash" | "nagad" | "sslcommerz" | "stripe",
    callbackURL: string
  ) => {
    // 1. Find the event
    const event = await Event.findById(eventId);
    if (!event) {
      throw new AppError(httpStatus.NOT_FOUND, "Event not found");
    }

    if (!event.isPremium) {
      throw new AppError(httpStatus.BAD_REQUEST, "Free events do not require payment");
    }

    // 2. Check ticket availability
    if (event.soldTickets + quantity > event.totalTickets) {
      throw new AppError(httpStatus.BAD_REQUEST, "Not enough tickets available");
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }

    const unitPrice = event.price || 0;
    const vat = 0; // Removed hidden VAT
    const serviceCharge = 0; // Removed hidden service charge
    const totalFare = unitPrice * quantity;

    // 3. Generate ticket number and QR
    const ticketNumber = generateTicketNumber();
    const qrCode = await generateQRCode(ticketNumber);

    // 4. Create pending ticket
    const ticket = await EventTicket.create({
      event: event._id,
      user: userId,
      ticketNumber,
      qrCode,
      status: "pending",
      price: unitPrice,
      quantity,
      vat,
      serviceCharge,
      totalFare,
      pnrNumber: ticketNumber.substring(0, 10).toUpperCase(),
    });

    // 5. Create pending payment record
    const transactionId = `TXN_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const payment = await Payment.create({
      user: userId,
      event: event._id,
      ticket: ticket._id,
      transactionId,
      method,
      amount: totalFare,
      status: "pending",
    });

    let gatewayResponse;
    let redirectURL;

    // 6. Initiate payment with respective gateway
    if (method === "bkash") {
      gatewayResponse = await BkashService.createPayment(
        payment.amount,
        payment.transactionId,
        callbackURL
      );
      redirectURL = gatewayResponse.redirectURL;
      payment.paymentIntent = gatewayResponse.paymentID;
    } else if (method === "nagad") {
      gatewayResponse = await NagadService.createPayment(
        payment.amount,
        payment.transactionId,
        callbackURL
      );
      redirectURL = gatewayResponse.redirectURL;
      payment.paymentIntent = gatewayResponse.paymentRefId;
    } else if (method === "sslcommerz") {
      const backendUrl = process.env.BACKEND_URL || "http://localhost:5000";
      gatewayResponse = await SSLCommerzService.initPayment({
        total_amount: payment.amount,
        tran_id: transactionId,
        success_url: `${backendUrl}/api/v1/payments/sslcommerz/success?tran_id=${transactionId}`,
        fail_url: `${backendUrl}/api/v1/payments/sslcommerz/fail?tran_id=${transactionId}`,
        cancel_url: `${backendUrl}/api/v1/payments/sslcommerz/cancel?tran_id=${transactionId}`,
        cus_name: user.fullName || "Guest User",
        cus_email: user.email,
        cus_phone: "01767122497",
        // cus_phone: user.phoneNumber || "01700000000",
        product_name: event.title || "Event Ticket",
        product_category: "Ticket",
      });

      if (gatewayResponse?.status === "SUCCESS" && gatewayResponse?.GatewayPageURL) {
        redirectURL = gatewayResponse.GatewayPageURL;
        payment.paymentIntent = transactionId; // For SSL, tran_id is the primary identifier
      } else {
        const reason = gatewayResponse?.failedreason || "Gateway initialization failed";
        throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, `SSLCommerz failed: ${reason}`);
      }
    } else if (method === "stripe") {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        success_url: `${callbackURL}?paymentID={CHECKOUT_SESSION_ID}&status=success&method=stripe`,
        cancel_url: `${callbackURL}?status=cancel&method=stripe`,
        customer_email: user.email,
        client_reference_id: transactionId,
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: event.title || "Event Ticket",
                description: `Ticket for ${event.title}`,
              },
              unit_amount: Math.round(payment.amount * 100), // Stripe takes amounts in cents
            },
            quantity: 1, // Quantity is 1 because totalFare is already total cost
          },
        ],
      });
      redirectURL = session.url;
      payment.paymentIntent = session.id;
    } else {
      throw new AppError(httpStatus.BAD_REQUEST, "Invalid payment method");
    }

    await payment.save();

    return {
      payment,
      ticketId: ticket._id,
      redirectURL,
    };
  },

  verifyPayment: async (
    paymentIntent: string, // This will be val_id for SSLCommerz or checkout session id for Stripe
    method: "bkash" | "nagad" | "sslcommerz" | "stripe",
    tran_id?: string // Optional tran_id for SSLCommerz lookup
  ) => {
    // For SSLCommerz, if we have tran_id, use it. Otherwise use paymentIntent as tranId if it's not a val_id.
    // Actually, in the success handler, we now pass val_id as paymentIntent.
    let payment;
    if (method === "sslcommerz") {
      // Try to find by transactionId first if we can guess it, but usually we need to find the record to update it.
      // Since we don't store val_id yet, we should find the pending payment for this session.
      // A better way is to pass tran_id to this function as well.
      payment = await Payment.findOne({
        $or: [
          { paymentIntent: paymentIntent },
          { transactionId: tran_id }
        ]
      });
    } else {
      payment = await Payment.findOne({ paymentIntent });
    }

    if (!payment) {
      throw new AppError(httpStatus.NOT_FOUND, "Payment record not found");
    }

    if (payment.status === "paid") {
      return payment;
    }

    let verificationResult;
    let isSuccess = false;

    if (method === "bkash") {
      verificationResult = await BkashService.executePayment(paymentIntent);
      isSuccess = verificationResult?.status === "Completed";
    } else if (method === "nagad") {
      verificationResult = await NagadService.verifyPayment(paymentIntent);
      isSuccess = verificationResult?.status === "Success";
    } else if (method === "sslcommerz") {
      // For SSLCommerz, we verify using validation API with val_id
      verificationResult = await SSLCommerzService.validatePayment(paymentIntent);
      isSuccess = verificationResult?.status === "VALID" || verificationResult?.status === "VALIDATED";
    } else if (method === "stripe") {
      const session = await stripe.checkout.sessions.retrieve(paymentIntent);
      isSuccess = session.payment_status === "paid";
    }

    if (isSuccess) {
      payment.status = "paid";
      payment.paidAt = new Date();
      if (method !== "sslcommerz") {
        payment.transactionId = verificationResult.trxID || verificationResult.trxId || payment.transactionId;
      } else {
        payment.bankTransactionId = verificationResult.bank_tran_id;
        payment.paymentIntent = paymentIntent; // Store the val_id
      }
      await payment.save();

      // Update ticket status and event sold tickets
      if (payment.ticket) {
        const ticket = await EventTicket.findByIdAndUpdate(payment.ticket, {
          status: "paid",
          paymentId: payment._id,
          transactionId: payment.transactionId,
        });

        if (ticket) {
          await Event.findByIdAndUpdate(payment.event, {
            $inc: { soldTickets: ticket.quantity }
          });
        }
      }

      return payment;
    }

    payment.status = "failed";
    await payment.save();

    // Also mark ticket as cancelled if payment fails
    if (payment.ticket) {
      await EventTicket.findByIdAndUpdate(payment.ticket, { status: "cancelled" });
    }

    throw new AppError(httpStatus.BAD_REQUEST, "Payment verification failed");
  },

  getMyPaymentsFromDB: async (userId: string) => {
    return await Payment.find({ user: userId })
      .populate("event")
      .sort({ createdAt: -1 });
  },
};

