import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {getAllOrders, updateOrderStatus,} from "../api/orderApi";
import useAuthStore from "../store/authstore";

interface Order {
  order_id: string;
  user_id: string;
  address_id: string;
  total_amount: string;
  status: string;
  payment_status: string;
  created_at: string;
}

const AdminOrders = () => {
  const { token } = useAuthStore();
  const queryClient = useQueryClient();

  // Get all orders
  const { data, isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: () => getAllOrders(token as string),
  });

  const orders: Order[] = data?.orders ?? [];

  // Update order status
  const { mutateAsync: changeOrderStatus, isPending: isUpdating } =
    useMutation({mutationFn: ({orderId,status}: {orderId: string;status: string;}
    ) => updateOrderStatus(token as string, orderId, status),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["orders"],
        });
      },
    });

  const handleStatusChange = async (orderId: string,status: string) => {
    await changeOrderStatus({orderId, status});
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <p className="text-gray-600">Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Orders
        </h1>

        <p className="text-sm text-gray-500 mt-1">
          Manage customer orders and update order status
        </p>
      </div>

      {/* Orders */}
      {orders.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <p className="text-gray-500">
            No orders found.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5">
          {orders.map((order) => {
            const isCompleted = order.status === "completed";// this is only flag
            return (
              <div
                key={order.order_id}
                className={`rounded-xl border p-5 shadow-sm transition ${
                  isCompleted
                    ? "bg-green-50 border-green-300"
                    : "bg-white border-gray-200"
                }`}
              >
                {/* Top section */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2
                      className={`text-lg font-semibold ${
                        isCompleted
                          ? "text-green-800"
                          : "text-gray-800"
                      }`}
                    >
                      Order #{order.order_id}
                    </h2>

                    <p className="text-sm text-gray-500">
                      User ID: {order.user_id}
                    </p>
                  </div>

                  {/* Status dropdown */}
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Order Status
                    </label>
                    <select value={order.status} disabled={isUpdating}
                      onChange={(e) =>handleStatusChange(order.order_id, e.target.value)
                      }
                      className={`rounded-lg border px-3 py-2 text-sm font-medium outline-none ${
                        isCompleted
                          ? "border-green-400 bg-green-100 text-green-800"
                          : "border-yellow-400 bg-yellow-50 text-yellow-800"
                      }`}
                    >
                      <option value="pending">
                        Pending
                      </option>

                      <option value="completed">
                        Completed
                      </option>
                    </select>
                  </div>
                </div>

                {/* Order information */}
                <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {/* Address */}
                  <div>
                    <p className="text-xs text-gray-500">
                      Address ID
                    </p>

                    <p className="mt-1 font-medium text-gray-800">
                      {order.address_id}
                    </p>
                  </div>

                  {/* Total */}
                  <div>
                    <p className="text-xs text-gray-500">
                      Total Amount
                    </p>

                    <p
                      className={`mt-1 font-semibold ${
                        isCompleted
                          ? "text-green-700"
                          : "text-gray-800"
                      }`}
                    >
                      ₹{Number(order.total_amount).toLocaleString("en-IN")} {/*local indian formating*/}
                    </p>
                  </div>

                  {/* Payment */}
                  <div>
                    <p className="text-xs text-gray-500">
                      Payment Status
                    </p>

                    <p className="mt-1 font-medium capitalize text-gray-800">
                      {order.payment_status}
                    </p>
                  </div>

                  {/* Date */}
                  <div>
                    <p className="text-xs text-gray-500">
                      Created At
                    </p>

                    <p className="mt-1 font-medium text-gray-800">
                      {new Date(
                        order.created_at
                      ).toLocaleDateString("en-IN")}
                    </p>
                  </div>
                </div>

                {/* Completed message */}
                {isCompleted && (
                  <div className="mt-5 rounded-lg bg-green-100 px-4 py-3">
                    <p className="text-sm font-medium text-green-800">
                      ✓ Order completed successfully
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminOrders;