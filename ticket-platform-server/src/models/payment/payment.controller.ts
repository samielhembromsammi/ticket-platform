import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { PaymentService } from "./payment.service";
import { JwtUserPayload } from "../../middlewares/auth";

const createPayment = catchAsync(async (req: Request, res: Response) => {
  const { eventId, quantity, method, callbackURL } = req.body;
  const { id: userId } = req.user as JwtUserPayload;

  const result = await PaymentService.createPaymentIntent(
    userId,
    eventId,
    quantity,
    method,
    callbackURL
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Payment initiated successfully",
    data: result,
  });
});

const verifyPayment = catchAsync(async (req: Request, res: Response) => {
  const { paymentIntent, method } = req.body;

  const result = await PaymentService.verifyPayment(paymentIntent, method);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Payment verified successfully",
    data: result,
  });
});

const sslSuccess = catchAsync(async (req: Request, res: Response) => {
  // SSLCommerz sends data in POST body
  const { tran_id, val_id } = req.body;
  const queryTranId = req.query.tran_id as string;
  
  const targetTranId = tran_id || queryTranId;
  const targetValId = val_id || req.query.val_id;

  const frontendURL = process.env.FRONTEND_URL || "http://localhost:3000";

  try {
    // We must use val_id for validation
    await PaymentService.verifyPayment(targetValId as string, "sslcommerz", targetTranId as string);
    res.redirect(`${frontendURL}/checkout/success?paymentID=${targetTranId}&status=success&method=sslcommerz`);
  } catch (error) {
    console.error("SSL Success Verification Failed:", error);
    res.redirect(`${frontendURL}/checkout/success?status=fail`);
  }
});


const sslFail = catchAsync(async (req: Request, res: Response) => {
  const frontendURL = process.env.FRONTEND_URL || "http://localhost:3000";
  res.redirect(`${frontendURL}/checkout/success?status=fail`);
});

const sslCancel = catchAsync(async (req: Request, res: Response) => {
  const frontendURL = process.env.FRONTEND_URL || "http://localhost:3000";
  res.redirect(`${frontendURL}/checkout/success?status=cancel`);
});

const sslIpn = catchAsync(async (req: Request, res: Response) => {
  const { tran_id, status } = req.body;
  if (status === "VALID" || status === "VALIDATED") {
    await PaymentService.verifyPayment(tran_id, "sslcommerz");
  }
  res.status(httpStatus.OK).send("IPN Received");
});

const getMyPayments = catchAsync(async (req: Request, res: Response) => {
  const { id: userId } = req.user as JwtUserPayload;
  const result = await PaymentService.getMyPaymentsFromDB(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Payment history fetched successfully",
    data: result,
  });
});

export const PaymentController = {
  createPayment,
  verifyPayment,
  sslSuccess,
  sslFail,
  sslCancel,
  sslIpn,
  getMyPayments,
};

