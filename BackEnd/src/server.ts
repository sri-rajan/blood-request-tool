import dotenv from "dotenv";
import app from "./app";
import { connectDB } from "./config/db";
import { logger } from "./config/loggerConfig";
import { setServer } from "./utils/shutdown";
dotenv.config();

const PORT = process.env.PORT || 3030;

const startServer = async () => {
  try {
    await connectDB();
    const server = app.listen(PORT, () => {
      logger.access(`Server Running at ${PORT}`);
    });
    setServer(server);
  } catch (err) {
    logger.debug(`Failed to start server, ${err}`);
    process.exit(1);
  }
};
startServer();

process.on("unhandledRejection", (reason: any) => {
  logger.error(`Unhandled Promise Rejection reason:${reason}`);
  process.exit(1);
});
process.on("uncaughtException", (err: Error) => {
  logger.error(`Uncaught Exception err:${err}`);
  process.exit(1);
});
