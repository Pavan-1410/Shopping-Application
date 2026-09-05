import { axiosInstance } from "../config/axios";

export const getAllProducts = async (token: string) => {
  const response = await axiosInstance.get("/product/get", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const getProductById = async (token: string, productId: string) => {
  const { data } = await axiosInstance.get(`/product/get/${productId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const createProduct = async (token: string, formData: FormData) => {
  const { data } = await axiosInstance.post("/product/add", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",  // need baucaue we have used multer in backend so this is needed
    },
  });
  return data;
};

export const updateProduct = async (token: string, productId: string, formData: FormData) => {
  const { data } = await axiosInstance.put(`/product/update/${productId}`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return data;
};

export const deleteProduct = async (token: string, productId: string) => {
  const { data } = await axiosInstance.delete(`/product/delete/${productId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const getAllCategories = async (token: string) => {
  const response = await axiosInstance.get("/category/get", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const createCategory = async (token: string, name: string) => {
  const response = await axiosInstance.post("/category/add",{name}, {
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
