import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
    clientName: 'RetailCorp',
    commissionReceived: 15000,
    jbCommissionPercentage: 10,
  },
  {
    id: '2',
    projectName: 'Marketing Dashboard',
    tier2SellerName: 'DataViz Pro',
    clientName: 'MarketingInc',
    commissionReceived: 22500,
    jbCommissionPercentage: 10,
  },
  {
    id: '3',
    projectName: 'Financial Reports',
    tier2SellerName: 'TechSolutions Ltd',
    clientName: 'FinanceGroup',
    commissionReceived: 18000,
    jbCommissionPercentage: 10,
  },
  {
    id: '4',
    projectName: 'Inventory Tracking',
    tier2SellerName: 'DataViz Pro',
    clientName: 'WarehouseCorp',
    commissionReceived: 12000,
    jbCommissionPercentage: 10,
  },
];

const JBCommissionSellerAdmin: React.FC = () => {
  const [projects, setProjects] = useState(mockTier2Projects);
  const { toast } = useToast();

  const handleCommissionChange = (projectId: string, percentage: string) => {
    setProjects(prev => prev.map(project => 
      project.id === projectId 
        ? { ...project, jbCommissionPercentage: parseFloat(percentage) || 0 }
        : project
    ));
  };

  const handleSaveCommission = (projectId: string) => {
    console.log('Saving commission for project:', projectId);
    toast({
      title: "Commission Updated",
      description: "Commission percentage has been saved.",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Commission (For JB)</h2>
        <p className="text-gray-600">
          Set commission percentage for JB on each tier-2 seller project
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Tier-2 Seller Projects & Commission Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project Name</TableHead>
                <TableHead>Tier-2 Seller</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Commission Received</TableHead>
                <TableHead>Commission % (For JB)</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="font-medium">{project.projectName}</TableCell>
                  <TableCell>{project.tier2SellerName}</TableCell>
                  <TableCell>{project.clientName}</TableCell>
                  <TableCell className="font-semibold text-green-600">
                    ₹{project.commissionReceived.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={project.jbCommissionPercentage}
                      onChange={(e) => handleCommissionChange(project.id, e.target.value)}
                      className="w-20"
                    />
                  </TableCell>
                  <TableCell>
                    <Button 
                      onClick={() => handleSaveCommission(project.id)}
                      size="sm"
                    >
                      <Save className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default JBCommissionSellerAdmin;