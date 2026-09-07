import {
  Check,
  CreditCard,
  Package,
  ShoppingBag,
  Truck,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import Navbar from "../../components/user/Navbar";
import useAuthStore from "../../store/authstore";
import { getAllOrders } from "../../api/orderApi";
import { createPayment, verifyPayment } from "../../api/payment.api";
import queryClient from "../../lib/queryclient";

interface Order {
  order_id: string;
  user_id: string;
  address_id: string;
  total_amount: string;
  status: string;
  payment_status: string;
  created_at: string;
}

const MyOrders = () => {
  const navigate = useNavigate();

  const { token } = useAuthStore();

  // =========================
  // Get Orders
  // =========================

  const {
    data: orderResponse,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: () => getAllOrders(token as string),
    enabled: !!token,
  });

  const orders: Order[] = orderResponse?.orders ?? [];

  //handling payment

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
          {/* Page Header */}
          {/* ========================= */}

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">
              My Orders
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Track your orders and manage payments.
            </p>
          </div>

          {/* ========================= */}
          {/* Loading */}
          {/* ========================= */}

          {isLoading && (
            <div className="flex min-h-[40vh] items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-green-600" />

                <p className="text-sm text-gray-500">
                  Loading orders...
                </p>
              </div>
            </div>
          )}

          {/* ========================= */}
          {/* Error */}
          {/* ========================= */}

          {isError && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
              <p className="text-sm text-red-600">
                Failed to load your orders.
              </p>
            </div>
          )}

          {/* ========================= */}
          {/* No Orders */}
          {/* ========================= */}

          {!isLoading &&
            !isError &&
            orders.length === 0 && (
              <div className="flex min-h-[50vh] flex-col items-center justify-center rounded-xl border border-gray-200 bg-white px-6 text-center">

                <ShoppingBag
                  size={50}
                  className="text-gray-300"
                />

                <h2 className="mt-4 text-xl font-semibold text-gray-800">
                  No orders yet
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                  Your placed orders will appear here.
                </p>

                <button
                  onClick={() => navigate("/home")}
                  className="mt-6 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-800"
                >
                  Start Shopping
                </button>

              </div>
            )}

          {/* ========================= */}
          {/* Orders */}
          {/* ========================= */}

          {!isLoading &&
            !isError &&
            orders.length > 0 && (
              <div className="space-y-5">

                {orders.map((order) => {
                  const isCompleted =
                    order.status.toLowerCase() === "completed";

                  const isPaid =
                    order.payment_status.toLowerCase() === "paid";

                  return (
                      <div
                        key={order.order_id}
                        className={`rounded-xl border p-5 shadow-sm transition hover:shadow-md sm:p-6 ${
                          isCompleted
                            ? "border-green-200 bg-green-50"
                            : "border-gray-200 bg-white"
                        }`}
                      >

                      {/* ========================= */}
                      {/* Order Header */}
                      {/* ========================= */}

                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                        <div>
                          <p className="text-xs text-gray-500">
                            Order ID
                          </p>

                          <h2 className="mt-1 text-base font-semibold text-gray-900">
                            #{order.order_id}
                          </h2>
                        </div>

                        <div className="sm:text-right">
                          <p className="text-xs text-gray-500">
                            Order Date
                          </p>

                          <p className="mt-1 text-sm font-medium text-gray-800">
                            {new Date(
                              order.created_at
                            ).toLocaleDateString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </p>
                        </div>

                      </div>

                      <div className="my-6 border-t border-gray-200" />

                      {/* ========================= */}
                      {/* Order Progress */}
                      {/* ========================= */}

                      <div className="px-1 sm:px-8">

                        <div className="relative">

                          {/* ========================= */}
                          {/* Background Track */}
                          {/* ========================= */}

                          <div className="absolute left-0 right-0 top-4 h-1.5 rounded-full bg-gray-200" />

                          {/* ========================= */}
                          {/* Green Progress */}
                          {/* ========================= */}

                          <div
                            className={`absolute left-0 top-4 h-1.5 rounded-full bg-green-500 shadow-sm transition-all duration-1000 ease-out ${
                              isCompleted
                                ? "w-full"
                                : "w-1/2"
                            }`}
                          >
                            {/* Processing shimmer */}

                            {!isCompleted && (
                              <div className="absolute inset-0 overflow-hidden rounded-full">
                                <div className="absolute h-full w-12 animate-[progressShimmer_1.5s_linear_infinite] bg-linear-to-r from-transparent via-white/60 to-transparent" />
                              </div>
                            )}
                          </div>

                          {/* ========================= */}
                          {/* Steps */}
                          {/* ========================= */}

                          <div className="relative flex justify-between">

                            {/* ========================= */}
                            {/* Order Placed */}
                            {/* ========================= */}

                            <div className="flex flex-col items-center">

                              <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-green-500 bg-green-500 text-white shadow-md">
                                <Check size={17} strokeWidth={3} />
                              </div>

                              <span className="mt-2 text-center text-xs font-semibold text-green-600">
                                Order Placed
                              </span>

                            </div>

                            {/* ========================= */}
                            {/* In Process */}
                            {/* ========================= */}

                            <div className="flex flex-col items-center">

                              <div className="relative flex h-9 w-9 items-center justify-center rounded-full border-2 border-green-500 bg-green-500 text-white shadow-md">

                                <Package
                                  size={17}
                                  strokeWidth={2.5}
                                />

                                {/* Processing pulse */}

                                {!isCompleted && (
                                  <span className="absolute inset-0 animate-ping rounded-full border-2 border-green-400 opacity-30" />
                                )}

                              </div>

                              <span className="mt-2 text-center text-xs font-semibold text-green-600">
                                In Process
                              </span>

                            </div>

                            {/* ========================= */}
                            {/* Delivered */}
                            {/* ========================= */}

                            <div className="flex flex-col items-center">

                              <div
                                className={`flex h-9 w-9 items-center justify-center rounded-full border-2 shadow-md transition-all duration-700 ${
                                  isCompleted
                                    ? "border-green-500 bg-green-500 text-white"
                                    : "border-gray-300 bg-white text-gray-400 shadow-none"
                                }`}
                              >
                                <Truck
                                  size={17}
                                  strokeWidth={2.5}
                                />
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

                      <div className="my-6 border-t border-gray-200" />

                      {/* ========================= */}
                      {/* Bottom Section */}
                      {/* ========================= */}

                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                        {/* Total Amount */}

                        <div>
                          <p className="text-xs text-gray-500">
                            Total Amount
                          </p>

                          <p className="mt-1 text-xl font-bold text-gray-900">
                            ₹
                            {Number(
                              order.total_amount
                            ).toLocaleString("en-IN")}
                          </p>
                        </div>

                        {/* Payment */}

                        <div className="flex gap-5">
                        <button
                              onClick={() => navigate(`/orders/${order.order_id}`)}
                              className="rounded-lg border border-blue-700 bg-blue-700 text-white px-5 py-2.5 text-sm font-medium  transition hover:bg-blue-50"
                        >
                        View Details
                      </button>
                          {isPaid ? (
                            <div className="rounded-lg bg-green-50 px-4 py-2.5 text-center">
                              <p className="text-sm font-medium text-green-700">
                                Payment Successful
                              </p>
                            </div>
                          ) : (
                              <button
                                onClick={() => {
                                  if (!token) {
                                    toast.error("Please login to continue");
                                    return;
                                  }
                                  handlePayment(token, order.order_id);
                                }}
                                className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-700 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-blue-800 sm:w-auto"
                              >
                              <CreditCard size={17} />
                              Pay
                            </button>
                          )}

                        </div>
                        

                      </div>

                    </div>
                  );
                })}

              </div>
            )}

        </div>
      </main>

      {/* ========================= */}
      {/* Progress Animation */}
      {/* ========================= */}

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

export default MyOrders;