import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../jwt";
import { UserRole } from "../../user/userInterface";

export const auth = (req: any, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ msg: "No token" });

  try {
    const decoded: any = verifyToken(token);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ msg: "Invalid token" });
  }
};

export const isAdmin = (req: any, res: Response, next: NextFunction) => {
  if (req.user.role !== UserRole.ADMIN)
    return res.status(403).json({ msg: "Admin only" });

  next();
};
