import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { apiService } from '@/services/api';
import { 
  CreditCard, 
  Plus, 
  Edit, 
  Trash2,
  ArrowRight
} from 'lucide-react';
import { SubscriptionPlan } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const Tier1SubscriptionPlanManagement: React.FC = () => {
  const [masterPlans, setMasterPlans] = useState<SubscriptionPlan[]>([]);
  const [tier1Plans, setTier1Plans] = useState<SubscriptionPlan[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedMasterPlan, setSelectedMasterPlan] = useState<SubscriptionPlan | null>(null);
  const [tier1Commission, setTier1Commission] = useState('15');
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      const [masterPlansData, tier1PlansData] = await Promise.all([
        apiService.getMasterPlans(),
        apiService.getTier1Plans()
      ]);
      setMasterPlans(masterPlansData);
      setTier1Plans(tier1PlansData);
    } catch (error: any) {
      console.error('Error loading subscription plans:', error);
      toast({
        title: 'Error',
        description: 'Failed to load subscription plans',
        variant: 'destructive'
      });
    }
  };

  const handleCreateWhiteLabeledPlan = async () => {
    if (!selectedMasterPlan || !tier1Commission) {
      toast({
        title: 'Error',
        description: 'Please select a master plan and enter commission percentage',
        variant: 'destructive'
      });
      return;
    }

    try {
      await apiService.createTier1Plan({
        master_plan_id: selectedMasterPlan.id,
        tier1_commission_pct: parseFloat(tier1Commission)
      });
      
      setIsCreateDialogOpen(false);
      setSelectedMasterPlan(null);
      setTier1Commission('15');
      await loadPlans();
      
      toast({
        title: 'Success',
        description: 'White-labeled plan created successfully'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create white-labeled plan',
        variant: 'destructive'
      });
    }
  };

  const handleEditPlan = async () => {
    if (!editingPlan || !tier1Commission) {
      toast({
        title: 'Error',
        description: 'Please enter commission percentage',
        variant: 'destructive'
      });
      return;
    }

    try {
      await apiService.updateSubscriptionPlan(editingPlan.id, {
        tier1_commission_pct: parseFloat(tier1Commission)
      });
      
      setIsEditDialogOpen(false);
      setEditingPlan(null);
      setTier1Commission('15');
      await loadPlans();
      
      toast({
        title: 'Success',
        description: 'Plan updated successfully'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update plan',
        variant: 'destructive'
      });
    }
  };

  const handleDeletePlan = async (planId: string) => {
    try {
      await apiService.deleteSubscriptionPlan(planId);
      await loadPlans();
      
      toast({
        title: 'Success',
        description: 'Plan deleted successfully'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete plan',
        variant: 'destructive'
      });
    }
  };

  const formatPrice = (price: string, billingCycle: string = 'monthly') => {
    return `$${price}/${billingCycle}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Subscription Plans</h2>
          <p className="text-gray-600">Create white-labeled plans from master plans and manage your subscription offerings</p>
        </div>
      </div>

      {/* Master Plans Section */}
      <Card>
        <CardHeader>
          <CardTitle>Available Master Plans</CardTitle>
          <p className="text-sm text-gray-600">Select a master plan to create your white-labeled version</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {masterPlans.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No master plans available. Contact admin for more plans.
              </div>
            ) : (
              masterPlans.map((plan) => (
                <div key={plan.id} className="flex flex-col lg:flex-row items-start lg:items-center justify-between p-4 border border-gray-200 rounded-lg space-y-4 lg:space-y-0">
                  <div className="flex-1">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <CreditCard className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-gray-900">{plan.name}</h3>
                          <Badge variant="secondary">Master Plan</Badge>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                          <span className="font-medium text-lg text-blue-600">
                            {formatPrice(plan.price, plan.billing_cycle)}
                          </span>
                          {plan.description && (
                            <span className="text-gray-600">{plan.description}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 w-full lg:w-auto justify-end">
                    <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          onClick={() => setSelectedMasterPlan(plan)}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Create White-labeled Plan
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Create White-labeled Plan</DialogTitle>
                          <DialogDescription>
                            Create your own version of "{selectedMasterPlan?.name}" with your commission rate
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="commission">Your Commission Percentage</Label>
                            <Input
                              id="commission"
                              type="number"
                              min="0"
                              max="100"
                              step="0.1"
                              value={tier1Commission}
                              onChange={(e) => setTier1Commission(e.target.value)}
                              placeholder="15"
                            />
                            <p className="text-xs text-gray-500">
                              This is your commission percentage from this plan
                            </p>
                          </div>
                          <div className="flex justify-end space-x-2">
                            <Button 
                              variant="outline" 
                              onClick={() => {
                                setIsCreateDialogOpen(false);
                                setSelectedMasterPlan(null);
                                setTier1Commission('15');
                              }}
                            >
                              Cancel
                            </Button>
                            <Button onClick={handleCreateWhiteLabeledPlan}>
                              Create Plan
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Your Plans Section */}
      <Card>
        <CardHeader>
          <CardTitle>Your White-labeled Plans</CardTitle>
          <p className="text-sm text-gray-600">Plans you've created from master plans</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tier1Plans.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No white-labeled plans yet. Create one from a master plan above.
              </div>
            ) : (
              tier1Plans.map((plan) => (
                <div key={plan.id} className="flex flex-col lg:flex-row items-start lg:items-center justify-between p-4 border border-gray-200 rounded-lg space-y-4 lg:space-y-0">
                  <div className="flex-1">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg flex items-center justify-center">
                        <CreditCard className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-gray-900">{plan.name}</h3>
                          <Badge variant="default">Your Plan</Badge>
                          {plan.tier1_commission_pct && (
                            <Badge variant="outline">
                              {plan.tier1_commission_pct}% Commission
                            </Badge>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                          <span className="font-medium text-lg text-green-600">
                            {formatPrice(plan.price, plan.billing_cycle)}
                          </span>
                          {plan.description && (
                            <span className="text-gray-600">{plan.description}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 w-full lg:w-auto justify-end">
                    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingPlan(plan);
                            setTier1Commission(plan.tier1_commission_pct || '15');
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Plan Commission</DialogTitle>
                          <DialogDescription>
                            Update the commission percentage for "{editingPlan?.name}"
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="editCommission">Your Commission Percentage</Label>
                            <Input
                              id="editCommission"
                              type="number"
                              min="0"
                              max="100"
                              step="0.1"
                              value={tier1Commission}
                              onChange={(e) => setTier1Commission(e.target.value)}
                              placeholder="15"
                            />
                          </div>
                          <div className="flex justify-end space-x-2">
                            <Button 
                              variant="outline" 
                              onClick={() => {
                                setIsEditDialogOpen(false);
                                setEditingPlan(null);
                                setTier1Commission('15');
                              }}
                            >
                              Cancel
                            </Button>
                            <Button onClick={handleEditPlan}>
                              Update Plan
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Plan</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{plan.name}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeletePlan(plan.id)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Tier1SubscriptionPlanManagement;