"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  UserPlus,
  Clock,
  Plus,
  MoreVertical,
} from "lucide-react";
import { getOverviewData } from "@/actions/admin-overview";
import { formatNaira } from "@/lib/utils";

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  paid: "bg-green-100 text-green-700",
  failed: "bg-red-100 text-red-700",
  shipped: "bg-blue-100 text-blue-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-gray-200 text-gray-600",
};

function TrendBadge({ pct }: { pct: number }) {
  const positive = pct >= 0;
  return (
    <span
      className={`flex items-center gap-1 text-xs font-medium ${positive ? "text-[#5F7A5B]" : "text-red-500"}`}
    >
      {positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
      {positive ? "+" : ""}
      {pct}%
    </span>
  );
}

export default function AdminOverviewPage() {
  const [range, setRange] = useState<"7D" | "30D" | "1Y">("30D");
  const [data, setData] =
    useState<Awaited<ReturnType<typeof getOverviewData>>>(null);

  useEffect(() => {
    getOverviewData(range).then(setData);
  }, [range]);

  if (!data)
    return <p className="text-sm text-[#8A928E]">Loading overview...</p>;

  const cards = [
    {
      label: "Total Revenue",
      value: formatNaira(data.revenue.value),
      pct: data.revenue.pct,
      icon: DollarSign,
    },
    {
      label: "Total Orders",
      value: data.orders.value.toLocaleString(),
      pct: data.orders.pct,
      icon: ShoppingCart,
    },
    {
      label: "New Customers",
      value: data.newCustomers.value.toLocaleString(),
      pct: data.newCustomers.pct,
      icon: UserPlus,
    },
    {
      label: "Pending Orders",
      value: data.pendingOrders.value.toLocaleString(),
      pct: data.pendingOrders.pct,
      icon: Clock,
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#1F2421]">Admin Overview</h1>
          <p className="text-xs text-[#8A928E] uppercase tracking-widest mt-1">
            Dashboard / Intelligence / General
          </p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {cards.map(({ label, value, pct, icon: Icon }) => (
          <div key={label} className="bg-white rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="w-9 h-9 rounded-full bg-[#DCE5D3] flex items-center justify-center text-[#3F5C42]">
                <Icon size={16} />
              </div>
              <TrendBadge pct={pct} />
            </div>
            <p className="text-xs uppercase tracking-widest text-[#8A928E] mb-1">
              {label}
            </p>
            <p className="text-2xl font-bold text-[#1F2421]">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
        {/* Revenue chart */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-6">
          <div className="flex items-center justify-between mb-1">
            <h2 className="font-semibold text-[#1F2421]">Revenue Over Time</h2>
            <div className="flex gap-1">
              {(["7D", "30D", "1Y"] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setRange(r)}
                  className={`text-xs font-medium px-3 py-1.5 rounded-full transition-colors ${
                    range === r
                      ? "bg-[#1F2421] text-white"
                      : "bg-[#F7F5F0] text-[#8A928E] hover:text-[#1F2421]"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
          <p className="text-xs text-[#8A928E] mb-6">
            Performance of sales across all categories
          </p>

          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={data.revenueChart}>
              <CartesianGrid strokeDasharray="3 3" stroke="#EFEDE6" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: "#8A928E" }}
                interval={Math.floor(data.revenueChart.length / 6)}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#8A928E" }}
                tickFormatter={(v) => `₦${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip formatter={(value: number) => formatNaira(value)} />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#5F7A5B"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Top selling products */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-6">
          <h2 className="font-semibold text-[#1F2421] mb-5">
            Top Selling Products
          </h2>
          <div className="flex flex-col gap-4">
            {data.topProducts.length === 0 && (
              <p className="text-xs text-[#8A928E]">No sales yet</p>
            )}
            {data.topProducts.map((p) => (
              <div key={p.name} className="flex items-center gap-3">
                <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-[#EFEDE6] shrink-0">
                  {p.image && (
                    <Image
                      src={p.image}
                      alt={p.name}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#1F2421] truncate">
                    {p.name}
                  </p>
                  <p className="text-xs text-[#8A928E]">{p.qty} sold</p>
                </div>
                <p className="text-sm font-semibold text-[#5F7A5B] shrink-0">
                  {formatNaira(p.revenue)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-semibold text-[#1F2421]">Recent Orders</h2>
            <p className="text-xs text-[#8A928E] mt-1">
              Latest transactions from the marketplace
            </p>
          </div>
          <Link
            href="/admin/orders"
            className="text-xs font-medium text-[#5F7A5B] hover:text-[#1F2421] transition-colors"
          >
            View All Orders
          </Link>
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-black/5 text-left text-xs uppercase tracking-widest text-[#8A928E]">
              <th className="pb-3">Order ID</th>
              <th className="pb-3">Customer</th>
              <th className="pb-3">Product</th>
              <th className="pb-3">Amount</th>
              <th className="pb-3">Status</th>
              <th className="pb-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.recentOrders.map((order) => (
              <tr
                key={order.id}
                className="border-b border-black/5 last:border-0"
              >
                <td className="py-4 font-medium text-[#1F2421]">
                  #{order.id.slice(0, 8).toUpperCase()}
                </td>
                <td className="py-4">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-[#DCE5D3] text-[#3F5C42] text-xs font-bold flex items-center justify-center shrink-0">
                      {order.customerName.charAt(0).toUpperCase()}
                    </span>
                    <span className="text-[#1F2421]">{order.customerName}</span>
                  </div>
                </td>
                <td className="py-4 text-[#8A928E]">{order.itemSummary}</td>
                <td className="py-4 font-medium text-[#1F2421]">
                  {formatNaira(order.amount)}
                </td>
                <td className="py-4">
                  <span
                    className={`text-xs font-medium uppercase tracking-wider px-2.5 py-1 rounded-full ${STATUS_STYLES[order.status] ?? "bg-gray-100 text-gray-600"}`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="py-4 text-right">
                  <Link
                    href="/admin/orders"
                    className="inline-block text-[#8A928E] hover:text-[#1F2421] transition-colors"
                  >
                    <MoreVertical size={16} />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {data.recentOrders.length === 0 && (
          <p className="text-center py-12 text-sm text-[#8A928E]">
            No orders yet
          </p>
        )}
      </div>

      {/* Floating quick-add button */}
      <Link
        href="/admin/products"
        className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-[#1F2421] hover:bg-[#2E3634] text-white flex items-center justify-center shadow-lg transition-colors"
      >
        <Plus size={22} />
      </Link>
    </div>
  );
}
