import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface AddTier2SellerFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AddTier2SellerForm: React.FC<AddTier2SellerFormProps> = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    subdomain: '',
    admin_email: '',
    admin_name: '',
    tier1_seller_id: '',
    description: '',
    logo_url: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // TODO: Replace with API call when backend is ready
      console.log('Adding tier-2 seller:', formData);
      
      toast({
        title: 'Success',
        description: 'Tier-2 seller added successfully',
      });
      
      onSuccess();
      onClose();
      setFormData({
        name: '',
        subdomain: '',
        admin_email: '',
        admin_name: '',
        tier1_seller_id: '',
        description: '',
        logo_url: ''
      });
    } catch (error: any) {
      console.error('Error adding tier-2 seller:', error);
      toast({
        title: 'Error',
        description: 'Failed to add tier-2 seller. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Tier-2 Seller</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Company Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter company name"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="subdomain">Subdomain</Label>
              <Input
                id="subdomain"
                value={formData.subdomain}
                onChange={(e) => setFormData(prev => ({ ...prev, subdomain: e.target.value }))}
                placeholder="Enter subdomain"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="tier1_seller_id">Parent Tier-1 Seller</Label>
            <Select onValueChange={(value) => setFormData(prev => ({ ...prev, tier1_seller_id: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select Tier-1 seller" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="marketstrendai">MarketsTriendAI</SelectItem>
                <SelectItem value="example">Example Seller</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="admin_email">Admin Email</Label>
              <Input
                id="admin_email"
                type="email"
                value={formData.admin_email}
                onChange={(e) => setFormData(prev => ({ ...prev, admin_email: e.target.value }))}
                placeholder="admin@company.com"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="admin_name">Admin Name</Label>
              <Input
                id="admin_name"
                value={formData.admin_name}
                onChange={(e) => setFormData(prev => ({ ...prev, admin_name: e.target.value }))}
                placeholder="Enter admin name"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter company description"
            />
          </div>

          <div>
            <Label htmlFor="logo_url">Logo URL (optional)</Label>
            <Input
              id="logo_url"
              value={formData.logo_url}
              onChange={(e) => setFormData(prev => ({ ...prev, logo_url: e.target.value }))}
              placeholder="https://example.com/logo.png"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Adding...' : 'Add Seller'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTier2SellerForm;