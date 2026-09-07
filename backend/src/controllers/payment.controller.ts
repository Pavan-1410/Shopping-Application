import { Request, Response } from 'express';
import * as paymentService from '../services/payment.service.js';

export async function createPayment(req: Request, res: Response) {
  try {
    const orderId = Number(req.params.orderId);
    const razorpayOrder = await paymentService.createRazorpayOrder(orderId);
    res.json(razorpayOrder);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Payment initiation failed' });
  }
}

export async function verifyPayment(req: Request, res: Response) {
  try {
    const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const isValid = paymentService.verifySignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    if (!isValid) {
      return res.status(400).json({ success: false, message: 'Signature mismatch' });
    }

    await paymentService.markOrderAsPaid(Number(orderId));
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Verification failed' });
  }
}