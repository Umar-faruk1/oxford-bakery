"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { ShoppingCart, Menu, X, LogOut, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCartStore, useAuthStore } from "@/lib/store"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

const navItems = [
  { name: "Home", href: "/" },
  { name: "Menu", href: "/menu" },
  { name: "Categories", href: "/categories" },
  { name: "Contact", href: "/contact" },
  { name: "About", href: "/about" },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeItem, setActiveItem] = useState("Home")
  const [mounted, setMounted] = useState(false)

  const cartItems = useCartStore((state) => state.getTotalItems())
  const { isAuthenticated, user, logout } = useAuthStore()

  // Hydration fix
  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b shadow-sm">
      <div className="container flex items-center justify-between h-16 px-4 mx-auto md:px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="text-2xl font-bold"
          >
            <span className="text-[#FF7F00]">Oxford</span>Bakery
          </motion.div>
        </Link>

        {/* Mobile menu button */}
        <button className="p-2 md:hidden" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center justify-center space-x-8">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              onClick={() => setActiveItem(item.name)}
              className={`text-sm font-medium transition-colors hover:text-[#FF7F00] ${
                activeItem === item.name ? "text-[#FF7F00] border-b-2 border-[#FF7F00]" : "text-muted-foreground"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Right side - Cart & Sign in/out */}
        <div className="hidden md:flex items-center space-x-4">
          <Link to="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {mounted && cartItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#FF7F00] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItems}
                </span>
              )}
            </Button>
          </Link>

          {mounted && isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  {user?.image ? (
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={user.image} alt={user.name} />
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <User className="h-4 w-4" />
                  )}
                  {user?.name}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <Link to="/profile">
                  <DropdownMenuItem className="cursor-pointer">
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </DropdownMenuItem>
                </Link>
                <Link to="/orders">
                  <DropdownMenuItem className="cursor-pointer">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    My Orders
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuItem onClick={logout} className="cursor-pointer text-red-500 hover:text-red-600">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/signin">
              <Button variant="outline" size="sm">
                Sign In
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute top-16 left-0 right-0 bg-white border-b shadow-md md:hidden"
          >
            <div className="flex flex-col p-4 space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => {
                    setActiveItem(item.name)
                    setIsOpen(false)
                  }}
                  className={`text-sm font-medium transition-colors hover:text-[#FF7F00] ${
                    activeItem === item.name ? "text-[#FF7F00]" : "text-muted-foreground"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              <div className="flex items-center justify-between pt-4 border-t">
                <Link to="/cart">
                  <Button variant="ghost" size="icon" className="relative">
                    <ShoppingCart className="h-5 w-5" />
                    {mounted && cartItems > 0 && (
                      <span className="absolute -top-1 -right-1 bg-[#FF7F00] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {cartItems}
                      </span>
                    )}
                  </Button>
                </Link>

                {mounted && isAuthenticated ? (
                  <div className="flex gap-2">
                    <Link to="/profile">
                      <Button variant="outline" size="sm" className="gap-2">
                        <User className="h-4 w-4" />
                        Profile
                      </Button>
                    </Link>
                    <Button variant="outline" size="sm" className="gap-2 text-red-500" onClick={logout}>
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <Link to="/signin">
                    <Button variant="outline" size="sm">
                      Sign In
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </header>
  )
}

