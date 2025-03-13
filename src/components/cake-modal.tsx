"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Cake } from "@/types/types"

interface CakeModalProps {
  cake: Cake
  isOpen: boolean
  onClose: () => void
  onAddToCart: () => void
}

const normalizeImageUrl = (url: string | null) => {
  if (!url) return "/placeholder.svg";
  return url.replace(/\\/g, '/');
};

export function CakeModal({ cake, isOpen, onClose, onAddToCart }: CakeModalProps) {
  if (!isOpen) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", damping: 20 }}
            className="relative bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-auto z-50"
          >
            <button onClick={onClose} className="absolute top-2 right-2 p-2 rounded-full bg-white/80 hover:bg-white">
              <X className="h-5 w-5" />
            </button>

            <div className="relative h-64 w-full">
              <img
                src={normalizeImageUrl(cake.image)}
                alt={cake.name}
                className="w-full h-full object-cover rounded-t-lg"
              />
            </div>

            <div className="p-6">
              <h2 className="text-2xl font-bold mb-2">{cake.name}</h2>
              <p className="text-[#FF7F00] text-xl font-bold mb-4">GH₵{cake.price.toFixed(2)}</p>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-gray-600">{cake.description}</p>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Ingredients</h3>
                <p className="text-gray-600">
                  Premium flour, free-range eggs, organic sugar, natural flavors, and the finest quality ingredients.
                </p>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Allergens</h3>
                <p className="text-gray-600">Contains: Wheat, Eggs, Dairy. May contain traces of nuts.</p>
              </div>

              <Button
                onClick={() => {
                  onAddToCart()
                  onClose()
                }}
                className="w-full bg-[#FF7F00] hover:bg-[#FF7F00]/90"
              >
                Add to Cart
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

