"use client"

import { useState } from "react"
import { Eye, Check, Search, Filter } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { OrderModal } from "./OrderModal"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"

interface Order {
  id: string
  orderNumber: string
  paymentToken: string
  orderDate: string
  customer: string
  deliveryAddress: string
  isPaid: boolean
  isCollected: boolean
  isDelivered: boolean
}

// Sample Orders Data
const initialOrders: Order[] = [
  {
    id: "1",
    orderNumber: "DPS2397022323",
    paymentToken: "p_3Nx",
    orderDate: "2023-09-28 20:31:29",
    customer: "Prince Demiano",
    deliveryAddress: "9/13 King St, Haymarket NSW 2000, Australia",
    isPaid: true,
    isCollected: true,
    isDelivered: true,
  },
  {
    id: "2",
    orderNumber: "DPS2397022324",
    paymentToken: "p_3NxXN3LC",
    orderDate: "2023-10-01 15:12:10",
    customer: "Amara Kingsley",
    deliveryAddress: "456 Broad St, Lagos, Nigeria",
    isPaid: false,
    isCollected: false,
    isDelivered: false,
  },
]

export function OrdersTable() {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [orderList, setOrderList] = useState<Order[]>(initialOrders)

  // Function to update order statuses
  const handleAction = (orderId: string, action: "paid" | "collected" | "delivered") => {
    setOrderList(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId
          ? {
              ...order,
              isPaid: action === "paid" ? true : order.isPaid,
              isCollected: action === "collected" ? true : order.isCollected,
              isDelivered: action === "delivered" ? true : order.isDelivered
            }
          : order
      )
    )
  }

  // Filter orders based on search query
  const filteredOrders = orderList.filter(order => {
    const searchLower = searchQuery.toLowerCase()
    return (
      order.orderNumber.toLowerCase().includes(searchLower) ||
      order.customer.toLowerCase().includes(searchLower) ||
      order.deliveryAddress.toLowerCase().includes(searchLower)
    )
  })

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">All Orders</h2>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-[300px]"
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Table Section */}
      <div className="rounded-lg border bg-white shadow-sm">
        <ScrollArea className="h-[600px]">
          <Table>
            <TableHeader className="bg-gray-100 sticky top-0">
              <TableRow>
                <TableHead className="w-[140px] font-semibold">Order Number</TableHead>
                <TableHead className="w-[200px] font-semibold">Payment Token</TableHead>
                <TableHead className="w-[150px] font-semibold">Order Date</TableHead>
                <TableHead className="w-[150px] font-semibold">Customer</TableHead>
                <TableHead className="w-[250px] font-semibold">Delivery Address</TableHead>
                <TableHead className="w-[80px] text-center font-semibold">Paid</TableHead>
                <TableHead className="w-[80px] text-center font-semibold">Collected</TableHead>
                <TableHead className="w-[80px] text-center font-semibold">Delivered</TableHead>
                <TableHead className="w-[50px] text-center font-semibold">View</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id} className="hover:bg-gray-50 transition-colors">
                  <TableCell className="font-medium">{order.orderNumber}</TableCell>
                  <TableCell className="font-mono text-sm text-gray-600">{order.paymentToken}</TableCell>
                  <TableCell className="text-gray-600">{order.orderDate}</TableCell>
                  <TableCell className="text-gray-600">{order.customer}</TableCell>
                  <TableCell className="text-gray-600 truncate max-w-[250px]" title={order.deliveryAddress}>
                    {order.deliveryAddress}
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`h-8 w-8 ${order.isPaid ? "text-green-500" : "text-gray-500"}`}
                      onClick={() => handleAction(order.id, "paid")}
                      disabled={order.isPaid}
                    >
                      {order.isPaid ? <Check className="h-4 w-4" /> : "✗"}
                    </Button>
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`h-8 w-8 ${order.isCollected ? "text-green-500" : "text-gray-500"}`}
                      onClick={() => handleAction(order.id, "collected")}
                      disabled={order.isCollected}
                    >
                      {order.isCollected ? <Check className="h-4 w-4" /> : "✗"}
                    </Button>
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`h-8 w-8 ${order.isDelivered ? "text-green-500" : "text-gray-500"}`}
                      onClick={() => handleAction(order.id, "delivered")}
                      disabled={order.isDelivered}
                    >
                      {order.isDelivered ? <Check className="h-4 w-4" /> : "✗"}
                    </Button>
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSelectedOrder(order)}
                      className="h-8 w-8"
                    >
                      <Eye className="h-4 w-4 text-gray-600" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>

      {/* Modal for Viewing Order Details */}
      {selectedOrder && <OrderModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />}
    </div>
  )
}