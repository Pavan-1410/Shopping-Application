import { Request, Response, NextFunction } from "express";
import { findUserByFirebaseUid, createUser } from "../services/user.services.js";

export const loadApplicationUser = async (      // this is used when the user already exists and we need appUser int the request
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const firebaseUid = req.user!.uid;

    const user = await findUserByFirebaseUid(firebaseUid);

    if (!user) {
      return res.status(404).json({
        message: "Application user not found",
      });
    }

    req.appUser = user;

    next();
  } catch (error) {
    console.error("Loading application user failed:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};


// export const syncApplicationUser = async (      // this is user to create the user
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const firebaseUid = req.user!.uid;
//     const name = req.user!.name || "User";
//     const email = req.user!.email;

//     if (!email) {
//       return res.status(400).json({
//         message: "Email not found in Firebase account",
//       });
//     }

//     let user = await findUserByFirebaseUid(firebaseUid);

//     if (!user) {
//       user = await createUser(firebaseUid, name, email);
//     }

//     req.appUser = user;     // it also return app user

//     next();
//   } catch (error) {
//     console.error("Sync application user failed:", error);

//     return res.status(500).json({
//       message: "Internal server error",
//     });
//   }
// };