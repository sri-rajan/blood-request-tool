import { Router } from "express";
import { authenticate } from "../utils/middleware/authMiddleware";
import { generateLinkController } from "./generateLinkController";

const generateLinkRouter = Router();

generateLinkRouter.post("/", authenticate, generateLinkController);

export { generateLinkRouter };
