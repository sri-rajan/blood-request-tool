import Joi from "joi";
import { nameRegex } from "../config/regex";
import { BloodGroup } from "../bloodRequest/bloodRequestInterface";

const addBloodRequestFormValidate = Joi.object({
  blood_group: Joi.string().valid(...Object.values(BloodGroup)),
  hospital: Joi.string,
  patient_name: String,
  reason: String,
  required_date: String,
  required_time: String,
  attender_name: String,
  attender_contact: {
    country_code: String,
    value: String,
  },
});

export { addBloodRequestFormValidate };
