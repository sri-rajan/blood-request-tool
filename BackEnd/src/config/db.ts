import { shutdownApp } from "../utils/shutdown";
import { MONGO_URI } from "./envConfg";
import { logger } from "./loggerConfig";

const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    logger.access("MongoDB connectingg...");
    console.log("before connection");
    await mongoose.connect(MONGO_URI);
    console.log("after connection>>");
  } catch (err) {
    console.log("this iserrorrr", err);
    console.error("Initial MongoDB connection failed", err);
    process.exit(1);
  }
};

mongoose.connection.on("connected", () => {
  console.log("this is connected");
  logger.access("MongoDB connected");
});

mongoose.connection.on("disconnected", () => {
  console.log("this is disconnected");
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
