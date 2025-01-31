"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OrderCard } from "./OrderCard"; 
import { DeliveredOrderModal } from "./DeliveredOrderModal"; 
import { TrackingModal } from "./TrackingModal"; 
import { Order } from "@/types"; 

const mockOrders: Order[] = [
  {
      id: "DPS2023604254",
      items: [
          {
              id: "1",
              name: "Bockshandy",
              quantity: 1,
              price: 42,
              image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%20(41)-IpKdybssDr0Zgf9vyaTnC98AQrN8IL.png",
          },
      ],
      statuses: "delivered",
      deliveredAt: "May 15 2023",
      discount: 2,
      serviceFee: 6,
      deliveryFee: 3,
      total: 56,
      deliveryAddress: "123 May St, Haymarket NSW 2000, Australia",
      deliveryNote: "Please ring the doorbell",
      createdAt: "",
      status: "delivered"
  },
  {
      id: "DPS2330072047",
      items: [
          {
              id: "2",
              name: "Chain Burger",
              quantity: 1,
              price: 25,
              image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%20(40)-hYSPhEfhNPLaTmJQ1gtvu8mt1Hz84J.png",
          },
      ],
      statuses: "on_the_way",
      estimatedDelivery: "30 mins",
      discount: 0,
      serviceFee: 5,
      deliveryFee: 3,
      total: 33,
      deliveryAddress: "45 Dublin Street, NSW, Darwin",
      chef: {
          name: "Manuel",
          phone: "+61 123 456 789",
      },
      tracking: {
          currentLocation: {
              lat: -12.4637,
              lng: 130.8444,
          },
          destination: {
              lat: -12.4666,
              lng: 130.8451,
          },
      },
      recipient: {
          name: "Dr Marco",
          image: "https://ui-avatars.com/api/?name=Dr+Marco",
          address: "45 Dublin Street, NSW, Darwin",
      },
      createdAt: "",
      status: "pending"
  },
];

export default function OrdersPage() {
  const [orders] = useState<Order[]>(mockOrders);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
  };

  return (
    <main className="min-h-screen bg-gray-50 pt-16 pb-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link href="/user">
            <Button
              variant="outline"
              className="text-green-600 hover:text-green-700 hover:bg-green-50"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to my Profile
            </Button>
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold mb-6">My Orders</h1>
          <div className="space-y-4">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} onViewDetails={handleViewDetails} />
            ))}
          </div>
        </div>
      </div>

      {selectedOrder?.statuses === "delivered" && (
        <DeliveredOrderModal
          order={selectedOrder}
          isOpen={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}

      {selectedOrder?.statuses === "on_the_way" && (
        <TrackingModal
          order={selectedOrder}
          isOpen={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </main>
  );
}