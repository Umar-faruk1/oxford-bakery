'use client';

import { useState } from 'react';
import { Eye, Pencil, Plus, Search, Trash } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MenuItem } from '@/types';
import MenuModal from './MenuModal';
import { useToast } from '@/hooks/use-toast';

const initialMenuItems: MenuItem[] = [
  {
    id: '1',
    image: '/menu/cheeseburger.jpg',
    title: 'Cheese Burger',
    category: 'meals',
    price: 105,
  },
  {
    id: '2',
    image: '/menu/chicken-filet.jpg',
    title: 'Chicken Filet',
    category: 'meals',
    price: 75,
  },
];

const Menu = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenuItems);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all'); // Default to "all"
  const [priceSort, setPriceSort] = useState<'asc' | 'desc'>('asc');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | undefined>();
  const { toast } = useToast();

  const filteredItems = menuItems
    .filter((item) => {
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'all' ? true : item.category === categoryFilter;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => (priceSort === 'asc' ? a.price - b.price : b.price - a.price));

  const handleAddEdit = (data: Omit<MenuItem, 'id'>) => {
    if (selectedItem) {
      setMenuItems(
        menuItems.map((item) => (item.id === selectedItem.id ? { ...item, ...data } : item))
      );
      toast({ title: 'Menu item updated', description: 'The menu item has been updated.' });
    } else {
      const newItem = { ...data, id: Math.random().toString(36).substr(2, 9) };
      setMenuItems([...menuItems, newItem]);
      toast({ title: 'Menu item added', description: 'The new menu item has been added.' });
    }
    setSelectedItem(undefined);
  };

  const handleDelete = (id: string) => {
    setMenuItems(menuItems.filter((item) => item.id !== id));
    toast({ title: 'Menu item deleted', description: 'The menu item has been deleted.' });
  };

  const handleEdit = (item: MenuItem) => {
    setSelectedItem(item);
    setModalOpen(true);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">All Menus</h1>
        <Button className='bg-red-500 hover:bg-red-600' onClick={() => setModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Menu
        </Button>
      </div>

      <div className="flex gap-4 items-center">
        <div className="flex-1">
          <Input
            placeholder="Search menus..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
            
          />
        </div>

        {/* Fixed: Select now uses "all" instead of an empty string */}
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="breakfast">Breakfast</SelectItem>
            <SelectItem value="meals">Meals</SelectItem>
            <SelectItem value="beverages">Beverages</SelectItem>
          </SelectContent>
        </Select>

        <Select value={priceSort} onValueChange={(value: 'asc' | 'desc') => setPriceSort(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Price" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="asc">Price: Low to High</SelectItem>
            <SelectItem value="desc">Price: High to Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                </TableCell>
                <TableCell>{item.title}</TableCell>
                <TableCell>
                  <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-sm">
                    {item.category}
                  </span>
                </TableCell>
                <TableCell>${item.price}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)}>
                      <Trash className="h-4 w-4 " />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <MenuModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        menuItem={selectedItem}
        onSave={handleAddEdit}
      />
    </div>
  );
};

export default Menu;
