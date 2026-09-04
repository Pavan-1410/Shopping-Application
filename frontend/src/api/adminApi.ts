import { axiosInstance } from "../config/axios";

export const getAllProducts = async (token: string) => {
  const response = await axiosInstance.get("/product/get", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const getAllCategories = async (token: string) => {
  const response = await axiosInstance.get("/category/get", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const getAllOrders = async (token: string) => {
  const response = await axiosInstance.get("/order/get", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}
