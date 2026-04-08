import { model, Model, Schema } from "mongoose";
import moment from "moment";
import {
  BloodGroup,
  BloodRequest,
  BloodRequestStatus,
} from "./bloodRequestInterface";
import { BLOOD_REQUEST_MODEL } from "../config/envConfg";

const bloodRequestSchema = new Schema<BloodRequest, Model<BloodRequest>>({
  request_id: String,
  name: String,
  blood_group: { type: String, enum: Object.values(BloodGroup) },
  hospital: String,
  patient_name: String,
  reason: String,
  required_date: String,
  required_time: String,
  attender_name: String,
  attender_contact: {
    country_code: String,
    value: String,
  },
  status: { type: String, enum: Object.values(BloodRequestStatus) },
  created_at: { type: Number, default: () => moment().valueOf() },
  created_by: String,
  updated_at: Number,
  updated_by: String,
});

const bloodRequestModel = model(
  BLOOD_REQUEST_MODEL,
  bloodRequestSchema,
  BLOOD_REQUEST_MODEL,
);

export { bloodRequestModel };
