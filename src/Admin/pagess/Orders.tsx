
import React, { useState } from 'react';
import { PageTransition } from '../ui/PageTransition';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface Order {
  id: string;
  customer: {
    name: string;
    initials: string;
  };
  items: string[];
  total: string;
  status: 'pending' | 'processing' | 'delivered' | 'cancelled';
  date: string;
}

const mockOrders: Order[] = [
  {
    id: 'ORD-001',
    customer: { name: 'John Smith', initials: 'JS' },
    items: ['Chocolate Cake', 'Vanilla Frosting'],
    total: '$42.99',
    status: 'pending',
    date: '2023-05-15',
  },
  {
    id: 'ORD-002',
    customer: { name: 'Sarah Johnson', initials: 'SJ' },
    items: ['Red Velvet Cake', 'Cream Cheese Icing'],
    total: '$39.50',
    status: 'processing',
    date: '2023-05-14',
  },
  {
    id: 'ORD-003',
    customer: { name: 'Mike Davis', initials: 'MD' },
    items: ['Black Forest Cake'],
    total: '$35.00',
    status: 'delivered',
    date: '2023-05-13',
  },
  {
    id: 'ORD-004',
    customer: { name: 'Emily Wilson', initials: 'EW' },
    items: ['Strawberry Shortcake', 'Extra Berries'],
    total: '$48.75',
    status: 'pending',
    date: '2023-05-15',
  },
  {
    id: 'ORD-005',
    customer: { name: 'David Clark', initials: 'DC' },
    items: ['Vanilla Bean Cake', 'Chocolate Ganache'],
    total: '$37.25',
    status: 'processing',
    date: '2023-05-14',
  },
];

const getStatusColor = (status: Order['status']) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'processing':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'delivered':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'cancelled':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return '';
  }
};

export const OrdersContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<Order['status']>('pending');
  
  const filteredOrders = orders.filter(order => {
    if (activeTab === 'all') return true;
    return order.status === activeTab;
  });

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailsOpen(true);
  };

  const handleUpdateStatus = (order: Order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setIsStatusOpen(true);
  };

  const saveStatusUpdate = () => {
    if (!selectedOrder) return;
    
    const updatedOrders = orders.map(order => 
      order.id === selectedOrder.id ? { ...order, status: newStatus } : order
    );
    
    setOrders(updatedOrders);
    setIsStatusOpen(false);
    toast.success(`Order ${selectedOrder.id} status updated to ${newStatus}`);
  };

  const OrderItem: React.FC<{ order: Order }> = ({ order }) => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        className="p-4 border rounded-lg hover:shadow-md bg-white mb-3 transition-all duration-200"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarFallback>{order.customer.initials}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{order.customer.name}</div>
              <div className="text-sm text-gray-500">{order.id}</div>
            </div>
          </div>
          <Badge className={getStatusColor(order.status)} variant="outline">
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </Badge>
        </div>
        <div className="mt-4 text-sm text-gray-600">
          <div className="mb-2">
            <span className="font-medium">Items:</span> {order.items.join(', ')}
          </div>
          <div className="flex justify-between">
            <span>{order.date}</span>
            <span className="font-medium">{order.total}</span>
          </div>
        </div>
        <div className="mt-4 flex space-x-2 justify-end">
          <Button size="sm" variant="outline" onClick={() => handleViewDetails(order)}>View Details</Button>
          <Button size="sm" variant="default" onClick={() => handleUpdateStatus(order)}>Update Status</Button>
        </div>
      </motion.div>
    );
  };

  return (
    <PageTransition>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Orders</h1>
          <p className="text-muted-foreground">Manage and track customer orders</p>
        </div>

        <Card>
          <CardContent className="p-6">
            <Tabs defaultValue="all" onValueChange={setActiveTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="processing">Processing</TabsTrigger>
                <TabsTrigger value="delivered">Delivered</TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="space-y-4">
                {filteredOrders.map((order) => (
                  <OrderItem key={order.id} order={order} />
                ))}
              </TabsContent>
              <TabsContent value="pending" className="space-y-4">
                {filteredOrders.map((order) => (
                  <OrderItem key={order.id} order={order} />
                ))}
              </TabsContent>
              <TabsContent value="processing" className="space-y-4">
                {filteredOrders.map((order) => (
                  <OrderItem key={order.id} order={order} />
                ))}
              </TabsContent>
              <TabsContent value="delivered" className="space-y-4">
                {filteredOrders.map((order) => (
                  <OrderItem key={order.id} order={order} />
                ))}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Order Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>
              Complete information about this order.
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Order ID</p>
                <p className="text-base">{selectedOrder.id}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Customer</p>
                <p className="text-base">{selectedOrder.customer.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Items</p>
                <ul className="list-disc list-inside">
                  {selectedOrder.items.map((item, index) => (
                    <li key={index} className="text-base">{item}</li>
                  ))}
                </ul>
              </div>
              <div className="flex justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Date</p>
                  <p className="text-base">{selectedOrder.date}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Total</p>
                  <p className="text-lg font-semibold">{selectedOrder.total}</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Status</p>
                <Badge className={getStatusColor(selectedOrder.status)} variant="outline">
                  {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                </Badge>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsDetailsOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update Status Dialog */}
      <Dialog open={isStatusOpen} onOpenChange={setIsStatusOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Update Order Status</DialogTitle>
            <DialogDescription>
              Change the status of this order.
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div>
                <p className="text-sm">Order: <span className="font-medium">{selectedOrder.id}</span></p>
                <p className="text-sm">Customer: <span className="font-medium">{selectedOrder.customer.name}</span></p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">New Status</Label>
                <Select value={newStatus} onValueChange={(value: Order['status']) => setNewStatus(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsStatusOpen(false)}>Cancel</Button>
            <Button onClick={saveStatusUpdate}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageTransition>
  );
};
