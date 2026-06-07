import express from "express";

import { auth } from "../../middlewares/auth";
import validateRequest from "../../shared/validateRequest";
import { eventTicketValidation } from "./event.ticket.validation";
import { EventTicketController } from "./event.ticket.controller";

const router = express.Router();

router.post(
    "/purchase",
    auth("user"),
    validateRequest(
        eventTicketValidation.purchaseTicket
    ),
    EventTicketController.purchaseTicket
);

router.get(
    "/my-tickets",
    auth("user"),
    EventTicketController.myTickets
);

router.get(
    "/verify/:ticketNumber",
    EventTicketController.verifyTicket
);

router.get(
    "/:id",
    EventTicketController.getTicketById
);

router.patch(
    "/check-in/:ticketNumber",
    auth("admin"),
    EventTicketController.checkInTicket
);

export const EventTicketRoutes = router;