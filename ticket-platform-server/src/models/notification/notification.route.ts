import express from "express";
import { auth } from "../../middlewares/auth";
import { NotificationController } from "./notification.controller";

const router = express.Router();

router.get(
  "/my",
  auth("admin", "user", "organizer"),
  NotificationController.getMyNotifications
);

router.patch(
  "/mark-as-read/:id",
  auth("admin", "user", "organizer"),
  NotificationController.markAsRead
);

router.patch(
  "/mark-all-read",
  auth("admin", "user", "organizer"),
  NotificationController.markAllAsRead
);

export const NotificationRoutes = router;
