'use client'

import { Truck } from "lucide-react";
import { useState } from "react";
import { DeliveryDetailsDialog } from "./DeliveryDetailDialog";
import { AssignDriverDialog } from "./AssignDriverDialog";
import { Button } from "@/components/ui/button";
import { Delivery, Driver } from "@/types";

const initialDeliveries: Delivery[] = [
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
    driver: null,
  },
];

const drivers: Driver[] = [
  { id: 1, name: "Mike Wilson", status: "online" },
  { id: 2, name: "Sarah Johnson", status: "offline" },
  { id: 3, name: "Tom Davis", status: "online" },
];

export default function DeliveriesPage() {
  const [deliveries, setDeliveries] = useState<Delivery[]>(initialDeliveries);
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null);
  const [deliveryToAssign, setDeliveryToAssign] = useState<Delivery | null>(null);

  const handleAssignDriver = (deliveryId: number, driverId: number) => {
    const driver = drivers.find((d) => d.id === driverId);
    if (!driver) return;
    
    setDeliveries((prev) =>
      prev.map((delivery) =>
        delivery.id === deliveryId
          ? { ...delivery, driver: driver.name, status: "In Transit" }
          : delivery
      )
    );
    setDeliveryToAssign(null);
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      <h1 className="text-3xl font-bold">Deliveries</h1>
      <div className="bg-card rounded-xl shadow-sm">
        <div className="grid grid-cols-6 gap-4 p-4 border-b font-semibold">
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
            className="grid grid-cols-6 gap-4 p-4 border-b last:border-0 hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <Truck className="w-4 h-4 text-primary" />
              </div>
              <span>{delivery.order}</span>
            </div>
            <div className="flex items-center">{delivery.customer}</div>
            <div className="flex items-center">{delivery.address}</div>
            <div className="flex items-center">
              <span
                className={`px-2 py-1 rounded-full text-sm ${
                  delivery.status === "Delivered"
                    ? "bg-green-100 text-green-800"
                    : delivery.status === "In Transit"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {delivery.status}
              </span>
            </div>
            <div className="flex items-center">
              {delivery.driver || "Not Assigned"}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedDelivery(delivery)}
              >
                View
              </Button>
              {delivery.status === "Pending" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDeliveryToAssign(delivery)}
                >
                  Assign Driver
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      <DeliveryDetailsDialog
        delivery={selectedDelivery}
        onClose={() => setSelectedDelivery(null)}
      />

      <AssignDriverDialog
        delivery={deliveryToAssign}
        drivers={drivers}
        onAssign={handleAssignDriver}
        onClose={() => setDeliveryToAssign(null)}
      />
    </div>
  );
}