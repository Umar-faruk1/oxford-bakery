import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useAuthStore } from '@/lib/store';

export const AdminLayout: React.FC = () => {
  const { user } = useAuthStore();

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold">Oxford Bakery</h1>
          <p className="text-sm text-gray-500">Admin Panel</p>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <Link to="/admin" className="block p-2 rounded hover:bg-gray-100">
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/admin/orders" className="block p-2 rounded hover:bg-gray-100">
                Orders
              </Link>
            </li>
            <li>
              <Link to="/admin/menu" className="block p-2 rounded hover:bg-gray-100">
                Menu
              </Link>
            </li>
            <li>
              <Link to="/admin/users" className="block p-2 rounded hover:bg-gray-100">
                Users
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold">Admin Dashboard</h2>
          <div className="flex items-center space-x-4">
            <span className="text-sm">{user?.email}</span>
            <button className="text-sm text-red-500">Logout</button>
          </div>
        </header>
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}; 