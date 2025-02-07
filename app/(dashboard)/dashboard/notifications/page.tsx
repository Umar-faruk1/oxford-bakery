"use client";

import { Bell, Check } from "lucide-react";
import { useState } from "react";

const initialNotifications = [
  {
    id: 1,
    title: "New Order",
    message: "You have received a new order from John Doe",
    time: "2023-10-05T10:00:00Z",
    read: false,
  },
  {
    id: 2,
    title: "Low Stock Alert",
    message: "Espresso beans are running low",
    time: "2023-10-05T09:00:00Z",
    read: true,
  },
  {
    id: 3,
    title: "New Review",
    message: "Jane Smith left a 5-star review",
    time: "2023-10-05T08:00:00Z",
    read: true,
  },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [filter, setFilter] = useState<"all" | "read" | "unread">("all");

  // Function to format time
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Function to mark all notifications as read
  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, read: true }))
    );
  };

  // Filter notifications based on the selected filter
  const filteredNotifications = notifications.filter((notification) => {
    if (filter === "read") return notification.read;
    if (filter === "unread") return !notification.read;
    return true; // "all"
  });

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Notifications</h1>
        <button
          onClick={markAllAsRead}
          className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
        >
          Mark all as read
        </button>
      </div>

      {/* Filter Links */}
      <div className="flex space-x-4 border-b pb-2">
        <button
          onClick={() => setFilter("all")}
          className={`text-sm font-medium ${
            filter === "all"
              ? "text-blue-600 dark:text-blue-400"
              : "text-gray-500 dark:text-gray-400"
          } hover:text-blue-600 dark:hover:text-blue-400`}
        >
          All
        </button>
        <button
          onClick={() => setFilter("read")}
          className={`text-sm font-medium ${
            filter === "read"
              ? "text-blue-600 dark:text-blue-400"
              : "text-gray-500 dark:text-gray-400"
          } hover:text-blue-600 dark:hover:text-blue-400`}
        >
          Read
        </button>
        <button
          onClick={() => setFilter("unread")}
          className={`text-sm font-medium ${
            filter === "unread"
              ? "text-blue-600 dark:text-blue-400"
              : "text-gray-500 dark:text-gray-400"
          } hover:text-blue-600 dark:hover:text-blue-400`}
        >
          Unread
        </button>
      </div>

      {/* Notifications List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm divide-y divide-gray-200 dark:divide-gray-700">
        {filteredNotifications.length === 0 ? (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400">
            No notifications found.
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 ${
                notification.read
                  ? "bg-white dark:bg-gray-800"
                  : "bg-blue-50 dark:bg-gray-700"
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <Bell className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{notification.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {notification.message}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                    {formatTime(notification.time)}
                  </p>
                </div>
                {!notification.read && (
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}