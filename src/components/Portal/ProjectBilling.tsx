import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DollarSign, TrendingUp, AlertTriangle, CheckCircle, Download } from 'lucide-react';
import { apiService } from '@/services/api';
import { Elements } from '@stripe/react-stripe-js';
import { stripePromise } from '@/lib/stripe';
import { PaymentModal } from '@/components/Payment/PaymentModal';

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
  commissionPercentage: number;
}

const ProjectBilling: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<string>('all');
  const [billingData, setBillingData] = useState<ProjectBilling[]>([]);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<{ id: string; number: string; amount: number } | null>(null);

  useEffect(() => {
    const fetchBilling = async () => {
      try {
        const res = await apiService.getRevenueData(); // 👈 call your API
        const transformed = res.billing_details.map((bill: any, idx: number) => ({
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
          commissionPercentage: bill.commission_percentage || 0
        }));
        setBillingData(transformed);
      } catch (err) {
        console.error('Error fetching billing:', err);
      }
    };
    fetchBilling();
  }, []);

  const filteredBillings =
    selectedProject === 'all'
      ? billingData
      : billingData.filter(b =>
          b.projectName.toLowerCase().includes(selectedProject.toLowerCase())
        );

  // status helpers
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

  const uniqueProjects = [...new Set(billingData.map(b => b.projectName))];

  const handlePayNow = (billing: ProjectBilling) => {
    const amountInCents = Math.round((billing.projectValue * (billing.commissionPercentage / 100)) * 100);
    setSelectedInvoice({
      id: billing.invoiceId,
      number: billing.invoiceId,
      amount: amountInCents,
    });
    setPaymentModalOpen(true);
  };

  const handlePaymentModalClose = () => {
    setPaymentModalOpen(false);
    setSelectedInvoice(null);
    // Refresh billing data
    const fetchBilling = async () => {
      try {
        const res = await apiService.getRevenueData();
        const transformed = res.billing_details.map((bill: any, idx: number) => ({
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
          commissionPercentage: bill.commission_percentage || 0
        }));
        setBillingData(transformed);
      } catch (err) {
        console.error('Error fetching billing:', err);
      }
    };
    fetchBilling();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Project Billing</h2>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <label>Filter by Project:</label>
        <Select value={selectedProject} onValueChange={setSelectedProject}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Projects</SelectItem>
            {uniqueProjects.map(project => (
              <SelectItem key={project} value={project}>{project}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Project Billing Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project</TableHead>
                <TableHead>Invoice</TableHead>
                <TableHead>Project Value</TableHead>
                <TableHead>Commission %</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Due</TableHead>
                <TableHead>Last Payment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBillings.map(billing => (
                <TableRow key={billing.id}>
                  <TableCell>{billing.projectName}</TableCell>
                  <TableCell>{billing.invoiceId}</TableCell>
                  <TableCell>₹{billing.projectValue?.toLocaleString() || 'N/A'}</TableCell>
                  <TableCell>{billing.commissionPercentage || 'N/A'}%</TableCell>
                  <TableCell>₹{(billing.projectValue * (billing.commissionPercentage / 100)) || billing.totalBilling}</TableCell>
                  <TableCell>{billing.dueDate}</TableCell>
                  <TableCell>{billing.lastPayment}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(billing.status)}>
                      {getStatusIcon(billing.status)} {billing.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {billing.status !== 'paid' && (
                      <Button 
                        size="sm" 
                        onClick={() => handlePayNow(billing)}
                      >
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

      {/* Payment Modal */}
      <Elements stripe={stripePromise}>
        {selectedInvoice && (
          <PaymentModal
            isOpen={paymentModalOpen}
            onClose={handlePaymentModalClose}
            invoiceId={selectedInvoice.id}
            invoiceNumber={selectedInvoice.number}
            amount={selectedInvoice.amount}
          />
        )}
      </Elements>
    </div>
  );
};

export default ProjectBilling;
