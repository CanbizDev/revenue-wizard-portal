import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import MetricCard from './MetricCard';
import { apiService, BillingSummary, DashboardData } from '@/services/api';
import { DollarSign, Users, TrendingUp, Calendar, Plus, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const SellerDashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [billingData, setBillingData] = useState<BillingSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [dashboard, billing] = await Promise.all([
        apiService.getSellerDashboard(),
        apiService.getBillingSummary()
      ]);
      setDashboardData(dashboard);
      setBillingData(billing);
    } catch (error) {
      toast({
        title: "Error loading dashboard",
        description: "Failed to load dashboard data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const getProjectStatusColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getPaymentStatusBadge = (paid: number, total: number) => {
    const percentage = (paid / total) * 100;
    if (percentage === 100) return <Badge variant="default" className="bg-green-100 text-green-800">Paid</Badge>;
    if (percentage > 0) return <Badge variant="secondary">Partial</Badge>;
    return <Badge variant="destructive">Pending</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Seller Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's an overview of your business.
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Eye className="mr-2 h-4 w-4" />
            View Reports
          </Button>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Client
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      {billingData && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Total Revenue"
            value={billingData.billing_summary.total_revenue}
            format="currency"
            icon={DollarSign}
            change={{ value: 12.5, period: "last month" }}
          />
          <MetricCard
            title="Total Paid"
            value={billingData.billing_summary.total_paid}
            format="currency"
            icon={TrendingUp}
            change={{ value: 8.3, period: "last month" }}
          />
          <MetricCard
            title="Pending Amount"
            value={billingData.billing_summary.total_pending}
            format="currency"
            icon={Calendar}
            change={{ value: -5.2, period: "last month" }}
          />
          <MetricCard
            title="Collection Rate"
            value={billingData.billing_summary.collection_rate}
            format="percentage"
            icon={Users}
            change={{ value: 2.1, period: "last month" }}
          />
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {/* Active Projects */}
        <Card>
          <CardHeader>
            <CardTitle>Active Projects</CardTitle>
            <CardDescription>
              Current project status and completion rates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {billingData?.projects.map((project, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{project.project_name}</p>
                      <p className="text-sm text-muted-foreground">{project.client_company}</p>
                    </div>
                    <Badge variant="outline">
                      {project.completion_percentage}%
                    </Badge>
                  </div>
                  <Progress 
                    value={project.completion_percentage} 
                    className="h-2"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Billed: ${project.total_billed.toLocaleString()}</span>
                    <span>Paid: ${project.paid_amount.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Billing Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest billing and project updates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData?.recent_activity?.slice(0, 5).map((activity) => (
                <div key={activity.id} className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(activity.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Client Overview Table */}
      <Card>
        <CardHeader>
          <CardTitle>Client Overview</CardTitle>
          <CardDescription>
            All clients and their project status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Billing</TableHead>
                <TableHead>Payment</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {billingData?.projects.map((project, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    {project.client_company}
                  </TableCell>
                  <TableCell>{project.project_name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">Active</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Progress value={project.completion_percentage} className="w-16 h-2" />
                      <span className="text-sm">{project.completion_percentage}%</span>
                    </div>
                  </TableCell>
                  <TableCell>${project.total_billed.toLocaleString()}</TableCell>
                  <TableCell>
                    {getPaymentStatusBadge(project.paid_amount, project.total_billed)}
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

export default SellerDashboard;