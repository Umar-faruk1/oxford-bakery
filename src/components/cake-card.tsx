"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Plus, Minus, Eye } from "lucide-react"
import { toast } from "sonner"
import { useCartStore } from "@/lib/store"
import type { Cake } from "@/types/types"
import { CakeModal } from "@/components/cake-modal"

interface CakeCardProps {
  cake: Cake
}

export default function CakeCard({ cake }: CakeCardProps) {
  const [quantity, setQuantity] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { addItem, updateQuantity } = useCartStore()

  const handleAddToCart = () => {
    setQuantity(quantity + 1)
    addItem(cake)
    toast.success("Added to cart", {
      description: `${cake.name} has been added to your cart.`,
      duration: 3000,
    })
  }

  const handleRemoveFromCart = () => {
    if (quantity > 0) {
      setQuantity(quantity - 1)
      updateQuantity(cake.id, quantity - 1)
      toast.success("Removed from cart", {
        description: `One ${cake.name} has been removed from your cart.`,
        duration: 3000,
      })
    }
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        whileHover={{ y: -5 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg"
      >
        <div className="relative h-48 w-full group">
          <img 
            src={cake.image || "/placeholder.svg"} 
            alt={cake.name} 
            className="w-full h-full object-cover"
          />

          {/* View details button */}
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsModalOpen(true)}
              className="bg-white rounded-full p-2 shadow-md"
            >
              <Eye className="h-5 w-5 text-[#FF7F00]" />
            </motion.button>
          </div>

          {/* Quantity controls */}
          <div className="absolute bottom-2 right-2 flex items-center space-x-1">
            {quantity > 0 && (
              <>
                <motion.button
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  onClick={handleRemoveFromCart}
                  className="bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
                >
                  <Minus className="h-5 w-5 text-[#FF7F00]" />
                </motion.button>

                <div className="bg-white rounded-full w-6 h-6 flex items-center justify-center shadow-md">
                  <span className="text-sm font-bold">{quantity}</span>
                </div>
              </>
            )}

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleAddToCart}
              className="bg-[#FF7F00] rounded-full p-1 shadow-md hover:bg-[#FF7F00]/90"
            >
              <Plus className="h-5 w-5 text-white" />
            </motion.button>
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-1 truncate">{cake.name}</h3>
          <p className="text-gray-600 text-sm mb-2 line-clamp-2">{cake.description}</p>
          <p className="text-[#FF7F00] font-bold">GH₵{cake.price.toFixed(2)}</p>
        </div>
      </motion.div>

      <CakeModal cake={cake} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAddToCart={handleAddToCart} />
    </>
  )
}

