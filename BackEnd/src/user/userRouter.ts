import { Router } from "express";
import {
  addUserController,
  getUserListController,
  deleteUserController,
} from "./userController";
import { validate } from "../utils/middleware/validate";
import { addUserValidator } from "./userValidator";

const userRouter = Router();

userRouter.post("/add", validate(addUserValidator), addUserController);
userRouter.get("/", getUserListController);
userRouter.delete("/:userId", deleteUserController);

export { userRouter };
