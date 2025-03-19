import { createBrowserRouter } from "react-router-dom";
import { AdminLayout } from "./Admin/layouts/AdminLayout";
import { DashboardContent } from "./Admin/pagess/Dashboard";
import { OrdersContent } from "./Admin/pagess/Orders";
import { MenuContent } from "./Admin/pagess/Menu";
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
    ]
  }
];

// Then in your routes array, use Orders instead of OrdersContent
{
  path: "/admin/orders",
  element: <OrdersContent />
} 