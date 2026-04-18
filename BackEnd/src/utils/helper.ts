import { Request } from "express";
import { AuthRequest } from "../interface";

type checkUserInRequestType = (
  req: AuthRequest,
) => asserts req is Request & { user: NonNullable<AuthRequest["user"]> };

const checkUserInRequest: checkUserInRequestType = (req: AuthRequest) => {
  if (!req.user) {
    throw {
      message: "User Not Found in request",
    };
  }
};

export { checkUserInRequest };
