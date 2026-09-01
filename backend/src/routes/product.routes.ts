import { Router } from "express";
import { createProduct, deleteProduct, getAllProducts, getProductById, updateProduct } from "../controllers/product.controller";
import { verifyFirebaseToken } from "../middleware/auth.middleware";
import { loadApplicationUser } from "../middleware/user.middleware";
import { requireAdmin } from "../middleware/role.middleware";

const router = Router()


router.get("/get",verifyFirebaseToken,loadApplicationUser,getAllProducts)
router.get("/get/:productId",verifyFirebaseToken,loadApplicationUser,getProductById)
router.post("/add",verifyFirebaseToken,loadApplicationUser,requireAdmin,createProduct)
router.put("/update/:productId",verifyFirebaseToken,loadApplicationUser,requireAdmin,updateProduct)
router.delete("/delete/:productId",verifyFirebaseToken,loadApplicationUser,requireAdmin,deleteProduct)

export default router