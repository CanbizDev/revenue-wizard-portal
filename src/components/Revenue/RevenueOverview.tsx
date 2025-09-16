import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DollarSign, TrendingUp, AlertTriangle, CheckCircle, Download } from 'lucide-react';
import { apiService, RevenueData } from '@/services/api';

interface BillingRecord {
  client_name: string;
  invoice_id: string;
  bill_amount: number;
  due_date: string;
  payment_date?: string;
  status: 'Paid' | 'Pending' | 'Overdue';
  tier: string;
}

const RevenueOverview: React.FC = () => {
  const [revenueData, setRevenueData] = useState<RevenueData | null>(null);
  const [filteredData, setFilteredData] = useState<BillingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<string>('all');

  // Load billing data from API
  const loadBillingData = async () => {
    try {
      setLoading(true);
      // Get current user data to get the tier1 seller ID
      const currentUser = apiService.getCurrentUser();
      const tier1Id = currentUser?.id;
      
      console.log('Current user for revenue:', currentUser);
      console.log('Tier1 ID for revenue request:', tier1Id);
      
      if (!tier1Id) {
        console.error('No tier1 seller ID found');
        return;
      }
      
      console.log('Making revenue API call with tier1Id:', tier1Id);
      const data = await apiService.getRevenueData(tier1Id);
      console.log('Revenue data received:', data);
      setRevenueData(data);
    } catch (error) {
      console.error('Failed to load billing data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Apply filters to billing records
  const applyFilters = () => {
    if (!revenueData || !revenueData.billing_details || !Array.isArray(revenueData.billing_details)) {
      setFilteredData([]);
      return;
    }
    
    let filtered = [...revenueData.billing_details];

    // Additional tier1 filtering (as backup if backend doesn't filter properly)
    const currentUser = apiService.getCurrentUser();
    const currentTier1Id = currentUser?.id;
    console.log('Frontend filtering - Current tier1 ID:', currentTier1Id);
    
    if (currentTier1Id && filtered.length > 0) {
      // If the backend didn't filter properly, we'll filter here
      // This assumes there might be a tier1_id field in the billing records
      console.log('Sample billing record:', filtered[0]);
    }

    // Apply project filter
    if (selectedProject !== 'all') {
      filtered = filtered.filter(record => record.client_name.toLowerCase().includes(selectedProject.toLowerCase()));
    }

    console.log('Filtered billing data:', filtered);
    setFilteredData(filtered);
  };

  // Load data on component mount
  useEffect(() => {
    loadBillingData();
  }, []);

  // Apply filters when data or filter settings change
  useEffect(() => {
    applyFilters();
  }, [revenueData, selectedProject]);

  // Utility functions for formatting and styling
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending': return <TrendingUp className="h-4 w-4 text-yellow-600" />;
      case 'overdue': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return null;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatAmount = (amount: number, symbol: string = '$') => {
    return `${symbol}${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  };

  // Calculate totals from filtered data
  const totals = filteredData.reduce((acc, record) => ({
    totalBilled: acc.totalBilled + record.bill_amount,
    totalPaid: acc.totalPaid + (record.status === 'Paid' ? record.bill_amount : 0),
    totalPending: acc.totalPending + (record.status !== 'Paid' ? record.bill_amount : 0)
  }), { totalBilled: 0, totalPaid: 0, totalPending: 0 });

  const uniqueClients = [...new Set(revenueData?.billing_details?.map(b => b.client_name) || [])];

  if (loading) {
    return (
      <div className="space-y-6">
        <div>Loading...</div>
      </div>
    );
  }

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
          <label className="text-sm font-medium">Filter by Client:</label>
          <Select value={selectedProject} onValueChange={setSelectedProject}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Clients</SelectItem>
              {uniqueClients.map((client) => (
                <SelectItem key={client} value={client}>
                  {client}
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
                <TableHead>Client Name</TableHead>
                <TableHead>Invoice ID</TableHead>
                <TableHead>Total Billing</TableHead>
                <TableHead>Paid Amount</TableHead>
                <TableHead>Pending Amount</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Payment Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((record, index) => (
                <TableRow key={`${record.invoice_id}-${index}`}>
                  <TableCell className="font-medium">{record.client_name}</TableCell>
                  <TableCell className="font-mono text-sm">{record.invoice_id}</TableCell>
                  <TableCell>${record.bill_amount.toLocaleString()}</TableCell>
                  <TableCell className="text-green-600 font-medium">
                    ${record.status === 'Paid' ? record.bill_amount.toLocaleString() : '0'}
                  </TableCell>
                  <TableCell className="text-orange-600 font-medium">
                    ${record.status !== 'Paid' ? record.bill_amount.toLocaleString() : '0'}
                  </TableCell>
                  <TableCell>{formatDate(record.due_date)}</TableCell>
                  <TableCell>{record.payment_date ? formatDate(record.payment_date) : '-'}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(record.status)}
                      <Badge className={getStatusColor(record.status)}>
                        {record.status}
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

export default RevenueOverview;