"use client";

import { Truck } from "lucide-react";

const deliveries = [
  {
    id: 1,
    order: "#1234",
    customer: "John Doe",
    address: "123 Main St, City",
    status: "In Transit",
    driver: "Mike Wilson",
  },
  {
    id: 2,
    order: "#1235",
    customer: "Jane Smith",
    address: "456 Oak Ave, Town",
    status: "Delivered",
    driver: "Sarah Johnson",
  },
  {
    id: 3,
    order: "#1236",
    customer: "Bob Brown",
    address: "789 Pine Rd, Village",
    status: "Pending",
    driver: "Tom Davis",
  },
];

export default function DeliveriesPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Deliveries</h1>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
        <div className="grid grid-cols-6 gap-4 p-4 border-b border-gray-200 dark:border-gray-700 font-semibold">
          <div>Order</div>
          <div>Customer</div>
          <div>Address</div>
          <div>Status</div>
          <div>Driver</div>
          <div>Actions</div>
        </div>
        {deliveries.map((delivery) => (
          <div
            key={delivery.id}
            className="grid grid-cols-6 gap-4 p-4 border-b border-gray-200 dark:border-gray-700 last:border-0"
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <Truck className="w-4 h-4" />
              </div>
              <span>{delivery.order}</span>
            </div>
            <div className="flex items-center">{delivery.customer}</div>
            <div className="flex items-center">{delivery.address}</div>
            <div className="flex items-center">
              <span className={`px-2 py-1 rounded-full text-sm ${
                delivery.status === "Delivered" ? "bg-green-100 text-green-800" :
                delivery.status === "In Transit" ? "bg-blue-100 text-blue-800" :
                "bg-yellow-100 text-yellow-800"
              }`}>
                {delivery.status}
              </span>
            </div>
            <div className="flex items-center">{delivery.driver}</div>
            <div className="flex items-center space-x-2">
              <button className="text-blue-600 hover:text-blue-800">Track</button>
              <button className="text-gray-600 hover:text-gray-800">Details</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}