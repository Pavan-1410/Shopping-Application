import { axiosInstance } from "../config/axios"

export const getAllOrders =async (token : string)=>{
    const responce = await axiosInstance.get("/order/get",{
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