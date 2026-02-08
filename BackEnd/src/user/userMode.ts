import { model, Model, Schema } from "mongoose";
import { User, UserRole } from "./userInterface";
import moment from "moment";
import { USER_MODEL } from "../config/envConfg";

const userSchema = new Schema<User, Model<User>>({
  name: String,
  email: String,
  phone: {
    country_code: String,
    value: String,
  },
  password: String,
  role: { type: String, enum: UserRole },
  created_at: { type: Number, default: () => moment().valueOf() },
  created_by: String,
  updated_at: Number,
  updated_by: String,
  is_deleted: { type: Boolean, default: false },
  is_disabled: { type: Boolean, default: false },
  is_verified: { type: Boolean, default: false },
});

const userModel = model(USER_MODEL, userSchema, USER_MODEL);

export { userModel };
