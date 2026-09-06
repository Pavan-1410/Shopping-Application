import { Router } from "express";
import { createAddressController, getAddressByIdController, getAllAddressController } from "../controllers/address.controller.js";
import { verifyFirebaseToken } from "../middleware/auth.middleware.js";
import { loadApplicationUser } from "../middleware/user.middleware.js";

const router = Router()

router.post("/create",verifyFirebaseToken,loadApplicationUser,createAddressController)
router.get("/get",verifyFirebaseToken,loadApplicationUser,getAllAddressController)
router.get("/get/:addressId",verifyFirebaseToken,loadApplicationUser,getAddressByIdController)

export default router;
