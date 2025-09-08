import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import MetricCard from './MetricCard';
import { apiService, DashboardData } from '@/services/api';
import { FileText, Calendar, Download, DollarSign, CheckCircle, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ClientDashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Mock client-specific data
  const [clientData] = useState({
    projects: [
      {
        id: '1',
        name: 'Forte Market Analysis',
        status: 'In Progress',
        completion: 75,
        deadline: '2024-02-15',
        description: 'Comprehensive market research and competitive analysis'
      },
      {
        id: '2',
        name: 'Brand Positioning Study',
        status: 'Review',
        completion: 90,
        deadline: '2024-01-30',
        description: 'Strategic brand positioning and messaging framework'
      }
    ],
    billing: {
      current_balance: 2500.00,
      total_paid: 15000.00,
      next_payment_due: '2024-02-01',
      next_payment_amount: 2500.00
    },
    reports: [
      {
        id: '1',
        title: 'Q4 Market Research Report',
        date: '2024-01-15',
        status: 'Ready',
        size: '2.3 MB'
      },
      {
        id: '2',
        title: 'Competitive Analysis',
        date: '2024-01-10',
        status: 'Ready',
        size: '1.8 MB'
      },
      {
        id: '3',
        title: 'Monthly Analytics Summary',
        date: '2024-01-05',
        status: 'Ready',
        size: '945 KB'
      }
    ]
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const dashboard = await apiService.getClientDashboardData();
      setDashboardData(dashboard);
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

  const getProjectStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Review': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Client Portal</h1>
          <p className="text-muted-foreground">
            Track your projects, reports, and billing information.
          </p>
        </div>
        <Button size="sm">
          <Download className="mr-2 h-4 w-4" />
          Download Reports
        </Button>
      </div>

      {/* Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Active Projects"
          value={clientData.projects.length}
          icon={FileText}
        />
        <MetricCard
          title="Current Balance"
          value={clientData.billing.current_balance}
          format="currency"
          icon={DollarSign}
        />
        <MetricCard
          title="Total Paid"
          value={clientData.billing.total_paid}
          format="currency"
          icon={CheckCircle}
        />
        <MetricCard
          title="Reports Available"
          value={clientData.reports.length}
          icon={Calendar}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Project Status */}
        <Card>
          <CardHeader>
            <CardTitle>Project Status</CardTitle>
            <CardDescription>
              Current progress on your active projects
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {clientData.projects.map((project) => (
                <div key={project.id} className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium">{project.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {project.description}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Due: {new Date(project.deadline).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge className={getProjectStatusColor(project.status)}>
                      {project.status}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{project.completion}%</span>
                    </div>
                    <Progress value={project.completion} className="h-2" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Billing Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Billing Overview</CardTitle>
            <CardDescription>
              Your account balance and payment information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium">Current Balance</p>
                  <p className="text-sm text-muted-foreground">Amount due</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold">
                    ${clientData.billing.current_balance.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Next Payment</p>
                  <p className="text-sm text-muted-foreground">
                    Due {new Date(clientData.billing.next_payment_due).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold">
                    ${clientData.billing.next_payment_amount.toLocaleString()}
                  </p>
                  <Badge variant="outline" className="text-orange-600">
                    <Clock className="mr-1 h-3 w-3" />
                    Upcoming
                  </Badge>
                </div>
              </div>

              <div className="pt-2">
                <Button className="w-full">Make Payment</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reports Section */}
      <Card>
        <CardHeader>
          <CardTitle>Available Reports</CardTitle>
          <CardDescription>
            Download your completed reports and deliverables
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Report</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clientData.reports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span>{report.title}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(report.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      {report.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {report.size}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
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

export default ClientDashboard;