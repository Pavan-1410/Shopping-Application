import { useQuery } from "@tanstack/react-query";
import {
  Package,
  ShoppingCart,
  Tags,
} from "lucide-react";

import { getAllCategories, getAllOrders, getAllProducts } from "../api/adminApi";
import useAuthStore from "../store/authstore";

const DotsLoader = () => (
  <span className="flex items-center gap-1 pt-4">
    <span className="h-2 w-2 rounded-full bg-blue-700 animate-bounce [animation-delay:-0.3s]"></span>
    <span className="h-2 w-2 rounded-full bg-blue-700 animate-bounce [animation-delay:-0.15s]"></span>
    <span className="h-2 w-2 rounded-full bg-blue-700 animate-bounce"></span>
  </span>
);

const AdminDashboard = () => {
  const authstore = useAuthStore();
  const token = authstore.token;

  const { data: productData, isLoading: isProductLoading } = useQuery({
    queryKey: ["products", token],
    queryFn: () => getAllProducts(token as string),
    enabled: !!token,
    staleTime: 1000 * 60,
  });

  const { data: categoryData, isLoading: isCategoryLoading } = useQuery({
    queryKey: ["categories", token],
    queryFn: () => getAllCategories(token as string),
    enabled: !!token,
    staleTime: 1000 * 60,
  });

  const { data: orderData, isLoading: isOrdersLoading } = useQuery({
    queryKey: ["orders", token],
    queryFn: () => getAllOrders(token as string),
    enabled: !!token,
    staleTime: 1000 * 60,
  });

  const products = productData?.products ?? [];
  const categories = categoryData?.categories ?? [];
  const orders = orderData?.orders ?? [];

  return (
    <div className="min-h-screen w-full bg-gray-50 p-6 lg:p-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-blue-700">Dashboard</h1>
        <p className="mt-1 text-gray-500">Welcome to your admin panel</p>
      </div>

      {/* Statistics */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* 👆 changed lg:grid-cols-4 to lg:grid-cols-3 since only 3 cards remain */}

        <div className="rounded-xl bg-white p-6 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Products</p>
              <h2 className="mt-2 text-3xl font-bold text-blue-700">
                {isProductLoading ? <DotsLoader /> : products.length}
              </h2>
            </div>
            <div className="rounded-lg bg-blue-100 p-3 text-blue-700">
              <Package size={24} />
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Categories</p>
              <h2 className="mt-2 text-3xl font-bold text-blue-700">
                {isCategoryLoading ? <DotsLoader /> : categories.length}
              </h2>
            </div>
            <div className="rounded-lg bg-yellow-100 p-3 text-yellow-600">
              <Tags size={24} />
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Orders</p>
              <h2 className="mt-2 text-3xl font-bold text-blue-700">
                {isOrdersLoading ? <DotsLoader /> : orders.length}
              </h2>
            </div>
            <div className="rounded-lg bg-blue-100 p-3 text-blue-700">
              <ShoppingCart size={24} />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;