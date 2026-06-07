import { Coupon, ICoupon } from "./coupon.model";

export const CouponService = {
  createCoupon: async (data: ICoupon) => {
    return await Coupon.create(data);
  },

  getAllCoupons: async () => {
    return await Coupon.find().sort({ createdAt: -1 });
  },

  updateCoupon: async (id: string, data: Partial<ICoupon>) => {
    return await Coupon.findByIdAndUpdate(id, data, { new: true });
  },

  deleteCoupon: async (id: string) => {
    return await Coupon.findByIdAndDelete(id);
  },

  validateCoupon: async (code: string) => {
    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });
    if (!coupon) return null;
    if (coupon.expiryDate < new Date()) return null;
    if (coupon.usedCount >= coupon.usageLimit) return null;
    return coupon;
  },
};
