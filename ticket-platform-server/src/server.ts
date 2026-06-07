import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import http from "http";
import cluster from "node:cluster";
import os from "node:os";
import app from "./app";
import { connectDB } from "./config/db";
import { IP, PORT } from "./config";
import 'dotenv/config';


const numCPUs = os.cpus().length;

async function main() {
  const server = http.createServer(app);
  try {
    await connectDB();
    // Start cron jobs
    // startJob();
    // initSocket(server);
    // console.log("Socket.IO initialised!");

    // Start server
    // Port: 5000
    server.listen(Number(PORT), IP, () => {
      console.log(`Server is running on Port : ${PORT}`);
    });

    // Handle exceptions per worker
    process.on("unhandledRejection", (err) => {
      console.error(`Server Unhandled rejection:`, err);
    });

    process.on("uncaughtException", (error) => {
      console.error(`Server Uncaught exception:`, error);
    });

    process.on("SIGINT", () => {
      console.log("SIGINT signal received, shutting down...");
      process.exit(0);
    });
  } catch (error) {
    console.error(`Server failed to start:`, error);
    process.exit(1);
  }
}

if (cluster.isPrimary && process.env.NODE_ENV === "production") {
  // Fork workers only in production
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker) => {
    console.log(`Worker ${worker.process.pid} died. Forking a new one...`);
    cluster.fork();
  });
} else {
  // In development, run single process for faster startup
  main().catch((err) => {
    console.error("Server failed to start:", err);
  });
}
