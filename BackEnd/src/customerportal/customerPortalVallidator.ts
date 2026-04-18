import Joi from "joi";
import { nameRegex } from "../config/regex";
import { BloodGroup } from "../bloodRequest/bloodRequestInterface";

const bloodRequestFormValidate = Joi.object({
  blood_group: Joi.string().valid(...Object.values(BloodGroup)),
  hospital: Joi.string(),
  patient_name: Joi.string(),
  reason: Joi.string(),
  required_date: Joi.number(),
  required_time: Joi.string(),
  attender_name: Joi.string(),
  attender_contact: {
    country_code: Joi.string(),
    value: Joi.string(),
  },
});

export { bloodRequestFormValidate };
