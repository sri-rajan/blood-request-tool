import { Router } from "express";
import { auth } from "../utils/middleware/authMiddleware";
import {
  generateLinkController,
  getGenerateLinkController,
} from "./generateLinkController";

const generateLinkRouter = Router();

generateLinkRouter.get("/:generateLinkId", getGenerateLinkController);
generateLinkRouter.post("/", auth, generateLinkController);

export { generateLinkRouter };
