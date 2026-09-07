import { axiosInstance } from "../config/axios";

export const createPayment = async (token: string, orderId: string) => {
  const response = await axiosInstance.post(
    `/payment/create/${orderId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const verifyPayment = async (
  token: string,
  data: {
    orderId: string;
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }
) => {
  const response = await axiosInstance.post("/payment/verify", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};