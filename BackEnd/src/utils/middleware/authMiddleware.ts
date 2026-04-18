import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../jwt";
import { UserRole } from "../../user/userInterface";

const authenticate = (req: any, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ msg: "No token" });
  const { organizationId } = req.params;

  try {
    const decoded: any = verifyToken(token);
    req.user = decoded;
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
  if (organizationId != req.user.org_id) {
    return res.status(500).json({ message: "Organization Not authorized" });
  }

  next();
};

const isAdmin = (req: any, res: Response, next: NextFunction) => {
  if (req.user.role !== UserRole.ADMIN)
    return res.status(403).json({ msg: "Admin only" });

  next();
};

export { authenticate, isAdmin };
