
import React, { useState } from 'react';
import { Bell, Search, Settings } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from '@/components/ui/badge';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const [unreadNotifications, setUnreadNotifications] = useState(3);
  
  return (
    <div className="w-full border-b bg-white py-3 px-6 flex items-center justify-between fixed top-0 z-40">
      <div className="flex items-center gap-3 w-full max-w-md">
        <Search className="w-4 h-4 text-muted-foreground" />
        <Input 
          type="text" 
          placeholder="Search..." 
          className="border-none shadow-none focus-visible:ring-0 pl-0" 
        />
      </div>
      
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative"
          onClick={() => navigate('admin/dashboard/notifications')}
        >
          <Bell className="h-5 w-5" />
          {unreadNotifications > 0 && (
            <Badge 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs" 
              variant="destructive"
            >
              {unreadNotifications}
            </Badge>
          )}
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="h-9 w-9 cursor-pointer">
              <AvatarImage src="/placeholder.svg" alt="Profile" />
              <AvatarFallback>CC</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('admin/dashboard/profile')}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Profile Settings</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
