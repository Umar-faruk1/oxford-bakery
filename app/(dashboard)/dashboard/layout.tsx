"use client";

import { useState } from "react";
import Sidebar from "./Components/Sidebar";
import Navbar from "./Components/Navbar";
import { DashboardLayoutProps } from "@/types";

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className={`${isSidebarOpen ? "ml-64" : "ml-20"} transition-all duration-300 ease-in-out`}>
        <Navbar />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}