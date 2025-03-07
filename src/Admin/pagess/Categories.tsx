import React, { useState, useRef, useEffect } from 'react';
import { PageTransition } from '../ui/PageTransition';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Pencil, Trash2, Image } from 'lucide-react';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import api from '@/lib/axios';

interface Category {
  id: number;
  name: string;
  description: string;
  item_count: number;
  image: string | null;
  created_at: string;
  updated_at: string | null;
}

export const CategoriesContent: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [newCategory, setNewCategory] = useState({
    name: '',
    description: '',
  });

  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [newImage, setNewImage] = useState<File | null>(null);
  const [editImage, setEditImage] = useState<File | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/menu/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to fetch categories');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.name || !newCategory.description) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', newCategory.name);
      formData.append('description', newCategory.description);
      if (newImage) {
        formData.append('image', newImage);
      }

      const response = await api.post('/menu/categories', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        params: {},
      });

      await fetchCategories();
      setNewCategory({
        name: '',
        description: '',
      });
      setNewImage(null);
      toast.success(`Category "${newCategory.name}" added successfully`);
    } catch (error: any) {
      console.error('Error adding category:', error);
      if (error.response?.data?.detail) {
        toast.error(Array.isArray(error.response.data.detail) 
          ? error.response.data.detail[0]?.msg 
          : error.response.data.detail);
      } else {
        toast.error('Failed to add category');
      }
    }
  };

  const handleEditCategory = (category: Category) => {
    setSelectedCategory(category);
    setEditImage(null);
    setIsEditDialogOpen(true);
  };

  const handleDeleteCategory = (category: Category) => {
    setSelectedCategory(category);
    setIsDeleteDialogOpen(true);
  };

  const saveEditedCategory = async () => {
    if (!selectedCategory) return;

    try {
      const formData = new FormData();
      formData.append('name', selectedCategory.name);
      formData.append('description', selectedCategory.description || '');
      
      if (editImage) {
        formData.append('image', editImage);
      }

      await api.put(`/menu/categories/${selectedCategory.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      await fetchCategories();
      setIsEditDialogOpen(false);
      toast.success('Category updated successfully');
    } catch (error: any) {
      console.error('Error updating category:', error);
      if (error.response?.data?.detail) {
        toast.error(error.response.data.detail);
      } else {
        toast.error('Failed to update category');
      }
    }
  };

  const confirmDeleteCategory = async () => {
    if (!selectedCategory) return;

    try {
      await api.delete(`/menu/categories/${selectedCategory.id}`);
      await fetchCategories();
      setIsDeleteDialogOpen(false);
      toast.success(`Category "${selectedCategory.name}" deleted successfully`);
    } catch (error: any) {
      console.error('Error deleting category:', error);
      if (error.response?.status === 400) {
        toast.error('Cannot delete category with existing menu items');
      } else {
        toast.error('Failed to delete category');
      }
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

  return (
    <PageTransition>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Categories</h1>
            <p className="text-muted-foreground">Organize your menu items into categories</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Add Category</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-4" onSubmit={(e) => {
                  e.preventDefault();
                  handleAddCategory();
                }}>
                  <div className="space-y-2">
                    <Label htmlFor="category-name">Name</Label>
                    <Input 
                      id="category-name" 
                      placeholder="Category name" 
                      value={newCategory.name}
                      onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category-description">Description</Label>
                    <Input 
                      id="category-description" 
                      placeholder="Category description" 
                      value={newCategory.description}
                      onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category-image">Category Image</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="category-image"
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
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={!newCategory.name || !newCategory.description}
                  >
                    Add Category
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>All Categories</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center py-8">Loading...</div>
                ) : (
                  <motion.div 
                    className="space-y-3"
                    variants={container}
                    initial="hidden"
                    animate="show"
                  >
                    {categories.map((category) => (
                      <motion.div 
                        key={category.id} 
                        className="p-4 border rounded-lg flex justify-between items-center hover:shadow-sm"
                        variants={item}
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={category.image || '/placeholder.svg'} alt={category.name} />
                            <AvatarFallback>{category.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-medium">{category.name}</h3>
                            <p className="text-sm text-muted-foreground">{category.description}</p>
                            <p className="text-xs text-muted-foreground mt-1">{category.item_count} items</p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleEditCategory(category)}
                          >
                            <Pencil size={16} />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDeleteCategory(category)}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Edit Category Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>
              Make changes to the category details.
            </DialogDescription>
          </DialogHeader>
          {selectedCategory && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Name</Label>
                <Input 
                  id="edit-name" 
                  value={selectedCategory.name} 
                  onChange={(e) => setSelectedCategory({...selectedCategory, name: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-description">Description</Label>
                <Input 
                  id="edit-description" 
                  value={selectedCategory.description} 
                  onChange={(e) => setSelectedCategory({...selectedCategory, description: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-category-image">Category Image</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="edit-category-image"
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
                    src={editImage ? URL.createObjectURL(editImage) : selectedCategory.image || '/placeholder.svg'}
                    alt={selectedCategory.name}
                    className="w-full h-32 object-cover rounded-md"
                  />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={saveEditedCategory}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Category Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Category</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this category? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {selectedCategory && (
            <div className="py-4">
              <p className="font-medium">{selectedCategory.name}</p>
              <p className="text-sm text-gray-500">{selectedCategory.item_count} items in this category</p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDeleteCategory}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageTransition>
  );
};
