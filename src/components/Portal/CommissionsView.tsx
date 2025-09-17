import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { DollarSign, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import { mockDashboardData } from '@/services/mockData';
import { useState, useEffect } from 'react';

interface CommissionsViewProps {
  userRole: 'tier1_seller' | 'tier2_seller';
  company: 'marketstrendai' | 'tier2seller';
}

const CommissionsView: React.FC<CommissionsViewProps> = ({ userRole, company }) => {
  const [commissions, setCommissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock commission data since API is not available
    const mockCommissions = [
      {
        id: '1',
        amount: 15000,
        commission_amount: 2250,
        type: 'client_payment',
        status: 'paid',
        transaction_date: new Date().toISOString(),
        clients: { name: 'John Smith', company: 'TechCorp' }
      },
      {
        id: '2',
        amount: 8000,
        commission_amount: 1200,
        type: 'client_payment',
        status: 'pending',
        transaction_date: new Date().toISOString(),
        clients: { name: 'Sarah Johnson', company: 'DataFlow Inc' }
      }
    ];
    
    setTimeout(() => {
      setCommissions(mockCommissions);
      setLoading(false);
    }, 1000);
  }, [company]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Calculate commission summary from real data
  const commissionSummary = {
    totalEarned: commissions.reduce((sum, c) => sum + c.commission_amount, 0),
    amountDue: commissions.filter(c => c.status === 'pending').reduce((sum, c) => sum + c.commission_amount, 0),
    thisMonth: commissions
      .filter(c => new Date(c.transaction_date).getMonth() === new Date().getMonth())
      .reduce((sum, c) => sum + c.commission_amount, 0),
    pendingPayouts: commissions.filter(c => c.status === 'pending').length
  };

  const recentCommissions = commissions.slice(0, 10).map(commission => ({
    id: commission.id,
    client: commission.clients?.name || 'Unknown Client',
    company: commission.clients?.company || 'Unknown Company',
    amount: commission.amount,
    commission: commission.commission_amount,
    type: commission.type === 'client_payment' ? 'Client Payment' : 'Tier-2 Commission',
    status: commission.status === 'paid' ? 'Paid' : 'Pending',
    date: new Date(commission.transaction_date).toLocaleDateString()
  }));

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Commission Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Earned</p>
                <p className="text-2xl font-bold">₹{commissionSummary.totalEarned.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Amount Due</p>
                <p className="text-2xl font-bold">₹{commissionSummary.amountDue.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">This Month</p>
                <p className="text-2xl font-bold">₹{commissionSummary.thisMonth.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Pending Payouts</p>
                <p className="text-2xl font-bold">{commissionSummary.pendingPayouts}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Commission History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Commission</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentCommissions.map((commission) => (
                <TableRow key={commission.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{commission.client}</div>
                      <div className="text-sm text-muted-foreground">{commission.company}</div>
                    </div>
                  </TableCell>
                  <TableCell>{commission.type}</TableCell>
                  <TableCell>₹{commission.amount.toLocaleString()}</TableCell>
                  <TableCell>₹{commission.commission.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant={commission.status === 'Paid' ? 'default' : 'secondary'}>
                      {commission.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{commission.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {recentCommissions.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No commission data available yet.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CommissionsView;