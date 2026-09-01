import pool from "../config/db.js";
import {Order, OrderItem,CreateOrderInput,} from "../types/order.types.js";

export const createOrderService = async (userId: number,orderData: CreateOrderInput): Promise<Order> => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");        // we are not using pool.query because there are multiple operation in the service so we use transaction so either all operation will done or all the operatioon will rollback

    // Get user's cart
    const cartResult = await client.query(
      `
      SELECT cart_id
      FROM carts
      WHERE user_id = $1
      `,
      [userId]
    );

    if (cartResult.rows.length === 0) {
      throw new Error("Cart not found");        // it goes to catch block
    }

    const cartId = cartResult.rows[0].cart_id;

    // Get cart items with product information
    const cartItemsResult = await client.query(
      `
      SELECT
        ci.product_id,
        ci.quantity,
        p.price, 
        p.stock
      FROM cart_items ci
      JOIN products p
        ON ci.product_id = p.product_id
      WHERE ci.cart_id = $1
      FOR UPDATE OF p      
      `,
      [cartId]          // for update of p locks the rows of that specific product
    );

    if (cartItemsResult.rows.length === 0) {
      throw new Error("Cart is empty");
    }

    // Check stock and calculate total
    let totalAmount = 0;

    for (const item of cartItemsResult.rows) {          // as .rows isarray of object so we iterate it using for loop
      if (item.quantity > item.stock) {                 // check  if sufficient stock is there or not
        throw new Error(
          `Insufficient stock for product ${item.product_id}`
        );
      }

      totalAmount +=
        Number(item.price) * item.quantity;
    }

    // Create order 
    const orderResult = await client.query(     // return all columns from the tbl
      `
      INSERT INTO orders (
        user_id,
        address_id,
        total_amount
      )
      VALUES ($1, $2, $3)
      RETURNING *                   
      `,
      [                                         // RETURNING return all row to client.query
        userId,
        orderData.address_id,
        totalAmount,
      ]
    );

    const order: Order = orderResult.rows[0];       // here Order is the type we we declare in the interface

    // Create order items       
    for (const item of cartItemsResult.rows) {
      await client.query(
        `
        INSERT INTO order_items (
          order_id,
          product_id,
          quantity,
          price
        )
        VALUES ($1, $2, $3, $4)
        `,
        [
          order.order_id,
          item.product_id,
          item.quantity,
          item.price,
        ]
      );

      // Reduce product stock
      await client.query(
        `
        UPDATE products
        SET
          stock = stock - $1,
          updated_at = NOW()
        WHERE product_id = $2
        `,
        [
          item.quantity,
          item.product_id,
        ]
      );
    }

    // Clear cart
    await client.query(
      `
      DELETE FROM cart_items
      WHERE cart_id = $1
      `,
      [cartId]
    );

    await client.query("COMMIT");       // this represent all the operations are completed 

    return order;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};
// get all order 
export const getOrdersByUser = async (userId: number): Promise<Order[]> => {
  const result = await pool.query(
    `
    SELECT *
    FROM orders
    WHERE user_id = $1
    ORDER BY created_at DESC
    `,
    [userId]
  );

  return result.rows;
};
// get specific order
export const getOrderById = async (orderId: number,userId: number): Promise<Order | undefined> => {     // undefine bacause order ID can be invalid or not in the DB
  const result = await pool.query(
    `
    SELECT *
    FROM orders
    WHERE order_id = $1
      AND user_id = $2
    `,
    [orderId, userId]
  );

  return result.rows[0];
};
// get order items
export const getOrderItems = async (orderId: number): Promise<OrderItem[]> => {
  const result = await pool.query(
    `
    SELECT *
    FROM order_items
    WHERE order_id = $1
    ORDER BY order_item_id
    `,
    [orderId]
  );

  return result.rows;
};
// update the status 
export const updateOrderStatus = async (orderId: number,status: "pending" | "completed"): Promise<Order | undefined> => {
  const result = await pool.query(
    `
    UPDATE orders
    SET status = $1
    WHERE order_id = $2
    RETURNING *
    `,
    [status, orderId]
  );

  return result.rows[0];
};