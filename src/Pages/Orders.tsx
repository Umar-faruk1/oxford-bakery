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
import axios from "@/lib/axios"
import { toast } from "sonner"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

interface OrderItem {
  id: number;
  menu_item_id: number;
  quantity: number;
  price: number;
  menu_item: {
    name: string;
    image: string;
  };
}

interface Order {
  id: number;
  reference: string;
  amount: number;
  delivery_fee: number;
  discount: number;
  final_amount: number;
  status: string;
  created_at: string;
  items: OrderItem[];
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "completed":
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
    case "completed":
      return <Badge className="bg-green-500">Completed</Badge>
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
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
    if (isAuthenticated) {
      fetchOrders()
    }
  }, [isAuthenticated])

  useEffect(() => {
    if (mounted && !isAuthenticated) {
      navigate("/signin")
    }
  }, [mounted, isAuthenticated, navigate])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/orders')
      setOrders(response.data)
      setError(null)
    } catch (error: any) {
      console.error('Error fetching orders:', error)
      setError(error.response?.data?.detail || 'Error fetching orders')
    } finally {
      setLoading(false)
    }
  }

  if (!mounted || !isAuthenticated) {
    return <div className="container mx-auto px-4 py-12 min-h-[60vh] flex items-center justify-center">Loading...</div>
  }

  if (loading) {
    return <div className="container mx-auto px-4 py-12 min-h-[60vh] flex items-center justify-center">Loading orders...</div>
  }

  if (error) {
    return <div className="container mx-auto px-4 py-12 min-h-[60vh] flex items-center justify-center">Error: {error}</div>
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

      {orders.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <ShoppingBag className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold mb-2">No Orders Yet</h2>
          <p className="text-gray-500 mb-6">You haven't placed any orders yet.</p>
          <Link to="/menu">
            <Button className="bg-[#FF7F00] hover:bg-[#FF7F00]/90">Browse Menu</Button>
          </Link>
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>My Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>{order.id}</TableCell>
                    <TableCell>{order.reference}</TableCell>
                    <TableCell>GH₵{order.final_amount.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant={
                        order.status === 'completed' ? 'default' : 
                        order.status === 'processing' ? 'secondary' : 
                        'destructive'
                      }>
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(order.created_at).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

