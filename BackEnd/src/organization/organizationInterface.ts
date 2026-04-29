enum ExpiryType {
  SECOND = "SECOND",
  MINUTE = "MINUTE",
  HOUR = "HOUR",
  DAY = "DAY",
  MONTH = "MONTH",
  YEAR = "YEAR",
}

interface BloodRequestSettings {
  expiry_after: {
    value: number;
    typ: ExpiryType;
  };
}
interface Organization {
  name: string;
  country: string;
  state: string;
  city: string;
  created_at: number;
  created_by: string;
  updated_at: number;
  updated_by: string;
  is_deleted: boolean;
  is_disabled: boolean;
  blood_request_settings: BloodRequestSettings;
}

export { Organization, ExpiryType, BloodRequestSettings };
