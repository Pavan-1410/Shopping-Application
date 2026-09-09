import  express  from "express";
import { createOrderController, getOrderAdminCOntroller, getOrderByIdController, getOrderItemsController, getOrdersController, updateOrderStatusController } from "../controllers/order.controllers.js";
import { verifyFirebaseToken } from "../middleware/auth.middleware.js";
import { loadApplicationUser } from "../middleware/user.middleware.js";
import { requireAdmin } from "../middleware/role.middleware.js";

const router = express.Router();

router.post("/create",verifyFirebaseToken,loadApplicationUser,createOrderController)
router.get("/get",verifyFirebaseToken,loadApplicationUser,getOrdersController)
router.get("/getall",verifyFirebaseToken,loadApplicationUser,getOrderAdminCOntroller)
router.get("/get/:orderId",verifyFirebaseToken,loadApplicationUser,getOrderByIdController)
router.get("/getorderitems/:orderId",verifyFirebaseToken,loadApplicationUser,getOrderItemsController)
router.put("/update/:orderId",verifyFirebaseToken,loadApplicationUser,requireAdmin,updateOrderStatusController)
export default router;