import { Router } from "express";
import {
  addBloodRequestForm,
  getCustomerPortalController,
} from "./customerPortalController";
import { validate } from "../utils/middleware/validate";
import { addBloodRequestFormValidate } from "./customerPortalVallidator";

const customerPortalRouter = Router();

customerPortalRouter.get("/:customerPortalId", getCustomerPortalController);

customerPortalRouter.post(
  "/:customerPortalId",
  validate(addBloodRequestFormValidate),
  addBloodRequestForm,
);

export { customerPortalRouter };
