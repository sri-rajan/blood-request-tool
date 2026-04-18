import { Router } from "express";
import {
  addUserController,
  getUserListController,
  deleteUserController,
} from "./userController";
import { validate } from "../utils/middleware/validate";
import { addUserValidator } from "./userValidator";
import { authenticate } from "../utils/middleware/authMiddleware";

const userRouter = Router();

userRouter.post(
  "/add",
  authenticate,
  validate(addUserValidator),
  addUserController,
);
userRouter.get("/", authenticate, getUserListController);
userRouter.delete("/:userId", authenticate, deleteUserController);

export { userRouter };
