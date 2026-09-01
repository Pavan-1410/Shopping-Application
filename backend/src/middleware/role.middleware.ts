import { Request, Response, NextFunction } from "express";
import { UserRole } from "../types/user.types.js";

export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.appUser) {
    return res.status(401).json({
      message: "Application user not found",
    });
  }

  if (req.appUser.role !== UserRole.ADMIN) {
    return res.status(403).json({
      message: "Admin access required",
    });
  }

  next();
};