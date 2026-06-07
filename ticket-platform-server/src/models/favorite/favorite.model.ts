import { model, Schema, Types } from "mongoose";

export interface IFavorite {
  user: Types.ObjectId;
  event: Types.ObjectId;
}

const favoriteSchema = new Schema<IFavorite>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    event: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
  },
  { timestamps: true }
);

// Prevent duplicate favorites
favoriteSchema.index({ user: 1, event: 1 }, { unique: true });

export const Favorite = model<IFavorite>("Favorite", favoriteSchema);
