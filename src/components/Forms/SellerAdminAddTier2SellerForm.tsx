import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { apiService } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

interface SellerAdminAddTier2SellerFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  currentTier1SellerId?: string;
  currentTier1SellerName?: string;
}

const SellerAdminAddTier2SellerForm: React.FC<SellerAdminAddTier2SellerFormProps> = ({ 
  isOpen, 
  onClose, 
  onSuccess,
  currentTier1SellerId,
  currentTier1SellerName 
}) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    subdomain: '',
    adminEmail: '',
    adminPassword: '',
    commissionType: 'percentage' as 'fixed' | 'percentage',
    commissionValue: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData(prev => ({ ...prev, adminPassword: password }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Hash password (in production, this should be done server-side)
      const passwordHash = btoa(formData.adminPassword); // Simple encoding for demo

      // Create tier2 seller via API - automatically using current tier1 seller
      await apiService.createTier2Seller({
        name: formData.name,
        subdomain: formData.subdomain,
        admin_email: formData.adminEmail,
        admin_password_hash: passwordHash,
        tier1_seller_id: currentTier1SellerId || 'current-tier1-seller', // Use current tier1 seller
        logo_url: null,
        stylesheet_url: null,
        site_content: null,
        commission_type: formData.commissionType,
        commission_value: formData.commissionValue ? parseFloat(formData.commissionValue) : null
      });

      toast({
        title: 'Success',
        description: 'Tier-2 Seller added successfully!'
      });

      // Reset form
      setFormData({
        name: '',
        subdomain: '',
        adminEmail: '',
        adminPassword: '',
        commissionType: 'percentage' as 'fixed' | 'percentage',
        commissionValue: ''
      });

      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Error adding tier2 seller:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to add Tier-2 seller',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Tier-2 Seller</DialogTitle>
          <DialogDescription>
            Create a new Tier-2 seller account under {currentTier1SellerName || 'your organization'}.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Seller Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Analytics Pro"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subdomain">Subdomain</Label>
              <Input
                id="subdomain"
                value={formData.subdomain}
                onChange={(e) => handleInputChange('subdomain', e.target.value)}
                placeholder="analyticspro"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="adminEmail">Admin Email *</Label>
              <Input
                id="adminEmail"
                type="email"
                value={formData.adminEmail}
                onChange={(e) => handleInputChange('adminEmail', e.target.value)}
                placeholder="admin@analyticspro.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="adminPassword">Admin Password *</Label>
              <div className="flex space-x-2">
                <Input
                  id="adminPassword"
                  type="text"
                  value={formData.adminPassword}
                  onChange={(e) => handleInputChange('adminPassword', e.target.value)}
                  placeholder="Generated password"
                  required
                />
                <Button type="button" onClick={generatePassword} variant="outline">
                  Generate
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="commissionType">Commission Type</Label>
              <Select 
                value={formData.commissionType} 
                onValueChange={(value: 'fixed' | 'percentage') => handleInputChange('commissionType', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Percentage</SelectItem>
                  <SelectItem value="fixed">Fixed Amount</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="commissionValue">
                Commission {formData.commissionType === 'percentage' ? 'Percentage' : 'Amount (₹)'}
              </Label>
              <Input
                id="commissionValue"
                type="number"
                step={formData.commissionType === 'percentage' ? '0.1' : '1'}
                min="0"
                max={formData.commissionType === 'percentage' ? '100' : undefined}
                value={formData.commissionValue}
                onChange={(e) => handleInputChange('commissionValue', e.target.value)}
                placeholder={formData.commissionType === 'percentage' ? '10' : '1000'}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Tier-2 Seller'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SellerAdminAddTier2SellerForm;