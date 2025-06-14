
import React, { useState } from 'react';
import Header from '@/components/Layout/Header';
import Sidebar from '@/components/Layout/Sidebar';
import DashboardCard from '@/components/Dashboard/DashboardCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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

  const mockUser = {
    name: 'Admin User',
    email: 'admin@jupiterbrains.com',
    role: 'JB Administrator',
    company: 'JupiterBrains'
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">JB Admin Dashboard</h2>
        <p className="text-gray-600">Overview of the entire ReportingPortal.ai ecosystem</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="Total Tier-1 Sellers"
          value={24}
          description="Active seller accounts"
          icon={Building2}
          trend={{ value: 12, isPositive: true }}
        />
        <DashboardCard
          title="Total Tier-2 Sellers"
          value={156}
          description="Managed by Tier-1s"
          icon={Users}
          trend={{ value: 8, isPositive: true }}
        />
        <DashboardCard
          title="Active Clients"
          value={892}
          description="Paying customers"
          icon={UserPlus}
          trend={{ value: 15, isPositive: true }}
        />
        <DashboardCard
          title="Monthly Revenue"
          value="₹12,45,000"
          description="Total platform revenue"
          icon={DollarSign}
          trend={{ value: 23, isPositive: true }}
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
              {[
                { action: 'New Tier-1 Seller registered', company: 'TechCorp Solutions', time: '2 hours ago', status: 'pending' },
                { action: 'Client payment received', company: 'DataFlow Inc', time: '4 hours ago', status: 'completed' },
                { action: 'Tier-2 Seller approved', company: 'Analytics Pro', time: '6 hours ago', status: 'approved' },
              ].map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-500">{activity.company} • {activity.time}</p>
                  </div>
                  <Badge 
                    variant={activity.status === 'completed' ? 'default' : 'secondary'}
                    className={
                      activity.status === 'completed' ? 'bg-green-100 text-green-800' :
                      activity.status === 'approved' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }
                  >
                    {activity.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderTier1Sellers = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Tier-1 Sellers</h2>
          <p className="text-gray-600">Manage primary seller accounts</p>
        </div>
        <Button className="flex items-center space-x-2">
          <UserPlus className="h-4 w-4" />
          <span>Add Tier-1 Seller</span>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Tier-1 Sellers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { name: 'TechCorp Solutions', email: 'admin@techcorp.com', clients: 45, revenue: '₹4,50,000', status: 'active' },
              { name: 'DataFlow Systems', email: 'contact@dataflow.com', clients: 32, revenue: '₹3,20,000', status: 'active' },
              { name: 'Analytics Pro', email: 'info@analyticspro.com', clients: 28, revenue: '₹2,80,000', status: 'pending' },
            ].map((seller, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Building2 className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{seller.name}</h3>
                      <p className="text-sm text-gray-500">{seller.email}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-6 text-sm text-gray-600">
                  <div className="text-center">
                    <p className="font-medium">{seller.clients}</p>
                    <p className="text-xs">Clients</p>
                  </div>
                  <div className="text-center">
                    <p className="font-medium">{seller.revenue}</p>
                    <p className="text-xs">Revenue</p>
                  </div>
                  <Badge 
                    variant={seller.status === 'active' ? 'default' : 'secondary'}
                    className={seller.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}
                  >
                    {seller.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'tier1-sellers':
        return renderTier1Sellers();
      case 'tier2-sellers':
        return <div className="p-8 text-center text-gray-500">Tier-2 Sellers management coming soon...</div>;
      case 'clients':
        return <div className="p-8 text-center text-gray-500">Client management coming soon...</div>;
      case 'revenue':
        return <div className="p-8 text-center text-gray-500">Revenue overview coming soon...</div>;
      case 'settings':
        return <div className="p-8 text-center text-gray-500">Global settings coming soon...</div>;
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <Header portalType="admin" user={mockUser} />
      <div className="flex-1 flex">
        <Sidebar 
          portalType="admin" 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
        />
        <main className="flex-1 p-6 bg-gray-50 overflow-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminPortal;
