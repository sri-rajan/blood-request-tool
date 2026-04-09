import { Request, Response } from "express";
import { sendErrorResponse } from "../config/errorHandler";
import { AuthRequest } from "../interface";
import { generateLinkModel } from "./generateLinkModel";
import { GenerateLinkStatus } from "./generateLinkInterface";
import { Types } from "mongoose";

const generateLinkController = async (req: AuthRequest, res: Response) => {
  try {
    const { org_id, id } = req?.user || {};
    const generateLink = await generateLinkModel.create({
      org_id: String(org_id),
      status: GenerateLinkStatus.NEW,
      created_by: String(id),
    });
    return res.status(200).json({
      message: "Successfully Created Generate Link",
      data: generateLink,
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

const getGenerateLinkController = async (req: Request, res: Response) => {
  try {
    const { generateLinkId } = req.params;
    const generatedLinkData = await generateLinkModel
      .findOne({
        _id: new Types.ObjectId(String(generateLinkId)),
      })
      .lean();
    if (!generatedLinkData) {
      throw {
        message: "GeneratedLink Data not found",
      };
    }

    return res
      .status(200)
      .json({
        message: "Successfully Retrived Generated Link",
        data: generatedLinkData,
      });
  } catch (error: any) {
    sendErrorResponse({
      req: req as any,
      res,
      message: error?.message,
      status: error?.status,
    });
  }
};

export { generateLinkController, getGenerateLinkController };
