import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Upload, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AddTier2SellerFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AddTier2SellerForm: React.FC<AddTier2SellerFormProps> = ({ isOpen, onClose, onSuccess }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [tier1Sellers, setTier1Sellers] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    subdomain: '',
    adminEmail: '',
    adminPassword: '',
    tier1SellerId: '',
    siteContent: '',
    commissionType: 'percentage' as 'fixed' | 'percentage',
    commissionValue: ''
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [stylesheetFile, setStylesheetFile] = useState<File | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadTier1Sellers();
    }
  }, [isOpen]);

  const loadTier1Sellers = async () => {
    try {
      const { data, error } = await supabase
        .from('sellers')
        .select('id, name')
        .eq('status', 'active')
        .order('name');

      if (error) throw error;
      setTier1Sellers(data || []);
    } catch (error: any) {
      console.error('Error loading tier1 sellers:', error);
      toast({
        title: 'Error',
        description: 'Failed to load Tier-1 sellers',
        variant: 'destructive'
      });
    }
  };

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
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, { upsert: true });

    if (error) {
      console.error(`Error uploading ${bucket}:`, error);
      return null;
    }

    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return urlData.publicUrl;
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
        logoUrl = await uploadFile(logoFile, 'tier2-logos', `${formData.subdomain}/logo.${logoFile.name.split('.').pop()}`);
      }

      if (stylesheetFile) {
        stylesheetUrl = await uploadFile(stylesheetFile, 'tier2-stylesheets', `${formData.subdomain}/style.css`);
      }

      // Hash password (in production, this should be done server-side)
      const passwordHash = btoa(formData.adminPassword); // Simple encoding for demo

      // Insert tier2 seller record
      const { error } = await supabase
        .from('tier2_sellers')
        .insert({
          name: formData.name,
          subdomain: formData.subdomain,
          admin_email: formData.adminEmail,
          admin_password_hash: passwordHash,
          tier1_seller_id: formData.tier1SellerId,
          logo_url: logoUrl,
          stylesheet_url: stylesheetUrl,
          site_content: formData.siteContent ? JSON.parse(formData.siteContent) : null,
          commission_type: formData.commissionType,
          commission_value: formData.commissionValue ? parseFloat(formData.commissionValue) : null
        });

      if (error) {
        throw error;
      }

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
        tier1SellerId: '',
        siteContent: '',
        commissionType: 'percentage' as 'fixed' | 'percentage',
        commissionValue: ''
      });
      setLogoFile(null);
      setStylesheetFile(null);

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
            Create a new Tier-2 seller account with admin credentials and branding assets.
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
              <Label htmlFor="subdomain">Subdomain *</Label>
              <Input
                id="subdomain"
                value={formData.subdomain}
                onChange={(e) => handleInputChange('subdomain', e.target.value)}
                placeholder="analyticspro"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tier1Seller">Tier-1 Seller *</Label>
            <Select value={formData.tier1SellerId} onValueChange={(value) => handleInputChange('tier1SellerId', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select Tier-1 Seller" />
              </SelectTrigger>
              <SelectContent>
                {tier1Sellers.map((seller) => (
                  <SelectItem key={seller.id} value={seller.id}>
                    {seller.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
              <Label htmlFor="commissionType">Commission Type *</Label>
              <Select
                value={formData.commissionType}
                onValueChange={(value) => handleInputChange('commissionType', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select commission type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Percentage</SelectItem>
                  <SelectItem value="fixed">Fixed Amount</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="commissionValue">
                Commission Value * {formData.commissionType === 'percentage' ? '(%)' : '($)'}
              </Label>
              <Input
                id="commissionValue"
                type="number"
                step={formData.commissionType === 'percentage' ? '0.01' : '0.01'}
                min="0"
                max={formData.commissionType === 'percentage' ? '100' : undefined}
                value={formData.commissionValue}
                onChange={(e) => handleInputChange('commissionValue', e.target.value)}
                placeholder={formData.commissionType === 'percentage' ? '10.5' : '50.00'}
                required
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Logo Upload</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                {logoFile ? (
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{logoFile.name}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleFileChange('logo', null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <label className="flex items-center justify-center space-x-2 cursor-pointer">
                    <Upload className="h-5 w-5 text-gray-400" />
                    <span className="text-sm text-gray-500">Choose logo file</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileChange('logo', e.target.files?.[0] || null)}
                    />
                  </label>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Stylesheet Upload</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                {stylesheetFile ? (
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{stylesheetFile.name}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleFileChange('stylesheet', null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <label className="flex items-center justify-center space-x-2 cursor-pointer">
                    <Upload className="h-5 w-5 text-gray-400" />
                    <span className="text-sm text-gray-500">Choose CSS file</span>
                    <input
                      type="file"
                      accept=".css"
                      className="hidden"
                      onChange={(e) => handleFileChange('stylesheet', e.target.files?.[0] || null)}
                    />
                  </label>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="siteContent">Site Content (JSON)</Label>
            <Textarea
              id="siteContent"
              value={formData.siteContent}
              onChange={(e) => handleInputChange('siteContent', e.target.value)}
              placeholder='{"title": "Welcome to Analytics Pro", "description": "Advanced analytics solutions"}'
              rows={4}
            />
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

export default AddTier2SellerForm;