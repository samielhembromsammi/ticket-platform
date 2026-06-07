import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { SupportService } from "./support.service";
import { JwtUserPayload } from "../../middlewares/auth";

const createTicket = catchAsync(async (req: Request, res: Response) => {
  const { id: userId } = req.user as JwtUserPayload;
  const result = await SupportService.createTicket({ ...req.body, user: userId });
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Support ticket created successfully",
    data: result,
  });
});

const getAllTickets = catchAsync(async (req: Request, res: Response) => {
  const result = await SupportService.getAllTickets();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Support tickets fetched successfully",
    data: result,
  });
});

const updateStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  const result = await SupportService.updateTicketStatus(id as string, status);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Ticket status updated successfully",
    data: result,
  });
});

export const SupportController = {
  createTicket,
  getAllTickets,
  updateStatus,
};
