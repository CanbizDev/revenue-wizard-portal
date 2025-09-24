import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { DollarSign, Edit2, Save, X, Plus } from 'lucide-react';

interface JBCommissionRule {
  id: string;
  seller_type: 'tier1' | 'tier2' | 'all';
  project_type?: string;
  commission_percentage: number;
  description: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

const JBCommissionManagement: React.FC = () => {
  const [commissionRules, setCommissionRules] = useState<JBCommissionRule[]>([
    {
      id: '1',
      seller_type: 'tier1',
      project_type: 'Analytics',
      commission_percentage: 10,
      description: 'Standard commission for Tier-1 sellers on Analytics projects',
      status: 'active',
      created_at: '2024-01-15',
      updated_at: '2024-01-15'
    },
    {
      id: '2',
      seller_type: 'tier2',
      project_type: 'Reporting',
      commission_percentage: 8,
      description: 'Standard commission for Tier-2 sellers on Reporting projects',
      status: 'active',
      created_at: '2024-01-15',
      updated_at: '2024-01-15'
    },
    {
      id: '3',
      seller_type: 'all',
      commission_percentage: 5,
      description: 'Default commission for all project types',
      status: 'active',
      created_at: '2024-01-15',
      updated_at: '2024-01-15'
    }
  ]);
  
  const [isAddRuleOpen, setIsAddRuleOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<JBCommissionRule | null>(null);
  const [newRule, setNewRule] = useState({
    seller_type: 'tier1' as 'tier1' | 'tier2' | 'all',
    project_type: '',
    commission_percentage: 0,
    description: ''
  });
  const { toast } = useToast();

  const handleAddRule = async () => {
    try {
      const rule: JBCommissionRule = {
        id: Date.now().toString(),
        ...newRule,
        status: 'active',
        created_at: new Date().toISOString().split('T')[0],
        updated_at: new Date().toISOString().split('T')[0]
      };

      setCommissionRules([...commissionRules, rule]);
      setNewRule({
        seller_type: 'tier1',
        project_type: '',
        commission_percentage: 0,
        description: ''
      });
      setIsAddRuleOpen(false);

      toast({
        title: 'Success',
        description: 'Commission rule added successfully'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add commission rule',
        variant: 'destructive'
      });
    }
  };

  const handleUpdateRule = async (updatedRule: JBCommissionRule) => {
    try {
      setCommissionRules(rules => 
        rules.map(rule => 
          rule.id === updatedRule.id 
            ? { ...updatedRule, updated_at: new Date().toISOString().split('T')[0] }
            : rule
        )
      );
      setEditingRule(null);

      toast({
        title: 'Success',
        description: 'Commission rule updated successfully'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update commission rule',
        variant: 'destructive'
      });
    }
  };

  const handleDeleteRule = async (ruleId: string) => {
    try {
      setCommissionRules(rules => rules.filter(rule => rule.id !== ruleId));
      
      toast({
        title: 'Success',
        description: 'Commission rule deleted successfully'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete commission rule',
        variant: 'destructive'
      });
    }
  };

  const toggleRuleStatus = async (ruleId: string) => {
    try {
      setCommissionRules(rules => 
        rules.map(rule => 
          rule.id === ruleId 
            ? { 
                ...rule, 
                status: rule.status === 'active' ? 'inactive' : 'active',
                updated_at: new Date().toISOString().split('T')[0]
              }
            : rule
        )
      );

      toast({
        title: 'Success',
        description: 'Commission rule status updated'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update rule status',
        variant: 'destructive'
      });
    }
  };

  const getSellerTypeLabel = (type: string) => {
    switch (type) {
      case 'tier1': return 'Tier-1 Sellers';
      case 'tier2': return 'Tier-2 Sellers';
      case 'all': return 'All Sellers';
      default: return type;
    }
  };

  const getSellerTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'tier1': return 'bg-blue-100 text-blue-800';
      case 'tier2': return 'bg-purple-100 text-purple-800';
      case 'all': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Commission % (For JB)</h2>
          <p className="text-muted-foreground">Manage JupiterBrains commission rules for different seller types and project categories</p>
        </div>
        <Dialog open={isAddRuleOpen} onOpenChange={setIsAddRuleOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="mr-2 h-4 w-4" />
              Add Commission Rule
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Commission Rule</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="seller_type">Seller Type</Label>
                <select
                  id="seller_type"
                  className="w-full p-2 border border-input rounded-md bg-background"
                  value={newRule.seller_type}
                  onChange={(e) => setNewRule({ ...newRule, seller_type: e.target.value as 'tier1' | 'tier2' | 'all' })}
                >
                  <option value="tier1">Tier-1 Sellers</option>
                  <option value="tier2">Tier-2 Sellers</option>
                  <option value="all">All Sellers</option>
                </select>
              </div>
              <div>
                <Label htmlFor="project_type">Project Type (Optional)</Label>
                <Input
                  id="project_type"
                  value={newRule.project_type}
                  onChange={(e) => setNewRule({ ...newRule, project_type: e.target.value })}
                  placeholder="e.g., Analytics, Reporting, Dashboard"
                />
              </div>
              <div>
                <Label htmlFor="commission_percentage">Commission Percentage</Label>
                <Input
                  id="commission_percentage"
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={newRule.commission_percentage}
                  onChange={(e) => setNewRule({ ...newRule, commission_percentage: Number(e.target.value) })}
                  placeholder="Enter commission percentage"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={newRule.description}
                  onChange={(e) => setNewRule({ ...newRule, description: e.target.value })}
                  placeholder="Describe this commission rule"
                />
              </div>
              <Button onClick={handleAddRule} className="w-full">
                Add Commission Rule
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Commission Rules List */}
      <div className="grid gap-4">
        {commissionRules.map((rule) => (
          <Card key={rule.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <CardTitle className="text-lg font-semibold">
                      {rule.project_type || 'All Project Types'}
                    </CardTitle>
                    <Badge className={getSellerTypeBadgeColor(rule.seller_type)}>
                      {getSellerTypeLabel(rule.seller_type)}
                    </Badge>
                    <Badge 
                      variant={rule.status === 'active' ? 'default' : 'secondary'}
                      className={rule.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
                    >
                      {rule.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{rule.description}</p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setEditingRule(rule)}
                    title="Edit Rule"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => toggleRuleStatus(rule.id)}
                    title={rule.status === 'active' ? 'Deactivate' : 'Activate'}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    <span className="text-2xl font-bold text-foreground">{rule.commission_percentage}%</span>
                  </div>
                </div>
                <div className="text-right text-sm text-muted-foreground">
                  <p>Created: {rule.created_at}</p>
                  <p>Updated: {rule.updated_at}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Rule Dialog */}
      {editingRule && (
        <Dialog open={!!editingRule} onOpenChange={() => setEditingRule(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Commission Rule</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit_seller_type">Seller Type</Label>
                <select
                  id="edit_seller_type"
                  className="w-full p-2 border border-input rounded-md bg-background"
                  value={editingRule.seller_type}
                  onChange={(e) => setEditingRule({ 
                    ...editingRule, 
                    seller_type: e.target.value as 'tier1' | 'tier2' | 'all' 
                  })}
                >
                  <option value="tier1">Tier-1 Sellers</option>
                  <option value="tier2">Tier-2 Sellers</option>
                  <option value="all">All Sellers</option>
                </select>
              </div>
              <div>
                <Label htmlFor="edit_project_type">Project Type (Optional)</Label>
                <Input
                  id="edit_project_type"
                  value={editingRule.project_type || ''}
                  onChange={(e) => setEditingRule({ ...editingRule, project_type: e.target.value })}
                  placeholder="e.g., Analytics, Reporting, Dashboard"
                />
              </div>
              <div>
                <Label htmlFor="edit_commission_percentage">Commission Percentage</Label>
                <Input
                  id="edit_commission_percentage"
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={editingRule.commission_percentage}
                  onChange={(e) => setEditingRule({ 
                    ...editingRule, 
                    commission_percentage: Number(e.target.value) 
                  })}
                  placeholder="Enter commission percentage"
                />
              </div>
              <div>
                <Label htmlFor="edit_description">Description</Label>
                <Input
                  id="edit_description"
                  value={editingRule.description}
                  onChange={(e) => setEditingRule({ ...editingRule, description: e.target.value })}
                  placeholder="Describe this commission rule"
                />
              </div>
              <div className="flex space-x-2">
                <Button onClick={() => handleUpdateRule(editingRule)} className="flex-1">
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={() => {
                    handleDeleteRule(editingRule.id);
                    setEditingRule(null);
                  }}
                >
                  Delete Rule
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default JBCommissionManagement;