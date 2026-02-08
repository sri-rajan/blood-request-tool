import { env } from "process";

const USER_MODEL = env.USER_MODEL || "users";
const MONGO_URI = env.MONGO_URI;
const PORT = env.PORT || 3030;
const JWT_SECRET = env.JWT_SECRET || "thisissecreet";
const INTERNAL_SECRET = env.INTERNAL_SECRET || "thisissecreet2";

export { USER_MODEL, MONGO_URI, PORT, JWT_SECRET, INTERNAL_SECRET };
