import { Router } from "express";
import { auth } from "../utils/middleware/authMiddleware";
import { generateLinkController } from "./generateLinkController";

const generateLinkRouter = Router();

generateLinkRouter.post("/", auth, generateLinkController);

export { generateLinkRouter };
