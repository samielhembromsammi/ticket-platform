import express from "express";
import { UserRoutes } from "../models/user/user.route";
import { AuthRoutes } from "../models/auth/auth.route";
import { CategoryRoutes } from "../models/category/category.route";
import { EventRoutes } from "../models/event/event.route";
import { TicketRoutes } from "../models/ticket/ticket.route";
import { PaymentRoutes } from "../models/payment/payment.route";
import { EventTicketRoutes } from "../models/event-ticket/event.ticket.route";
import { FavoriteRoutes } from "../models/favorite/favorite.route";
import { NotificationRoutes } from "../models/notification/notification.route";
import { CouponRoutes } from "../models/coupon/coupon.route";
import { ReportRoutes } from "../models/report/report.route";
import { SupportRoutes } from "../models/support/support.route";

const router = express.Router();

const apiRoutes: any[] = [
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/users",
    route: UserRoutes,
  },
  {
    path: "/categories",
    route: CategoryRoutes,
  },
  {
    path: "/events",
    route: EventRoutes,
  },
  {
    path: "/tickets",
    route: TicketRoutes,
  },
  {
    path: "/event-tickets",
    route: EventTicketRoutes,
  },
  {
    path: "/payments",
    route: PaymentRoutes,
  },
  {
    path: "/favorites",
    route: FavoriteRoutes,
  },
  {
    path: "/notifications",
    route: NotificationRoutes,
  },
  {
    path: "/coupons",
    route: CouponRoutes,
  },
  {
    path: "/reports",
    route: ReportRoutes,
  },
  {
    path: "/support",
    route: SupportRoutes,
  },
];

apiRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
