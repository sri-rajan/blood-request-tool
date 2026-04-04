import { Request, Response } from "express";
import { userModel } from "./userMode";
import { generateToken } from "../utils/jwt";
import bcrypt from "bcrypt";
import { AuthRequest } from "../interface";
import { sendErrorResponse } from "../config/errorHandler";
import { UserRole } from "./userInterface";
import { INTERNAL_SECRET } from "../config/envConfg";

interface addUserInterface {
  name: string;
  email: string;
  phone: {
    country_code: string;
    value: string;
  };
  password: string;
  role?: string;
  userId?: string;
}

const addUser = async ({
  name,
  email,
  password,
  role = UserRole.USER,
  userId,
  phone,
}: addUserInterface) => {
  const exists = await userModel.findOne({ email }).lean();
  if (exists) throw { message: "User exists", status: 400 };

  const hash = await bcrypt.hash(password, 10);

  const user = await userModel.create({
    name,
    email,
    phone,
    password: hash,
    role,
    is_verified: true, // TODO: Add Verification Method via email afterwards
    ...(userId ? { created_by: String(userId) } : {}),
  });
  return { ...user, password: "XXXX" };
};

const addUserController = async (req: AuthRequest, res: Response) => {
  try {
    const { name, email, phone, password, role } = req.body;
    const user = await addUser({
      name,
      email,
      phone,
      password,
      role,
      userId: req?.user?.id || "",
    });
    return res.status(200).json({ user, message: "Successfully Added user" });
  } catch (error: any) {
    sendErrorResponse({
      req,
      res,
      message: error?.message,
      status: error?.status,
    });
  }
};
const addAdminUserController = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, password, role, secret } = req.body;
    if (!secret || secret != INTERNAL_SECRET) {
      throw { message: "Invalid Secret" };
    }
    const user = await addUser({ name, email, phone, password, role });
    return res
      .status(200)
      .json({ user, message: "Successfully Added Admin User" });
  } catch (error: any) {
    sendErrorResponse({
      req,
      res,
      message: error?.message,
      status: error?.status,
    });
  }
};

const loginUserController = async (req: AuthRequest, res: Response) => {
  try {
    const { email, password } = req.body;

    const user: any = await userModel.findOne({ email }).lean();
    if (!user) {
      throw { message: "Invalid email", status: 400 };
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      throw { message: "Wrong password", status: 400 };
    }
    const token = generateToken(user);
    return res
      .status(200)
      .json({
        accessToken: token,
        user: {
          id: user._id,
          role: user.role,
          name: user.name,
          email: user.email,
        },
        message: "Successfully Logged In",
      });
  } catch (error: any) {
    sendErrorResponse({
      req,
      res,
      message: error?.message,
      status: error?.status,
    });
  }
};

const getUserListController = () => {};
const deleteUserController = () => {};

export {
  addUserController,
  addAdminUserController,
  loginUserController,
  getUserListController,
  deleteUserController,
};
