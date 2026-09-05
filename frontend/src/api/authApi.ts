import { axiosInstance } from "../config/axios";
// create user / login
export const getMe = async (token: string) => {
  const response = await axiosInstance.get("/auth/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
// to check the admin
export const getAdminMe = async (token: string) => {
  const response = await axiosInstance.get("/auth/admin/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
// to check and give user on refresh
export const checkAuth = async (token: string) => {
  const response = await axiosInstance.get("/auth/check", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};