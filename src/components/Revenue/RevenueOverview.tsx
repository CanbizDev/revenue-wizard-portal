import React, { useState, useEffect } from 'react';
import { FileText, CheckCircle, Clock, AlertCircle, ArrowUpDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import MetricCard from '../Dashboard/MetricCard';
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
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortField, setSortField] = useState<'bill_amount' | 'due_date'>('due_date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Load billing data from API
  const loadBillingData = async () => {
    try {
      setLoading(true);
      const data = await apiService.getRevenueData();
      setRevenueData(data);
    } catch (error) {
      console.error('Failed to load billing data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Apply filters and sorting to billing records
  const applyFiltersAndSort = () => {
    if (!revenueData || !revenueData.billing_details || !Array.isArray(revenueData.billing_details)) {
      setFilteredData([]);
      return;
    }
    
    let filtered = [...revenueData.billing_details];

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(record => record.status.toLowerCase() === statusFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      // Handle date sorting
      if (sortField === 'due_date') {
        aValue = new Date(aValue as string).getTime();
        bValue = new Date(bValue as string).getTime();
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredData(filtered);
  };

  // Handle sort column toggle
  const toggleSort = (field: 'bill_amount' | 'due_date') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Load data on component mount
  useEffect(() => {
    loadBillingData();
  }, []);

  // Apply filters when data or filter settings change
  useEffect(() => {
    applyFiltersAndSort();
  }, [revenueData, statusFilter, sortField, sortOrder]);

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
      case 'paid': return CheckCircle;
      case 'pending': return Clock;
      case 'overdue': return AlertCircle;
      default: return AlertCircle;
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

  // Loading state with skeletons
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-48" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          title="Total Bills"
          value={revenueData?.summary?.total_bills || 0}
          icon={FileText}
        />
        <MetricCard
          title="Paid Bills"
          value={revenueData?.summary?.paid_bills || 0}
          icon={CheckCircle}
        />
        <MetricCard
          title="Pending Bills"
          value={revenueData?.summary?.pending_bills || 0}
          icon={Clock}
        />
      </div>

      {/* Billing Records Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle className="text-lg font-semibold">Billing Records</CardTitle>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
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
        <CardContent>
          {filteredData.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Project Name</TableHead>
                    <TableHead>Invoice ID</TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 font-semibold"
                        onClick={() => toggleSort('bill_amount')}
                      >
                        Amount
                        <ArrowUpDown className="ml-1 h-3 w-3" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 font-semibold"
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
                  {filteredData.map((record, index) => (
                    <TableRow key={`${record.invoice_id}-${index}`}>
                      <TableCell className="font-medium">{record.client_name}</TableCell>
                      <TableCell className="font-mono text-sm">{record.invoice_id}</TableCell>
                      <TableCell className="font-semibold">
                        {formatAmount(record.bill_amount, '$')}
                      </TableCell>
                      <TableCell>{formatDate(record.due_date)}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(record.status)}`}>
                          {record.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        {record.payment_date ? formatDate(record.payment_date) : '-'}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {record.tier}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <FileText className="mx-auto h-12 w-12 mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">No billing records found</p>
              <p className="text-sm">
                {statusFilter !== 'all' 
                  ? `No records match the "${statusFilter}" status filter.`
                  : 'There are no billing records to display at this time.'
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RevenueOverview;