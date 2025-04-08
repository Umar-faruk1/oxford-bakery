import React, { useState, useRef, useEffect } from 'react';
import { PageTransition } from '../ui/PageTransition';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Pencil, Plus, Trash2, Image, Eye } from 'lucide-react';
// import { motion } from 'framer-motion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import api from '@/lib/axios';

interface Category {
  id: number;
  name: string;
  description: string;
  image: string | null;
}

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category_id: number;
  category: Category;
  image: string | null;
  status: boolean;
  created_at: string;
  updated_at: string | null;
}

export const MenuItemsContent: React.FC = () => {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<MenuItem | null>(null);
  const [newImage, setNewImage] = useState<File | null>(null);
  const [editImage, setEditImage] = useState<File | null>(null);
  
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    price: '',
    category_id: '',
    status: true
  });

  useEffect(() => {
    fetchMenuItems();
    fetchCategories();
  }, []);

  const fetchMenuItems = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/menu/items');
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching menu items:', error);
      toast.error('Failed to fetch menu items');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('/menu/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to fetch categories');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewImage(file);
    }
  };

  const handleEditFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setEditImage(file);
    }
  };

  const handleEditItem = (item: MenuItem) => {
    setCurrentItem(item);
    setEditImage(null);
    setIsEditDialogOpen(true);
  };

  const handleViewItem = (item: MenuItem) => {
    setCurrentItem(item);
    setIsViewDialogOpen(true);
  };

  const handleDeleteItem = (item: MenuItem) => {
    setCurrentItem(item);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteItem = async () => {
    if (!currentItem) return;

    try {
      await api.delete(`/menu/items/${currentItem.id}`);
      await fetchMenuItems();
      setIsDeleteDialogOpen(false);
      toast.success(`${currentItem.name} has been deleted`);
    } catch (error) {
      console.error('Error deleting menu item:', error);
      toast.error('Failed to delete menu item');
    }
  };

  const handleAddItem = async () => {
    if (!newItem.name || !newItem.description || !newItem.price || !newItem.category_id) {
      toast.error('Please fill all required fields');
      return;
    }
    
    try {
      const formData = new FormData();
      
      // Convert price to float before sending
      const price = parseFloat(newItem.price);
      if (isNaN(price)) {
        toast.error('Please enter a valid price');
        return;
      }

      // Convert category_id to integer
      const categoryId = parseInt(newItem.category_id);
      if (isNaN(categoryId)) {
        toast.error('Please select a valid category');
        return;
      }

      formData.append('name', newItem.name);
      formData.append('description', newItem.description);
      formData.append('price', price.toString());
      formData.append('category_id', categoryId.toString());
      formData.append('status', newItem.status ? 'active' : 'inactive');
      if (newImage) {
        formData.append('image', newImage);
      }

      const response = await api.post('/menu/items', formData);
      console.log('Item added:', response.data);
      
      await fetchMenuItems();
      setNewItem({
        name: '',
        description: '',
        price: '',
        category_id: '',
        status: true
      });
      setNewImage(null);
      setIsAddDialogOpen(false);
      toast.success(`${newItem.name} has been added to the menu`);
    } catch (error: any) {
      console.error('Error adding menu item:', error);
      if (error.response?.data?.detail) {
        const details = error.response.data.detail;
        if (Array.isArray(details)) {
          // Show the first error message
          toast.error(details[0]?.msg || 'Failed to add menu item');
        } else {
          toast.error(details);
        }
      } else {
        toast.error('Failed to add menu item');
      }
    }
  };

  const handleUpdateItem = async () => {
    if (!currentItem) return;

    try {
      // Prepare the update data
      const updateData = {
        name: currentItem.name,
        description: currentItem.description,
        price: parseFloat(currentItem.price.toString()),
        category_id: parseInt(currentItem.category_id.toString()),
        status: currentItem.status ? 'active' : 'inactive'
      };

      // Validate the data before sending
      if (isNaN(updateData.price)) {
        toast.error('Please enter a valid price');
        return;
      }

      if (isNaN(updateData.category_id)) {
        toast.error('Please select a valid category');
        return;
      }

      if (editImage) {
        // If there's an image, send as multipart/form-data
        const formData = new FormData();
        formData.append('image', editImage);
        formData.append('item_update', JSON.stringify(updateData));

        await api.put(`/menu/items/${currentItem.id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        // If no image, still send as form-data but without the image
        const formData = new FormData();
        formData.append('item_update', JSON.stringify(updateData));

        await api.put(`/menu/items/${currentItem.id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }

      await fetchMenuItems();
      setIsEditDialogOpen(false);
      toast.success(`${currentItem.name} has been updated`);
    } catch (error: any) {
      console.error('Error updating menu item:', error);
      if (error.response?.data?.detail) {
        toast.error(error.response.data.detail);
      } else {
        toast.error('Failed to update menu item');
      }
    }
  };

  return (
    <PageTransition>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Menu Items</h1>
            <p className="text-muted-foreground">Manage your bakery menu items</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-1">
                <Plus size={16} />
                <span>Add Item</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Menu Item</DialogTitle>
                <DialogDescription>
                  Add the details of the new menu item below.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input 
                    id="name" 
                    placeholder="Item name" 
                    value={newItem.name}
                    onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Input 
                    id="description" 
                    placeholder="Item description" 
                    value={newItem.description}
                    onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="price">Price</Label>
                  <Input 
                    id="price" 
                    placeholder="29.99" 
                    value={newItem.price}
                    onChange={(e) => setNewItem({...newItem, price: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="category">Category</Label>
                  <Select 
                    value={newItem.category_id}
                    onValueChange={(value) => setNewItem({...newItem, category_id: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={String(category.id)}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="image">Image</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      className="hidden"
                      onChange={handleFileChange}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Image size={16} className="mr-2" />
                      Upload Image
                    </Button>
                  </div>
                  {newImage && (
                    <div className="mt-2">
                      <img
                        src={URL.createObjectURL(newImage)}
                        alt="Preview"
                        className="w-full h-32 object-cover rounded-md"
                      />
                    </div>
                  )}
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleAddItem}>Add Item</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Menu Items</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">Loading...</div>
            ) : (
              <div className="relative w-full overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Image</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={item.image || '/placeholder.svg'} alt={item.name} />
                            <AvatarFallback>{item.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                        </TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.description}</TableCell>
                        <TableCell>${item.price.toFixed(2)}</TableCell>
                        <TableCell>{item.category.name}</TableCell>
                        <TableCell>
                          <Badge variant={item.status ? "default" : "secondary"}>
                            {item.status ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm" onClick={() => handleViewItem(item)}>
                              <Eye size={16} />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleEditItem(item)}>
                              <Pencil size={16} />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDeleteItem(item)}>
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* View Item Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>View Menu Item</DialogTitle>
          </DialogHeader>
          {currentItem && (
            <div className="space-y-4">
              <div className="aspect-video relative rounded-lg overflow-hidden">
                <img
                  src={currentItem.image || '/placeholder.svg'}
                  alt={currentItem.name}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="grid gap-2">
                <h3 className="font-semibold">{currentItem.name}</h3>
                <p className="text-sm text-muted-foreground">{currentItem.description}</p>
                <div className="flex items-center gap-2">
                  <Badge>{currentItem.category.name}</Badge>
                  <Badge variant="secondary">${currentItem.price.toFixed(2)}</Badge>
                  <Badge variant={currentItem.status ? "default" : "secondary"}>
                    {currentItem.status ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  <p>Created: {new Date(currentItem.created_at).toLocaleDateString()}</p>
                  {currentItem.updated_at && (
                    <p>Last Updated: {new Date(currentItem.updated_at).toLocaleDateString()}</p>
                  )}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Item Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Menu Item</DialogTitle>
            <DialogDescription>
              Make changes to the menu item below.
            </DialogDescription>
          </DialogHeader>
          {currentItem && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Name</Label>
                <Input 
                  id="edit-name" 
                  value={currentItem.name}
                  onChange={(e) => setCurrentItem({...currentItem, name: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-description">Description</Label>
                <Input 
                  id="edit-description" 
                  value={currentItem.description}
                  onChange={(e) => setCurrentItem({...currentItem, description: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-price">Price</Label>
                <Input 
                  id="edit-price" 
                  value={currentItem.price}
                  onChange={(e) => setCurrentItem({...currentItem, price: parseFloat(e.target.value) || 0})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-category">Category</Label>
                <Select 
                  value={String(currentItem.category_id)}
                  onValueChange={(value) => setCurrentItem({...currentItem, category_id: parseInt(value)})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={String(category.id)}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select 
                  value={String(currentItem.status)}
                  onValueChange={(value) => setCurrentItem({...currentItem, status: value === 'true'})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Active</SelectItem>
                    <SelectItem value="false">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-image">Image</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="edit-image"
                    type="file"
                    accept="image/*"
                    ref={editFileInputRef}
                    className="hidden"
                    onChange={handleEditFileChange}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => editFileInputRef.current?.click()}
                  >
                    <Image size={16} className="mr-2" />
                    Change Image
                  </Button>
                </div>
                <div className="mt-2">
                  <img
                    src={editImage ? URL.createObjectURL(editImage) : currentItem.image || '/placeholder.svg'}
                    alt={currentItem.name}
                    className="w-full h-32 object-cover rounded-md"
                  />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdateItem}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Item Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Delete Menu Item</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this menu item? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {currentItem && (
            <div className="py-4">
              <p className="font-medium">{currentItem.name}</p>
              <p className="text-sm text-muted-foreground">{currentItem.description}</p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDeleteItem}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageTransition>
  );
};
