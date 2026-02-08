import { Request } from "express";

type AuthRequest = Request & {
  user?: {
    id: string;
    email?: string;
    role?: string;
  };
};

export type { AuthRequest };
