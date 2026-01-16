import { Server } from "http";
import mongoose from "mongoose";
import { logger } from "../config/loggerConfig";

let server: Server | null = null;

const setServer = (httpServer: Server) => {
  server = httpServer;
};

const shutdownApp = async (reason: string) => {
  logger.error("Shutting down application", { reason });

  if (server) {
    server.close(async () => {
      logger.access("HTTP server closed");
      await mongoose.connection.close();
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

export { setServer, shutdownApp };
