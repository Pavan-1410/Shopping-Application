import { Router } from "express";
import { verifyFirebaseToken } from "../middleware/auth.middleware.js";
import { loadApplicationUser } from "../middleware/user.middleware.js";
import { requireAdmin } from "../middleware/role.middleware.js";
import { addCategory, getAllCategories, getCategoryById } from "../controllers/category.controller.js";

const router = Router()

router.post("/add",verifyFirebaseToken,loadApplicationUser,requireAdmin,addCategory)  // create category
router.get("/get",verifyFirebaseToken,loadApplicationUser,getAllCategories)
router.get("/getbyid/:categoryId",verifyFirebaseToken,loadApplicationUser,getCategoryById)

export default router;