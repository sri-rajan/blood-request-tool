import fs from "fs";
import path from "path";
import morgan from "morgan";
import { createLogger, format } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import { Request } from "express";

// Ensure logs directory exists
const logDir = path.join(process.cwd(), "logs");
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

/* ======================
   INTERNAL WINSTON LOGGERS
   ====================== */

const debugWinston = createLogger({
  level: "debug",
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.printf(
      ({ timestamp, level, message, ...meta }) =>
        `${timestamp} [${level.toUpperCase()}] ${message} ${
          Object.keys(meta)?.length ? JSON.stringify(meta) : ""
        }`
    )
  ),
  transports: [
    new DailyRotateFile({
      filename: path.join(logDir, "debug-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      maxFiles: "14d",
      zippedArchive: true,
    }),
  ],
});

const accessWinston = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.printf(({ timestamp, message }) => `${timestamp} ${message}`)
  ),
  transports: [
    new DailyRotateFile({
      filename: path.join(logDir, "access-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      maxFiles: "14d",
      zippedArchive: true,
    }),
  ],
});

/* ======================
   PUBLIC LOGGER API
   ====================== */
const logger = {
  debug: (message: string, meta?: object) => debugWinston.debug(message, meta),

  info: (message: string, meta?: object) => debugWinston.info(message, meta),

  error: (message: string, meta?: object) => debugWinston.error(message, meta),

  access: (message: string) => accessWinston.info(message),
};

/* ======================
   MORGAN → ACCESS LOGGER
   ====================== */

morgan.token("body", (req: Request) => JSON.stringify(req.body));

const accessLogMiddleware = morgan(
  ":method :url :status :response-time ms :body",
  {
    stream: {
      write: (message) => logger.access(message.trim()),
    },
  }
);

export { logger, accessLogMiddleware };
