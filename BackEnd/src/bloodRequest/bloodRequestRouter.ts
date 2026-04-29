import { Router } from "express";
import {
  getBloodRequestController,
  getBloodRequestListController,
  updateBloodRequestStatusController,
} from "./bloodRequestController";
import { validate } from "../utils/middleware/validate";
import { updateBloodRequestStatusValidator } from "./blooRequestValidator";

const bloodRequestRouter = Router();

bloodRequestRouter.get("/", getBloodRequestListController);
bloodRequestRouter.get("/:bloodRequestId", getBloodRequestController);
bloodRequestRouter.patch(
  "/:bloodRequestId",
  validate(updateBloodRequestStatusValidator),
  updateBloodRequestStatusController,
);

export { bloodRequestRouter };
