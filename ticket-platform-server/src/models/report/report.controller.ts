import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { ReportService } from "./report.service";

const getAllReports = catchAsync(async (req: Request, res: Response) => {
  const result = await ReportService.getAllReports();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Reports fetched successfully",
    data: result,
  });
});

const getDashboardStats = catchAsync(async (req: Request, res: Response) => {
  const result = await ReportService.getDashboardStats();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Dashboard stats fetched successfully",
    data: result,
  });
});

export const ReportController = {
  getAllReports,
  getDashboardStats,
};
