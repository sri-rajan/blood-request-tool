import moment from "moment";
import { ExpiryType } from "../organization/organizationInterface";

const expiryTypeToMomentUnit: Record<
  ExpiryType,
  moment.unitOfTime.DurationConstructor
> = {
  [ExpiryType.SECOND]: "seconds",
  [ExpiryType.MINUTE]: "minutes",
  [ExpiryType.HOUR]: "hours",
  [ExpiryType.DAY]: "days",
  [ExpiryType.MONTH]: "months",
  [ExpiryType.YEAR]: "years",
};

const getValidTillUtcFromConfig = ({
  type,
  value,
}: {
  type: ExpiryType;
  value: number;
}) => {
  return moment().add(value, expiryTypeToMomentUnit[type]).valueOf();
};

export { getValidTillUtcFromConfig };
