import { axiosInstance } from "../config/axios";

export interface Address {
  address_id: string;
  user_id: string;
  full_name: string;
  phone: string;
  address_line: string;
  city: string;
  state: string;
  pincode: string;
}

export interface CreateAddressData {
  full_name: string;
  phone: string;
  address_line: string;
  city: string;
  state: string;
  pincode: string;
}

export const createAddress = async (
  token: string,
  addressData: CreateAddressData
) => {
  const response = await axiosInstance.post(
    "/address/create",
    addressData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const getAllAddresses = async (token: string) => {
  const response = await axiosInstance.get("/address/get", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const getAddressById = async (
  token: string,
  addressId: string
) => {
  const response = await axiosInstance.get(
    `/address/get/${addressId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};