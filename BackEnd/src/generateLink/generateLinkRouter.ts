import { Router } from "express";
import { generateLinkController } from "./generateLinkController";

const generateLinkRouter = Router();

generateLinkRouter.post("/", generateLinkController);

export { generateLinkRouter };
