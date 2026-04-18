import { Types } from "mongoose";
import { logger } from "../config/loggerConfig";
import { generateLinkModel } from "../generateLink/generateLinkModel";
import { BloodRequestBase } from "./bloodRequestInterface";
import { GenerateLinkStatus } from "../generateLink/generateLinkInterface";
import { bloodRequestModel } from "./bloodRequestModel";
import moment from "moment";
import { AuthRequest } from "../interface";
import { sendErrorResponse } from "../config/errorHandler";
import { Response } from "express";
import { organizationModel } from "../organization/organizationModel";
import { checkUserInRequest } from "../utils/helper";

type bloodRequestDataBase =
  | {
      data: BloodRequestBase;
      userId: string;
      customerPortalId?: string;
      org_id: string;
    }
  | {
      data: BloodRequestBase;
      userId?: string;
      customerPortalId: string;
      org_id?: string;
    };

type bloodRequestData<T extends "create" | "update"> = T extends "update"
  ? bloodRequestDataBase & { bloodRequestId: string } // required
  : bloodRequestDataBase & { bloodRequestId?: string }; // optional

const addBloodRequest = async ({
  data,
  userId,
  customerPortalId,
  org_id,
}: bloodRequestData<"create">) => {
  let OrgId = org_id;
  if (customerPortalId) {
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
    if (GenerateLinkStatus.NEW != generatedLinkData.status) {
      throw {
        message: "Request Already Created",
      };
    }
    OrgId = String(generatedLinkData.org_id);
  }
  const bloodRequestData = await bloodRequestModel.create({
    ...data,
    org_id: String(OrgId || ""),
    ...(userId ? { created_by: userId } : {}),
  });
  if (customerPortalId) {
    await generateLinkModel.updateOne(
      { _id: new Types.ObjectId(String(customerPortalId)) },
      {
        blood_req_id: String(bloodRequestData._id),
        status: GenerateLinkStatus.UPDATED,
      },
    );
  }
  return bloodRequestData;
};

const editBloodRequest = async ({
  data,
  userId,
  customerPortalId,
  bloodRequestId,
  org_id,
}: bloodRequestData<"update">) => {
  try {
    let OrgId = org_id;
    if (customerPortalId) {
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
      if (![GenerateLinkStatus.NEW].includes(generatedLinkData.status)) {
        throw {
          message: "Can't Edit Request Kindly contact Admin",
        };
      }
      OrgId = generatedLinkData.org_id;
    }
    const bloodRequestDetail = await bloodRequestModel
      .findOne({
        _id: new Types.ObjectId(String(bloodRequestId)),
        org_id: String(OrgId),
      })
      .lean();
    if (!bloodRequestDetail) {
      throw {
        message: "Blood Request Not Found",
      };
    }
    const bloodRequestData = await bloodRequestModel.updateOne(
      {
        _id: new Types.ObjectId(String(bloodRequestId)),
      },
      {
        ...data,
        ...(userId ? { updated_by: userId } : { $unset: { updated_by: 0 } }),
        updated_at: moment().utc().valueOf(),
      },
    );
    if (customerPortalId) {
      await generateLinkModel.updateOne(
        { _id: new Types.ObjectId(String(customerPortalId)) },
        {
          updated_at: moment().utc().valueOf(),
        },
      );
    }
    return bloodRequestData;
  } catch (error) {
    logger.debug(`editBloodRequestForm error`);
  }
};

const updateBloodRequestStatusController = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const { bloodRequestId } = req.params;
    const { status } = req.body;
    checkUserInRequest(req);
    const { org_id, id } = req.user;
    const bloodRequestDetail = await bloodRequestModel.findOne({
      _id: new Types.ObjectId(String(id)),
      org_id: String(org_id),
    });
    if (!bloodRequestDetail) {
      throw {
        message: "Blood Request Not Found",
      };
    }

    const bloodRequestData = await bloodRequestModel.updateOne(
      {
        _id: new Types.ObjectId(String(id)),
        org_id: String(org_id),
      },
      {
        status,
      },
    );

    return res.status(200).json({
      message: "Successfully Updated Blood Request Status",
      doc: bloodRequestData,
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

export {
  addBloodRequest,
  editBloodRequest,
  updateBloodRequestStatusController,
};
