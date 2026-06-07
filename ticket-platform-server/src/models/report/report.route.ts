import express from "express";
import { auth } from "../../middlewares/auth";
import { ReportController } from "./report.controller";

const router = express.Router();

router.get("/", auth("admin"), ReportController.getAllReports);

router.get("/dashboard-stats", auth("admin"), ReportController.getDashboardStats);


export const ReportRoutes = router;
