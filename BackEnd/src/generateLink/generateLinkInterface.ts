enum GenerateLinkStatus {
  NEW = "new",
  UPDATED = "updated",
  COMPLETED = "completed",
}

interface GenerateLink {
  org_id: string;
  blood_req_id: string;
  status: GenerateLinkStatus;
  created_at: number;
  created_by: string;
  updated_at: number;
  updated_by: string;
}

export { GenerateLink, GenerateLinkStatus };
