"use client";

import { Package } from "lucide-react";

const orders = [
  { id: 1, customer: "John Doe", status: "Delivered", total: "$99.99", date: "2024-03-20" },
  { id: 2, customer: "Jane Smith", status: "Processing", total: "$149.99", date: "2024-03-19" },
  { id: 3, customer: "Mike Johnson", status: "Pending", total: "$79.99", date: "2024-03-18" },
];

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Orders</h1>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
        <div className="grid grid-cols-5 gap-4 p-4 border-b border-gray-200 dark:border-gray-700 font-semibold">
          <div>Order ID</div>
          <div>Customer</div>
          <div>Status</div>
          <div>Total</div>
          <div>Date</div>
        </div>
        {orders.map((order) => (
          <div
            key={order.id}
            className="grid grid-cols-5 gap-4 p-4 border-b border-gray-200 dark:border-gray-700 last:border-0"
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <Package className="w-4 h-4" />
              </div>
              <span>#{order.id}</span>
            </div>
            <div className="flex items-center">{order.customer}</div>
            <div className="flex items-center">
              <span className={`px-2 py-1 rounded-full text-sm ${
                order.status === "Delivered" ? "bg-green-100 text-green-800" :
                order.status === "Processing" ? "bg-blue-100 text-blue-800" :
                "bg-yellow-100 text-yellow-800"
              }`}>
                {order.status}
              </span>
            </div>
            <div className="flex items-center">{order.total}</div>
            <div className="flex items-center">{order.date}</div>
          </div>
        ))}
      </div>
    </div>
  );
}