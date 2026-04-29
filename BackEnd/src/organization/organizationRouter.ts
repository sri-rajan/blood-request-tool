import { Router } from "express";
import {
  getOrganizationController,
  updateOrganizationController,
} from "./organizationController";
import { validate } from "../utils/middleware/validate";
import { updateOrganizationValidator } from "./organizationvalidator";

const organizationRouter = Router();
organizationRouter.get("/", getOrganizationController);
organizationRouter.put(
  "/",
  validate(updateOrganizationValidator),
  updateOrganizationController,
);

export { organizationRouter };
