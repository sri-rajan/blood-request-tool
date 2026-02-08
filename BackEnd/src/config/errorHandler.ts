import { Response } from "express";
import { logger } from "./loggerConfig";
import { AuthRequest } from "../interface";

const sendErrorResponse = ({
  req,
  res,
  message,
  status,
}: {
  req: AuthRequest;
  res: Response;
  message?: string;
  status: number;
}) => {
  logger.debug(`Request Error | 
  METHOD:${req.method} 
  URL:${req.url} 
  BODY:${JSON.stringify(req.body)} 
  QUERY:${JSON.stringify(req.query)}
  PARAMS:${JSON.stringify(req.params)}
  IP:${req.ip}`);
  return res.status(status || 500).json({ message: message || "Server Error" });
};

export { sendErrorResponse };
