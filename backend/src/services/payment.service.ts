import Razorpay from 'razorpay';
import crypto from 'crypto';
import pool from "../config/db.js";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function createRazorpayOrder(orderId: number) {
  const result = await pool.query(
    `SELECT total_amount, payment_status FROM orders WHERE order_id = $1`,
    [orderId]
  );

  if (result.rows.length === 0) {
    throw new Error('Order not found');
  }

  const order = result.rows[0];

  if (order.payment_status === 'paid') {
    throw new Error('Order already paid');
  }

  const razorpayOrder = await razorpay.orders.create({
    amount: Math.round(Number(order.total_amount) * 100), // rupies to paise conversion
    currency: 'INR',
    receipt: `receipt_${orderId}`,
  });

  return razorpayOrder;
}

export function verifySignature(
  razorpay_order_id: string,
  razorpay_payment_id: string,
  razorpay_signature: string
): boolean {
  const body = razorpay_order_id + '|' + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
    .update(body)
    .digest('hex');
  return expectedSignature === razorpay_signature;
}

export async function markOrderAsPaid(orderId: number) {
  await pool.query(
    `UPDATE orders SET payment_status = $1 WHERE order_id = $2`,
    ['paid', orderId]
  );
}