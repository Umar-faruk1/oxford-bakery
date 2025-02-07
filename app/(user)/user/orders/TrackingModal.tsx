'use client';

import Image from "next/image";
import { Phone, MapPin } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DeliveryMap } from "./DeliveryMap";
import { Order } from "@/types";

interface TrackingModalProps {
  order?: Order;  // Ensure `order` is optional to prevent crashes
  isOpen: boolean;
  onClose: () => void;
}

export function TrackingModal({ order, isOpen, onClose }: TrackingModalProps) {
  if (!isOpen || !order) return null; // Only render when modal is open and order exists

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md" aria-describedby="tracking-order-description">
        <DialogHeader>
          <DialogTitle>Order: {order?.id || "Unknown"}</DialogTitle>
        </DialogHeader>
        <p id="tracking-order-description" className="text-sm text-muted-foreground">
          Track your order's status and view delivery details, including the recipient and delivery address.
        </p>

        <div className="space-y-4">
          {/* Map Section */}
          {order?.tracking && (
            <div className="aspect-video rounded-lg overflow-hidden">
              <DeliveryMap
                currentLocation={order.tracking.currentLocation}
                destination={order.tracking.destination}
              />
            </div>
          )}

          {/* Delivery Details */}
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-gray-500 mt-1" />
              <div>
                <h4 className="font-medium">DPS Route</h4>
                <p className="text-sm text-muted-foreground">{order?.deliveryAddress || "N/A"}</p>
              </div>
            </div>

            {/* Order Preparation */}
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-red-500 rounded-full" />
                <span className="text-blue-600 font-medium">Order is Being Prepared</span>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {order?.chef?.name && (
                    <Image
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(order.chef.name)}`}
                      alt={order.chef.name}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  )}
                  <div>
                    <p className="text-sm font-medium">Chef: {order?.chef?.name || "Unknown"}</p>
                    <p className="text-xs text-muted-foreground">ID: {order?.id || "N/A"}</p>
                  </div>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => {
                    if (typeof window !== "undefined" && order?.chef?.phone) {
                      window.open(`tel:${order.chef.phone}`);
                    }
                  }}
                >
                  <Phone className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Delivery Information */}
            <div className="p-4 bg-red-50 rounded-lg">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-red-500" />
                <span className="text-red-600 font-medium">Delivering To:</span>
              </div>
              <div className="mt-2 flex items-center gap-3">
                {order?.recipient && (
                  <Image
                    src={order.recipient.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(order.recipient.name)}`}
                    alt={order.recipient.name}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                )}
                <div>
                  <p className="font-medium">{order?.recipient?.name || "Unknown Recipient"}</p>
                  <p className="text-sm text-muted-foreground">{order?.deliveryAddress || "N/A"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
