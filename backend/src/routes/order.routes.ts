import  express  from "express";
import { createOrderController, getOrderByIdController, getOrderItemsController, getOrdersController, updateOrderStatusController } from "../controllers/order.controllers";
import { verifyFirebaseToken } from "../middleware/auth.middleware";
import { loadApplicationUser } from "../middleware/user.middleware";
import { requireAdmin } from "../middleware/role.middleware";

const router = express.Router();

router.post("/create",verifyFirebaseToken,loadApplicationUser,createOrderController)
router.get("/get",verifyFirebaseToken,loadApplicationUser,getOrdersController)
router.get("/get/:orderId",verifyFirebaseToken,loadApplicationUser,getOrderByIdController)
router.get("/getorderitems/:orderId",verifyFirebaseToken,loadApplicationUser,getOrderItemsController)
router.put("/update/:orderId",verifyFirebaseToken,loadApplicationUser,requireAdmin,updateOrderStatusController)
export default router;