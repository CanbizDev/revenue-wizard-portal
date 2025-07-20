
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
import { useSellerData } from '@/hooks/useSellerData';
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
  const { sellerData, clients, commissions, loading } = useSellerData('marketstrendai');

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

    const activeClients = clients.filter(c => c.status === 'active').length;
    const monthlyRevenue = clients.reduce((sum, client) => {
      if (client.subscription_plans) {
        return sum + client.subscription_plans.price;
      }
      return sum;
    }, 0);
    const thisMonthCommissions = commissions
      .filter(c => new Date(c.transaction_date).getMonth() === new Date().getMonth())
      .length;

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Seller Dashboard</h2>
          <p className="text-gray-600">Welcome back, {mockUser.name}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <DashboardCard
            title="Active Clients"
            value={activeClients}
            description="Paying customers"
            icon={Users}
            trend={{ value: 8, isPositive: true }}
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
            value={`₹${monthlyRevenue.toLocaleString()}`}
            description="This month's earnings"
            icon={DollarSign}
            trend={{ value: 15, isPositive: true }}
          />
          <DashboardCard
            title="Reports Generated"
            value={thisMonthCommissions}
            description="This month"
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
              <CardTitle>Recent Client Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {clients.slice(0, 3).map((client, index) => (
                  <div key={client.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{client.name}</p>
                      <p className="text-xs text-gray-500">{client.company} • {new Date(client.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-green-600">
                        {client.subscription_plans ? `₹${client.subscription_plans.price.toLocaleString()}` : 'No Plan'}
                      </p>
                    </div>
                  </div>
                ))}
                {clients.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No client activity yet.
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
          <div className="space-y-4">
            {clients.map((client) => (
              <div key={client.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border border-gray-200 rounded-lg space-y-3 sm:space-y-0">
                <div className="flex-1">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <Users className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{client.name}</h3>
                      <p className="text-sm text-gray-500">{client.email}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-6 text-sm text-gray-600 w-full sm:w-auto justify-between sm:justify-end">
                  <div className="text-center">
                    <p className="font-medium">{client.subscription_plans?.name || 'No Plan'}</p>
                    <p className="text-xs">Plan</p>
                  </div>
                  <div className="text-center">
                    <p className="font-medium">
                      {client.subscription_plans ? `₹${client.subscription_plans.price.toLocaleString()}` : '₹0'}
                    </p>
                    <p className="text-xs">Revenue</p>
                  </div>
                  <Badge 
                    variant={client.status === 'active' ? 'default' : 'secondary'}
                    className={client.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}
                  >
                    {client.status}
                  </Badge>
                </div>
              </div>
            ))}
            {clients.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No clients found. Add your first client to get started.
              </div>
            )}
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
        return <CommissionsView userRole={userRole} company="marketstrendai" />;
      case 'tier2-sellers':
        return userRole === 'tier1_seller' ? 
          <div className="p-8 text-center text-gray-500">Tier-2 Sellers management coming soon...</div> : 
          renderDashboard();
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
