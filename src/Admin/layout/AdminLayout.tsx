import { useState } from "react";
import { Outlet } from "react-router-dom";
import {Navbar} from "../components/navbar";
import { Sidebar } from "../components/sidebar";

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <main
        className={`transition-all duration-300 ${
          collapsed ? "ml-20" : "ml-64"
        } p-6 pt-24`}
      >
        <Outlet />
      </main>
    </div>
  );
} 