import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Header from '@/components/Layout/Header';
import Sidebar from '@/components/Layout/Sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import DashboardCard from '@/components/Dashboard/DashboardCard';
import AddSellerForm from '@/components/Forms/AddSellerForm';
import AddTier2SellerForm from '@/components/Forms/AddTier2SellerForm';
import RevenueOverview from '@/components/Revenue/RevenueOverview';
import ServiceControlPanel from '@/components/Portal/ServiceControlPanel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import { apiService, type DashboardData } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { 
  Users, 
  Building2, 
  DollarSign, 
  TrendingUp,
  UserPlus,
  Settings,
  BarChart3
} from 'lucide-react';

const AdminPortal: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAddSellerOpen, setIsAddSellerOpen] = useState(false);
  const [isAddTier2SellerOpen, setIsAddTier2SellerOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const mockUser = {
    name: 'Admin User',
    email: 'admin@jupiterbrains.com',
    role: 'JB Administrator',
    company: 'JupiterBrains'
  };

  // Fetch admin dashboard data using React Query
  const { data: dashboardData, isLoading, error } = useQuery<DashboardData>({
    queryKey: ['adminDashboard'],
    queryFn: apiService.getAdminDashboardData,
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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">JB Admin Dashboard</h2>
          <p className="text-gray-600">Overview of the entire ReportingPortal.ai ecosystem</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <DashboardCard
            title="Total Clients"
            value={dashboardData?.metrics.total_clients || 0}
            description="Active customers"
            icon={Users}
            trend={{ value: dashboardData?.metrics.growth_rate || 0, isPositive: true }}
          />
          <DashboardCard
            title="Active Projects"
            value={dashboardData?.metrics.active_projects || 0}
            description="Running projects"
            icon={Building2}
            trend={{ value: 8, isPositive: true }}
          />
          <DashboardCard
            title="Monthly Revenue"
            value={`₹${(dashboardData?.metrics.monthly_revenue || 0).toLocaleString()}`}
            description="Total platform revenue"
            icon={DollarSign}
            trend={{ value: 23, isPositive: true }}
          />
          <DashboardCard
            title="Growth Rate"
            value={`${dashboardData?.metrics.growth_rate || 0}%`}
            description="Monthly growth"
            icon={TrendingUp}
            trend={{ value: dashboardData?.metrics.growth_rate || 0, isPositive: true }}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>Revenue Growth</span>
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
              <CardTitle>Recent Activities</CardTitle>
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

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'tier1-sellers':
        return <div className="p-8 text-center text-gray-500">Tier-1 Sellers management - API integration pending</div>;
      case 'tier2-sellers':
        return <div className="p-8 text-center text-gray-500">Tier-2 Sellers management - API integration pending</div>;
      case 'revenue':
        return <RevenueOverview />;
      case 'settings':
        return <ServiceControlPanel />;
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <Header portalType="admin" user={mockUser} onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex-1 flex relative">
        <Sidebar 
          portalType="admin" 
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
      
      <AddSellerForm
        isOpen={isAddSellerOpen}
        onClose={() => setIsAddSellerOpen(false)}
        onSuccess={() => {}}
      />
      
      <AddTier2SellerForm
        isOpen={isAddTier2SellerOpen}
        onClose={() => setIsAddTier2SellerOpen(false)}
        onSuccess={() => {}}
      />
    </div>
  );
};

export default AdminPortal;