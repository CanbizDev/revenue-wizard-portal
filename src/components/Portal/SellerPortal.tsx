
import React, { useState } from 'react';
import Header from '@/components/Layout/Header';
import Sidebar from '@/components/Layout/Sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import DashboardCard from '@/components/Dashboard/DashboardCard';
import CommissionsView from '@/components/Portal/CommissionsView';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { apiService } from '@/services/api';
import { mockSellerData } from '@/services/mockData';
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

  // Get real data from database
  // Mock data setup
  const sellerData = mockSellerData;
  const clients: any[] = [];
  const commissions: any[] = [];
  const loading = false;

  const getUser = () => {
    if (!sellerData) {
      return {
        name: 'Loading...',
        email: 'loading@example.com',
        role: 'Loading...',
        company: 'Loading...'
      };
    }
    return {
      name: `${sellerData.name} Admin`,
      email: sellerData.admin_email,
      role: userRole === 'tier1_seller' ? 'Tier-1 Seller' : 'Tier-2 Seller',
      company: sellerData.name
    };
  };

  const mockUser = getUser();

  const renderDashboard = () => {
    if (loading) {
      return (
        <div className="flex h-64 items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      );
    }

    // Mock data for tier1 seller metrics
    const totalTier2Sellers = 5;
    const totalProjects = 12;
    const monthlyRevenue = 150000;

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Seller Dashboard</h2>
          <p className="text-gray-600">Welcome back, {mockUser.name}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <DashboardCard
            title="Total Tier-2 Sellers"
            value={totalTier2Sellers}
            description="Under your management"
            icon={Building2}
            trend={{ value: 10, isPositive: true }}
          />
          <DashboardCard
            title="Total Projects"
            value={totalProjects}
            description="Active projects"
            icon={FileText}
            trend={{ value: 15, isPositive: true }}
          />
          <DashboardCard
            title="Monthly Revenue"
            value={`₹${monthlyRevenue.toLocaleString()}`}
            description="This month's earnings"
            icon={DollarSign}
            trend={{ value: 20, isPositive: true }}
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
              <CardTitle>Project Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                <p className="text-gray-500">Project status overview placeholder</p>
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
      case 'tier2-sellers':
        return userRole === 'tier1_seller' ? 
          <div className="p-8 text-center text-gray-500">Tier-2 Sellers management coming soon...</div> : 
          renderDashboard();
      case 'projects':
        return <div className="p-8 text-center text-gray-500">Project Management coming soon...</div>;
      case 'billing':
        return <div className="p-8 text-center text-gray-500">Billing & Revenue coming soon...</div>;
      case 'reports':
        return <div className="p-8 text-center text-gray-500">Reports management coming soon...</div>;
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
