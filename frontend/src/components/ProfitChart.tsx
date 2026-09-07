import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getAllOrders } from "../api/adminApi";
import type { ValueType } from "recharts/types/component/DefaultTooltipContent"
interface Order {
  order_id: number;
  total_amount: number;
  payment_status: "pending" | "paid";
  created_at: string;
}

function getBucketLabel(date: Date): string {
  const day = date.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
  const hour = date.getHours();
  const hourLabel = hour === 0 ? "12 AM" : hour < 12 ? `${hour} AM` : hour === 12 ? "12 PM" : `${hour - 12} PM`;
  return `${day} ${hourLabel}`;
}

function getBucketKey(date: Date): string {
  const dateOnly = date.toISOString().split("T")[0];
  const hour = date.getHours();
  return `${dateOnly}-${hour}`;
}

export default function ProfitChart({ token }: { token: string }) {
  const { data: orderResponse, isLoading, isError } = useQuery({
    queryKey: ["orders"],
    queryFn: () => getAllOrders(token),
    enabled: !!token,
  });

const chartData = useMemo(() => {
  if (!orderResponse) return [];

  const orders: Order[] = orderResponse.orders ?? [];
  const paidOrders = orders.filter((order) => order.payment_status === "paid");

  // Build a map of actual profit per hour bucket (from ALL paid orders)
  const profitByHour = new Map<string, number>();
  paidOrders.forEach((order) => {
    const date = new Date(order.created_at);
    const key = getBucketKey(date);
    const profit = order.total_amount * 0.1;
    profitByHour.set(key, (profitByHour.get(key) ?? 0) + profit);
  });

  // Fixed window: last 24 hours ending at the current hour (right now)
  const now = new Date();
  now.setMinutes(0, 0, 0);

  const start = new Date(now);
  start.setHours(start.getHours() - 23); // 24 buckets total, including "now"

  const result: { label: string; profit: number }[] = [];
  const cursor = new Date(start);
  while (cursor.getTime() <= now.getTime()) {
    const key = getBucketKey(cursor);
    const profit = profitByHour.get(key) ?? 0;
    result.push({
      label: getBucketLabel(cursor),
      profit: Math.round(profit * 100) / 100,
    });
    cursor.setHours(cursor.getHours() + 1);
  }

  return result;
}, [orderResponse]);

  if (isLoading) {
    return (
      <div className="w-full h-64 flex items-center justify-center text-gray-400 text-sm">
        Loading profit data...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full h-64 flex items-center justify-center text-red-500 text-sm">
        Failed to load profit data
      </div>
    );
  }

  if (chartData.length === 0) {
    return (
      <div className="w-full h-64 flex items-center justify-center text-gray-400 text-sm">
        No paid orders yet
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
      <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">
        Profit (last 24 hrs)
      </h2>
      <div className="w-full h-64 sm:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="label" tick={{ fontSize: 11 }} interval="preserveStartEnd" />
            <YAxis tick={{ fontSize: 11 }} tickFormatter={(value) => `₹${value}`} width={60} />
            <Tooltip
            formatter={(value: ValueType | undefined) => [`₹${Number(value ?? 0).toFixed(2)}`, "Profit"]}
            />
            <Line
              type="monotone"
              dataKey="profit"
              stroke="#1d4ed8"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}