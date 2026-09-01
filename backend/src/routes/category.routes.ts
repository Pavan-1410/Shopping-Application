import { Router } from "express";
import { verifyFirebaseToken } from "../middleware/auth.middleware";
import { loadApplicationUser } from "../middleware/user.middleware";
import { requireAdmin } from "../middleware/role.middleware";
import { addCategory, getAllCategories, getCategoryById } from "../controllers/category.controller";

const router = Router()

router.post("/add",verifyFirebaseToken,loadApplicationUser,requireAdmin,addCategory)
router.get("/get",getAllCategories)
router.get("/getbyid/:categoryId",getCategoryById)

export default router;