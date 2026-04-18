enum BloodGroup {
  A_POSITIVE = "A+",
  A_NEGATIVE = "A-",
  B_POSITIVE = "B+",
  B_NEGATIVE = "B-",
  AB_POSITIVE = "AB+",
  AB_NEGATIVE = "AB-",
  O_POSTIVE = "O+",
  O_NEGATIVE = "O-",
}

enum BloodRequestStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
  PROCESSED = "processed",
}

interface BloodRequestBase {
  patient_name: string;
  blood_group: BloodGroup;
  hospital: string;
  reason: string;
  required_date: string;
  required_time: string;
  attender_name: string;
  attender_contact: {
    country_code: string;
    value: string;
  };
}
interface BloodRequest extends BloodRequestBase {
  status: BloodRequestStatus;
  created_at: number;
  created_by: string;
  updated_at: number;
  updated_by: string;
}

export { BloodRequest, BloodGroup, BloodRequestStatus, BloodRequestBase };
