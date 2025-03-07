import React, { useState, useEffect } from 'react';
import { PageTransition } from '../ui/PageTransition';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Edit, Trash2, Loader2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
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
import { toast } from 'sonner';
import api from '@/lib/axios';

interface PromoCode {
  id: number;
  code: string;
  discount: string;
  start_date: string;
  end_date: string;
  usage_count: number;
  is_active: boolean;
}

export const PromosContent: React.FC = () => {
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPromo, setSelectedPromo] = useState<PromoCode | null>(null);
  const [newPromo, setNewPromo] = useState({
    code: '',
    discount: '',
    start_date: '',
    end_date: '',
  });
  const [editedPromo, setEditedPromo] = useState({
    code: '',
    discount: '',
    start_date: '',
    end_date: '',
    is_active: false
  });

  // Fetch promo codes
  const fetchPromoCodes = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/promo');
      const formattedCodes = response.data.map((promo: any) => ({
        ...promo,
        start_date: new Date(promo.start_date).toISOString().split('T')[0],
        end_date: new Date(promo.end_date).toISOString().split('T')[0]
      }));
      setPromoCodes(formattedCodes);
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to fetch promo codes');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPromoCodes();
  }, []);

  const handleToggleStatus = async (id: number) => {
    try {
      const response = await api.patch(`/promo/${id}/toggle`);
      const updatedPromo = response.data;
      setPromoCodes(prevCodes =>
        prevCodes.map(code =>
          code.id === id ? { ...code, is_active: updatedPromo.is_active } : code
        )
      );
      toast.success(`Promo code status updated successfully`);
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to update status');
    }
  };

  const handleEdit = (promo: PromoCode) => {
    setSelectedPromo(promo);
    setEditedPromo({
      code: promo.code,
      discount: promo.discount,
      start_date: promo.start_date,
      end_date: promo.end_date,
      is_active: promo.is_active
    });
    setIsEditDialogOpen(true);
  };

  const handleDelete = (promo: PromoCode) => {
    setSelectedPromo(promo);
    setIsDeleteDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedPromo) return;
    
    try {
      const response = await api.put(`/promo/${selectedPromo.id}`, {
        ...editedPromo,
        start_date: new Date(editedPromo.start_date).toISOString(),
        end_date: new Date(editedPromo.end_date).toISOString()
      });
      
      const updatedPromo = {
        ...response.data,
        start_date: new Date(response.data.start_date).toISOString().split('T')[0],
        end_date: new Date(response.data.end_date).toISOString().split('T')[0]
      };
      
      setPromoCodes(prevCodes =>
        prevCodes.map(code =>
          code.id === selectedPromo.id ? updatedPromo : code
        )
      );
      
      setIsEditDialogOpen(false);
      toast.success('Promo code updated successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to update promo code');
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedPromo) return;
    
    try {
      await api.delete(`/promo/${selectedPromo.id}`);
      setPromoCodes(prevCodes => prevCodes.filter(code => code.id !== selectedPromo.id));
      setIsDeleteDialogOpen(false);
      toast.success('Promo code deleted successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to delete promo code');
    }
  };

  const handleAddPromo = async () => {
    try {
      const response = await api.post('/promo', {
        ...newPromo,
        start_date: new Date(newPromo.start_date).toISOString(),
        end_date: new Date(newPromo.end_date).toISOString()
      });
      
      const newPromoCode = {
        ...response.data,
        start_date: new Date(response.data.start_date).toISOString().split('T')[0],
        end_date: new Date(response.data.end_date).toISOString().split('T')[0]
      };
      
      setPromoCodes([...promoCodes, newPromoCode]);
      
      // Reset form
      setNewPromo({
        code: '',
        discount: '',
        start_date: '',
        end_date: '',
      });
      
      setIsAddDialogOpen(false);
      toast.success('New promo code added successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to add promo code');
    }
  };

  if (isLoading) {
    return (
      <PageTransition>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-[#FF7F00]" />
            <p className="text-lg text-gray-600">Loading promo codes...</p>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Promo Codes</h1>
            <p className="text-muted-foreground">Manage discounts and special offers</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-1">
                <Plus size={16} />
                <span>New Promo</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Promo Code</DialogTitle>
                <DialogDescription>
                  Create a new promotional code for customers.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="promo-code">Promo Code</Label>
                  <Input 
                    id="promo-code" 
                    value={newPromo.code} 
                    onChange={(e) => setNewPromo({...newPromo, code: e.target.value})}
                    placeholder="SUMMER20" 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="discount">Discount</Label>
                  <Input 
                    id="discount" 
                    value={newPromo.discount} 
                    onChange={(e) => setNewPromo({...newPromo, discount: e.target.value})}
                    placeholder="20% or Free Shipping" 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="start-date">Start Date</Label>
                    <Input 
                      id="start-date" 
                      type="date" 
                      value={newPromo.start_date} 
                      onChange={(e) => setNewPromo({...newPromo, start_date: e.target.value})}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="end-date">End Date</Label>
                    <Input 
                      id="end-date" 
                      type="date" 
                      value={newPromo.end_date} 
                      onChange={(e) => setNewPromo({...newPromo, end_date: e.target.value})}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleAddPromo} disabled={!newPromo.code || !newPromo.discount || !newPromo.start_date || !newPromo.end_date}>Add Promo</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Active Promotions</CardTitle>
          </CardHeader>
          <CardContent>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Discount</TableHead>
                    <TableHead>Period</TableHead>
                    <TableHead>Usage</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {promoCodes.map((promo) => (
                    <TableRow key={promo.id}>
                      <TableCell className="font-medium">{promo.code}</TableCell>
                      <TableCell>{promo.discount}</TableCell>
                      <TableCell>
                        {promo.start_date} - {promo.end_date}
                      </TableCell>
                      <TableCell>{promo.usage_count} uses</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Switch 
                            checked={promo.is_active} 
                            onCheckedChange={() => handleToggleStatus(promo.id)}
                          />
                          <Badge 
                            variant="outline" 
                            className={promo.is_active ? 
                              "bg-green-100 text-green-800 border-green-200" : 
                              "bg-gray-100 text-gray-800 border-gray-200"}
                          >
                            {promo.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleEdit(promo)}
                          >
                            <Edit size={16} />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleDelete(promo)}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </motion.div>
          </CardContent>
        </Card>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Promo Code</DialogTitle>
            <DialogDescription>
              Update the details for this promotional code.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-code">Promo Code</Label>
              <Input 
                id="edit-code" 
                value={editedPromo.code} 
                onChange={(e) => setEditedPromo({...editedPromo, code: e.target.value})}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-discount">Discount</Label>
              <Input 
                id="edit-discount" 
                value={editedPromo.discount} 
                onChange={(e) => setEditedPromo({...editedPromo, discount: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-start-date">Start Date</Label>
                <Input 
                  id="edit-start-date" 
                  type="date" 
                  value={editedPromo.start_date} 
                  onChange={(e) => setEditedPromo({...editedPromo, start_date: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-end-date">End Date</Label>
                <Input 
                  id="edit-end-date" 
                  type="date" 
                  value={editedPromo.end_date} 
                  onChange={(e) => setEditedPromo({...editedPromo, end_date: e.target.value})}
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Switch 
                id="edit-active"
                checked={editedPromo.is_active} 
                onCheckedChange={(checked) => setEditedPromo({...editedPromo, is_active: checked})}
              />
              <Label htmlFor="edit-active">Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Promo Code</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this promo code? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {selectedPromo && (
            <div className="py-4">
              <p className="font-medium">{selectedPromo.code}</p>
              <p className="text-sm text-gray-500">{selectedPromo.discount} discount</p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageTransition>
  );
};
