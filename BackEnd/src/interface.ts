import { Request } from "express";

type AuthRequest = Request & {
  user?: {
    id: string;
    email: string;
    role: string;
    org_id: string;
  };
};

export type { AuthRequest };
