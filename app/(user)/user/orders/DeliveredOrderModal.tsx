'use client'

import { X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Order } from "@/types";

interface DeliveredOrderModalProps {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
}

export function DeliveredOrderModal({ order, isOpen, onClose }: DeliveredOrderModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md" aria-describedby="delivered-order-description">
        <DialogHeader>
          <DialogTitle>Order: {order.id}</DialogTitle>
        </DialogHeader>
        <p id="delivered-order-description" className="text-sm text-muted-foreground">
          Details of your delivered order, including items, prices, and delivery address, are listed below.
        </p>
        <div className="space-y-4">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center gap-3">
              <img
                src={item.image || "/placeholder.svg"}
                alt={item.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <h4 className="font-medium">{item.name}</h4>
                <p className="text-sm text-muted-foreground">Price: ${item.price}</p>
              </div>
            </div>
          ))}

          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Discount</span>
              <span>-${order.discount}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Service Fees</span>
              <span>${order.serviceFee}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Delivery Fee</span>
              <span>${order.deliveryFee}</span>
            </div>
            <div className="flex justify-between font-medium pt-2 border-t">
              <span>Total</span>
              <span>${order.total}</span>
            </div>
          </div>

          <div className="space-y-2 pt-4 border-t">
            <h4 className="font-medium">Delivery Note:</h4>
            <p className="text-sm text-muted-foreground">{order.deliveryNote || "No delivery note"}</p>
            <h4 className="font-medium">Delivery Address:</h4>
            <p className="text-sm text-muted-foreground">{order.deliveryAddress}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
