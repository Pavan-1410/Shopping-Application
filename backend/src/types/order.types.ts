export interface Order {
  order_id: number;
  user_id: number;
  address_id: number;
  total_amount: number;
  status: "pending" | "completed";
  payment_status: "pending" | "paid";
  created_at: Date;
}

export interface OrderItem {
  order_item_id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: number;
}

export interface CreateOrderInput {
  address_id: number;
}