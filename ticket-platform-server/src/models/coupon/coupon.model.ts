import { model, Schema } from "mongoose";

export interface ICoupon {
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  expiryDate: Date;
  isActive: boolean;
  usageLimit: number;
  usedCount: number;
}

const couponSchema = new Schema<ICoupon>(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    discountType: {
      type: String,
      enum: ["percentage", "fixed"],
      required: true,
    },
    discountValue: {
      type: Number,
      required: true,
    },
    expiryDate: {
      type: Date,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    usageLimit: {
      type: Number,
      default: 100,
    },
    usedCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export const Coupon = model<ICoupon>("Coupon", couponSchema);
