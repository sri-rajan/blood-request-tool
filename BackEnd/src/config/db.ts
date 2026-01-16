import { shutdownApp } from "../utils/shutdown";
import { logger } from "./loggerConfig";

const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
  } catch (err) {
    console.error("Initial MongoDB connection failed", err);
    process.exit(1);
  }
};

mongoose.connection.on("connected", () => {
  logger.access("MongoDB connected");
});

mongoose.connection.on("disconnected", () => {
  logger.debug("MongoDB disconnected");
  shutdownApp("MongoDB disconnected");
});

mongoose.connection.on("reconnected", () => {
  logger.access("MongoDB reconnected");
});

mongoose.connection.on("error", (err: any) => {
  logger.debug(`MongoDB error: ${err}`);
  shutdownApp("MongoDB Error");
});

export { connectDB };
