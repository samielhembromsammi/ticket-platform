import express from "express";
import { auth } from "../../middlewares/auth";
import { CouponController } from "./coupon.controller";

const router = express.Router();

router.post("/", auth("admin"), CouponController.createCoupon);
router.get("/", auth("admin"), CouponController.getAllCoupons);
router.patch("/:id", auth("admin"), CouponController.updateCoupon);
router.delete("/:id", auth("admin"), CouponController.deleteCoupon);

export const CouponRoutes = router;
