import { Router } from "express";
import { authenticate } from "../utils/middleware/authMiddleware";
import { updateBloodRequestStatusController } from "./bloodRequestController";
import { validate } from "../utils/middleware/validate";
import { updateBloodRequestStatusValidator } from "./blooRequestValidator";

const bloodRequestRouter = Router();

bloodRequestRouter.patch(
  "/:bloodRequestId",
  authenticate,
  validate(updateBloodRequestStatusValidator),
  updateBloodRequestStatusController,
);

export { bloodRequestRouter };
