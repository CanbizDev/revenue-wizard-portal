import React, { useState, useEffect } from 'react';
import { FileText, CheckCircle, Clock, AlertCircle, TrendingUp, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { apiService, RevenueData } from '@/services/api';

interface DirectRevenueRecord {
  client_name: string;
  invoice_id: string;
  project_value: number;
  commission_percentage: number;
  commission_amount: number;
  due_date: string;
  payment_date?: string;
  status: 'Paid' | 'Pending' | 'Overdue';
  seller_name?: string;
}

interface IndirectRevenueRecord {
  client_name: string;
  invoice_id: string;
  project_value: number;
  tier1_commission_amount: number;
  admin_commission_amount: number;
  due_date: string;
  payment_date?: string;
  status: 'Paid' | 'Pending' | 'Overdue';
  tier1_seller_name?: string;
  tier2_seller_name?: string;
}

const RevenueOverview: React.FC = () => {
  const [revenueData, setRevenueData] = useState<RevenueData | null>(null);
  const [directRevenue, setDirectRevenue] = useState<DirectRevenueRecord[]>([]);
  const [indirectRevenue, setIndirectRevenue] = useState<IndirectRevenueRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Load billing data from API
  const loadBillingData = async () => {
    try {
      setLoading(true);
      const data = await apiService.getRevenueData();
      setRevenueData(data);
      
      // Set direct and indirect revenue data
      setDirectRevenue(data.direct_revenue_details || []);
      setIndirectRevenue(data.indirect_revenue_details || []);
    } catch (error) {
      console.error('Failed to load billing data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    loadBillingData();
  }, []);

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

  // Loading state with skeletons
  if (loading) {
    return <div>Loading billing data...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Revenue Overview</h2>

      <Tabs defaultValue="direct-revenue" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="direct-revenue">Direct Revenue (Tier-1 Projects)</TabsTrigger>
          <TabsTrigger value="indirect-revenue">Indirect Revenue (Tier-2 Projects)</TabsTrigger>
        </TabsList>

        {/* Tab 1: Direct Revenue from Tier-1 Projects */}
        <TabsContent value="direct-revenue">
          <Card>
            <CardHeader><CardTitle>Direct Revenue - Commission from Tier-1 Sellers</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Project</TableHead>
                    <TableHead>Seller</TableHead>
                    <TableHead>Invoice</TableHead>
                    <TableHead>Project Value</TableHead>
                    <TableHead>Commission %</TableHead>
                    <TableHead>Commission Amount</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Payment Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {directRevenue.map((record, index) => (
                    <TableRow key={`direct-${index}`}>
                      <TableCell>{record.client_name}</TableCell>
                      <TableCell>{record.seller_name || 'N/A'}</TableCell>
                      <TableCell>{record.invoice_id || '-'}</TableCell>
                      <TableCell>₹{record.project_value?.toLocaleString()}</TableCell>
                      <TableCell>{record.commission_percentage}%</TableCell>
                      <TableCell>₹{record.commission_amount?.toLocaleString()}</TableCell>
                      <TableCell>{record.due_date || '-'}</TableCell>
                      <TableCell>{record.payment_date || '-'}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(record.status)}>
                          {getStatusIcon(record.status)} {record.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Indirect Revenue from Tier-2 Projects */}
        <TabsContent value="indirect-revenue">
          <Card>
            <CardHeader><CardTitle>Indirect Revenue - Commission from Tier-2 Sellers</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Project</TableHead>
                    <TableHead>Tier-1 Seller</TableHead>
                    <TableHead>Tier-2 Seller</TableHead>
                    <TableHead>Invoice</TableHead>
                    <TableHead>Project Value</TableHead>
                    <TableHead>Tier-1 Commission</TableHead>
                    <TableHead>Admin Commission</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Payment Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {indirectRevenue.map((record, index) => (
                    <TableRow key={`indirect-${index}`}>
                      <TableCell>{record.client_name}</TableCell>
                      <TableCell>{record.tier1_seller_name || 'N/A'}</TableCell>
                      <TableCell>{record.tier2_seller_name || 'N/A'}</TableCell>
                      <TableCell>{record.invoice_id || '-'}</TableCell>
                      <TableCell>₹{record.project_value?.toLocaleString()}</TableCell>
                      <TableCell>₹{record.tier1_commission_amount?.toLocaleString()}</TableCell>
                      <TableCell>₹{record.admin_commission_amount?.toLocaleString()}</TableCell>
                      <TableCell>{record.due_date || '-'}</TableCell>
                      <TableCell>{record.payment_date || '-'}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(record.status)}>
                          {getStatusIcon(record.status)} {record.status}
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

export default RevenueOverview;