"use client";

import { Bell } from "lucide-react";

const notifications = [
  {
    id: 1,
    title: "New Order",
    message: "You have received a new order from John Doe",
    time: "5 minutes ago",
    read: false,
  },
  {
    id: 2,
    title: "Low Stock Alert",
    message: "Espresso beans are running low",
    time: "1 hour ago",
    read: true,
  },
  {
    id: 3,
    title: "New Review",
    message: "Jane Smith left a 5-star review",
    time: "2 hours ago",
    read: true,
  },
];

export default function NotificationsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Notifications</h1>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm divide-y divide-gray-200 dark:divide-gray-700">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-4 ${notification.read ? "bg-white dark:bg-gray-800" : "bg-blue-50 dark:bg-gray-700"}`}
          >
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <Bell className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">{notification.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{notification.message}</p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">{notification.time}</p>
              </div>
              {!notification.read && (
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}