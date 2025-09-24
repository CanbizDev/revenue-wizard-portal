import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { X, Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AddPlanFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (planData: any) => void;
  editingPlan?: any;
}

const AddPlanForm: React.FC<AddPlanFormProps> = ({ isOpen, onClose, onSubmit, editingPlan }) => {
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
    name: editingPlan?.name || '',
    price: editingPlan?.price || '',
    currency: editingPlan?.currency || 'INR',
    billing_cycle: editingPlan?.billing_cycle || 'monthly',
    max_clients: editingPlan?.max_clients || '',
    description: editingPlan?.description || '',
    features: editingPlan?.features || [''],
    status: editingPlan?.status || 'active'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.price || !formData.max_clients) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all required fields."
      });
      return;
    }

    const planData = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      billing_cycle: formData.billing_cycle,
      currency: formData.currency,
      max_clients: parseInt(formData.max_clients),
      features: formData.features.filter(f => f.trim() !== ''),
      status: formData.status
    };

    onSubmit(planData);
    
    if (!editingPlan) {
      setFormData({
        name: '',
        price: '',
        currency: 'INR',
        billing_cycle: 'monthly',
        max_clients: '',
        description: '',
        features: [''],
        status: 'active'
      });
    }
    
    onClose();
    
    toast({
      title: "Success",
      description: editingPlan ? "Plan updated successfully!" : "Plan created successfully!"
    });
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addFeature = () => {
    setFormData(prev => ({ ...prev, features: [...prev.features, ''] }));
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({ 
      ...prev, 
      features: prev.features.filter((_, i) => i !== index) 
    }));
  };

  const updateFeature = (index: number, value: string) => {
    setFormData(prev => ({ 
      ...prev, 
      features: prev.features.map((f, i) => i === index ? value : f) 
    }));
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Plan Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="e.g., Premium Plan"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxClients">Max Clients *</Label>
                <Input
                  id="maxClients"
                  type="number"
                  value={formData.max_clients}
                  onChange={(e) => handleChange('max_clients', e.target.value)}
                  placeholder="15"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price *</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleChange('price', e.target.value)}
                  placeholder="25000"
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

            <div className="space-y-2">
              <Label>Price Preview</Label>
              <div className="px-3 py-2 bg-gray-50 border rounded-md">
                <span className="text-lg font-semibold">
                  {currencyOptions.find(c => c.code === formData.currency)?.symbol || '₹'}
                  {formData.price ? parseInt(formData.price).toLocaleString() : '0'} 
                  <span className="text-sm text-gray-500"> / {formData.billing_cycle}</span>
                </span>
                <div className="text-xs text-gray-500 mt-1">{formData.currency}</div>
              </div>
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

            <div className="space-y-2">
              <Label>Features</Label>
              <div className="space-y-3">
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      value={feature}
                      onChange={(e) => updateFeature(index, e.target.value)}
                      placeholder="Enter feature"
                      className="flex-1"
                    />
                    {formData.features.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFeature(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addFeature}
                  className="flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Feature</span>
                </Button>
              </div>
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