import { Document, Types } from "mongoose";

export type PaymentStatus = "pending" | "paid" | "failed" | "cancelled";
export type PaymentMethod = "bkash" | "nagad" | "sslcommerz" | "stripe";

export interface IPayment extends Document {
  user: Types.ObjectId;
  event: Types.ObjectId;
  ticket?: Types.ObjectId;
  transactionId: string;
  bankTransactionId?: string;
  method: PaymentMethod;
  amount: number;
  status: PaymentStatus;
  paymentIntent?: string;
  paidAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

