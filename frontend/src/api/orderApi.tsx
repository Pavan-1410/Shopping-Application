import { axiosInstance } from "../config/axios"

export const getAllOrders =async (token : string)=>{
    const responce = await axiosInstance.get("/order/get",{
        headers :{
            Authorization :`Bearer ${token}`,
        },
    })
    return responce.data
}
export const getAllOrdersAdmin =async (token : string)=>{
    const responce = await axiosInstance.get("/order/getall",{
        headers :{
            Authorization :`Bearer ${token}`,
        },
    })
    return responce.data
}
export const updateOrderStatus = async (token : string, order_id : string, status:string)=>{
    const responce = await axiosInstance.put(`/order/update/${order_id}`,{status}, {
        headers :{
            Authorization :`Bearer ${token}`,
        },
    })
    return responce.data
}

export const createOrder = async (
  token: string,
  address_id: number
) => {
  const response = await axiosInstance.post(
    "/order/create",
    {
      address_id,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};


export const getOrderById = async (
  token: string,
  orderId: string
) => {
  const response = await axiosInstance.get(
    `/order/get/${orderId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const getOrderItems = async (
  token: string,
  orderId: string
) => {
  const response = await axiosInstance.get(
    `/order/getorderitems/${orderId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};