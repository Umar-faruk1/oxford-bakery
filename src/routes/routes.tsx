import { Routes, Route, useLocation, Outlet } from "react-router-dom";
import Home from "../Pages/Home";
import Menu from "../Pages/Menu";
import About from "../Pages/About";
import SignIn from "../Pages/Signin";
import Signup from "../Pages/Signup";
import Cart from "../Pages/Cart";
import Checkout from "../Pages/Checkout";
import Contact from "../Pages/Contact";
import OrderSuccess from "../Pages/Order-Success";
import Orders from "../Pages/Orders";
import Profile from "../Pages/Profile";
import ProtectedRoute from "./protectedRoute";
import AdminProtectedRoute from "./adminProtectedRoute";
import Navbar from "../components/navbar";
import TabNavigation from "../components/tab-navigation";
import ForgotPassword from "../Pages/Forgot-Password";
import AdminLayout from "@/Admin/layout/AdminLayout";
import DashboardPage from "@/Admin/pagess/Home";
import { PromosContent } from "@/Admin/pagess/Promos";
import { UsersContent } from "@/Admin/pagess/User";
import { OrdersContent } from "@/Admin/pagess/Orders";
import { MenuItemsContent } from "@/Admin/pagess/Menus";
import { NotificationsContent } from "@/Admin/pagess/Notifications";
import { ProfileContent } from "@/Admin/pagess/Profile";
import { CategoriesContent } from "@/Admin/pagess/Categories";

const MainLayout = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === "/signin" || location.pathname === "/signup";

  return (
    <div className="min-h-screen flex flex-col">
      {!isAuthPage && (
        <>
          <Navbar />
          <TabNavigation />
        </>
      )}
      <div className="flex-1">
        <Outlet />
      </div>
      {!isAuthPage && (
        <footer className="bg-white border-t mt-auto">
          <div className="container mx-auto px-4 py-6">
            <p className="text-center text-gray-600">© 2024 Oxford Bakery. All rights reserved.</p>
          </div>
        </footer>
      )}
    </div>
  );
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes with Main Layout */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/about" element={<About />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/contact" element={<Contact />} />
      </Route>

      {/* Admin Routes with Admin Layout */}
      <Route element={<AdminLayout />}>
        <Route element={<AdminProtectedRoute />}>
          <Route path="/admin/dashboard" element={<DashboardPage />} />
          <Route path="/admin/dashboard/promos" element={<PromosContent/>} />
          <Route path="/admin/dashboard/users" element={<UsersContent/>} />
          <Route path="/admin/dashboard/orders" element={<OrdersContent/>} />
          <Route path="/admin/dashboard/menu" element={<MenuItemsContent/>} />
          <Route path="/admin/dashboard/notifications" element={<NotificationsContent/>} />
          <Route path="/admin/dashboard/profile" element={<ProfileContent/>} />
          <Route path="/admin/dashboard/categories" element={<CategoriesContent/>} />
        </Route>
      </Route>

      {/* Protected Routes (Only for authenticated users) */}
      <Route element={<MainLayout />}>
        <Route element={<ProtectedRoute />}>
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;
