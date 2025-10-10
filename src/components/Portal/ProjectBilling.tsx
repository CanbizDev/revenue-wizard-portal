import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { apiService } from '@/services/api';
import PaymentModal from '@/components/Revenue/PaymentModal'; // Ensure this path is correct
import { useNavigate } from 'react-router-dom';

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
  const [loading, setLoading] = useState(true);

  // --- State for Payment Modal ---
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<ProjectBilling | null>(
    null
  );
  const navigate = useNavigate();

  // --- Extracted fetchBilling function ---
  const fetchBilling = useCallback(async () => {
    try {
      setLoading(true);
      const res = await apiService.getRevenueData();
      const transformed = res.billing_details.map(
        (bill: any, idx: number) => {
          // CHANGE 1: Calculate the correct bill amount here
          const projectValue = bill.project_value || 0;
          const commissionPercentage = bill.commission_percentage || 0;
          const calculatedAmount = projectValue * (commissionPercentage / 100);
          const finalBillAmount = calculatedAmount || bill.bill_amount || 0; // Use calculated amount, fallback to API amount

          return {
            id: bill.invoice_id || String(idx),
            projectName: bill.client_name,
            totalBilling: finalBillAmount, // Use the CORRECT amount
            paidAmount:
              bill.status.toLowerCase() === 'paid' ? finalBillAmount : 0,
            pendingAmount:
              bill.status.toLowerCase() !== 'paid' ? finalBillAmount : 0,
            lastPayment: bill.payment_date || '-',
            status: bill.status.toLowerCase(),
            invoiceId: bill.invoice_id,
            dueDate: bill.due_date || '-',
            projectValue: projectValue,
            commissionPercentage: commissionPercentage,
          };
        }
      );
      setBillingData(transformed);
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
    fetchBilling(); // Refresh the data
    navigate('/payment-success');
  };
  // --- End of Payment Flow Handlers ---

  const filteredBillings =
    selectedProject === 'all'
      ? billingData
      : billingData.filter(b =>
          b.projectName.toLowerCase().includes(selectedProject.toLowerCase())
        );

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

  const uniqueProjects = [...new Set(billingData.map(b => b.projectName))];

  if (loading) return <div>Loading billing data...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Project Billing</h2>

      <div className="flex items-center space-x-4">
        <label>Filter by Project:</label>
        <Select value={selectedProject} onValueChange={setSelectedProject}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Projects</SelectItem>
            {uniqueProjects.map(project => (
              <SelectItem key={project} value={project}>
                {project}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

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
                  <TableCell>
                    ₹{billing.projectValue?.toLocaleString() || 'N/A'}
                  </TableCell>
                  <TableCell>
                    {billing.commissionPercentage || 'N/A'}%
                  </TableCell>
                  {/* CHANGE 2: Display the stored totalBilling value directly */}
                  <TableCell>
                    ₹{billing.totalBilling.toLocaleString()}
                  </TableCell>
                  <TableCell>{billing.dueDate}</TableCell>
                  <TableCell>{billing.lastPayment}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(billing.status)}>
                      {getStatusIcon(billing.status)} {billing.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {billing.status.toLowerCase() !== 'paid' && (
                      <Button size="sm" onClick={() => handlePayNow(billing)}>
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

      {/* --- Payment Modal --- */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        invoice={
          selectedInvoice
            ? {
                id: selectedInvoice.id,
                invoiceId: selectedInvoice.invoiceId,
                totalBilling: selectedInvoice.totalBilling, // This will now have the correct value
              }
            : null
        }
        onPaymentSuccess={handlePaymentSuccess}
      />
    </div>
  );
};

export default ProjectBilling;