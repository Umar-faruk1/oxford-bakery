"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import backgroundImage from "@/assets/background.jpg"

export default function HeroSection() {
  return (
    <section className="relative w-full h-[80vh] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={backgroundImage}
          alt="Delicious cake"
          className="w-full h-full object-cover brightness-[0.85]"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center items-start">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-xl"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4"
          >
            Delicious Cakes Delivered to Your Doorstep!
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-xl text-white/90 mb-8"
          >
            Handcrafted with love, our cakes are made with the finest ingredients for every special occasion.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button size="lg" className="bg-[#FF7F00] hover:bg-[#FF7F00]/90 text-white">
              View Menu
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

