// controller contail the HTTP handling logic
import { Request, Response } from "express";
import { createUser, findUserByFirebaseUid } from "../services/user.services.ts";

export const getMe = async (req: Request, res: Response) => {
  try {
    const firebaseUid = req.user!.uid;      // ! tell that the user may be undefine, So continue so typescript gives us error
    const email = req.user!.email;
    const name = req.user!.name || "User";

    if (!email) {
      return res.status(400).json({
        message: "Email not found in Firebase account",
      });
    }

    // check if user already already exists
    let user = await findUserByFirebaseUid(firebaseUid);  // use to fund the existing user in DB

    // Create user if they don't exist
    if(!user){
        user = await createUser(firebaseUid,name,email)
    }

    req.appUser = user;

    // return that user 
    return res.status(200).json({
      message: "Authenticated successfully",
      user,
    });
  } catch (error) {
    console.error("Get user failed:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// to check auth while the user refresh
export const checkAuth = (req:Request,res:Response)=>{
    try{
        if (!req.appUser) {
            return res.status(404).json({
                message: "Application user not found",
            });
        }

        res.status(200).json({
            message: "Authenticated successfully",
            user: req.appUser,
        });
    }catch(error){
        console.log("Error in checkAuth controller",error)
        res.status(500).json({msg:"Internal Server Error"})
    }
}