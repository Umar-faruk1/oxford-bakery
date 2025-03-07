"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { useAuthStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ShoppingBag, Clock, CheckCircle, TruckIcon, Package } from "lucide-react"

// Sample order data
const sampleOrders = [
  {
    id: "ORD-2023-001",
    date: "2023-11-15",
    status: "delivered",
    total: 87.97,
    items: [
      {
        id: 1,
        name: "Chocolate Fudge Cake",
        price: 32.99,
        quantity: 1,
        image: "/placeholder.svg?height=100&width=100",
      },
      {
        id: 3,
        name: "Strawberry Cheesecake",
        price: 34.99,
        quantity: 1,
        image: "/placeholder.svg?height=100&width=100",
      },
    ],
  },
  {
    id: "ORD-2023-002",
    date: "2023-11-28",
    status: "processing",
    total: 42.99,
    items: [
      {
        id: 8,
        name: "Custom Photo Cake",
        price: 42.99,
        quantity: 1,
        image: "/placeholder.svg?height=100&width=100",
      },
    ],
  },
  {
    id: "ORD-2023-003",
    date: "2023-12-05",
    status: "pending",
    total: 55.98,
    items: [
      {
        id: 5,
        name: "Red Velvet Cupcakes (6)",
        price: 18.99,
        quantity: 1,
        image: "/placeholder.svg?height=100&width=100",
      },
      {
        id: 6,
        name: "Lemon Drizzle Cake",
        price: 26.99,
        quantity: 1,
        image: "/placeholder.svg?height=100&width=100",
      },
    ],
  },
]

const getStatusIcon = (status: string) => {
  switch (status) {
    case "delivered":
      return <CheckCircle className="h-5 w-5 text-green-500" />
    case "processing":
      return <TruckIcon className="h-5 w-5 text-blue-500" />
    case "pending":
      return <Clock className="h-5 w-5 text-yellow-500" />
    default:
      return <Package className="h-5 w-5 text-gray-500" />
  }
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case "delivered":
      return <Badge className="bg-green-500">Delivered</Badge>
    case "processing":
      return <Badge className="bg-blue-500">Processing</Badge>
    case "pending":
      return <Badge className="bg-yellow-500">Pending</Badge>
    default:
      return <Badge variant="outline">Unknown</Badge>
  }
}

export default function OrdersPage() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && !isAuthenticated) {
      navigate("/signin")
    }
  }, [mounted, isAuthenticated, navigate])

  if (!mounted || !isAuthenticated) {
    return <div className="container mx-auto px-4 py-12 min-h-[60vh] flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-12 mb-16 md:mb-0">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">My Orders</h1>
        <Link to="/menu">
          <Button className="bg-[#FF7F00] hover:bg-[#FF7F00]/90 gap-2">
            <ShoppingBag className="h-4 w-4" />
            Order More
          </Button>
        </Link>
      </div>

      {sampleOrders.length > 0 ? (
        <div className="space-y-6">
          {sampleOrders.map((order, index) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        Order #{order.id}
                        {getStatusIcon(order.status)}
                      </CardTitle>
                      <CardDescription>
                        Placed on{" "}
                        {new Date(order.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </CardDescription>
                    </div>
                    <div>{getStatusBadge(order.status)}</div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-4">
                        <div className="relative h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
                          <img
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">{item.name}</h3>
                          <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                        </div>
                        <div className="font-medium">GH₵{item.price.toFixed(2)}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between border-t pt-4">
                  <Button variant="outline">View Details</Button>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Total Amount</p>
                    <p className="font-bold text-lg">GH₵{order.total.toFixed(2)}</p>
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <ShoppingBag className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold mb-2">No Orders Yet</h2>
          <p className="text-gray-500 mb-6">You haven't placed any orders yet.</p>
          <Link to="/menu">
            <Button className="bg-[#FF7F00] hover:bg-[#FF7F00]/90">Browse Menu</Button>
          </Link>
        </div>
      )}
    </div>
  )
}

