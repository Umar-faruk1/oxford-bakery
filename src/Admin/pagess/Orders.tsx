import React, { useState, useEffect } from 'react';
import { PageTransition } from '../ui/PageTransition';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectValue, SelectTrigger, SelectContent, SelectItem } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { Pagination } from '@/components/ui/pagination';
import axios from '@/lib/axios';
import { toast } from "sonner";
import { Eye, Package, Truck, CheckCircle, XCircle, Clock } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface OrderItem {
  menu_item_id: number;
  name: string;
  quantity: number;
  price: number;
  image?: string;
}

interface Order {
  id: number;
  reference: string;
  user_id: number;
  amount: number;
  delivery_fee: number;
  final_amount: number;
  status: string;
  payment_status: string;
  payment_reference?: string;
  items: OrderItem[];
  created_at: string;
  email: string;
  name: string;
  phone?: string;
  address?: string;
}

interface OrderFilter {
  status?: string;
  payment_status?: string;
  start_date?: string;
  end_date?: string;
  page: number;
  per_page: number;
}

interface PaginatedResponse {
  items: Order[];
  total: number;
  page: number;
  per_page: number;
  pages: number;
}

// Add helper functions
const getStatusVariant = (status: string) => {
  switch (status) {
    case "completed": return "default";
    case "processing": return "secondary";
    case "cancelled": return "destructive";
    case "delivered": return "default";
    default: return "outline";
  }
};

const getPaymentStatusVariant = (status: string) => {
  switch (status) {
    case "paid": return "default";
    case "failed": return "destructive";
    default: return "outline";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "completed":
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case "processing":
      return <Truck className="h-4 w-4 text-blue-500" />;
    case "cancelled":
      return <XCircle className="h-4 w-4 text-red-500" />;
    case "delivered":
      return <Package className="h-4 w-4 text-green-500" />;
    default:
      return <Clock className="h-4 w-4 text-yellow-500" />;
  }
};

// Add this type definition at the top with other interfaces
type OrderStatus = "pending" | "processing" | "completed" | "cancelled" | "delivered";

export const OrdersContent: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<OrderFilter>({
    page: 1,
    per_page: 10
  });
  const [pagination, setPagination] = useState({
    total: 0,
    pages: 0,
    page: 1,
    per_page: 10
  });
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      Object.entries(filter).forEach(([key, value]) => {
        if (value) params.append(key, value.toString());
      });
      
      const response = await axios.get<PaginatedResponse>(`/admin/orders?${params.toString()}`);
      setOrders(response.data.items);
      setPagination({
        total: response.data.total,
        pages: response.data.pages,
        page: response.data.page,
        per_page: response.data.per_page
      });
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: number, status: OrderStatus) => {
    try {
      // Validate status before sending
      if (!["pending", "processing", "completed", "cancelled", "delivered"].includes(status)) {
        toast.error("Invalid status value");
        return;
      }

      const response = await axios.patch(`/admin/orders/${orderId}/status`, { status });
      toast.success("Order status updated successfully");
      fetchOrders(); // Refresh the orders list
    } catch (error: any) {
      console.error('Error updating order status:', error);
      
      // Handle the error response properly
      let errorMessage = "Failed to update order status";
      
      if (error.response) {
        // Check if the error response has a detail field
        if (error.response.data && error.response.data.detail) {
          // If detail is an array, take the first error message
          if (Array.isArray(error.response.data.detail)) {
            errorMessage = error.response.data.detail[0]?.msg || errorMessage;
          } else {
            // If detail is a string, use it directly
            errorMessage = error.response.data.detail;
          }
        }
      }
      
      toast.error(errorMessage);
    }
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsViewDialogOpen(true);
  };

  useEffect(() => {
    fetchOrders();
  }, [filter]);

  if (loading) {
    return <div>Loading orders...</div>;
  }

  return (
    <PageTransition>
      <Card>
        <CardHeader>
          <CardTitle>Orders</CardTitle>
          <div className="flex gap-4 mt-4">
            <Select onValueChange={(value: string) => setFilter({...filter, status: value})} value={filter.status || "all"}>
              <SelectTrigger>
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
              </SelectContent>
            </Select>
            
            <Select onValueChange={(value: string) => setFilter({...filter, payment_status: value})} value={filter.payment_status || "all"}>
              <SelectTrigger>
                <SelectValue placeholder="All Payments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Payments</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
            
            <DatePicker
              selected={filter.start_date ? new Date(filter.start_date) : null}
              onChange={(date) => setFilter({...filter, start_date: date?.toISOString()})}
              placeholderText="Start Date"
            />
            
            <DatePicker
              selected={filter.end_date ? new Date(filter.end_date) : null}
              onChange={(date) => setFilter({...filter, end_date: date?.toISOString()})}
              placeholderText="End Date"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.reference}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{order.name}</div>
                      <div className="text-sm text-gray-500">{order.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>{order.items.length} items</TableCell>
                  <TableCell>GH₵{order.final_amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <Select 
                      value={order.status} 
                      onValueChange={(value: OrderStatus) => updateOrderStatus(order.id, value)}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(order.status)}
                            <Badge variant={getStatusVariant(order.status)}>
                              {order.status}
                            </Badge>
                          </div>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getPaymentStatusVariant(order.payment_status)}>
                      {order.payment_status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(order.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewOrder(order)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.pages}
            onPageChange={(page) => setFilter({...filter, page})}
          />
        </CardContent>
      </Card>

      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>
              Order Reference: {selectedOrder?.reference}
            </DialogDescription>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium mb-2">Customer Information</h3>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-medium">Name:</span> {selectedOrder.name}</p>
                    <p><span className="font-medium">Email:</span> {selectedOrder.email}</p>
                    <p><span className="font-medium">Phone:</span> {selectedOrder.phone || 'N/A'}</p>
                    <p><span className="font-medium">Address:</span> {selectedOrder.address || 'N/A'}</p>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Order Information</h3>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-medium">Status:</span> 
                      <Badge variant={getStatusVariant(selectedOrder.status)} className="ml-2">
                        {selectedOrder.status}
                      </Badge>
                    </p>
                    <p><span className="font-medium">Payment Status:</span>
                      <Badge variant={getPaymentStatusVariant(selectedOrder.payment_status)} className="ml-2">
                        {selectedOrder.payment_status}
                      </Badge>
                    </p>
                    <p><span className="font-medium">Date:</span> {new Date(selectedOrder.created_at).toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Order Items</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedOrder.items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>GH₵{item.price.toFixed(2)}</TableCell>
                        <TableCell>GH₵{(item.price * item.quantity).toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex justify-end space-x-4 pt-4 border-t">
                <div className="text-right space-y-1">
                  <p className="text-sm"><span className="font-medium">Subtotal:</span> GH₵{selectedOrder.amount.toFixed(2)}</p>
                  <p className="text-sm"><span className="font-medium">Delivery Fee:</span> GH₵{selectedOrder.delivery_fee.toFixed(2)}</p>
                  <p className="text-lg font-medium">Total: GH₵{selectedOrder.final_amount.toFixed(2)}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </PageTransition>
  );
};
