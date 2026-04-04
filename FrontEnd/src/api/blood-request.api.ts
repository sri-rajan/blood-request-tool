export const BLOOD_GROUPS = [
  "A+",
  "A-",
  "B+",
  "B-",
  "AB+",
  "AB-",
  "O+",
  "O-",
] as const;

export type BloodGroup = (typeof BLOOD_GROUPS)[number];
export type RequestStatus = "pending" | "approved" | "rejected" | "processed";

export interface BloodRequest {
  id: string;
  bloodGroup: BloodGroup;
  hospitalName: string;
  patientName: string;
  reason: string;
  requiredTiming: string;
  attenderPhone: string;
  status: RequestStatus;
  createdAt: number;
  token?: string;
}

export interface RequestLink {
  token: string;
  expiryHours: number;
  createdAt: string;
  expiresAt: string;
  requestId?: string;
}
