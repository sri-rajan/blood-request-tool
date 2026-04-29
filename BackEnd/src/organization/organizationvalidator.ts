import Joi from "joi";
import { ExpiryType } from "./organizationInterface";

const updateOrganizationValidator = Joi.object({
  blood_request_settings: Joi.object({
    expiry_after: Joi.object({
      value: Joi.number().required(),
      type: Joi.string()
        .valid(...Object.values(ExpiryType))
        .required(),
    }).required(),
  }).required(),
});

export { updateOrganizationValidator };
