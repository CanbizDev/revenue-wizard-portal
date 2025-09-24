import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  DollarSign, 
  Building2, 
  TrendingUp,
  Save
} from 'lucide-react';

const JBCommissionTier1: React.FC = () => {
  const [jbCommissionPercentage, setJbCommissionPercentage] = useState('15');
  const { toast } = useToast();

  // Mock data for projects from tier2 sellers
  const tier2Projects = [
    {
      id: '1',
      projectName: 'Market Analysis Dashboard',
      tier2SellerName: 'Analytics Pro',
      clientName: 'TechCorp Solutions',
      commissionReceived: 25000,
      status: 'active',
      startDate: '2024-01-15',
    },
    {
      id: '2',
      projectName: 'Financial Reporting System',
      tier2SellerName: 'DataFlow Inc',
      clientName: 'FinanceHub Ltd',
      commissionReceived: 18500,
      status: 'completed',
      startDate: '2024-02-10',
    },
    {
      id: '3',
      projectName: 'Customer Analytics Portal',
      tier2SellerName: 'InsightTech',
      clientName: 'RetailMax',
      commissionReceived: 32000,
      status: 'active',
      startDate: '2024-03-05',
    },
    {
      id: '4',
      projectName: 'Supply Chain Optimization',
      tier2SellerName: 'Analytics Pro',
      clientName: 'LogiFlow Corp',
      commissionReceived: 28750,
      status: 'active',
      startDate: '2024-03-20',
    },
  ];

  const totalCommissionReceived = tier2Projects.reduce((sum, project) => sum + project.commissionReceived, 0);

  const handleSaveCommissionPercentage = () => {
    toast({
      title: 'Success',
      description: `JB Commission percentage updated to ${jbCommissionPercentage}%`
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Commission (For JB)</h2>
        <p className="text-gray-600">Manage commissions from Tier-2 seller projects and set JB commission percentage</p>
      </div>

      {/* JB Commission Percentage Setting */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <DollarSign className="h-5 w-5" />
            <span>JB Commission Percentage</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end space-x-4">
            <div className="flex-1 max-w-xs">
              <Label htmlFor="jb-commission">Commission Percentage for JB (%)</Label>
              <Input
                id="jb-commission"
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={jbCommissionPercentage}
                onChange={(e) => setJbCommissionPercentage(e.target.value)}
                className="mt-1"
              />
            </div>
            <Button onClick={handleSaveCommissionPercentage} className="flex items-center space-x-2">
              <Save className="h-4 w-4" />
              <span>Save</span>
            </Button>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Current JB commission rate: {jbCommissionPercentage}%
          </p>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Projects</p>
                <p className="text-2xl font-bold text-gray-900">{tier2Projects.length}</p>
              </div>
              <Building2 className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Commission Received</p>
                <p className="text-2xl font-bold text-gray-900">₹{totalCommissionReceived.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Estimated JB Commission</p>
                <p className="text-2xl font-bold text-gray-900">
                  ₹{Math.round(totalCommissionReceived * (parseFloat(jbCommissionPercentage) / 100)).toLocaleString()}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Projects List */}
      <Card>
        <CardHeader>
          <CardTitle>Projects from Tier-2 Sellers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tier2Projects.map((project) => (
              <div key={project.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border border-gray-200 rounded-lg space-y-3 sm:space-y-0">
                <div className="flex-1">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Building2 className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{project.projectName}</h3>
                      <p className="text-sm text-gray-600">Tier-2 Seller: {project.tier2SellerName}</p>
                      <p className="text-sm text-gray-500">Client: {project.clientName}</p>
                      <p className="text-xs text-gray-400">Started: {new Date(project.startDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6 text-sm text-gray-600 w-full sm:w-auto justify-between sm:justify-end">
                  <div className="text-center">
                    <p className="font-medium text-green-600">₹{project.commissionReceived.toLocaleString()}</p>
                    <p className="text-xs">Commission Received</p>
                  </div>
                  <div className="text-center">
                    <p className="font-medium text-purple-600">
                      ₹{Math.round(project.commissionReceived * (parseFloat(jbCommissionPercentage) / 100)).toLocaleString()}
                    </p>
                    <p className="text-xs">JB Commission ({jbCommissionPercentage}%)</p>
                  </div>
                  <Badge 
                    variant={project.status === 'active' ? 'default' : 'secondary'}
                    className={project.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
                  >
                    {project.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default JBCommissionTier1;