import { createBrowserRouter } from "react-router-dom";
import { AdminLayout } from "./Admin/layouts/AdminLayout";
import { DashboardContent } from "./Admin/pagess/Dashboard";
import { OrdersContent } from "./Admin/pagess/Orders";
import { MenuItemsContent } from "./Admin/pagess/Menus";
import { UsersContent } from "./Admin/pagess/User";

export const adminRoutes = [
  {
    element: <AdminLayout />,
    children: [
      {
        path: "/admin",
        element: <DashboardContent />
      },
      {
        path: "/admin/orders",
        element: <OrdersContent />
      },
      {
        path: "/admin/menu",
        element: <MenuItemsContent />
      },
      {
        path: "/admin/users",
        element: <UsersContent />
      }
    ]
  }
];

export const router = createBrowserRouter([
  ...adminRoutes,
  // Add other routes here
]); 