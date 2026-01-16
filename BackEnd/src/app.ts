import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { accessLogMiddleware, logger } from "./config/loggerConfig";

const app = express();

// basic middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// logger to debuging and request information
app.use(accessLogMiddleware);

// db connection check
app.use((req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    logger.debug("Service Unavailable - DB NOT CONNECTED")
    return res.status(503).json({ message: "Service temporarily unavailable" });
  }
  next();
});

// health check api for monitoring
app.get("/health", (_req, res) => {
  res.json({ status: "OK" });
});

//user router and validation middleware

export default app;
