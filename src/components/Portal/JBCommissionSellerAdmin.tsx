import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { DollarSign, Save } from 'lucide-react';

// Mock data for tier2 seller projects
const mockTier2Projects = [
  {
    id: '1',
    projectName: 'E-commerce Analytics',
    tier2SellerName: 'TechSolutions Ltd',
    tier2SellerId: 'ts001',
    clientName: 'RetailCorp',
    commissionReceived: 15000,
    projectValue: 100000,
    status: 'active',
    startDate: '2024-01-15',
  },
  {
    id: '2',
    projectName: 'Marketing Dashboard',
    tier2SellerName: 'DataViz Pro',
    tier2SellerId: 'dv002',
    clientName: 'MarketingInc',
    commissionReceived: 22500,
    projectValue: 150000,
    status: 'completed',
    startDate: '2024-02-01',
  },
  {
    id: '3',
    projectName: 'Financial Reports',
    tier2SellerName: 'TechSolutions Ltd',
    tier2SellerId: 'ts001',
    clientName: 'FinanceGroup',
    commissionReceived: 18000,
    projectValue: 120000,
    status: 'active',
    startDate: '2024-02-15',
  },
  {
    id: '4',
    projectName: 'Inventory Tracking',
    tier2SellerName: 'DataViz Pro',
    tier2SellerId: 'dv002',
    clientName: 'WarehouseCorp',
    commissionReceived: 12000,
    projectValue: 80000,
    status: 'active',
    startDate: '2024-03-01',
  },
];

const JBCommissionSellerAdmin: React.FC = () => {
  const [jbCommissionPercentage, setJbCommissionPercentage] = useState<string>('10');
  const { toast } = useToast();

  const handleSaveCommission = () => {
    console.log('Saving JB commission percentage:', jbCommissionPercentage);
    toast({
      title: "Commission Percentage Updated",
      description: `JB commission percentage set to ${jbCommissionPercentage}%`,
    });
  };

  const totalCommissionReceived = mockTier2Projects.reduce(
    (sum, project) => sum + project.commissionReceived,
    0
  );

  const calculatedJBCommission = (totalCommissionReceived * parseFloat(jbCommissionPercentage || '0')) / 100;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Commission (For JB)</h2>
        <p className="text-gray-600">
          Manage commission percentage for JB and view tier-2 seller project commissions
        </p>
      </div>

      {/* Commission Percentage Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            JB Commission Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="jb-commission">Commission % (For JB)</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  id="jb-commission"
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={jbCommissionPercentage}
                  onChange={(e) => setJbCommissionPercentage(e.target.value)}
                  placeholder="Enter percentage"
                />
                <Button onClick={handleSaveCommission} size="sm">
                  <Save className="h-4 w-4 mr-1" />
                  Save
                </Button>
              </div>
            </div>
            <div>
              <Label>Total Commission Received</Label>
              <div className="text-2xl font-bold text-green-600 mt-1">
                ₹{totalCommissionReceived.toLocaleString()}
              </div>
            </div>
            <div>
              <Label>Calculated JB Commission</Label>
              <div className="text-2xl font-bold text-blue-600 mt-1">
                ₹{calculatedJBCommission.toLocaleString()}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tier-2 Seller Projects Table */}
      <Card>
        <CardHeader>
          <CardTitle>Tier-2 Seller Projects & Commissions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project Name</TableHead>
                <TableHead>Tier-2 Seller</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Project Value</TableHead>
                <TableHead>Commission Received</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Start Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockTier2Projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="font-medium">{project.projectName}</TableCell>
                  <TableCell>{project.tier2SellerName}</TableCell>
                  <TableCell>{project.clientName}</TableCell>
                  <TableCell>₹{project.projectValue.toLocaleString()}</TableCell>
                  <TableCell className="font-semibold text-green-600">
                    ₹{project.commissionReceived.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge variant={project.status === 'active' ? 'default' : 'secondary'}>
                      {project.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(project.startDate).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockTier2Projects.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Active Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {mockTier2Projects.filter(p => p.status === 'active').length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Unique Tier-2 Sellers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {new Set(mockTier2Projects.map(p => p.tier2SellerId)).size}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default JBCommissionSellerAdmin;