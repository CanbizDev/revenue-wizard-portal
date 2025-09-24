import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { apiService } from '@/services/api';
import AddPlanForm from '@/components/Forms/AddPlanForm';
import { 
  CreditCard, 
  Plus, 
  Edit, 
  Trash2,
  Users,
  DollarSign
} from 'lucide-react';

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  billing_cycle: string;
  max_clients: number;
  description?: string;
  features: string[];
  status: 'active' | 'inactive';
  created_at: string;
}

const SubscriptionPlanManagement: React.FC = () => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [isAddPlanOpen, setIsAddPlanOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
  const { toast } = useToast();

  const loadPlans = async () => {
    try {
      const plansData = await apiService.getAllSubscriptionPlans();
      setPlans(plansData);
    } catch (error: any) {
      console.error('Error loading subscription plans:', error);
      toast({
        title: 'Error',
        description: 'Failed to load subscription plans',
        variant: 'destructive'
      });
    }
  };

  useEffect(() => {
    loadPlans();
  }, []);

  const handleCreatePlan = async (planData: any) => {
    try {
      await apiService.createSubscriptionPlan(planData);
      setIsAddPlanOpen(false);
      await loadPlans(); // Reload plans after creation
      
      toast({
        title: 'Success',
        description: 'Subscription plan created successfully'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create subscription plan',
        variant: 'destructive'
      });
    }
  };

  const handleEditPlan = async (planData: any) => {
    if (!editingPlan) return;
    
    try {
      await apiService.updateSubscriptionPlan(editingPlan.id, planData);
      setEditingPlan(null);
      setIsAddPlanOpen(false);
      await loadPlans(); // Reload plans after update
      
      toast({
        title: 'Success',
        description: 'Subscription plan updated successfully'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update subscription plan',
        variant: 'destructive'
      });
    }
  };

  const handleDeletePlan = async (planId: string) => {
    try {
      await apiService.deleteSubscriptionPlan(planId);
      await loadPlans(); // Reload plans after deletion
      
      toast({
        title: 'Success',
        description: 'Subscription plan deleted successfully'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete subscription plan',
        variant: 'destructive'
      });
    }
  };

  const formatPrice = (price: number, currency: string, billingCycle: string) => {
    const symbol = currency === 'USD' ? '$' : '₹';
    return `${symbol}${price}/${billingCycle}`;
  };

  const formatClientLimit = (maxClients: number) => {
    return maxClients === -1 ? 'Unlimited' : maxClients.toString();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Subscription Plans</h2>
          <p className="text-gray-600">Manage subscription plans for your platform</p>
        </div>
        <Button 
          className="flex items-center space-x-2 w-full sm:w-auto" 
          onClick={() => setIsAddPlanOpen(true)}
        >
          <Plus className="h-4 w-4" />
          <span>Add New Plan</span>
        </Button>
      </div>

      {/* Plans Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <CreditCard className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Plans</p>
                <p className="text-2xl font-bold">{plans.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Plans</p>
                <p className="text-2xl font-bold">{plans.filter(p => p.status === 'active').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Avg. Price</p>
                <p className="text-2xl font-bold">
                  ₹{Math.round(plans.reduce((sum, plan) => sum + plan.price, 0) / plans.length || 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Plans List */}
      <Card>
        <CardHeader>
          <CardTitle>All Subscription Plans</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {plans.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No subscription plans found. Create your first plan to get started.
              </div>
            ) : (
              plans.map((plan) => (
                <div key={plan.id} className="flex flex-col lg:flex-row items-start lg:items-center justify-between p-4 border border-gray-200 rounded-lg space-y-4 lg:space-y-0">
                  <div className="flex-1">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <CreditCard className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-gray-900">{plan.name}</h3>
                          <Badge 
                            variant={plan.status === 'active' ? 'default' : 'secondary'}
                            className={plan.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}
                          >
                            {plan.status}
                          </Badge>
                        </div>
                        <p className="text-gray-600 text-sm mb-2">{plan.description}</p>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                          <span className="font-medium text-lg text-blue-600">
                            {formatPrice(plan.price, plan.currency, plan.billing_cycle)}
                          </span>
                          <span>Max Clients: {formatClientLimit(plan.max_clients)}</span>
                          <span>Features: {plan.features.length}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 w-full lg:w-auto justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingPlan(plan);
                        setIsAddPlanOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeletePlan(plan.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Plan Form */}
      <AddPlanForm
        isOpen={isAddPlanOpen}
        onClose={() => {
          setIsAddPlanOpen(false);
          setEditingPlan(null);
        }}
        onSubmit={editingPlan ? handleEditPlan : handleCreatePlan}
        editingPlan={editingPlan}
      />
    </div>
  );
};

export default SubscriptionPlanManagement;