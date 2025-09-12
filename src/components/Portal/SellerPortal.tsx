
import React, { useState } from 'react';
import Header from '@/components/Layout/Header';
import Sidebar from '@/components/Layout/Sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import DashboardCard from '@/components/Dashboard/DashboardCard';
import RevenueOverview from '@/components/Revenue/RevenueOverview';
import Tier2SellerManagement from '@/components/Portal/Tier2SellerManagement';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { apiService } from '@/services/api';
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
  const [tier2Sellers, setTier2Sellers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const isMobile = useIsMobile();

  const mockUser = {
    name: 'Tier1 Seller Admin',
    email: 'admin@tier1seller.com',
    role: userRole === 'tier1_seller' ? 'Tier-1 Seller' : 'Tier-2 Seller',
    company: 'MarketsTrendAI'
  };

  // Load data on component mount
  React.useEffect(() => {
    const loadData = async () => {
      try {
        const tier2Data = await apiService.getAllTier2Sellers();
        setTier2Sellers(tier2Data);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const renderDashboard = () => {
    if (loading) {
      return (
        <div className="flex h-64 items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      );
    }

    // Real data for tier1 seller metrics
    const totalTier2Sellers = tier2Sellers.length;
    const totalProjects = tier2Sellers.reduce((sum, seller) => sum + (seller.project_count || 0), 0);
    const monthlyRevenue = tier2Sellers.reduce((sum, seller) => sum + (seller.revenue || 0), 0);

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
          <Tier2SellerManagement /> : 
          renderDashboard();
      case 'projects':
        return <div className="p-8 text-center text-gray-500">Project Management coming soon...</div>;
      case 'billing':
        return <RevenueOverview />;
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
