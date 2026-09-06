import { axiosInstance } from "../config/axios";

export const addToCart = async (token: string, product_id: string, quantity: number) => {
  const response = await axiosInstance.post("/cart/add",{
      product_id: Number(product_id),
      quantity,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const getCart = async (token: string) => {
  const response = await axiosInstance.get("/cart/get", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const updateCartItem = async (
  token: string,
  cartItemId: string,
  quantity: number
) => {
  const response = await axiosInstance.put(
    `/cart/update/${cartItemId}`,
    {
      quantity,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const removeFromCart = async (
  token: string,
  cartItemId: string
) => {
  const response = await axiosInstance.put(
    `/cart/remove/${cartItemId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};