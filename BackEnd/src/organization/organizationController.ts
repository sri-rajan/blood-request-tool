import { Response } from "express";
import { sendErrorResponse } from "../config/errorHandler";
import { AuthRequest } from "../interface";
import { organizationModel } from "./organizationModel";
import { Types } from "mongoose";
import moment from "moment";
import { checkUserInRequest } from "../utils/helper";

const getOrganizationController = async (req: AuthRequest, res: Response) => {
  try {
    const { organizationId } = req.params;
    const organization = await organizationModel
      .findById(String(organizationId))
      .lean();
    if (!organization) {
      throw {
        message: "Organization Not Found",
      };
    }
    return res.status(200).json({
      message: "Successfully Retrived Organization",
      doc: organization,
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

const updateOrganizationController = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const { organizationId } = req.params;
    checkUserInRequest(req);
    const { id } = req.user;
    const organization = await organizationModel
      .findById(String(organizationId))
      .lean();
    if (!organization) {
      throw {
        message: "Organization Not Found",
      };
    }
    const updatedOrganization = organizationModel.findOneAndUpdate(
      {
        _id: new Types.ObjectId(organizationId),
      },
      {
        ...req.body,
        updated_at: moment().utc().valueOf(),
        updated_by: String(id),
      },
      { new: true },
    );
    return res.status(200).json({
      message: "Successfully Updated Organization",
      doc: updatedOrganization,
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

export { getOrganizationController, updateOrganizationController };
