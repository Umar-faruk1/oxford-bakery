"use client"

import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { motion } from "framer-motion"
import { Home, Menu, ShoppingCart, User, Phone } from "lucide-react"
import { useCartStore, useAuthStore } from "@/lib/store"

export default function MobileNavigation() {
  const location = useLocation()
  const [mounted, setMounted] = useState(false)
  const getTotalItems = useCartStore((state) => state.getTotalItems)
  const [cartCount, setCartCount] = useState(0)
  const { user } = useAuthStore()

  useEffect(() => {
    setMounted(true)
    if (mounted) {
      setCartCount(getTotalItems())
    }
  }, [mounted, getTotalItems])

  const navItems = [
    { name: "Home", href: "/", icon: <Home className="h-5 w-5" /> },
    { name: "Menu", href: "/menu", icon: <Menu className="h-5 w-5" /> },
    {
      name: "Cart",
      href: "/cart",
      icon: (
        <div className="relative">
          <ShoppingCart className="h-5 w-5" />
          {mounted && cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-[#FF7F00] text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </div>
      ),
    },
    { 
      name: "Profile", 
      href: user ? "/profile" : "/signin", 
      icon: <User className="h-5 w-5" /> 
    },
    { name: "Contact", href: "/contact", icon: <Phone className="h-5 w-5" /> },
  ]

  if (!mounted) return null;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t shadow-lg">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href

          return (
            <Link key={item.name} to={item.href} className="flex flex-col items-center justify-center w-full h-full">
              <div
                className={`flex flex-col items-center justify-center ${isActive ? "text-[#FF7F00]" : "text-gray-500"}`}
              >
                {item.icon}
                <span className="text-xs mt-1">{item.name}</span>
                {isActive && (
                  <motion.div
                    layoutId="navigation-underline"
                    className="absolute bottom-0 w-12 h-1 bg-[#FF7F00] rounded-t-md"
                    transition={{ type: "spring", duration: 0.5 }}
                  />
                )}
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

