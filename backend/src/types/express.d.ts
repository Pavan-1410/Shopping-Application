import { DecodedIdToken } from "firebase-admin/auth";
import { AppUser } from "./user.types.js";

declare global {
  namespace Express {
    interface Request {
      user?: DecodedIdToken;
      appUser?: AppUser;
    }
  }
}

export {};

// We're telling TypeScript:

// "Express's Request object has one more property called user."