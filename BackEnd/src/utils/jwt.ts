import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/envConfg";

export const generateToken = (user: any) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
      name: user.name,
      email: user.email,
      org_id: user.org_id,
    },
    JWT_SECRET,
    {
      expiresIn: "10d",
    },
  );
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET);
};
