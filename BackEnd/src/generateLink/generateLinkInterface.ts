enum GenerateLinkStatus {
  NEW = "NEW",
  UPDATED = "UPDATED",
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
