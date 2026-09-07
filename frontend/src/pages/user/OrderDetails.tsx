import {
  ArrowLeft,
  Check,
  CreditCard,
  Package,
  ShoppingCart,
  Truck,
} from "lucide-react";

import { useQuery } from "@tanstack/react-query";

import { useNavigate, useParams } from "react-router-dom";

import toast from "react-hot-toast";

import Navbar from "../../components/user/Navbar";

import {
  getOrderById,
  getOrderItems,
} from "../../api/orderApi";

import { getAllProducts } from "../../api/adminApi";

import useAuthStore from "../../store/authstore";
import queryClient from "../../lib/queryclient";
import { createPayment, verifyPayment } from "../../api/payment.api";

interface Order {
  order_id: string;
  user_id: string;
  address_id: string;
  total_amount: string;
  status: string;
  payment_status: string;
  created_at: string;
}

interface OrderItem {
  order_item_id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: string;
}

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

const OrderDetails = () => {
  const navigate = useNavigate();

  const { orderId } = useParams();

  const { token } = useAuthStore();

  // =========================
  // Get Order
  // =========================

  const {
    data: orderResponse,
    isLoading: orderLoading,
    isError: orderError,
  } = useQuery({
    queryKey: ["order", orderId],
    queryFn: () =>
      getOrderById(
        token as string,
        orderId as string
      ),
    enabled: !!token && !!orderId,
  });

  // =========================
  // Get Order Items
  // =========================

  const {
    data: itemsResponse,
    isLoading: itemsLoading,
    isError: itemsError,
  } = useQuery({
    queryKey: ["order-items", orderId],
    queryFn: () =>
      getOrderItems(
        token as string,
        orderId as string
      ),
    enabled: !!token && !!orderId,
  });

  // =========================
  // Get Products
  // =========================

  const {
    data: productResponse,
    isLoading: productsLoading,
    isError: productsError,
  } = useQuery({
    queryKey: ["products"],
    queryFn: () =>
      getAllProducts(token as string),
    enabled: !!token,
  });

  // =========================
  // Data
  // =========================

  const order: Order | null =
    orderResponse?.order ?? null;

  const items: OrderItem[] =
    itemsResponse?.items ?? [];

  const products: Product[] =
    productResponse?.products ?? [];

  // =========================
  // Loading
  // =========================

  if (
    orderLoading ||
    itemsLoading ||
    productsLoading
  ) {
    return (
      <>
        <Navbar />

        <main className="flex min-h-[70vh] items-center justify-center">
          <div className="flex flex-col items-center gap-3">

            <div className="h-9 w-9 animate-spin rounded-full border-4 border-gray-200 border-t-blue-700" />

            <p className="text-sm text-gray-500">
              Loading order details...
            </p>

          </div>
        </main>
      </>
    );
  }

  // =========================
  // Error
  // =========================

  if (
    orderError ||
    itemsError ||
    productsError ||
    !order
  ) {
    return (
      <>
        <Navbar />

        <main className="flex min-h-[70vh] items-center justify-center px-4">

          <div className="text-center">

            <Package
              size={50}
              className="mx-auto text-gray-300"
            />

            <h2 className="mt-4 text-xl font-semibold text-gray-800">
              Order not found
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              We couldn't load this order.
            </p>

            <button
              onClick={() =>
                navigate("/orders")
              }
              className="mt-6 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-800"
            >
              Back to My Orders
            </button>

          </div>

        </main>
      </>
    );
  }

  // =========================
  // Order Status
  // =========================

  const isCompleted =
    order.status.toLowerCase() ===
    "completed";

  const isPaid =
    order.payment_status.toLowerCase() ===
    "paid";

  // =========================
  // Payment
  // =========================

const handlePayment = async (token: string, orderId: string) => {
  try {
    const razorpayOrder = await createPayment(token, orderId);

    const options = {
      key: "rzp_test_TZ6GbWdiQg0fFN",
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      order_id: razorpayOrder.id,
      name: "Shopping",
      description: `Payment for order #${orderId}`,
      handler: async (response: any) => {
        const verifyData = await verifyPayment(token, {
          orderId,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
        });

        if (verifyData.success) {
          toast.success("Payment successful!");
          queryClient.invalidateQueries({ queryKey: ["orders"] }); // tells React Query to refetch
        } else {
          toast.error("Payment verification failed");
        }
      },
      modal: {
        ondismiss: () => {
          toast.error("Payment cancelled");
        },
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  } catch (err) {
    console.error(err);
    toast.error("Something went wrong");
  }
};

  return (
    <>
      <Navbar />

      <main className="w-full px-4 py-6 sm:px-8 sm:py-8 lg:px-16">

        <div className="mx-auto w-full max-w-6xl">

          {/* ========================= */}
          {/* Back */}
          {/* ========================= */}

          <button
            onClick={() =>
              navigate("/orders")
            }
            className="mb-6 flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-blue-700"
          >
            <ArrowLeft size={18} />

            Back to My Orders
          </button>

          {/* ========================= */}
          {/* Header */}
          {/* ========================= */}

          <div className="mb-6">

            <h1 className="text-2xl font-bold text-gray-900">
              Order Details
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Order #{order.order_id}
            </p>

          </div>

          {/* ========================= */}
          {/* Status Card */}
          {/* ========================= */}

          <div
            className={`rounded-xl border p-5 shadow-sm sm:p-6 ${
              isCompleted
                ? "border-green-200 bg-green-50"
                : "border-gray-200 bg-white"
            }`}
          >

            {/* Order Info */}

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div>
                <p className="text-xs text-gray-500">
                  Order ID
                </p>

                <p className="mt-1 text-lg font-bold text-gray-900">
                  #{order.order_id}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500">
                  Order Date
                </p>

                <p className="mt-1 text-sm font-medium text-gray-800">
                  {new Date(
                    order.created_at
                  ).toLocaleDateString(
                    "en-IN",
                    {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    }
                  )}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500">
                  Status
                </p>

                <span
                  className={`mt-1 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                    isCompleted
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {isCompleted
                    ? "Completed"
                    : "In Process"}
                </span>
              </div>

            </div>

            <div className="my-7 border-t border-gray-200" />

            {/* ========================= */}
            {/* Progress */}
            {/* ========================= */}

            <div className="px-1 sm:px-8">

              <div className="relative">

                {/* Background */}

                <div className="absolute left-0 right-0 top-4 h-1.5 rounded-full bg-gray-200" />

                {/* Green Progress */}

                <div
                  className={`absolute left-0 top-4 h-1.5 rounded-full bg-green-500 shadow-sm transition-all duration-1000 ${
                    isCompleted
                      ? "w-full"
                      : "w-1/2"
                  }`}
                >
                  {!isCompleted && (
                    <div className="absolute inset-0 overflow-hidden rounded-full">
                      <div className="absolute h-full w-12 animate-[progressShimmer_1.5s_linear_infinite] bg-linear-to-r from-transparent via-white/60 to-transparent" />
                    </div>
                  )}
                </div>

                {/* Steps */}

                <div className="relative flex justify-between">

                  {/* Order Placed */}

                  <div className="flex flex-col items-center">

                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-500 text-white shadow-md">
                      <Check
                        size={17}
                        strokeWidth={3}
                      />
                    </div>

                    <span className="mt-2 text-center text-xs font-semibold text-green-600">
                      Order Placed
                    </span>

                  </div>

                  {/* In Process */}

                  <div className="flex flex-col items-center">

                    <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-green-500 text-white shadow-md">

                      <Package
                        size={17}
                        strokeWidth={2.5}
                      />

                      {!isCompleted && (
                        <span className="absolute inset-0 animate-ping rounded-full border-2 border-green-400 opacity-30" />
                      )}

                    </div>

                    <span className="mt-2 text-center text-xs font-semibold text-green-600">
                      In Process
                    </span>

                  </div>

                  {/* Delivered */}

                  <div className="flex flex-col items-center">

                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-full border-2 ${
                        isCompleted
                          ? "border-green-500 bg-green-500 text-white"
                          : "border-gray-300 bg-white text-gray-400"
                      }`}
                    >
                      <Truck size={17} />
                    </div>

                    <span
                      className={`mt-2 text-center text-xs font-semibold ${
                        isCompleted
                          ? "text-green-600"
                          : "text-gray-400"
                      }`}
                    >
                      Delivered
                    </span>

                  </div>

                </div>

              </div>

            </div>

          </div>

          {/* ========================= */}
          {/* Ordered Items */}
          {/* ========================= */}

          <div className="mt-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">

            <div className="flex items-center gap-2">

              <ShoppingCart
                size={20}
                className="text-blue-700"
              />

              <h2 className="text-lg font-semibold text-gray-900">
                Ordered Items
              </h2>

            </div>

            <div className="my-5 border-t border-gray-200" />

            <div className="space-y-4">

              {items.length === 0 ? (
                <p className="text-sm text-gray-500">
                  No items found for this order.
                </p>
              ) : (
                items.map((item) => {

                  const product =
                    products.find(
                      (product) =>
                        product.product_id ===
                        item.product_id
                    );

                  const itemTotal =
                    Number(item.price) *
                    item.quantity;

                  return (
                    <div
                      key={item.order_item_id}
                      className="flex items-center gap-4 rounded-lg border border-gray-100 p-3"
                    >

                      {/* Product Image */}

                      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-gray-100">

                        {product?.image_url ? (
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <Package
                              size={25}
                              className="text-gray-400"
                            />
                          </div>
                        )}

                      </div>

                      {/* Product Details */}

                      <div className="min-w-0 flex-1">

                        <h3 className="truncate text-sm font-semibold text-gray-900">
                          {product?.name ??
                            `Product ${item.product_id}`}
                        </h3>

                        <p className="mt-1 text-xs text-gray-500">
                          Quantity: {item.quantity}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          Price: ₹
                          {Number(
                            item.price
                          ).toLocaleString(
                            "en-IN"
                          )}
                        </p>

                      </div>

                      {/* Item Total */}

                      <p className="shrink-0 text-sm font-semibold text-gray-900">
                        ₹
                        {itemTotal.toLocaleString(
                          "en-IN"
                        )}
                      </p>

                    </div>
                  );
                })
              )}

            </div>

          </div>

          {/* ========================= */}
          {/* Payment / Total */}
          {/* ========================= */}

          <div className="mt-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">

            <div className="flex items-center justify-between">

              <span className="text-sm text-gray-500">
                Total Amount
              </span>

              <span className="text-2xl font-bold text-gray-900">
                ₹
                {Number(
                  order.total_amount
                ).toLocaleString(
                  "en-IN"
                )}
              </span>

            </div>

            <div className="my-5 border-t border-gray-200" />

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              {/* Payment Status */}

              <div>

                <p className="text-xs text-gray-500">
                  Payment Status
                </p>

                <p
                  className={`mt-1 text-sm font-semibold ${
                    isPaid
                      ? "text-green-600"
                      : "text-yellow-600"
                  }`}
                >
                  {isPaid
                    ? "Paid"
                    : "Payment Pending"}
                </p>

              </div>

              {/* Pay */}

              {!isPaid && (
                
                <button
                  onClick={()=>{
                    if(!token) return
                    handlePayment(token, order.order_id)}}
                  className="flex items-center justify-center gap-2 rounded-lg bg-blue-700 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-blue-800"
                >
                  <CreditCard size={17} />

                  Pay Now
                </button>
              )}

            </div>

          </div>

        </div>

      </main>

      {/* Progress Animation */}

      <style>
        {`
          @keyframes progressShimmer {
            0% {
              transform: translateX(-100%);
            }

            100% {
              transform: translateX(500%);
            }
          }
        `}
      </style>
    </>
  );
};

export default OrderDetails;