import { Request, Response, NextFunction } from "express";
import { getAuth } from "firebase-admin/auth";
import firebaseAdmin from "../config/firebase.js";

export const verifyFirebaseToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "No token provided",
      });
    }

    const token = authHeader.split("Bearer ")[1];

    const decodedToken = await getAuth(firebaseAdmin).verifyIdToken(token);

    req.user = decodedToken;  // we have userdefined type declaration for this

    next();
  } catch (error) {
    console.error("Firebase token verification failed:", error);

    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};