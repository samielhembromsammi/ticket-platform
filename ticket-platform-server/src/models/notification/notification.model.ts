import { model, Schema, Types } from "mongoose";

export interface INotification {
  user: Types.ObjectId;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  isRead: boolean;
}

const notificationSchema = new Schema<INotification>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["info", "success", "warning", "error"],
      default: "info",
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const Notification = model<INotification>("Notification", notificationSchema);
