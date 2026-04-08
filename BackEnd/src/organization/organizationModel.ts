import { model, Model, Schema } from "mongoose";
import moment from "moment";
import { ORGANIZATION_MODEL } from "../config/envConfg";
import { Organization } from "./organizationInterface";

const orgSchema = new Schema<Organization, Model<Organization>>({
  name: String,
  country: String,
  state: String,
  city: String,
  created_at: { type: Number, default: () => moment().valueOf() },
  created_by: String,
  updated_at: Number,
  updated_by: String,
  is_deleted: { type: Boolean, default: false },
  is_disabled: { type: Boolean, default: false },
});

const organizationModel = model(
  ORGANIZATION_MODEL,
  orgSchema,
  ORGANIZATION_MODEL,
);

export { organizationModel };
