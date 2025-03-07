"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { Trash2, Plus, Minus, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCartStore } from "@/lib/store"
import { toast } from "sonner"

export default function CartPage() {
  const [mounted, setMounted] = useState(false)
  const { items, updateQuantity, removeItem, getTotalPrice } = useCartStore()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="container mx-auto px-4 py-12 min-h-[60vh] flex items-center justify-center">Loading...</div>
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 min-h-[60vh] flex flex-col items-center justify-center mb-16 md:mb-0">
        <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
        <div className="text-center">
          <p className="text-xl mb-6">Your cart is empty</p>
          <Link to="/menu">
            <Button className="bg-[#FF7F00] hover:bg-[#FF7F00]/90">Browse Menu</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12 mb-16 md:mb-0">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <div className="hidden md:grid grid-cols-5 gap-4 pb-4 border-b text-sm font-medium text-gray-500">
                <div className="col-span-2">Product</div>
                <div>Price</div>
                <div>Quantity</div>
                <div>Total</div>
              </div>

              {items.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="grid grid-cols-1 md:grid-cols-5 gap-4 py-6 border-b items-center"
                >
                  <div className="col-span-2 flex items-center gap-4">
                    <div className="relative h-20 w-20 rounded-md overflow-hidden">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-gray-500 hidden md:block">{item.description.substring(0, 60)}...</p>
                    </div>
                  </div>

                  <div className="text-[#FF7F00] font-medium">GH₵{item.price.toFixed(2)}</div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => {
                        if (item.quantity > 1) {
                          updateQuantity(item.id, item.quantity - 1)
                        }
                      }}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-medium">GH₵{(item.price * item.quantity).toFixed(2)}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        removeItem(item.id)
                        toast.success("Item removed", {
                          description: `${item.name} has been removed from your cart.`,
                        })
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>GH₵{getTotalPrice().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery</span>
                <span>GH₵5.00</span>
              </div>
              <div className="border-t pt-3 flex justify-between font-bold">
                <span>Total</span>
                <span>GH₵{(getTotalPrice() + 5).toFixed(2)}</span>
              </div>
            </div>

            <Link to="/checkout">
              <Button className="w-full bg-[#FF7F00] hover:bg-[#FF7F00]/90 gap-2">
                Proceed to Checkout
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

