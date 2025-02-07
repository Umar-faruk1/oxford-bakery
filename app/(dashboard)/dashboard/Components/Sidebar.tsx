"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import {
  ChevronLeft,
  ChevronRight,
  Home,
  LayoutDashboard,
  Users,
  ShoppingCart,
  Menu,
  Bell,
  Truck,
  Settings,
  LogOut,
} from "lucide-react";
import { SidebarProps, NavItem } from "@/types";

const navItems: NavItem[] = [
  { title: "Home", href: "/dashboard", icon: Home },
  { title: "Dashboard", href: "/dashboard/stats", icon: LayoutDashboard },
  { title: "Users", href: "/dashboard/users", icon: Users },
  { title: "Orders", href: "/dashboard/orders", icon: ShoppingCart },
  { title: "Menu", href: "/dashboard/menu", icon: Menu },
  { title: "Notifications", href: "/dashboard/notifications", icon: Bell },
  { title: "Deliveries", href: "/dashboard/deliveries", icon: Truck },
  { title: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const pathname = usePathname();

  const isLinkActive = (href: string): boolean => {
    // Exact match for dashboard home
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    // For other routes, check if the pathname starts with the href
    // and either ends there or continues with a slash
    return pathname.startsWith(href) && (pathname === href || pathname.charAt(href.length) === '/');
  };

  return (
    <aside
      className={`${
        isOpen ? "w-64" : "w-20"
      } fixed left-0 top-0 h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out z-50`}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between h-16 px-4">
        {isOpen && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-red-500 rounded-full"></div>
            <span className="text-xl font-bold">Dashboard</span>
          </div>
        )}
        <button
          onClick={onToggle}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          {isOpen ? <ChevronLeft className="w-6 h-6" /> : <ChevronRight className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <nav className="mt-4 px-2">
        {navItems.map((item) => {
          const isActive = isLinkActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-colors ${
                isActive ? "bg-red-500 text-white" : "hover:bg-gray-100 dark:hover:bg-gray-700"
              } ${!isOpen && "justify-center"}`}
            >
              <item.icon className="w-6 h-6" />
              {isOpen && <span>{item.title}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="absolute bottom-4 w-full px-2">
        <Link
          href="/logout"
          className={`flex items-center space-x-2 px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
            !isOpen && "justify-center"
          }`}
        >
          <LogOut className="w-6 h-6" />
          {isOpen && <span>Logout</span>}
        </Link>
      </div>
    </aside>
  );
}