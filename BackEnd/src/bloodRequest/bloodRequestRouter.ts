import { Router } from "express";
import { authenticate } from "../utils/middleware/authMiddleware";
import {
  getBloodRequestController,
  getBloodRequestListController,
  updateBloodRequestStatusController,
} from "./bloodRequestController";
import { validate } from "../utils/middleware/validate";
import { updateBloodRequestStatusValidator } from "./blooRequestValidator";

const bloodRequestRouter = Router();

bloodRequestRouter.get("/", authenticate, getBloodRequestListController);
bloodRequestRouter.get(
  "/:bloodRequestId",
  authenticate,
  getBloodRequestController,
);
bloodRequestRouter.patch(
  "/:bloodRequestId",
  authenticate,
  validate(updateBloodRequestStatusValidator),
  updateBloodRequestStatusController,
);

export { bloodRequestRouter };
