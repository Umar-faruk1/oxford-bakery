import React from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Ticket, 
  Utensils, 
  Users, 
  FolderTree, 
  BarChart, 
  ChevronLeft, 
  ChevronRight,
  LogOut
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, setCollapsed }) => {
  const location = useLocation();
  const { logout } = useAuth();
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = React.useState(false);
  
  const navigationItems: NavItem[] = [
    { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Orders', href: '/admin/dashboard/orders', icon: ShoppingCart },
    { label: 'Promos', href: '/admin/dashboard/promos', icon: Ticket },
    { label: 'Menu Items', href: '/admin/dashboard/menu', icon: Utensils },
    { label: 'Users', href: '/admin/dashboard/users', icon: Users },
    { label: 'Categories', href: '/admin/dashboard/categories', icon: FolderTree },
    { label: 'Profile', href: '/admin/dashboard/profile', icon: BarChart },
    { label: 'Notifications', href: '/admin/dashboard/notifications', icon: BarChart },
  ];

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const handleLogout = () => {
    logout();
    setIsLogoutDialogOpen(false);
    toast.success("Logged out successfully");
  };

  return (
    <motion.aside
      className={cn(
        "fixed inset-y-0 left-0 z-50 bg-white dark:bg-gray-800 flex flex-col border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out overflow-hidden",
        collapsed ? "w-20" : "w-64"
      )}
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
        {!collapsed && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-gray-900 dark:text-white font-semibold"
          >
            Oxford Bakery
          </motion.div>
        )}
        <button
          onClick={toggleSidebar}
          className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors duration-200"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <div className="flex flex-col gap-1 p-3 flex-1">
        {navigationItems.map((item) => {
          const isActive = location.pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors",
                isActive && "bg-red-500 text-white hover:bg-red-600"
              )}
            >
              <Icon className="w-5 h-5" />
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {item.label}
                </motion.span>
              )}
            </Link>
          );
        })}
      </div>

      <div className="p-3 border-t border-gray-200 dark:border-gray-700">
        <Dialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
          <DialogTrigger asChild>
            <button className={cn(
              "flex items-center gap-3 w-full px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors",
              collapsed ? "justify-center" : ""
            )}>
              <LogOut className="w-5 h-5" />
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  Logout
                </motion.span>
              )}
            </button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Log Out</DialogTitle>
              <DialogDescription>
                Are you sure you want to log out of your account?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsLogoutDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleLogout}>Log Out</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </motion.aside>
  );
};
