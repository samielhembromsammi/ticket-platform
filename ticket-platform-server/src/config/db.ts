import { DATABASE_URL } from "./index";
import mongoose from "mongoose";

export const connectDB = async () => {
  if (!DATABASE_URL) throw new Error("DATABASE_URL is not finded in .env file");
  try {
    await mongoose.connect(DATABASE_URL as string);
    console.log("MongoDB Connected Successfully.");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};
