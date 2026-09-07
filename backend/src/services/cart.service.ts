import pool from "../config/db.js";
import { AddToCartItemInput, Cart, CartItem, UpdateCartItemInput } from "../types/cart.types.js";

// create cart  // one user have only one cart as constrain userId unique is there
export const createCartService = async (userId: number): Promise<Cart> => {
    const result = await pool.query(
        `
    INSERT INTO carts (user_id)
    VALUES ($1)
    RETURNING *
    `,
        [userId]
    );

    return result.rows[0];
};

// get my cart bu userID

export const getCartByUserId = async (userId: number): Promise<Cart | undefined> => {   // undefine represent cart of this id not found
    const result = await pool.query(
        `
    SELECT *
    FROM carts
    WHERE user_id = $1
    `,
        [userId]
    );

    return result.rows[0];
}

// add products to cartItems

export const addToCart = async (cartId: number,itemData: AddToCartItemInput): Promise<CartItem> => {
  const { product_id, quantity } = itemData;

  const result = await pool.query(
    `
    INSERT INTO cart_items (
      cart_id,
      product_id,
      quantity
    )
    VALUES ($1, $2, $3)

    ON CONFLICT (cart_id, product_id)
    DO UPDATE SET
      quantity = cart_items.quantity + EXCLUDED.quantity

    RETURNING *
    `,
    [cartId, product_id, quantity]
  );

  return result.rows[0];
};

//get products form cartitems

export const getCartItemsService = async (cartId: number): Promise<CartItem[]> => {
  const result = await pool.query(
    `
    SELECT *
    FROM cart_items
    WHERE cart_id = $1
    ORDER BY cart_item_id
    `,
    [cartId]
  );

  return result.rows;
};


// update quantity of cartitem products

export const updateCartItem = async (cartItemId: number,userId: number,itemData: UpdateCartItemInput): Promise<CartItem | undefined> => {
  const { quantity } = itemData;

  const result = await pool.query(
    `
    UPDATE cart_items ci
    SET quantity = $1
    FROM carts c
    WHERE ci.cart_item_id = $2
      AND ci.cart_id = c.cart_id
      AND c.user_id = $3
    RETURNING ci.*
    `,
    [quantity, cartItemId, userId]
  );

  return result.rows[0];
};

// remove cart items 
export const removeCartItem = async (cartItemId: number, userId: number): Promise<CartItem | undefined> => {
  const result = await pool.query(
    `
    DELETE FROM cart_items ci
    USING carts c
    WHERE ci.cart_item_id = $1
      AND ci.cart_id = c.cart_id
      AND c.user_id = $2
    RETURNING ci.*
    `,
    [cartItemId, userId]
  );

  return result.rows[0];
};