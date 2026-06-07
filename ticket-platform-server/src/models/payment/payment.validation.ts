import { z } from "zod";

export const PaymentValidation = {
  createPaymentSchema: z.object({
    eventId: z.string({
      message: "Event ID is required",
    }),
    quantity: z.number({
      message: "Quantity is required",
    }).min(1),
    method: z.enum(["bkash", "nagad", "sslcommerz", "stripe"] as const, {
      message: "Payment method is required",
    }),
    callbackURL: z.string({
      message: "Callback URL is required",
    }),
  }),

  verifyPaymentSchema: z.object({
    paymentIntent: z.string({
      message: "Payment Intent/Ref ID is required",
    }),
    method: z.enum(["bkash", "nagad", "sslcommerz", "stripe"] as const, {
      message: "Payment method is required",
    }),
  }),
};

