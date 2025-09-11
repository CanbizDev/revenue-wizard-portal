import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { apiService, RevenueData } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { 
  DollarSign, 
  TrendingUp, 
  Clock, 
  CheckCircle,
  AlertCircle,
  ArrowUpDown,
  Filter
} from 'lucide-react';

interface BillingRecord {
  id: string;
  client_name: string;
  invoice_id: string;
  bill_amount: number;
  due_date: string;
  payment_status: 'paid' | 'pending' | 'overdue';
  payment_date?: string;
  tier: 'tier1' | 'tier2';
  currency_symbol: string;
}

const RevenueOverview: React.FC = () => {
  const [revenueData, setRevenueData] = useState<RevenueData | null>(null);
  const [filteredData, setFilteredData] = useState<BillingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'due_date' | 'bill_amount'>('due_date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const { toast } = useToast();


  useEffect(() => {
    loadBillingData();
  }, []);

  useEffect(() => {
    applyFiltersAndSort();
  }, [revenueData, statusFilter, sortBy, sortOrder]);

  const loadBillingData = async () => {
    try {
      setLoading(true);
      const data = await apiService.getRevenueData();
      setRevenueData(data);
    } catch (error: any) {
      console.error('Error loading revenue data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load revenue data',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndSort = () => {
    if (!revenueData) return;
    
    let filtered = [...revenueData.billing_records];

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(record => record.payment_status === statusFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      if (sortBy === 'due_date') {
        aValue = new Date(a.due_date).getTime();
        bValue = new Date(b.due_date).getTime();
      } else {
        aValue = a.bill_amount;
        bValue = b.bill_amount;
      }

      if (sortOrder === 'asc') {
        return aValue - bValue;
      } else {
        return bValue - aValue;
      }
    });

    setFilteredData(filtered);
  };

  const toggleSort = (column: 'due_date' | 'bill_amount') => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'overdue':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="h-4 w-4" />;
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'overdue':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const summary = revenueData?.summary || {
    total_bills: 0,
    total_paid: 0,
    total_pending: 0,
    total_amount: 0,
    paid_amount: 0
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatAmount = (amount: number, symbol: string) => {
    return `${symbol}${amount.toLocaleString('en-IN')}`;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-gray-200 rounded-lg animate-pulse" />
          ))}
        </div>
        <div className="h-96 bg-gray-200 rounded-lg animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Revenue Overview</h2>
        <p className="text-gray-600">Track billing and payment status across all clients</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <DollarSign className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Bills</p>
                <p className="text-xl font-bold text-gray-900">{summary.total_bills}</p>
                <p className="text-xs text-gray-500">₹{summary.total_amount.toLocaleString('en-IN')} total value</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Paid Bills</p>
                <p className="text-xl font-bold text-gray-900">{summary.total_paid}</p>
                <p className="text-xs text-gray-500">₹{summary.paid_amount.toLocaleString('en-IN')} collected</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Pending Bills</p>
                <p className="text-xl font-bold text-gray-900">{summary.total_pending}</p>
                <p className="text-xs text-gray-500">₹{(summary.total_amount - summary.paid_amount).toLocaleString('en-IN')} outstanding</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Billing Details</span>
            </CardTitle>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client Name</TableHead>
                  <TableHead>Invoice ID</TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      className="h-auto p-0 font-medium"
                      onClick={() => toggleSort('bill_amount')}
                    >
                      Bill Amount
                      <ArrowUpDown className="ml-1 h-3 w-3" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      className="h-auto p-0 font-medium"
                      onClick={() => toggleSort('due_date')}
                    >
                      Due Date
                      <ArrowUpDown className="ml-1 h-3 w-3" />
                    </Button>
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment Date</TableHead>
                  <TableHead>Tier</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">{record.client_name}</TableCell>
                    <TableCell className="font-mono text-sm">{record.invoice_id}</TableCell>
                    <TableCell className="font-semibold">
                      {formatAmount(record.bill_amount, record.currency_symbol)}
                    </TableCell>
                    <TableCell>{formatDate(record.due_date)}</TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={`flex items-center space-x-1 ${getStatusColor(record.payment_status)}`}
                      >
                        {getStatusIcon(record.payment_status)}
                        <span className="capitalize">{record.payment_status}</span>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {record.payment_date ? formatDate(record.payment_date) : '-'}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={record.tier === 'tier1' ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700'}>
                        {record.tier === 'tier1' ? 'Tier-1' : 'Tier-2'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {filteredData.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                {statusFilter === 'all' ? 'No billing records found.' : `No ${statusFilter} bills found.`}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RevenueOverview;