import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { accessLogMiddleware, logger } from "./config/loggerConfig";
import { userRouter } from "./user/userRouter";
import { generateLinkRouter } from "./generateLink/generateLinkRouter";
import { customerPortalRouter } from "./customerportal/customerPortalRouter";
import { bloodRequestRouter } from "./bloodRequest/bloodRequestRouter";
import { validate } from "./utils/middleware/validate";
import {
  adminAddUserValidator,
  loginUserValidator,
} from "./user/userValidator";
import {
  addAdminUserController,
  loginUserController,
} from "./user/userController";

const app = express();

// basic middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true, // if using cookies
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// logger to debuging and request information
app.use(accessLogMiddleware);

// db connection check
app.use((req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    logger.debug("Service Unavailable - DB NOT CONNECTED");
    return res.status(503).json({ message: "Service temporarily unavailable" });
  }
  next();
});

// health check api for monitoring
app.get("/health", (_req, res) => {
  res.json({ status: "OK" });
});

// open route without org_id
// route for adding the admin user manually
app.post(
  "user/add-admin",
  validate(adminAddUserValidator),
  addAdminUserController,
);

app.post("user/login", validate(loginUserValidator), loginUserController);

//user router and validation middleware
app.use(":organizationId/user", userRouter);
app.use(":organizationId/generate_link", generateLinkRouter);
app.use(":organizationId/blood_request", bloodRequestRouter);

// customerportal routers
app.use("/customer_portal", customerPortalRouter);

export default app;
