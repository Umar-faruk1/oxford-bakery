import React, { useState, useEffect } from 'react';
import { PageTransition } from '../ui/PageTransition';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectValue, SelectTrigger, SelectContent, SelectItem } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { DatePicker } from '@/components/ui/date-picker';
import { Pagination } from '@/components/ui/pagination';
import axios from '@/lib/axios';
import { ChangeEvent } from "react";
import { toast } from "sonner";

interface Order {
  id: number;
  reference: string;
  amount: number;
  final_amount: number;
  status: string;
  created_at: string;
  name: string;
  payment_status: string;
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
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: number, status: string) => {
    try {
      await axios.patch(`/admin/orders/${orderId}/status`, { status });
      toast.success("Order status updated successfully");
      fetchOrders(); // Refresh the orders list
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "Failed to update order status");
    }
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
                <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
              {orders.map((order) => (
                      <TableRow key={order.id}>
                  <TableCell>{order.reference}</TableCell>
                  <TableCell>{order.name}</TableCell>
                        <TableCell>GH₵{order.final_amount.toFixed(2)}</TableCell>
                        <TableCell>
                    <Select 
                      value={order.status} 
                      onValueChange={(value) => updateOrderStatus(order.id, value)}
                    >
                      <SelectTrigger>
                        <SelectValue>
                          <Badge variant={getStatusVariant(order.status)}>
                            {order.status}
          </Badge>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
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
    </PageTransition>
  );
};
