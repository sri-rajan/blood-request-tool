import Joi from "joi";
import { BloodRequestStatus } from "./bloodRequestInterface";

const updateBloodRequestStatusValidator = Joi.object({
  status: Joi.string()
    .valid(...Object.values(BloodRequestStatus))
    .optional(),
});

export { updateBloodRequestStatusValidator };
