import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, X } from 'lucide-react';
import { apiService } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

interface AddSellerFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AddSellerForm: React.FC<AddSellerFormProps> = ({ isOpen, onClose, onSuccess }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    subdomain: '',
    adminEmail: '',
    adminPassword: '',
    siteContent: '',
    commissionType: 'percentage' as 'fixed' | 'percentage',
    commissionValue: ''
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [stylesheetFile, setStylesheetFile] = useState<File | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (type: 'logo' | 'stylesheet', file: File | null) => {
    if (type === 'logo') {
      setLogoFile(file);
    } else {
      setStylesheetFile(file);
    }
  };

  const uploadFile = async (file: File, bucket: string, path: string): Promise<string | null> => {
    // Mock file upload - in real implementation this would use your Flask API file upload endpoint
    console.log(`Mock upload: ${file.name} to ${bucket}/${path}`);
    // Return a mock URL
    return `https://mock-storage.example.com/${bucket}/${path}`;
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
      // Upload files if provided
      let logoUrl = null;
      let stylesheetUrl = null;

      if (logoFile) {
        logoUrl = await uploadFile(logoFile, 'seller-logos', `${formData.subdomain}/logo.${logoFile.name.split('.').pop()}`);
      }

      if (stylesheetFile) {
        stylesheetUrl = await uploadFile(stylesheetFile, 'seller-stylesheets', `${formData.subdomain}/style.css`);
      }

      // Hash password (in production, this should be done server-side)
      const passwordHash = btoa(formData.adminPassword); // Simple encoding for demo

      // Create seller via API
      await apiService.createTier1Seller({
        name: formData.name,
        subdomain: formData.subdomain,
        admin_email: formData.adminEmail,
        admin_password_hash: passwordHash,
        logo_url: logoUrl,
        stylesheet_url: stylesheetUrl,
        site_content: formData.siteContent ? JSON.parse(formData.siteContent) : null,
        commission_type: formData.commissionType,
        commission_value: formData.commissionValue ? parseFloat(formData.commissionValue) : null
      });

      toast({
        title: 'Success',
        description: 'Tier-1 Seller added successfully!'
      });

      // Reset form
      setFormData({
        name: '',
        subdomain: '',
        adminEmail: '',
        adminPassword: '',
        siteContent: '',
        commissionType: 'percentage' as 'fixed' | 'percentage',
        commissionValue: ''
      });
      setLogoFile(null);
      setStylesheetFile(null);

      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Error adding seller:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to add seller',
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
          <DialogTitle>Add New Tier-1 Seller</DialogTitle>
          <DialogDescription>
            Create a new seller account with admin credentials and branding assets.
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
                placeholder="TechCorp Solutions"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subdomain">Subdomain</Label>
              <Input
                id="subdomain"
                value={formData.subdomain}
                onChange={(e) => handleInputChange('subdomain', e.target.value)}
                placeholder="techcorp"
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
                placeholder="admin@techcorp.com"
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


          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Seller'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddSellerForm;