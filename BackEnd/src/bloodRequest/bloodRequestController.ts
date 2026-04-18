import { Types } from "mongoose";
import { logger } from "../config/loggerConfig";
import { generateLinkModel } from "../generateLink/generateLinkModel";
import { BloodRequestBase } from "./bloodRequestInterface";
import { GenerateLinkStatus } from "../generateLink/generateLinkInterface";
import { bloodRequestModel } from "./bloodRequestModel";
import moment from "moment";

type bloodRequestDataBase =
  | {
      data: BloodRequestBase;
      userId: string;
      customerPortalId?: string;
    }
  | {
      data: BloodRequestBase;
      userId?: string;
      customerPortalId: string;
    };

type bloodRequestData<T extends "create" | "update"> = T extends "update"
  ? bloodRequestDataBase & { bloodRequestId: string } // required
  : bloodRequestDataBase & { bloodRequestId?: string }; // optional

const addBloodRequest = async ({
  data,
  userId,
  customerPortalId,
}: bloodRequestData<"create">) => {
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
  }
  const bloodRequestData = await bloodRequestModel.create({
    ...data,
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
}: bloodRequestData<"update">) => {
  try {
    const bloodRequestDetail = await bloodRequestModel
      .findOne({
        _id: new Types.ObjectId(String(bloodRequestId)),
      })
      .lean();
    if (!bloodRequestDetail) {
      throw {
        message: "Blood Request Not Found",
      };
    }
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
      if (
        ![
          GenerateLinkStatus.NEW,
          GenerateLinkStatus.REJECTED,
          GenerateLinkStatus.COMPLETED,
        ].includes(generatedLinkData.status)
      ) {
        throw {
          message: "Can't Edit Request Kindly contact Admin",
        };
      }
      await generateLinkModel.updateOne(
        { _id: new Types.ObjectId(String(customerPortalId)) },
        {
          updated_at: moment().utc().valueOf(),
        },
      );
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
    return bloodRequestData;
  } catch (error) {
    logger.debug(`editBloodRequestForm error`);
  }
};

export { addBloodRequest, editBloodRequest };
