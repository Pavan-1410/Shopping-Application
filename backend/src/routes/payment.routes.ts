import express from "express"
import { createPayment, verifyPayment } from "../controllers/payment.controller.js";
import { verifyFirebaseToken } from "../middleware/auth.middleware.js";
const router = express.Router();
router.post('/create/:orderId',verifyFirebaseToken,createPayment);
router.post('/verify', verifyFirebaseToken,verifyPayment);

export default router;