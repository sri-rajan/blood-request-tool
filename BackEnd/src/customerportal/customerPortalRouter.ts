import { Router } from "express";
import {
  addBloodRequestFormController,
  editBloodRequestFormController,
  getCustomerPortalController,
} from "./customerPortalController";
import { validate } from "../utils/middleware/validate";
import { bloodRequestFormValidate } from "./customerPortalVallidator";

const customerPortalRouter = Router();

customerPortalRouter.get("/:customerPortalId", getCustomerPortalController);

customerPortalRouter.post(
  "/:customerPortalId",
  validate(bloodRequestFormValidate),
  addBloodRequestFormController,
);
customerPortalRouter.put(
  "/:customerPortalId",
  validate(bloodRequestFormValidate),
  editBloodRequestFormController,
);

export { customerPortalRouter };
