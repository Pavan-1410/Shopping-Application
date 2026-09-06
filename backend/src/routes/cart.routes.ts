import { Router } from "express";
import { addProductToCart, getCart, removeProductFromCart, updateCartItemController } from "../controllers/cart.controllers.js";
import { verifyFirebaseToken } from "../middleware/auth.middleware.js";
import { loadApplicationUser } from "../middleware/user.middleware.js";

const router = Router();

router.get("/get",verifyFirebaseToken,loadApplicationUser,getCart)
router.post("/add",verifyFirebaseToken,loadApplicationUser,addProductToCart)
router.put("/update/:cartItemId",verifyFirebaseToken,loadApplicationUser,updateCartItemController)
router.put("/remove/:cartItemId",verifyFirebaseToken,loadApplicationUser,removeProductFromCart)


export default router;