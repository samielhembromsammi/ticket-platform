import express from "express";
import { auth } from "../../middlewares/auth";
import { FavoriteController } from "./favorite.controller";

const router = express.Router();

router.post(
  "/toggle",
  auth("admin", "user", "organizer"),
  FavoriteController.toggleFavorite
);

router.get(
  "/my",
  auth("admin", "user", "organizer"),
  FavoriteController.getMyFavorites
);

export const FavoriteRoutes = router;
