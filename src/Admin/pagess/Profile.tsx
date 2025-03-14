import React, { useState } from 'react';
import { PageTransition } from '../ui/PageTransition';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Eye, EyeOff, Upload, User } from 'lucide-react';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';
import api from '@/lib/axios';
import { useAuthStore } from '@/lib/store';

export const ProfileContent: React.FC = () => {
  const { user: authUser, login } = useAuthStore();
  const [userData, setUserData] = useState({
    name: authUser?.name || '',
    email: authUser?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const [avatarSrc, setAvatarSrc] = useState<string>(authUser?.image || '/placeholder.svg');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfileUpdate = async () => {
    try {
      setIsLoading(true);
      const response = await api.put('/admin/profile', {
        fullname: userData.name,
      });
      
      // Update auth store with new user data
      if (authUser) {
        login(
          userData.email,
          userData.name,
          authUser.image || '',
          useAuthStore.getState().token || '',
          authUser.role || 'user'
        );
      }
      
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (userData.newPassword !== userData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    
    try {
      setIsLoading(true);
      await api.put('/admin/profile/password', {
        current_password: userData.currentPassword,
        new_password: userData.newPassword,
        confirm_password: userData.confirmPassword,
      });
      
      toast.success('Password changed successfully');
      setUserData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (error) {
      toast.error('Failed to change password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append('file', file);
      
      try {
        setIsLoading(true);
        const response = await api.post('/admin/profile/avatar', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        
        const newImageUrl = response.data.image_url;
        setAvatarSrc(newImageUrl);
        
        // Update auth store with new image
        if (authUser) {
          login(
            authUser.email,
            authUser.name,
            newImageUrl || '',
            useAuthStore.getState().token || '',
            authUser.role || 'user'
          );
        }
        
        toast.success('Profile picture updated');
      } catch (error) {
        toast.error('Failed to update profile picture');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  return (
    <PageTransition>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold tracking-tight">Profile Settings</h1>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your account details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex flex-col items-center space-y-4 mb-6">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={avatarSrc} />
                    <AvatarFallback>
                      <User className="h-12 w-12" />
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="relative">
                    <Button 
                      variant="outline" 
                      className="flex items-center gap-2" 
                      type="button"
                      disabled={isLoading}
                    >
                      <Upload className="h-4 w-4" />
                      Upload Avatar
                    </Button>
                    <input 
                      type="file" 
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                      onChange={handleAvatarChange}
                      accept="image/*"
                      disabled={isLoading}
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={userData.name}
                      onChange={handleInputChange}
                      disabled={isLoading}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={userData.email}
                      disabled
                      className="bg-gray-50"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleProfileUpdate} 
                type="button"
                disabled={isLoading}
              >
                {isLoading ? 'Updating...' : 'Update Profile'}
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>Update your password securely</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      name="currentPassword"
                      type={showPassword.current ? "text" : "password"}
                      value={userData.currentPassword}
                      onChange={handleInputChange}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => togglePasswordVisibility('current')}
                    >
                      {showPassword.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      name="newPassword"
                      type={showPassword.new ? "text" : "password"}
                      value={userData.newPassword}
                      onChange={handleInputChange}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => togglePasswordVisibility('new')}
                    >
                      {showPassword.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showPassword.confirm ? "text" : "password"}
                      value={userData.confirmPassword}
                      onChange={handleInputChange}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => togglePasswordVisibility('confirm')}
                    >
                      {showPassword.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handlePasswordChange}
                disabled={isLoading}
              >
                {isLoading ? 'Changing Password...' : 'Change Password'}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </PageTransition>
  );
};
