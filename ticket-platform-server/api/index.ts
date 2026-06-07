import app from "../src/app";
import { connectDB } from "../src/config/db";

// Connect to the database when the serverless function spins up
let isConnected = false;

// Modify connectDB or assure it's called
const init = async () => {
  if (!isConnected) {
    await connectDB();
    isConnected = true;
  }
};

// We intercept the request slightly to ensure DB is connected before handling logic
export default async (req: any, res: any) => {
  await init();
  return app(req, res);
};
