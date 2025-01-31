import { Package, Clock } from "lucide-react"
import { AnimatedMotorIcon } from "./AnimatedMotorIcon"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Order } from "@/types"

interface OrderCardProps {
  order: Order
  onViewDetails: (order: Order) => void
}

export function OrderCard({ order, onViewDetails }: OrderCardProps) {
  return (
    <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer" onClick={() => onViewDetails(order)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {order.status === "delivered" ? (
            <div className="p-2 rounded-full bg-green-50">
              <Package className="h-5 w-5 text-green-600" />
            </div>
          ) : (
            <AnimatedMotorIcon />
          )}
          <div>
            <div className="font-medium">{order.status === "delivered" ? "Order Delivered" : "Order on the way"}</div>
            <div className="text-sm text-muted-foreground">Order: {order.id}</div>
          </div>
        </div>
        <div className="text-sm text-muted-foreground flex items-center gap-1">
          <Clock className="h-4 w-4" />
          {order.status === "delivered" ? `Delivered ${order.deliveredAt}` : `Estimated ${order.estimatedDelivery}`}
        </div>
      </div>
    </Card>
  )
}

