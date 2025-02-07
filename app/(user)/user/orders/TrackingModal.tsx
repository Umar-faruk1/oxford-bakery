'use client'
import { Phone, MapPin, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DeliveryMap } from "./DeliveryMap";
import { Order } from "@/types";
import { useEffect } from "react"; // Import useEffect

interface TrackingModalProps {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
}

export function TrackingModal({ order, isOpen, onClose }: TrackingModalProps) {
  const handleCallChef = () => {
    if (typeof window !== 'undefined') {
      window.open(`tel:${order.chef?.phone}`);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md" aria-describedby="tracking-order-description">
        <DialogHeader>
          <DialogTitle>Order: {order.id}</DialogTitle>
        </DialogHeader>
        <p id="tracking-order-description" className="text-sm text-muted-foreground">
          Track your order's status and view delivery details, including the recipient and delivery address.
        </p>
        <div className="space-y-4">
          {/* Map Section */}
          {order.tracking && (
            <div className="aspect-video rounded-lg overflow-hidden">
              <DeliveryMap currentLocation={order.tracking.currentLocation} destination={order.tracking.destination} />
            </div>
          )}

          {/* Delivery Details */}
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-gray-500 mt-1" />
              <div>
                <h4 className="font-medium">DPS Route</h4>
                <p className="text-sm text-muted-foreground">{order.deliveryAddress}</p>
              </div>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-red-500 rounded-full" />
                <span className="text-blue-600 font-medium">Order is Being Prepared</span>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gray-200">
                    {order.chef?.name && (
                      <img
                        src={`https://ui-avatars.com/api/?name=${order.chef.name}`}
                        alt={order.chef.name}
                        className="w-full h-full rounded-full"
                      />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium">Chef: {order.chef?.name}</p>
                    <p className="text-xs text-muted-foreground">ID: {order.id}</p>
                  </div>
                </div>
                <Button size="icon" variant="ghost" onClick={handleCallChef}>
                  <Phone className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="p-4 bg-red-50 rounded-lg">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-red-500" />
                <span className="text-red-600 font-medium">Delivering To:</span>
              </div>
              <div className="mt-2 flex items-center gap-3">
                {order.recipient && (
                  <img
                    src={order.recipient.image || `https://ui-avatars.com/api/?name=${order.recipient.name}`}
                    alt={order.recipient.name}
                    className="w-10 h-10 rounded-full"
                  />
                )}
                <div>
                  <p className="font-medium">{order.recipient?.name}</p>
                  <p className="text-sm text-muted-foreground">{order.deliveryAddress}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}