"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export default function PromoSection() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 3,
    hours: 8,
    minutes: 30,
    seconds: 0,
  })

  useEffect(() => {
    const timer = setTimeout(() => {
      if (timeLeft.seconds > 0) {
        setTimeLeft({ ...timeLeft, seconds: timeLeft.seconds - 1 })
      } else if (timeLeft.minutes > 0) {
        setTimeLeft({
          ...timeLeft,
          minutes: timeLeft.minutes - 1,
          seconds: 59,
        })
      } else if (timeLeft.hours > 0) {
        setTimeLeft({
          ...timeLeft,
          hours: timeLeft.hours - 1,
          minutes: 59,
          seconds: 59,
        })
      } else if (timeLeft.days > 0) {
        setTimeLeft({
          ...timeLeft,
          days: timeLeft.days - 1,
          hours: 23,
          minutes: 59,
          seconds: 59,
        })
      }
    }, 1000)

    return () => clearTimeout(timer)
  }, [timeLeft])

  return (
    <section className="py-12 bg-gradient-to-r from-[#FF7F00]/90 to-[#FF5500]/90 text-white">
      <div className="container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Get 20% Off Your First Order!</h2>
          <p className="text-lg mb-8">
            Use code <span className="font-bold">SWEETTREAT</span> at checkout
          </p>

          {/* Countdown Timer */}
          <div className="flex justify-center gap-4 mb-8">
            {Object.entries(timeLeft).map(([unit, value]) => (
              <motion.div
                key={unit}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center"
              >
                <motion.div
                  key={value}
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="bg-white text-[#FF7F00] rounded-lg w-16 h-16 flex items-center justify-center text-2xl font-bold"
                >
                  {value}
                </motion.div>
                <span className="text-sm mt-2 capitalize">{unit}</span>
              </motion.div>
            ))}
          </div>

          <Button size="lg" className="bg-white text-[#FF7F00] hover:bg-white/90">
            Order Now
          </Button>
        </motion.div>
      </div>
    </section>
  )
}

