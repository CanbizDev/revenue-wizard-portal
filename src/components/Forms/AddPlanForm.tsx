import React, { useState, useEffect } from 'react'; // Make sure useEffect is imported
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AddPlanFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (planData: any) => void;
  editingPlan?: any;
  formType?: 'admin' | 'seller_admin';
}

const AddPlanForm: React.FC<AddPlanFormProps> = ({ isOpen, onClose, onSubmit, editingPlan, formType = 'seller_admin' }) => {
  const { toast } = useToast();
  
  const currencyOptions = [
    { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
    { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
    { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar' },
  ];

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    currency: 'INR',
    billing_cycle: 'monthly',
    description: '',
    tier1_commission_percentage: '',
    jb_commission_percentage: '',
    status: 'active'
  });

  // --- useEffect hook is now in the correct position ---
  useEffect(() => {
    if (editingPlan) {
        setFormData({
            name: editingPlan.name || '',
            price: editingPlan.price || '',
            currency: editingPlan.currency || 'INR',
            billing_cycle: editingPlan.billing_cycle || 'monthly',
            description: editingPlan.description || '',
            tier1_commission_percentage: editingPlan.admin_commission_pct || '',
            jb_commission_percentage: editingPlan.jb_commission_percentage || '',
            status: editingPlan.status || 'active'
        });
    } else {
        // Reset form when there is no editingPlan (e.g., for creating a new plan)
        setFormData({
            name: '',
            price: '',
            currency: 'INR',
            billing_cycle: 'monthly',
            description: '',
            tier1_commission_percentage: '',
            jb_commission_percentage: '',
            status: 'active'
        });
    }
  }, [editingPlan]); 

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const requiredFields = formType === 'admin' 
      ? ['name', 'price', 'tier1_commission_percentage']
      : ['name', 'price', 'tier1_commission_percentage', 'jb_commission_percentage'];
    
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
    
    if (missingFields.length > 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all required fields."
      });
      return;
    }

    const planData: any = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      billing_cycle: formData.billing_cycle,
      currency: formData.currency,
      status: formData.status,
      admin_commission_pct: parseFloat(formData.tier1_commission_percentage)
    };

    if (formType === 'seller_admin') {
      planData.jb_commission_percentage = parseFloat(formData.jb_commission_percentage);
    }

    onSubmit(planData);
    onClose();
    
    toast({
      title: "Success",
      description: editingPlan ? "Plan updated successfully!" : "Plan created successfully!"
    });
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{editingPlan ? 'Edit Plan' : 'Create New Plan'}</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* --- Your form JSX (no changes needed here) --- */}
            <div className="space-y-2">
              <Label htmlFor="name">Plan Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price *</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleChange('price', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Currency *</Label>
                <Select value={formData.currency} onValueChange={(value) => handleChange('currency', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {currencyOptions.map((currency) => (
                      <SelectItem key={currency.code} value={currency.code}>
                        {currency.symbol} {currency.code} - {currency.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="billing">Billing Cycle</Label>
                <Select value={formData.billing_cycle} onValueChange={(value) => handleChange('billing_cycle', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tier1Commission">Commission (From Tier1) % *</Label>
                <Input
                  id="tier1Commission"
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={formData.tier1_commission_percentage}
                  onChange={(e) => handleChange('tier1_commission_percentage', e.target.value)}
                  required
                />
                <div className="text-xs text-gray-500">
                  Percentage of commission from Tier1 sellers
                </div>
              </div>
              
              {formType === 'seller_admin' && (
                <div className="space-y-2">
                  <Label htmlFor="jbCommission">Commission (For JB) % *</Label>
                  <Input
                    id="jbCommission"
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={formData.jb_commission_percentage}
                    onChange={(e) => handleChange('jb_commission_percentage', e.target.value)}
                    placeholder="10"
                    required
                  />
                  <div className="text-xs text-gray-500">
                    Percentage of commission for JB Admin
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Brief description of the plan"
                rows={3}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="active"
                checked={formData.status === 'active'}
                onCheckedChange={(checked) => handleChange('status', checked ? 'active' : 'inactive')}
              />
              <Label htmlFor="active">Plan is active</Label>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                {editingPlan ? 'Update Plan' : 'Create Plan'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddPlanForm;