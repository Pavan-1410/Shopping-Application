import { Router } from "express";
import { createProduct, deleteProduct, getAllProducts, getProductById, updateProduct } from "../controllers/product.controller.js";
import { verifyFirebaseToken } from "../middleware/auth.middleware.js";
import { loadApplicationUser } from "../middleware/user.middleware.js";
import { requireAdmin } from "../middleware/role.middleware.js";
import upload from "../middleware/upload.middleware.js";

const router = Router()


router.get("/get",verifyFirebaseToken,loadApplicationUser,getAllProducts)
router.get("/get/:productId",verifyFirebaseToken,loadApplicationUser,getProductById)
router.post("/add",verifyFirebaseToken,loadApplicationUser,requireAdmin,upload.single("image"),createProduct)// upload.single is multer middleware 
router.put("/update/:productId",verifyFirebaseToken,loadApplicationUser,requireAdmin,upload.single("image"),updateProduct)
router.delete("/delete/:productId",verifyFirebaseToken,loadApplicationUser,requireAdmin,deleteProduct)

export default router