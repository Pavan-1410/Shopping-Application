export interface Cart {             // this represent the cart responce after creation
  cart_id: number;
  user_id: number;
  created_at: Date;
}

export interface CartItem {         // this represent the cart responce after creation
  cart_item_id: number;
  cart_id: number;
  product_id: number;
  quantity: number;
}

export interface AddToCartItemInput  {  // this represent input data
  product_id: number;
  quantity: number;
}

export interface UpdateCartItemInput {
  quantity: number;
}