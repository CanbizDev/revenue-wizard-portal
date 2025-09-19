import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { DollarSign, TrendingUp, AlertTriangle, CheckCircle, Download, Search, Filter, Loader2 } from 'lucide-react';
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
  clientName: string;
  projectValue: number;
  commissionPercentage: number;
}

const ClientBilling: React.FC<{ client: string }> = ({ client }) => {
  const [selectedProject, setSelectedProject] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [billingData, setBillingData] = useState<ProjectBilling[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const loadBillingData = async () => {
      try {
        setLoading(true);
        const data = await apiService.getProjectBilling(client);
        setBillingData(data);
      } catch (err) {
        console.error('Failed to load billing data:', err);
        setError('Failed to load billing data');
      } finally {
        setLoading(false);
      }
    };

    loadBillingData();
  }, [client]);
  const projectBillings = billingData;

  // Filter billings based on selections
  const filteredBillings = projectBillings.filter(billing => {
    const matchesProject = selectedProject === 'all' || billing.projectName === selectedProject;
    const matchesStatus = statusFilter === 'all' || billing.status === statusFilter;
    const matchesSearch = searchTerm === '' || 
      billing.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      billing.invoiceId.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesProject && matchesStatus && matchesSearch;
  });

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

  // Calculate totals for filtered data
  const totals = filteredBillings.reduce((acc, billing) => ({
    totalBilled: acc.totalBilled + billing.totalBilling,
    totalPaid: acc.totalPaid + billing.paidAmount,
    totalPending: acc.totalPending + billing.pendingAmount
  }), { totalBilled: 0, totalPaid: 0, totalPending: 0 });

  const uniqueProjects = [...new Set(projectBillings.map(b => b.projectName))];
  const statuses = ['all', 'paid', 'pending', 'overdue'];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin mr-3" />
          <span className="text-muted-foreground">Loading billing data...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-destructive mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Billing Overview</h2>
          <p className="text-muted-foreground">Track billing and payments for {client} projects</p>
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
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="flex items-center space-x-2 flex-1">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by project name or invoice ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-xs"
              />
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <label className="text-sm font-medium">Project:</label>
                <Select value={selectedProject} onValueChange={setSelectedProject}>
                  <SelectTrigger className="w-40">
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

              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium">Status:</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Project Billing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBillings.map((billing) => (
          <Card key={billing.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold text-foreground">
                    {billing.projectName}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">{billing.invoiceId}</p>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(billing.status)}
                  <Badge className={getStatusColor(billing.status)}>
                    {billing.status.charAt(0).toUpperCase() + billing.status.slice(1)}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total Billing:</span>
                  <span className="font-semibold">${billing.totalBilling.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Paid Amount:</span>
                  <span className="font-semibold text-green-600">${billing.paidAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Pending:</span>
                  <span className="font-semibold text-orange-600">${billing.pendingAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Due Date:</span>
                  <span className="font-medium">{billing.dueDate}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Last Payment:</span>
                  <span className="font-medium">{billing.lastPayment}</span>
                </div>
              </div>
              
              <div className="flex space-x-2 pt-2">
                <Button size="sm" variant="outline" className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button size="sm" variant="outline">
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Billing Table */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Billing History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project Name</TableHead>
                <TableHead>Invoice ID</TableHead>
                <TableHead>Project Value</TableHead>
                <TableHead>Commission %</TableHead>
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
                  <TableCell>₹{billing.projectValue?.toLocaleString() || 'N/A'}</TableCell>
                  <TableCell>{billing.commissionPercentage || 'N/A'}%</TableCell>
                  <TableCell>₹{(billing.projectValue * (billing.commissionPercentage / 100)) || billing.totalBilling.toLocaleString()}</TableCell>
                  <TableCell className="text-green-600 font-medium">
                    ₹{billing.paidAmount.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-orange-600 font-medium">
                    ₹{billing.pendingAmount.toLocaleString()}
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

export default ClientBilling;