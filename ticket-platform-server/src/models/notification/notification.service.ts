import { Notification } from "./notification.model";

export const NotificationService = {
  getMyNotifications: async (userId: string) => {
    return await Notification.find({ user: userId }).sort({ createdAt: -1 });
  },

  markAsRead: async (userId: string, notificationId: string) => {
    return await Notification.findOneAndUpdate(
      { _id: notificationId, user: userId },
      { isRead: true },
      { new: true }
    );
  },

  markAllAsRead: async (userId: string) => {
    return await Notification.updateMany({ user: userId }, { isRead: true });
  },
};
