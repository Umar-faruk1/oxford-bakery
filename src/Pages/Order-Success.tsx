"use client"

import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { CheckCircle, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function OrderSuccessPage() {
  return (
    <div className="container mx-auto px-4 py-12 min-h-[70vh] flex flex-col items-center justify-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", damping: 10 }}
        className="text-[#FF7F00] mb-6"
      >
        <CheckCircle size={80} />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-3xl md:text-4xl font-bold mb-4 text-center"
      >
        Thank You for Your Order!
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-lg text-gray-600 mb-8 text-center max-w-md"
      >
        Your order has been received and is being prepared. You'll receive a confirmation email shortly.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <Link to="/">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </Link>

        <Link to="/menu">
          <Button className="bg-[#FF7F00] hover:bg-[#FF7F00]/90">Continue Shopping</Button>
        </Link>
      </motion.div>
    </div>
  )
}

