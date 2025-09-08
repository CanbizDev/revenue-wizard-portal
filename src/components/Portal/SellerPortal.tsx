import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Header from '@/components/Layout/Header';
import Sidebar from '@/components/Layout/Sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import DashboardCard from '@/components/Dashboard/DashboardCard';
import CommissionsView from '@/components/Portal/CommissionsView';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import { apiService, type DashboardData } from '@/services/api';
import { 
  Users, 
  DollarSign, 
  FileText, 
  TrendingUp,
  UserPlus,
  Building2
} from 'lucide-react';

const SellerPortal: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userRole] = useState<'tier1_seller' | 'tier2_seller'>('tier1_seller');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();

  const mockUser = {
    name: 'Seller Admin',
    email: 'admin@marketstrendai.com',
    role: 'Tier-1 Seller',
    company: 'MarketsTriendAI'
  };

  // Fetch seller dashboard data using React Query
  const { data: dashboardData, isLoading, error } = useQuery<DashboardData>({
    queryKey: ['sellerDashboard'],
    queryFn: apiService.getSellerDashboardData,
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
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Seller Dashboard</h2>
          <p className="text-gray-600">Welcome back, {mockUser.name}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <DashboardCard
            title="Total Clients"
            value={dashboardData?.metrics.total_clients || 0}
            description="Active customers"
            icon={Users}
            trend={{ value: dashboardData?.metrics.growth_rate || 0, isPositive: true }}
          />
          {userRole === 'tier1_seller' && (
            <DashboardCard
              title="Tier-2 Sellers"
              value={0}
              description="Under your management"
              icon={Building2}
              trend={{ value: 0, isPositive: true }}
            />
          )}
          <DashboardCard
            title="Monthly Revenue"
            value={`₹${(dashboardData?.metrics.monthly_revenue || 0).toLocaleString()}`}
            description="This month's earnings"
            icon={DollarSign}
            trend={{ value: 15, isPositive: true }}
          />
          <DashboardCard
            title="Active Projects"
            value={dashboardData?.metrics.active_projects || 0}
            description="Currently running"
            icon={FileText}
            trend={{ value: 12, isPositive: true }}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>Revenue Trends</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                <p className="text-gray-500">Revenue chart placeholder</p>
              </div>
            </CardContent>
          </Card>

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
        </div>
      </div>
    );
  };

  const renderClients = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">My Clients</h2>
          <p className="text-gray-600">Manage your client relationships</p>
        </div>
        <Button className="flex items-center space-x-2 w-full sm:w-auto">
          <UserPlus className="h-4 w-4" />
          <span>Add New Client</span>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Client List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            Client management - API integration pending
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'clients':
        return renderClients();
      case 'commissions':
        return <div className="p-8 text-center text-gray-500">Commissions - API integration pending</div>;
      case 'tier2-sellers':
        return userRole === 'tier1_seller' ? 
          <div className="p-8 text-center text-gray-500">Tier-2 Sellers management - API integration pending</div> : 
          renderDashboard();
      case 'billing':
        return <div className="p-8 text-center text-gray-500">Billing & Revenue - API integration pending</div>;
      case 'reports':
        return <div className="p-8 text-center text-gray-500">Reports management - API integration pending</div>;
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <Header portalType="seller" user={mockUser} onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex-1 flex relative">
        <Sidebar 
          portalType="seller" 
          userRole={userRole}
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

export default SellerPortal;