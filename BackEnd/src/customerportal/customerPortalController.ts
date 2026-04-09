import { Request, Response } from "express";
import { sendErrorResponse } from "../config/errorHandler";
import { generateLinkModel } from "../generateLink/generateLinkModel";
import { Types } from "mongoose";
import { bloodRequestModel } from "../bloodRequest/bloodRequestModel";

const getCustomerPortalController = async (req: Request, res: Response) => {
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
    let bloodRequestDetails;
    const bloodRequestId = generatedLinkData.blood_req_id;
    if (bloodRequestId) {
      bloodRequestDetails = await bloodRequestModel
        .findById(String(bloodRequestId))
        .lean();
      if (!bloodRequestDetails) {
        throw {
          message: "Blood Request Details not found",
        };
      }
    }

    return res.status(200).json({
      message: "Successfully Retrived Generated Link",
      data: { generatedLinkData, bloodRequestDetails },
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

const addBloodRequestForm = async (req: Request, res: Response) => {
  try {
  } catch (error: any) {
    sendErrorResponse({
      req: req as any,
      res,
      message: error?.message,
      status: error?.status,
    });
  }
};

export { getCustomerPortalController, addBloodRequestForm };
