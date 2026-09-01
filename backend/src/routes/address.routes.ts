import { Router } from "express";
import { createAddressController, getAddressByIdController, getAllAddressController } from "../controllers/address.controller";
import { verifyFirebaseToken } from "../middleware/auth.middleware";
import { loadApplicationUser } from "../middleware/user.middleware";

const router = Router()

router.post("/create",verifyFirebaseToken,loadApplicationUser,createAddressController)
router.get("/get",verifyFirebaseToken,loadApplicationUser,getAllAddressController)
router.get("/get/:addressId",verifyFirebaseToken,loadApplicationUser,getAddressByIdController)

export default router;
