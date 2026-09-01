import { Router } from "express";
import { addProductToCart, getCart, removeProductFromCart, updateCartItemController } from "../controllers/cart.controllers";
import { verifyFirebaseToken } from "../middleware/auth.middleware";
import { loadApplicationUser } from "../middleware/user.middleware";

const router = Router();

router.get("/get",verifyFirebaseToken,loadApplicationUser,getCart)
router.post("/add",verifyFirebaseToken,loadApplicationUser,addProductToCart)
router.put("/update/:cartItemId",verifyFirebaseToken,loadApplicationUser,updateCartItemController)
router.put("/remove/:cartItemId",verifyFirebaseToken,loadApplicationUser,removeProductFromCart)


export default router;