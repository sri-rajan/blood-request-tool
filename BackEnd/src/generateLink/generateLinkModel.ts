import { model, Model, Schema } from "mongoose";
import moment from "moment";
import { GenerateLink, GenerateLinkStatus } from "./generateLinkInterface";
import { GENERATE_LINK_MODEL } from "../config/envConfg";

const generateLinkSchema = new Schema<GenerateLink, Model<GenerateLink>>({
  org_id: String,
  blood_req_id: String,
  status: { type: String, enum: Object.values(GenerateLinkStatus) },
  created_at: { type: Number, default: () => moment().valueOf() },
  created_by: String,
  updated_at: Number,
  updated_by: String,
});

const generateLinkModel = model(
  GENERATE_LINK_MODEL,
  generateLinkSchema,
  GENERATE_LINK_MODEL,
);

export { generateLinkModel };
