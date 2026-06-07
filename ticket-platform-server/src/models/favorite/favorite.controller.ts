import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { FavoriteService } from "./favorite.service";
import { JwtUserPayload } from "../../middlewares/auth";

const toggleFavorite = catchAsync(async (req: Request, res: Response) => {
  const { eventId } = req.body;
  const { id: userId } = req.user as JwtUserPayload;

  const result = await FavoriteService.toggleFavorite(userId, eventId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: result.message,
    data: result,
  });
});

const getMyFavorites = catchAsync(async (req: Request, res: Response) => {
  const { id: userId } = req.user as JwtUserPayload;
  const result = await FavoriteService.getMyFavorites(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Favorites fetched successfully",
    data: result,
  });
});

export const FavoriteController = {
  toggleFavorite,
  getMyFavorites,
};
