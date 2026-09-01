import { Request, Response } from "express";
import {createOrderService, getOrdersByUser, getOrderById, getOrderItems,updateOrderStatus,} from "../services/order.services.js";
import { CreateOrderInput } from "../types/order.types.js";

// place order      //   only need to pass address_id from body
export const createOrderController = async (req: Request,res: Response) => {
  try {
    const userId = req.appUser?.user_id;

    if (!userId) {
      return res.status(401).json({
        message: "Application user not found",
      });
    }

    const { address_id } = req.body;

    if (address_id === undefined) {
      return res.status(400).json({
        message: "Address ID is required",
      });
    }

    if (typeof address_id !== "number") {
      return res.status(400).json({
        message: "Address ID must be a number",
      });
    }

    const orderData: CreateOrderInput = {
      address_id,
    };

    const order = await createOrderService(
      userId,
      orderData
    );

    return res.status(201).json({
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    console.log(
      "Error in order controller, createOrder",
      error
    );

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

// get all Orders of Logged-in User
export const getOrdersController = async (req: Request,res: Response) => {
  try {
    const userId = req.appUser?.user_id;

    if (!userId) {
      return res.status(401).json({
        message: "Application user not found",
      });
    }

    const orders = await getOrdersByUser(userId);

    return res.status(200).json({
      message: "Orders fetched successfully",
      orders,
    });
  } catch (error) {
    console.log(
      "Error in order controller, getOrders",
      error
    );

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

// Get one Order using orderid       // need orderid in param
export const getOrderByIdController = async (req: Request, res: Response) => {
  try {
    const userId = req.appUser?.user_id;

    if (!userId) {
      return res.status(401).json({
        message: "Application user not found",
      });
    }

    const orderId = Number(req.params.orderId);

    if (Number.isNaN(orderId)) {
      return res.status(400).json({
        message: "Invalid order ID",
      });
    }

    const order = await getOrderById(
      orderId,
      userId
    );

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    return res.status(200).json({
      message: "Order fetched successfully",
      order,
    });
  } catch (error) {
    console.log(
      "Error in order controller, getOrderById",
      error
    );

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

// Get Items of an Order            // need orderid in param
export const getOrderItemsController = async (req: Request,res: Response) => {
  try {
    const userId = req.appUser?.user_id;

    if (!userId) {
      return res.status(401).json({
        message: "Application user not found",
      });
    }

    const orderId = Number(req.params.orderId);

    if (Number.isNaN(orderId)) {
      return res.status(400).json({
        message: "Invalid order ID",
      });
    }

    // Check whether this order belongs to the logged-in user
    const order = await getOrderById(
      orderId,
      userId
    );

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    const items = await getOrderItems(orderId);

    return res.status(200).json({
      message: "Order items fetched successfully",
      items,
    });
  } catch (error) {
    console.log(
      "Error in order controller, getOrderItems",
      error
    );

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
// Update Order Status              // need to pass sts in body && // need orderid in param
export const updateOrderStatusController = async (req: Request,res: Response) => {
  try {
    const orderId = Number(req.params.orderId);

    if (Number.isNaN(orderId)) {
      return res.status(400).json({
        message: "Invalid order ID",
      });
    }

    const { status } = req.body;

    if (status === undefined) {
      return res.status(400).json({
        message: "Order status is required",
      });
    }

    if (
      status !== "pending" &&
      status !== "completed"
    ) {
      return res.status(400).json({
        message:
          "Order status must be pending or completed",
      });
    }

    const order = await updateOrderStatus(
      orderId,
      status
    );

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    return res.status(200).json({
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    console.log(
      "Error in order controller, updateOrderStatus",
      error
    );

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
