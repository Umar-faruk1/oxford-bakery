import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageTransition } from '../ui/PageTransition';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Plus, Trash2, MoreHorizontal, UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import api from '@/lib/axios';

interface User {
  id: number;
  fullname: string;
  email: string;
  role: 'admin' | 'users';
  status: 'active' | 'inactive';
  orders: number;
  joinDate: string;
  image: string | null;
}

export const UsersContent: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const [newUser, setNewUser] = useState({
    fullname: '',
    email: '',
    role: 'users' as 'admin' | 'users',
    status: 'active' as 'active' | 'inactive',
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/admin/users');
      // console.log('API Response:', response.data);
      
      const userData = Array.isArray(response.data) ? response.data : [];
      
      const transformedUsers = userData.map(user => ({
        id: user.id,
        fullname: user.name,
        email: user.email,
        role: user.role as 'admin' | 'users',
        status: user.status as 'active' | 'inactive',
        orders: user.orders,
        joinDate: user.joinDate,
        image: user.image
      }));
      
      // console.log('Transformed Users:', transformedUsers);
      setUsers(transformedUsers);
    } catch (error: any) {
      console.error('Error fetching users:', error);
      if (error.response?.status === 403) {
        toast.error('You do not have permission to view users');
      } else {
        toast.error('Failed to fetch users');
      }
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsEditDialogOpen(true);
  };

  const handleDeleteUser = (user: User) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const saveEditedUser = async () => {
    if (!selectedUser) return;
    
    try {
      const response = await api.put(`/admin/users/${selectedUser.id}`, {
        email: selectedUser.email,
        fullname: selectedUser.fullname,
        role: selectedUser.role,
        status: selectedUser.status
      });
      
      const updatedUser = {
        ...response.data,
        fullname: response.data.name,
        joinDate: response.data.joinDate
      };
      
      setUsers(users.map(user => 
        user.id === selectedUser.id ? updatedUser : user
      ));
      
      setIsEditDialogOpen(false);
      toast.success(`User ${selectedUser.fullname} updated successfully`);
    } catch (error) {
      toast.error('Failed to update user');
      console.error('Error updating user:', error);
    }
  };

  const confirmDeleteUser = async () => {
    if (!selectedUser) return;
    
    try {
      await api.delete(`/admin/users/${selectedUser.id}`);
      setUsers(users.filter(user => user.id !== selectedUser.id));
      setIsDeleteDialogOpen(false);
      toast.success(`User ${selectedUser.fullname} deleted successfully`);
    } catch (error) {
      toast.error('Failed to delete user');
      console.error('Error deleting user:', error);
    }
  };

  const addNewUser = async () => {
    try {
      const response = await api.post('/auth/signup', {
        fullname: newUser.fullname,
        email: newUser.email,
        password: 'defaultPassword123',
        confirm_password: 'defaultPassword123',
        role: newUser.role,
        status: newUser.status
      });
      
      await fetchUsers();
      setIsAddDialogOpen(false);
      toast.success(`User ${newUser.fullname} added successfully`);
      
      setNewUser({
        fullname: '',
        email: '',
        role: 'users',
        status: 'active',
      });
    } catch (error) {
      toast.error('Failed to add user');
      console.error('Error adding user:', error);
    }
  };

  const toggleUserStatus = async (userId: number) => {
    try {
      const response = await api.patch(`/admin/users/${userId}/status`);
      const updatedUser = {
        ...response.data,
        fullname: response.data.name,
        joinDate: response.data.joinDate
      };
      
      setUsers(users.map(user => 
        user.id === userId ? updatedUser : user
      ));
      
      toast.success(`${updatedUser.fullname} is now ${updatedUser.status}`);
    } catch (error) {
      toast.error('Failed to update user status');
      console.error('Error updating user status:', error);
    }
  };

  return (
    <PageTransition>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Users</h1>
            <p className="text-muted-foreground">Manage users and administrators</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-1">
                <UserPlus size={16} />
                <span>Add User</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
                <DialogDescription>
                  Create a new user account.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="fullname">Full Name</Label>
                  <Input 
                    id="fullname" 
                    value={newUser.fullname}
                    onChange={(e) => setNewUser({...newUser, fullname: e.target.value})}
                    placeholder="John Doe" 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                    placeholder="john.doe@example.com" 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="role">Role</Label>
                  <Select 
                    value={newUser.role}
                    onValueChange={(value: 'admin' | 'users') => setNewUser({...newUser, role: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="users">User</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="status"
                    checked={newUser.status === 'active'}
                    onCheckedChange={(checked) => setNewUser({...newUser, status: checked ? 'active' : 'inactive'})}
                  />
                  <Label htmlFor="status">Active Account</Label>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                <Button 
                  onClick={addNewUser}
                  disabled={!newUser.fullname || !newUser.email}
                >
                  Add User
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Users</CardTitle>
          </CardHeader>
          <CardContent>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {isLoading ? (
                <div className="flex justify-center py-8">Loading...</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Orders</TableHead>
                      <TableHead>Join Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar>
                              <AvatarImage src={user.image || '/placeholder.svg'} />
                              <AvatarFallback>
                                {user.fullname ? user.fullname.split(' ').map(n => n[0]).join('') : 'U'}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{user.fullname || 'Unknown User'}</div>
                              <div className="text-sm text-muted-foreground">{user.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline"
                            className={user.role === 'admin' ? 
                              "bg-purple-100 text-purple-800 border-purple-200" : 
                              "bg-blue-100 text-blue-800 border-blue-200"}
                          >
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Switch 
                              checked={user.status === 'active'} 
                              onCheckedChange={() => toggleUserStatus(user.id)}
                            />
                            <Badge 
                              variant="outline"
                              className={user.status === 'active' ? 
                                "bg-green-100 text-green-800 border-green-200" : 
                                "bg-gray-100 text-gray-800 border-gray-200"}
                            >
                              {user.status}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>{user.orders}</TableCell>
                        <TableCell>{user.joinDate}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal size={16} />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleEditUser(user)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="text-red-600"
                                onClick={() => handleDeleteUser(user)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </motion.div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Make changes to the user's details.
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-fullname">Full Name</Label>
                <Input 
                  id="edit-fullname" 
                  value={selectedUser.fullname} 
                  onChange={(e) => setSelectedUser({...selectedUser, fullname: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input 
                  id="edit-email" 
                  type="email"
                  value={selectedUser.email} 
                  onChange={(e) => setSelectedUser({...selectedUser, email: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-role">Role</Label>
                <Select 
                  value={selectedUser.role}
                  onValueChange={(value: 'admin' | 'users') => setSelectedUser({...selectedUser, role: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="users">User</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Switch 
                  id="edit-status"
                  checked={selectedUser.status === 'active'}
                  onCheckedChange={(checked) => setSelectedUser({...selectedUser, status: checked ? 'active' : 'inactive'})}
                />
                <Label htmlFor="edit-status">Active Account</Label>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={saveEditedUser}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="py-4">
              <p className="font-medium">{selectedUser.fullname}</p>
              <p className="text-sm text-gray-500">{selectedUser.email}</p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDeleteUser}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageTransition>
  );
};
