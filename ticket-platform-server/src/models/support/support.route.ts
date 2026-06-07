import express from "express";
import { auth } from "../../middlewares/auth";
import { SupportController } from "./support.controller";

const router = express.Router();

router.post("/", auth("admin", "user", "organizer"), SupportController.createTicket);
router.get("/", auth("admin"), SupportController.getAllTickets);
router.patch("/:id/status", auth("admin"), SupportController.updateStatus);

export const SupportRoutes = router;
