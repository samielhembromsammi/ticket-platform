import express from "express";
import { PaymentController } from "./payment.controller";
import { PaymentValidation } from "./payment.validation";
import validateRequest from "../../shared/validateRequest";
import { auth } from "../../middlewares/auth";

const router = express.Router();

router.post(
  "/create",
  auth("admin", "user", "organizer"),
  validateRequest(PaymentValidation.createPaymentSchema),
  PaymentController.createPayment
);

router.post(
  "/verify",
  auth("admin", "user", "organizer"),
  validateRequest(PaymentValidation.verifyPaymentSchema),
  PaymentController.verifyPayment
);

// SSLCommerz Callbacks (No auth here as SSLCommerz calls these)
router.post("/sslcommerz/success", PaymentController.sslSuccess);
router.post("/sslcommerz/fail", PaymentController.sslFail);
router.post("/sslcommerz/cancel", PaymentController.sslCancel);
router.post("/sslcommerz/ipn", PaymentController.sslIpn);

// Use GET for success redirect from gateway if configured that way
router.get("/sslcommerz/success", PaymentController.sslSuccess);

router.get(
  "/my",
  auth("admin", "user", "organizer"),
  PaymentController.getMyPayments
);

export const PaymentRoutes = router;

