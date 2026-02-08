import { Router } from "express";
import {
  addUserController,
  loginUserController,
  getUserListController,
  deleteUserController,
  addAdminUserController,
} from "./userController";
import { validate } from "../utils/middleware/validate";
import { addUserValidator, loginUserValidator } from "./userValidator";
import { auth } from "../utils/middleware/authMiddleware";

const userRouter = Router();

// route for adding the admin user manually
userRouter.post(
  "/add-admin",
  validate(addUserValidator),
  addAdminUserController,
);

userRouter.post("/login", validate(loginUserValidator), loginUserController);
userRouter.post("/add", auth, validate(addUserValidator), addUserController);
userRouter.get("/", auth, getUserListController);
userRouter.delete("/:userId", auth, deleteUserController);

export { userRouter };
