import { Button } from "@/components/ui/button";
import Link from "next/link";

interface OrderSummaryProps {
  subtotal: number;
  deliveryCharge: number;
  total: number;
}

export const OrderSummary = ({ subtotal, deliveryCharge, total }: OrderSummaryProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold mb-4">Order Summary</h2>
      <div className="space-y-3 mb-4">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-semibold">${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Delivery Charge</span>
          <span className="font-semibold">${deliveryCharge.toFixed(2)}</span>
        </div>
        <div className="border-t pt-3">
          <div className="flex justify-between">
            <span className="font-bold">Total</span>
            <span className="font-bold">${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
      <Link href="/checkout">
        <Button className="w-full bg-red-500 hover:bg-red-600">
          Proceed to Checkout
        </Button>
      </Link>
    </div>
  );
};
