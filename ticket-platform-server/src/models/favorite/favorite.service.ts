import { Favorite } from "./favorite.model";

export const FavoriteService = {
  toggleFavorite: async (userId: string, eventId: string) => {
    const existing = await Favorite.findOne({ user: userId, event: eventId });
    if (existing) {
      await Favorite.findByIdAndDelete(existing._id);
      return { message: "Removed from favorites", isFavorite: false };
    } else {
      await Favorite.create({ user: userId, event: eventId });
      return { message: "Added to favorites", isFavorite: true };
    }
  },

  getMyFavorites: async (userId: string) => {
    return await Favorite.find({ user: userId }).populate("event");
  },
};
