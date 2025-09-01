import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DollarSign, TrendingUp, AlertTriangle, CheckCircle, Download } from 'lucide-react';

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
}

const ProjectBilling: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<string>('all');
  
  const projectBillings: ProjectBilling[] = [
    {
      id: '1',
      projectName: 'MarketTrendsAI Core',
      totalBilling: 25000,
      paidAmount: 20000,
      pendingAmount: 5000,
      lastPayment: '2024-01-15',
      status: 'pending',
      invoiceId: 'INV-2024-001',
      dueDate: '2024-02-15'
    },
    {
      id: '2',
      projectName: 'Margin Analytics',
      totalBilling: 18000,
      paidAmount: 18000,
      pendingAmount: 0,
      lastPayment: '2024-01-10',
      status: 'paid',
      invoiceId: 'INV-2024-002',
      dueDate: '2024-01-31'
    },
    {
      id: '3',
      projectName: 'Cementech Solutions',
      totalBilling: 30000,
      paidAmount: 25000,
      pendingAmount: 5000,
      lastPayment: '2023-12-20',
      status: 'overdue',
      invoiceId: 'INV-2024-003',
      dueDate: '2024-01-20'
    },
    {
      id: '4',
      projectName: 'PPI Platform',
      totalBilling: 22000,
      paidAmount: 22000,
      pendingAmount: 0,
      lastPayment: '2024-01-08',
      status: 'paid',
      invoiceId: 'INV-2024-004',
      dueDate: '2024-01-25'
    }
  ];

  const filteredBillings = selectedProject === 'all' 
    ? projectBillings 
    : projectBillings.filter(billing => billing.projectName.toLowerCase().includes(selectedProject.toLowerCase()));

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending':
        return <TrendingUp className="h-4 w-4 text-yellow-600" />;
      case 'overdue':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  // Calculate totals
  const totals = filteredBillings.reduce((acc, billing) => ({
    totalBilled: acc.totalBilled + billing.totalBilling,
    totalPaid: acc.totalPaid + billing.paidAmount,
    totalPending: acc.totalPending + billing.pendingAmount
  }), { totalBilled: 0, totalPaid: 0, totalPending: 0 });

  const uniqueProjects = [...new Set(projectBillings.map(b => b.projectName))];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Project Billing</h2>
          <p className="text-muted-foreground">Track billing and payments across all projects</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Billed</p>
                <p className="text-2xl font-bold text-foreground">${totals.totalBilled.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Paid</p>
                <p className="text-2xl font-bold text-green-600">${totals.totalPaid.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Pending</p>
                <p className="text-2xl font-bold text-orange-600">${totals.totalPending.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium">Filter by Project:</label>
          <Select value={selectedProject} onValueChange={setSelectedProject}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              {uniqueProjects.map((project) => (
                <SelectItem key={project} value={project}>
                  {project}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Billing Table */}
      <Card>
        <CardHeader>
          <CardTitle>Project Billing Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project Name</TableHead>
                <TableHead>Invoice ID</TableHead>
                <TableHead>Total Billing</TableHead>
                <TableHead>Paid Amount</TableHead>
                <TableHead>Pending Amount</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Last Payment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBillings.map((billing) => (
                <TableRow key={billing.id}>
                  <TableCell className="font-medium">{billing.projectName}</TableCell>
                  <TableCell className="font-mono text-sm">{billing.invoiceId}</TableCell>
                  <TableCell>${billing.totalBilling.toLocaleString()}</TableCell>
                  <TableCell className="text-green-600 font-medium">
                    ${billing.paidAmount.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-orange-600 font-medium">
                    ${billing.pendingAmount.toLocaleString()}
                  </TableCell>
                  <TableCell>{billing.dueDate}</TableCell>
                  <TableCell>{billing.lastPayment}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(billing.status)}
                      <Badge className={getStatusColor(billing.status)}>
                        {billing.status.charAt(0).toUpperCase() + billing.status.slice(1)}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
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

export default ProjectBilling;