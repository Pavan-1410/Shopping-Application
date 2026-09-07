import { Request,Response } from "express";
import {getCartByUserId, addToCart, updateCartItem, removeCartItem, createCartService, getCartItemsService,} from "../services/cart.service.js";
import { AddToCartItemInput, UpdateCartItemInput} from "../types/cart.types.js";

// get | create the cart 
export const getCart = async(req:Request,res:Response)=>{
    try {
        const userId = req.appUser?.user_id;       // we add appuser because it contain the database _id
        if (!userId) {
            return res.status(401).json({
            message: "User not authenticated",
        });
        }
        let cart = await getCartByUserId(userId);


        // Create cart if user doesn't have one
        if (!cart) {
        cart = await createCartService(userId);
        }

        const items = await getCartItemsService(cart.cart_id);

        return res.status(200).json({
        message: "Cart fetched successfully",
        cart,
        items,
        });

    
    } catch (error) {
        

    return res.status(500).json({
      message: "Internal Server Error",
    });
    }
}
// add the products to the cart
export const addProductToCart = async (req: Request,res: Response) => {
  try {
    const userId = req.appUser?.user_id;

    if (!userId) {
      return res.status(401).json({
        message: "User not authenticated",
      });
    }

    const { product_id, quantity } = req.body;

    if (product_id === undefined) {
      return res.status(400).json({
        message: "Product ID is required",
      });
    }

    if (typeof product_id !== "number") {
      return res.status(400).json({
        message: "Product ID must be a number",
      });
    }

    if (quantity === undefined) {
      return res.status(400).json({
        message: "Quantity is required",
      });
    }

    if (typeof quantity !== "number") {
      return res.status(400).json({
        message: "Quantity must be a number",
      });
    }

    if (quantity <= 0) {
      return res.status(400).json({
        message: "Quantity must be greater than 0",
      });
    }

    const itemData: AddToCartItemInput = {
      product_id,
      quantity,
    };

    let cart = await getCartByUserId(userId);

    if (!cart) {
      cart = await createCartService(userId);
    }

    const cartItem = await addToCart(
      cart.cart_id,
      itemData
    );

    return res.status(201).json({
      message: "Product added to cart successfully",
      cart,
      cartItem,
    });
  } catch (error) {


    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
// update the cartItems - update the quantity   // give cartitem_id in params
export const updateCartItemController = async (req: Request,res: Response) => {
  try {
    const userId = req.appUser?.user_id;

    const { cartItemId } = req.params;

    const cartItemIdNumber = Number(cartItemId);

    if (!userId) {
    return res.status(401).json({
     message: "Application user not found",
     });
    }


    if (isNaN(cartItemIdNumber)) {
      return res.status(400).json({
        message: "Cart item ID must be a number",
      });
    }

    const { quantity } = req.body;

    if (quantity === undefined) {
      return res.status(400).json({
        message: "Quantity is required",
      });
    }

    if (typeof quantity !== "number") {
      return res.status(400).json({
        message: "Quantity must be a number",
      });
    }

    if (quantity <= 0) {
      return res.status(400).json({
        message: "Quantity must be greater than 0",
      });
    }

    const itemData: UpdateCartItemInput = {
      quantity,
    };

    const cartItem = await updateCartItem(
      cartItemIdNumber,
      userId,
      itemData,
    );

    if (!cartItem) {
      return res.status(404).json({
        message: "Cart item not found",
      });
    }

    return res.status(200).json({
      message: "Cart item updated successfully",
      cartItem,
    });
  } catch (error) {


    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
//remove cartItems from cart
export const removeProductFromCart = async (
  req: Request,
  res: Response
) => {
  try {    
    const userId = req.appUser?.user_id;

    const { cartItemId } = req.params;

    const cartItemIdNumber = Number(cartItemId);
    
    if (!userId) {
    return res.status(401).json({
     message: "Application user not found",
     });
    }

    if (isNaN(cartItemIdNumber)) {
      return res.status(400).json({
        message: "Cart item ID must be a number",
      });
    }

    const cartItem = await removeCartItem(
      cartItemIdNumber,
      userId
    );

    if (!cartItem) {
      return res.status(404).json({
        message: "Cart item not found",
      });
    }

    return res.status(200).json({
      message: "Product removed from cart successfully",
      cartItem,
    });
  } catch (error) {


    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
