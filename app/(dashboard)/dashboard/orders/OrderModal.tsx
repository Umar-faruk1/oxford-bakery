import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Order {
  id: string
  orderNumber: string
  paymentToken: string
  orderDate: string
  customer: string
  deliveryAddress: string
  isPaid: boolean
  isCollected: boolean
  isDelivered: boolean
}

interface OrderModalProps {
  order: Order
  onClose: () => void
}

export function OrderModal({ order, onClose }: OrderModalProps) {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] p-6">
        <DialogHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold">Order Details</DialogTitle>
            {/* <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button> */}
          </div>
          <div className="space-y-2 text-sm text-gray-600">
            <p><span className="font-medium">Order Number:</span> {order.orderNumber}</p>
            <p><span className="font-medium">Customer:</span> {order.customer}</p>
            <p><span className="font-medium">Payment Token:</span> {order.paymentToken}</p>
            <p><span className="font-medium">Delivery Address:</span> {order.deliveryAddress}</p>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium">Order Summary</h4>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>RockShandy</span>
                <span>$45 × 2</span>
              </div>
              <div className="flex justify-between">
                <span>Discount</span>
                <span>$2</span>
              </div>
              <div className="flex justify-between">
                <span>Service Fee</span>
                <span>$6</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span>$3</span>
              </div>
            </div>
          </div>

          <div className="flex justify-between font-medium pt-4 border-t">
            <span>Total</span>
            <span>$96</span>
          </div>
        </div>

        <div className="space-y-2 text-sm">
          <h4 className="font-medium">Delivery Note:</h4>
          <p className="text-gray-600">Please deliver to the front desk.</p>
        </div>
      </DialogContent>
    </Dialog>
  )
}