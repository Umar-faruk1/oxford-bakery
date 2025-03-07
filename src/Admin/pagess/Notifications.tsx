
import React, { useState } from 'react';
import { PageTransition } from '../ui/PageTransition';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Check, CheckCheck, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'order' | 'user' | 'system';
}

export const NotificationsContent: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'New Order',
      message: 'Order #12345 has been placed',
      timestamp: '2023-06-01T10:30:00',
      read: false,
      type: 'order'
    },
    {
      id: '2',
      title: 'Order Updated',
      message: 'Order #12340 status changed to "Delivered"',
      timestamp: '2023-06-01T09:15:00',
      read: false,
      type: 'order'
    },
    {
      id: '3',
      title: 'New User',
      message: 'John Doe registered as a new user',
      timestamp: '2023-05-31T16:45:00',
      read: true,
      type: 'user'
    },
    {
      id: '4',
      title: 'System Update',
      message: 'System maintenance scheduled for tonight',
      timestamp: '2023-05-31T14:20:00',
      read: true,
      type: 'system'
    },
    {
      id: '5',
      title: 'Promo Added',
      message: 'New promotion "Summer Special" has been added',
      timestamp: '2023-05-30T11:10:00',
      read: false,
      type: 'system'
    }
  ]);

  const markAsRead = (id: string) => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
    toast.success('Notification marked as read');
  };

  const markAllAsRead = () => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notification => ({ ...notification, read: true }))
    );
    toast.success('All notifications marked as read');
  };

  const deleteNotification = (id: string) => {
    setNotifications(prevNotifications =>
      prevNotifications.filter(notification => notification.id !== id)
    );
    toast.success('Notification deleted');
  };

  // Format timestamp to a readable date
  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'order':
        return 'bg-blue-500';
      case 'user':
        return 'bg-green-500';
      case 'system':
        return 'bg-amber-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
          <Button onClick={markAllAsRead} variant="outline" size="sm">
            <CheckCheck className="mr-2 h-4 w-4" />
            Mark All as Read
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[calc(100vh-300px)]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Type</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead className="w-[150px]">Date</TableHead>
                    <TableHead className="w-[100px]">Status</TableHead>
                    <TableHead className="w-[120px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {notifications.map((notification) => (
                    <TableRow key={notification.id} className={notification.read ? '' : 'bg-muted/30 font-medium'}>
                      <TableCell>
                        <div className={`w-3 h-3 rounded-full ${getTypeColor(notification.type)} mr-2`}></div>
                        {notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}
                      </TableCell>
                      <TableCell>{notification.title}</TableCell>
                      <TableCell>{notification.message}</TableCell>
                      <TableCell>{formatDate(notification.timestamp)}</TableCell>
                      <TableCell>
                        <Badge variant={notification.read ? "outline" : "default"}>
                          {notification.read ? 'Read' : 'Unread'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          {!notification.read && (
                            <Button
                              onClick={() => markAsRead(notification.id)}
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              <Check className="h-4 w-4" />
                              <span className="sr-only">Mark as read</span>
                            </Button>
                          )}
                          <Button
                            onClick={() => deleteNotification(notification.id)}
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </PageTransition>
  );
};
