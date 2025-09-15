import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { apiService } from '@/services/api';

interface EditSellerFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  seller: any;
  sellerType: 'tier1' | 'tier2';
}

export const EditSellerForm: React.FC<EditSellerFormProps> = ({
  isOpen,
  onClose,
  onSuccess,
  seller,
  sellerType
}) => {
  const [formData, setFormData] = useState({
    name: '',
    subdomain: '',
    admin_email: '',
    status: 'active'
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (seller) {
      setFormData({
        name: seller.name || '',
        subdomain: seller.subdomain || '',
        admin_email: seller.admin_email || '',
        status: seller.status || 'active'
      });
    }
  }, [seller]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (sellerType === 'tier1') {
        await apiService.updateTier1Seller(seller.id, formData);
        toast.success('Tier-1 seller updated successfully!');
      } else {
        await apiService.updateTier2Seller(seller.id, formData);
        toast.success('Tier-2 seller updated successfully!');
      }
      
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error updating seller:', error);
      toast.error('Failed to update seller. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit {sellerType === 'tier1' ? 'Tier-1' : 'Tier-2'} Seller</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Seller Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="subdomain">Subdomain</Label>
            <Input
              id="subdomain"
              name="subdomain"
              value={formData.subdomain}
              onChange={handleInputChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="admin_email">Admin Email</Label>
            <Input
              id="admin_email"
              name="admin_email"
              type="email"
              value={formData.admin_email}
              onChange={handleInputChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>

          <div className="flex space-x-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'Updating...' : 'Update Seller'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};