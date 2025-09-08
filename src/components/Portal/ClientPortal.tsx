import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Header from '@/components/Layout/Header';
import Sidebar from '@/components/Layout/Sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import { apiService, type DashboardData } from '@/services/api';
import ClientProjectDashboard from '@/components/Portal/ClientProjectDashboard';
import ClientUserManagement from '@/components/Portal/ClientUserManagement';
import ClientBilling from '@/components/Portal/ClientBilling';
import {
  FileText,
  Download,
  Calendar,
  DollarSign,
  Users,
  BarChart3
} from 'lucide-react';

interface ClientPortalProps {
  client?: string;
  onNavigate?: (path: string) => void;
  activeTab?: string;
}

const ClientPortal: React.FC<ClientPortalProps> = ({ 
  client = 'defaultclient', 
  onNavigate, 
  activeTab: propActiveTab 
}) => {
  const [activeTab, setActiveTab] = useState(propActiveTab || 'dashboard');
  const [userRole] = useState<'admin' | 'viewer'>('admin');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();

  const mockUser = {
    name: 'Client Admin',
    email: 'admin@client.com',
    role: 'Client Administrator',
    company: client
  };

  // Fetch client dashboard data using React Query
  const { data: dashboardData, isLoading, error } = useQuery<DashboardData>({
    queryKey: ['clientDashboard'],
    queryFn: apiService.getClientDashboardData,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const renderDashboard = () => {
    if (isLoading) {
      return (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading dashboard data...</span>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">Failed to load dashboard data</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Client Portal</h2>
            <p className="text-gray-600">Welcome to your analytics dashboard</p>
          </div>
          <Button className="flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Download Reports</span>
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Projects</p>
                  <p className="text-2xl font-bold text-gray-900">{dashboardData?.metrics.active_projects || 0}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Clients</p>
                  <p className="text-2xl font-bold text-gray-900">{dashboardData?.metrics.total_clients || 0}</p>
                </div>
                <Users className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">₹{(dashboardData?.metrics.monthly_revenue || 0).toLocaleString()}</p>
                </div>
                <DollarSign className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Reports Available</p>
                  <p className="text-2xl font-bold text-gray-900">12</p>
                </div>
                <FileText className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardData?.recent_activity?.slice(0, 3).map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                      <p className="text-xs text-gray-500">{activity.type} • {new Date(activity.timestamp).toLocaleDateString()}</p>
                    </div>
                    <Badge variant="secondary">
                      {activity.type}
                    </Badge>
                  </div>
                )) || (
                  <div className="text-center py-8 text-gray-500">
                    No recent activities
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Upcoming Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Monthly Analytics Report</p>
                    <p className="text-xs text-gray-500">Due in 3 days</p>
                  </div>
                  <Badge variant="outline">Pending</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Quarterly Review</p>
                    <p className="text-xs text-gray-500">Due in 10 days</p>
                  </div>
                  <Badge variant="outline">Scheduled</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  const renderReports = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Reports</h2>
        <p className="text-gray-600">Access and download your analytics reports</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Available Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            Reports section - API integration pending
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'projects':
        return <ClientProjectDashboard client={client || 'defaultclient'} />;
      case 'reports':
        return renderReports();
      case 'users':
        return <ClientUserManagement />;
      case 'billing':
        return <ClientBilling client={client || 'defaultclient'} />;
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <Header portalType="client" user={mockUser} onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex-1 flex relative">
        <Sidebar 
          portalType="client" 
          activeTab={activeTab} 
          onTabChange={setActiveTab}
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
        />
        <main className={cn(
          "flex-1 p-4 sm:p-6 bg-gray-50 overflow-auto",
          isMobile ? "w-full" : "ml-0"
        )}>
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default ClientPortal;