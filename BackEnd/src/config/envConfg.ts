import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 3030;
const JWT_SECRET = process.env.JWT_SECRET || "thisissecreet";
const INTERNAL_SECRET = process.env.INTERNAL_SECRET || "thisissecreet2";

//DB ENVs
const USER_MODEL = process.env.USER_MODEL || "users";
const ORGANIZATION_MODEL = process.env.ORGANIZATION_MODEL || "organizations";

export {
  USER_MODEL,
  MONGO_URI,
  PORT,
  JWT_SECRET,
  INTERNAL_SECRET,
  ORGANIZATION_MODEL,
};
