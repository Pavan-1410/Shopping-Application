import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

import Navbar from "../../components/user/Navbar";
import { getAllProducts } from "../../api/adminApi";
import {
  getCart,
  updateCartItem,
  removeFromCart,
} from "../../api/cartApi";
import useAuthStore from "../../store/authstore";
import useCartStore from "../../store/cartStore";

interface Product {
  product_id: string;
  category_id: string;
  name: string;
  description: string;
  price: string;
  stock: number;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

const Cart = () => {
  const navigate = useNavigate();

  const { token } = useAuthStore();
  const {  items, setCart } = useCartStore();

  const [updatingItem, setUpdatingItem] = useState<string | null>(null);

  const {data: productResponse,isLoading: productsLoading} = useQuery({
    queryKey: ["products"],
    queryFn: () => getAllProducts(token as string),
  });

  const products: Product[] = productResponse?.products ?? [];
  

  // Fetch latest cart
  useEffect(() => {
    const fetchCart = async () => {
      if (!token) return;

      try {
        const cartData = await getCart(token);

        setCart(cartData.cart, cartData.items);
      } catch (error) {
        console.error("Failed to fetch cart:", error);
      }
    };

    fetchCart();
  }, [token, setCart]);

  const getProduct = (productId: string) => {
    return products.find(
      (product) => product.product_id === productId
    );
  };

  const handleUpdateQuantity = async (
    cartItemId: string,
    quantity: number
  ) => {
    if (!token || quantity < 1) return;

    try {
      setUpdatingItem(cartItemId);

      await updateCartItem(token, cartItemId, quantity);

      const cartData = await getCart(token);

      setCart(cartData.cart, cartData.items);
    } catch (error) {
      console.error("Failed to update cart:", error);
      toast.error("Failed to update quantity");
    } finally {
      setUpdatingItem(null);
    }
  };

  const handleRemove = async (cartItemId: string) => {
    if (!token) return;

    try {
      setUpdatingItem(cartItemId);

      await removeFromCart(token, cartItemId);

      const cartData = await getCart(token);

      setCart(cartData.cart, cartData.items);

      toast.success("Item removed from cart");
    } catch (error) {
      console.error("Failed to remove item:", error);
      toast.error("Failed to remove item");
    } finally {
      setUpdatingItem(null);
    }
  };

  const total = items.reduce((sum, item) => {
    const product = getProduct(item.product_id);

    if (!product) return sum;

    return sum + Number(product.price) * item.quantity;
  }, 0);

  return (
    <>
      <Navbar />

      <main className="w-full px-6 py-8 sm:px-10 lg:px-16">
       <div className="mx-auto w-full max-w-6xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">
              Shopping Cart
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Review your items before checkout
            </p>
          </div>

          {/* Loading */}
          {productsLoading ? (
            <div className="flex min-h-[40vh] items-center justify-center">
              <p className="text-gray-500">
                Loading cart...
              </p>
            </div>
          ) : 
            
          items.length === 0 ? (
            /* Empty Cart */
            <div className="flex min-h-[50vh] flex-col items-center justify-center rounded-xl border border-gray-200 bg-white px-6 text-center">
              <ShoppingCart
                size={50}
                className="text-gray-300"
              />

              <h2 className="mt-4 text-xl font-semibold text-gray-800">
                Your cart is empty
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Add some products to your cart to continue.
              </p>

              <button
                onClick={() => navigate("/home")}
                className="mt-6 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-800"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="grid gap-8 lg:grid-cols-3">
              {/* Cart Items */}
              <div className="space-y-4 lg:col-span-2">
                {items.map((item) => {
                  const product = getProduct(item.product_id);

                  if (!product) return null;

                  const itemTotal =
                    Number(product.price) * item.quantity;

                  const isUpdating =
                    updatingItem === item.cart_item_id;

                  return (
                    <div
                      key={item.cart_item_id}
                      className="flex gap-4 rounded-xl border border-gray-200 bg-white p-4"
                    >
                      {/* Image */}
                      <div className="h-28 w-28 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                        {product.image_url ? (
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-xs text-gray-400">
                            No Image
                          </div>
                        )}
                      </div>

                      {/* Details */}
                      <div className="flex min-w-0 flex-1 flex-col">
                        <div className="flex justify-between gap-4">
                          <div>
                            <h2 className="truncate text-base font-semibold text-gray-800">
                              {product.name}
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                              ₹
                              {Number(
                                product.price
                              ).toLocaleString("en-IN")}
                            </p>
                          </div>

                          <button
                            onClick={() =>
                              handleRemove(
                                item.cart_item_id
                              )
                            }
                            disabled={isUpdating}
                            className="text-gray-400 transition hover:text-red-500 disabled:cursor-not-allowed"
                            title="Remove"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>

                        <div className="mt-auto flex items-center justify-between">
                          {/* Quantity */}
                          <div className="flex items-center rounded-lg border border-gray-200">
                            <button
                              onClick={() =>
                                handleUpdateQuantity(
                                  item.cart_item_id,
                                  item.quantity - 1
                                )
                              }
                              disabled={
                                isUpdating ||
                                item.quantity <= 1
                              }
                              className="p-2 text-gray-600 transition hover:text-blue-700 disabled:cursor-not-allowed disabled:text-gray-300"
                            >
                              <Minus size={15} />
                            </button>

                            <span className="w-8 text-center text-sm font-medium">
                              {item.quantity}
                            </span>

                            <button
                              onClick={() =>
                                handleUpdateQuantity(
                                  item.cart_item_id,
                                  item.quantity + 1
                                )
                              }
                              disabled={
                                isUpdating ||
                                item.quantity >= product.stock
                              }
                              className="p-2 text-gray-600 transition hover:text-blue-700 disabled:cursor-not-allowed disabled:text-gray-300"
                            >
                              <Plus size={15} />
                            </button>
                          </div>

                          {/* Item Total */}
                          <p className="font-semibold text-gray-800">
                            ₹{itemTotal.toLocaleString("en-IN")}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Order Summary */}
              <div className="h-fit rounded-xl border border-gray-200 bg-white p-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  Order Summary
                </h2>

                <div className="my-5 border-t border-gray-200" />

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    Items
                  </span>

                  <span className="text-sm font-medium text-gray-800">
                    {items.reduce(
                      (sum, item) => sum + item.quantity,
                      0
                    )}
                  </span>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    Total
                  </span>

                  <span className="text-xl font-bold text-blue-700">
                    ₹{total.toLocaleString("en-IN")}
                  </span>
                </div>

                <button
                  onClick={() => navigate("/checkout")}
                  className="mt-6 w-full rounded-lg bg-blue-700 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-800"
                >
                  Place the Order
                </button>

                <button
                  onClick={() => navigate("/home")}
                  className="mt-3 w-full rounded-lg border border-gray-200 px-5 py-3 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default Cart;