import { Request, Response } from "express";
import { sendErrorResponse } from "../config/errorHandler";
import { generateLinkModel } from "../generateLink/generateLinkModel";
import { Types } from "mongoose";
import { bloodRequestModel } from "../bloodRequest/bloodRequestModel";
import { GenerateLinkStatus } from "../generateLink/generateLinkInterface";
import {
  addBloodRequest,
  editBloodRequest,
} from "../bloodRequest/bloodRequestController";

const getCustomerPortalController = async (req: Request, res: Response) => {
  try {
    const { customerPortalId } = req.params;
    const generatedLinkData = await generateLinkModel
      .findOne({
        _id: new Types.ObjectId(String(customerPortalId)),
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

const addBloodRequestFormController = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const { customerPortalId } = req.params;
    const newBloodRequestData = await addBloodRequest({
      data,
      customerPortalId: customerPortalId || "",
    });

    return {
      message: "Successfully Created Blood Request",
      doc: newBloodRequestData,
    };
  } catch (error: any) {
    sendErrorResponse({
      req: req as any,
      res,
      message: error?.message,
      status: error?.status,
    });
  }
};

const editBloodRequestFormController = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const { customerPortalId } = req.params;
    const { bloodRequestId } = req.query;
    const editBloodRequestData = await editBloodRequest({
      data,
      customerPortalId: String(customerPortalId || ""),
      bloodRequestId: String(bloodRequestId || ""),
    });

    return {
      message: "Successfully Created Blood Request",
      doc: editBloodRequestData,
    };
  } catch (error: any) {
    sendErrorResponse({
      req: req as any,
      res,
      message: error?.message,
      status: error?.status,
    });
  }
};

export {
  getCustomerPortalController,
  addBloodRequestFormController,
  editBloodRequestFormController,
};
