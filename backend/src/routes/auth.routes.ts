import { Router } from "express";
import { verifyFirebaseToken } from "../middleware/auth.middleware.js";
import { checkAuth, getMe } from "../controllers/auth.controller.js";
import { requireAdmin } from "../middleware/role.middleware.js";
import { loadApplicationUser } from "../middleware/user.middleware.js";

const router = Router();

router.get('/check',verifyFirebaseToken,loadApplicationUser,checkAuth)      // when user refresh
router.get("/me", verifyFirebaseToken, getMe);
router.get("/admin/me",verifyFirebaseToken,loadApplicationUser,requireAdmin,getMe) // this is to ckeck the admin request
export default router;

//verifyFirebaseToken - verify firebase token
//syncApplicationUser - Find PostgreSQL user or create one - but not needed
//loadApplicationUser - Find existing PostgreSQL user

