import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DollarSign, TrendingUp, AlertTriangle, CheckCircle, Download } from 'lucide-react';
import { apiService } from '@/services/api';

interface ProjectBilling {
  id: string;
  projectName: string;
  totalBilling: number;
  paidAmount: number;
  pendingAmount: number;
  lastPayment: string;
  status: 'paid' | 'pending' | 'overdue';
  invoiceId: string;
  dueDate: string;
  projectValue: number;
  adminCommissionPercentage: number;
  tier1CommissionPercentage: number;
}

const ProjectBillingTier1: React.FC = () => {
  const [selectedTier1Project, setSelectedTier1Project] = useState<string>('all');
  const [selectedTier2Project, setSelectedTier2Project] = useState<string>('all');
  const [tier1OwnProjects, setTier1OwnProjects] = useState<ProjectBilling[]>([]);
  const [tier2SellerProjects, setTier2SellerProjects] = useState<ProjectBilling[]>([]);

  useEffect(() => {
    const fetchBilling = async () => {
      try {
        // Fetch Tier1's own projects
        const tier1Res = await apiService.getRevenueData();
        const tier1Transformed = tier1Res.billing_details.map((bill: any, idx: number) => ({
          id: String(idx),
          projectName: bill.client_name,
          totalBilling: bill.bill_amount,
          paidAmount: bill.status.toLowerCase() === 'paid' ? bill.bill_amount : 0,
          pendingAmount: bill.status.toLowerCase() !== 'paid' ? bill.bill_amount : 0,
          lastPayment: bill.payment_date || '-',
          status: bill.status.toLowerCase(),
          invoiceId: bill.invoice_id,
          dueDate: bill.due_date || '-',
          projectValue: bill.project_value || 0,
          adminCommissionPercentage: bill.admin_commission_percentage || 0,
          tier1CommissionPercentage: bill.tier1_commission_percentage || 0
        }));
        setTier1OwnProjects(tier1Transformed);

        // Fetch Tier2 seller projects (commission for Tier1)
        // TODO: Replace with actual API call when available
        // For now, using mock data structure
        const tier2Mock = tier1Res.billing_details.map((bill: any, idx: number) => ({
          id: String(idx + 100),
          projectName: `Tier2 - ${bill.client_name}`,
          totalBilling: bill.bill_amount,
          paidAmount: bill.status.toLowerCase() === 'paid' ? bill.bill_amount : 0,
          pendingAmount: bill.status.toLowerCase() !== 'paid' ? bill.bill_amount : 0,
          lastPayment: bill.payment_date || '-',
          status: bill.status.toLowerCase(),
          invoiceId: `T2-${bill.invoice_id}`,
          dueDate: bill.due_date || '-',
          projectValue: bill.project_value || 0,
          adminCommissionPercentage: 0,
          tier1CommissionPercentage: bill.tier1_commission_percentage || 15
        }));
        setTier2SellerProjects(tier2Mock);
      } catch (err) {
        console.error('Error fetching billing:', err);
      }
    };
    fetchBilling();
  }, []);

  const filteredTier1Projects =
    selectedTier1Project === 'all'
      ? tier1OwnProjects
      : tier1OwnProjects.filter(b =>
          b.projectName.toLowerCase().includes(selectedTier1Project.toLowerCase())
        );

  const filteredTier2Projects =
    selectedTier2Project === 'all'
      ? tier2SellerProjects
      : tier2SellerProjects.filter(b =>
          b.projectName.toLowerCase().includes(selectedTier2Project.toLowerCase())
        );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending': return <TrendingUp className="h-4 w-4 text-yellow-600" />;
      case 'overdue': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return null;
    }
  };

  const uniqueTier1Projects = [...new Set(tier1OwnProjects.map(b => b.projectName))];
  const uniqueTier2Projects = [...new Set(tier2SellerProjects.map(b => b.projectName))];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Project Billing</h2>

      <Tabs defaultValue="tier1-projects" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="tier1-projects">My Projects (Admin Commission)</TabsTrigger>
          <TabsTrigger value="tier2-projects">Tier-2 Seller Projects (My Commission)</TabsTrigger>
        </TabsList>

        {/* Tier1 Own Projects Tab */}
        <TabsContent value="tier1-projects" className="space-y-4">
          <div className="flex items-center space-x-4">
            <label>Filter by Project:</label>
            <Select value={selectedTier1Project} onValueChange={setSelectedTier1Project}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Projects</SelectItem>
                {uniqueTier1Projects.map(project => (
                  <SelectItem key={project} value={project}>{project}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>My Project Billing Details - Admin Commission</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Project</TableHead>
                    <TableHead>Invoice</TableHead>
                    <TableHead>Project Value</TableHead>
                    <TableHead>Admin Commission %</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Due</TableHead>
                    <TableHead>Last Payment</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTier1Projects.map(billing => (
                    <TableRow key={billing.id}>
                      <TableCell>{billing.projectName}</TableCell>
                      <TableCell>{billing.invoiceId}</TableCell>
                      <TableCell>₹{billing.projectValue?.toLocaleString() || 'N/A'}</TableCell>
                      <TableCell>{billing.adminCommissionPercentage || 'N/A'}%</TableCell>
                      <TableCell>₹{(billing.projectValue * (billing.adminCommissionPercentage / 100))?.toLocaleString() || billing.totalBilling?.toLocaleString()}</TableCell>
                      <TableCell>{billing.dueDate}</TableCell>
                      <TableCell>{billing.lastPayment}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(billing.status)}>
                          {getStatusIcon(billing.status)} {billing.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tier2 Seller Projects Tab */}
        <TabsContent value="tier2-projects" className="space-y-4">
          <div className="flex items-center space-x-4">
            <label>Filter by Project:</label>
            <Select value={selectedTier2Project} onValueChange={setSelectedTier2Project}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Projects</SelectItem>
                {uniqueTier2Projects.map(project => (
                  <SelectItem key={project} value={project}>{project}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Tier-2 Seller Projects - My Commission</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Project</TableHead>
                    <TableHead>Invoice</TableHead>
                    <TableHead>Project Value</TableHead>
                    <TableHead>My Commission %</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Due</TableHead>
                    <TableHead>Last Payment</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTier2Projects.map(billing => (
                    <TableRow key={billing.id}>
                      <TableCell>{billing.projectName}</TableCell>
                      <TableCell>{billing.invoiceId}</TableCell>
                      <TableCell>₹{billing.projectValue?.toLocaleString() || 'N/A'}</TableCell>
                      <TableCell>{billing.tier1CommissionPercentage || 'N/A'}%</TableCell>
                      <TableCell>₹{(billing.projectValue * (billing.tier1CommissionPercentage / 100))?.toLocaleString() || billing.totalBilling?.toLocaleString()}</TableCell>
                      <TableCell>{billing.dueDate}</TableCell>
                      <TableCell>{billing.lastPayment}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(billing.status)}>
                          {getStatusIcon(billing.status)} {billing.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProjectBillingTier1;