import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button'; // Import Button
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, AlertTriangle, TrendingUp } from 'lucide-react';
import { apiService } from '@/services/api';
import PaymentModal from '@/components/Revenue/PaymentModal'; // Corrected path
import { useNavigate } from 'react-router-dom';

interface ProjectBilling {
  id: string;
  projectName: string;
  projectValue: number;
  // My Commission (Tier 1's commission from Tier 2)
  tier1CommissionPercentage: number | null;
  tier1CommissionAmount: number;
  // Admin Commission (what Tier 1 owes to Admin)
  adminCommissionPercentage: number | null;
  adminCommissionAmount: number;
  status: 'paid' | 'pending' | 'overdue' | 'invoiced';
  invoiceId: string | null;
  dueDate: string | null;
  lastPayment: string | null;
  // Added for payment modal
  totalBilling?: number;
}

const ProjectBillingTier1: React.FC = () => {
  // State for the three different data sets
  const [myProjectsBilling, setMyProjectsBilling] = useState<ProjectBilling[]>(
    []
  );
  const [tier2MyCommission, setTier2MyCommission] = useState<ProjectBilling[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  // State for Payment Modal
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<ProjectBilling | null>(
    null
  );
  const navigate = useNavigate();

  const fetchBilling = useCallback(async () => {
    try {
      setLoading(true);
      const res = await apiService.getRevenueData();

      // Data for "My Projects" tab
      const myProjectsTransformed = (res.tier1_project_billing || []).map(
        (bill: any, idx: number) => ({
          id: bill.invoice_id || `t1-${idx}`, // Use actual invoice ID if available
          projectName: bill.client_name,
          projectValue: bill.project_value || 0,
          tier1CommissionPercentage: null,
          tier1CommissionAmount: 0,
          adminCommissionPercentage: bill.commission_percentage || null,
          adminCommissionAmount: bill.commission_amount || 0,
          status: bill.status.toLowerCase(),
          invoiceId: bill.invoice_id,
          dueDate: bill.due_date,
          lastPayment: bill.payment_date,
          totalBilling: bill.commission_amount || 0, // Pass amount to modal
        })
      );
      setMyProjectsBilling(myProjectsTransformed);

      // Data for the two "Tier-2 Seller" tabs
      const tier2Transformed = (res.tier2_project_billing || []).map(
        (bill: any, idx: number) => ({
          id: bill.invoice_id || `t2-${idx}`,
          projectName: bill.client_name,
          projectValue: bill.project_value || 0,
          tier1CommissionPercentage: bill.commission_percentage || null,
          tier1CommissionAmount: bill.commission_amount || 0,
          adminCommissionPercentage: bill.admin_commission_percentage || null,
          adminCommissionAmount: bill.admin_commission_amount || 0,
          status: bill.status.toLowerCase(),
          invoiceId: bill.invoice_id,
          dueDate: bill.due_date,
          lastPayment: bill.payment_date,
        })
      );
      setTier2MyCommission(tier2Transformed);
    } catch (err) {
      console.error('Error fetching billing:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBilling();
  }, [fetchBilling]);

  // --- Handlers for Payment Flow ---
  const handlePayNow = (invoice: ProjectBilling) => {
    setSelectedInvoice(invoice);
    setIsPaymentModalOpen(true);
  };

  const handlePaymentSuccess = () => {
    fetchBilling(); // Refresh the billing data
    navigate('/payment-success');
  };
  // --- End of Payment Flow Handlers ---

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'invoiced':
        return 'bg-blue-100 text-blue-800';
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
      case 'invoiced':
        return <TrendingUp className="h-4 w-4 text-blue-600" />;
      case 'overdue':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  if (loading) return <div>Loading billing data...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Project Billing</h2>

      <Tabs defaultValue="my-projects" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="my-projects">My Projects</TabsTrigger>
          <TabsTrigger value="tier2-my-commission">
            Tier-2 Projects (My Commission)
          </TabsTrigger>
          <TabsTrigger value="tier2-admin-commission">
            Tier-2 Projects (Admin Commission)
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: My Projects (Commission to Admin) */}
        <TabsContent value="my-projects">
          <Card>
            <CardHeader>
              <CardTitle>My Projects - Commission to Admin</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Project</TableHead>
                    <TableHead>Invoice</TableHead>
                    <TableHead>Plan Price</TableHead>
                    <TableHead>Admin Commission %</TableHead>
                    <TableHead>Amount to Pay</TableHead>
                    <TableHead>Due</TableHead>
                    <TableHead>Last Payment</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead> {/* New Table Head */}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {myProjectsBilling.map(bill => (
                    <TableRow key={bill.id}>
                      <TableCell>{bill.projectName}</TableCell>
                      <TableCell>{bill.invoiceId || '-'}</TableCell>
                      <TableCell>
                        ₹{bill.projectValue?.toLocaleString()}
                      </TableCell>
                      <TableCell>{bill.adminCommissionPercentage}%</TableCell>
                      <TableCell>
                        ₹{bill.adminCommissionAmount?.toLocaleString()}
                      </TableCell>
                      <TableCell>{bill.dueDate || '-'}</TableCell>
                      <TableCell>{bill.lastPayment || '-'}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(bill.status)}>
                          {getStatusIcon(bill.status)} {bill.status}
                        </Badge>
                      </TableCell>
                      {/* --- New Table Cell with Pay Now Button --- */}
                      <TableCell>
                        {bill.status.toLowerCase() !== 'paid' && (
                          <Button size="sm" onClick={() => handlePayNow(bill)}>
                            Pay Now
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Tier-2 Projects (My Commission) */}
        <TabsContent value="tier2-my-commission">
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
                    <TableHead>Plan Price</TableHead>
                    <TableHead>My Commission %</TableHead>
                    <TableHead>Amount Earned</TableHead>
                    <TableHead>Due</TableHead>
                    <TableHead>Last Payment</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tier2MyCommission.map(bill => (
                    <TableRow key={bill.id}>
                      <TableCell>{bill.projectName}</TableCell>
                      <TableCell>{bill.invoiceId || '-'}</TableCell>
                      <TableCell>
                        ₹{bill.projectValue?.toLocaleString()}
                      </TableCell>
                      <TableCell>{bill.tier1CommissionPercentage}%</TableCell>
                      <TableCell>
                        ₹{bill.tier1CommissionAmount?.toLocaleString()}
                      </TableCell>
                      <TableCell>{bill.dueDate || '-'}</TableCell>
                      <TableCell>{bill.lastPayment || '-'}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(bill.status)}>
                          {getStatusIcon(bill.status)} {bill.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Tier-2 Projects (Admin Commission) */}
        <TabsContent value="tier2-admin-commission">
          <Card>
            <CardHeader>
              <CardTitle>Tier-2 Seller Projects - Admin Commission</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Project</TableHead>
                    <TableHead>My Commission %</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Admin Commission %</TableHead>
                    <TableHead>Amount to be Paid</TableHead>
                    <TableHead>Due</TableHead>
                    <TableHead>Last Payment</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tier2MyCommission.map(bill => (
                    <TableRow key={bill.id}>
                      <TableCell>{bill.projectName}</TableCell>
                      <TableCell>{bill.tier1CommissionPercentage}%</TableCell>
                      <TableCell>
                        ₹{bill.tier1CommissionAmount?.toLocaleString()}
                      </TableCell>
                      <TableCell>{bill.adminCommissionPercentage}%</TableCell>
                      <TableCell>
                        ₹{bill.adminCommissionAmount?.toLocaleString()}
                      </TableCell>
                      <TableCell>{bill.dueDate || '-'}</TableCell>
                      <TableCell>{bill.lastPayment || '-'}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(bill.status)}>
                          {getStatusIcon(bill.status)} {bill.status}
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

      {/* --- Payment Modal --- */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        invoice={
          selectedInvoice
            ? {
                id: selectedInvoice.id,
                invoiceId: selectedInvoice.invoiceId || '',
                totalBilling: selectedInvoice.totalBilling || 0,
              }
            : null
        }
        onPaymentSuccess={handlePaymentSuccess}
      />
    </div>
  );
};

export default ProjectBillingTier1;