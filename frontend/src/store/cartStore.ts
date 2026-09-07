import { create } from "zustand";

interface Cart {
  cart_id: string;
  user_id: string;
  created_at: string;
}

interface CartItem {
  cart_item_id: string;
  cart_id: string;
  product_id: string;
  quantity: number;
}

interface CartState {
  cart: Cart | null;
  items: CartItem[];

  setCart: (cart: Cart, items: CartItem[]) => void;
  clearCart: () => void;
}

const useCartStore = create<CartState>((set) => ({
  cart: null,
  items: [],

  setCart: (cart, items) =>
    set({
      cart,
      items,
    }),

  clearCart: () =>
    set({
      cart: null,
      items: [],
    }),
}));

export default useCartStore;