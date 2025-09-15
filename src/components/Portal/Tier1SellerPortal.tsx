import React, { useState, useEffect } from 'react';
import Header from '@/components/Layout/Header';
import Sidebar from '@/components/Layout/Sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import DashboardCard from '@/components/Dashboard/DashboardCard';
import AddTier2SellerForm from '@/components/Forms/AddTier2SellerForm';
import { EditSellerForm } from '@/components/Forms/EditSellerForm';
import RevenueOverview from '@/components/Revenue/RevenueOverview';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { apiService } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { 
  Users, 
  Building2, 
  DollarSign, 
  TrendingUp,
  UserPlus,
  Settings,
  BarChart3,
  Trash2,
  Edit
} from 'lucide-react';

const Tier1SellerPortal: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAddTier2SellerOpen, setIsAddTier2SellerOpen] = useState(false);
  const [isEditTier2SellerOpen, setIsEditTier2SellerOpen] = useState(false);
  const [editingTier2Seller, setEditingTier2Seller] = useState<any>(null);
  const [tier2Sellers, setTier2Sellers] = useState<any[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const mockUser = {
    name: 'Tier1 Seller',
    email: 'admin@tier1seller.com',
    role: 'Tier1 Administrator',
    company: 'MarketsTrendAI'
  };

  const loadTier2Sellers = async () => {
    try {
      const currentUser = apiService.getCurrentUser();
      const tier2Data = await apiService.getAllTier2Sellers();
      
      // Filter tier2 sellers to only show those belonging to the current tier1 seller
      const filteredTier2Sellers = tier2Data.filter(seller => 
        seller.tier1_seller_id === currentUser?.id
      );
      
      setTier2Sellers(filteredTier2Sellers);
    } catch (error: any) {
      console.error('Error loading tier2 sellers:', error);
      toast({
        title: 'Error',
        description: 'Failed to load Tier-2 sellers',
        variant: 'destructive'
      });
    }
  };

  const handleDeleteTier2Seller = async (sellerId: string) => {
    try {
      await apiService.deleteTier2Seller(sellerId);
      toast({
        title: 'Success',
        description: 'Tier-2 seller deleted successfully'
      });
      loadTier2Sellers();
    } catch (error: any) {
      console.error('Error deleting tier2 seller:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete tier2 seller',
        variant: 'destructive'
      });
    }
  };

  useEffect(() => {
    loadTier2Sellers();
  }, []);

  const renderDashboard = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Tier-1 Seller Dashboard</h2>
        <p className="text-gray-600">Manage your Tier-2 sellers and monitor performance</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <DashboardCard
          title="My Tier-2 Sellers"
          value={tier2Sellers.length}
          description="Active seller accounts"
          icon={Building2}
          trend={{ value: 12, isPositive: true }}
        />
        <DashboardCard
          title="Total Clients"
          value={156}
          description="Across all Tier-2s"
          icon={Users}
          trend={{ value: 8, isPositive: true }}
        />
        <DashboardCard
          title="Active Projects"
          value={42}
          description="Ongoing work"
          icon={UserPlus}
          trend={{ value: 15, isPositive: true }}
        />
        <DashboardCard
          title="Monthly Revenue"
          value="₹8,45,000"
          description="Total earnings"
          icon={DollarSign}
          trend={{ value: 23, isPositive: true }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Performance Overview</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <p className="text-gray-500">Performance chart placeholder</p>
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
                { action: 'New client onboarded', company: 'DataFlow Inc', time: '2 hours ago', status: 'completed' },
                { action: 'Project milestone reached', company: 'Analytics Pro', time: '4 hours ago', status: 'completed' },
                { action: 'Payment received', company: 'TechCorp', time: '6 hours ago', status: 'completed' },
              ].map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-500">{activity.company} • {activity.time}</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">
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

  const renderTier2Sellers = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">My Tier-2 Sellers</h2>
          <p className="text-gray-600">Manage your subsidiary seller accounts</p>
        </div>
        <Button className="flex items-center space-x-2 w-full sm:w-auto" onClick={() => setIsAddTier2SellerOpen(true)}>
          <UserPlus className="h-4 w-4" />
          <span>Add Tier-2 Seller</span>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Tier-2 Sellers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tier2Sellers.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No Tier-2 sellers found. Add your first Tier-2 seller to get started.
              </div>
            ) : (
              tier2Sellers.map((seller) => (
                <div key={seller.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border border-gray-200 rounded-lg space-y-3 sm:space-y-0">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        {seller.logo_url ? (
                          <img src={seller.logo_url} alt={seller.name} className="w-8 h-8 rounded-full object-cover" />
                        ) : (
                          <Building2 className="h-5 w-5 text-purple-600" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{seller.name}</h3>
                        <p className="text-sm text-gray-500">{seller.admin_email}</p>
                        <p className="text-xs text-gray-400">{seller.subdomain}.reportingportal.ai</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-6 text-sm text-gray-600 w-full sm:w-auto justify-between sm:justify-end">
                    <div className="text-center">
                      <p className="font-medium">{seller.client_count || 0}</p>
                      <p className="text-xs">Clients</p>
                    </div>
                    <div className="text-center">
                      <p className="font-medium">₹{seller.revenue || 0}</p>
                      <p className="text-xs">Revenue</p>
                    </div>
                    <Badge 
                      variant={seller.status === 'active' ? 'default' : 'secondary'}
                      className={seller.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}
                    >
                      {seller.status || 'active'}
                    </Badge>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingTier2Seller(seller);
                          setIsEditTier2SellerOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteTier2Seller(seller.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
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
      case 'tier2-sellers':
        return renderTier2Sellers();
      case 'revenue':
        return <RevenueOverview />;
      case 'settings':
        return <div className="p-6">Settings placeholder</div>;
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <Header portalType="seller" user={mockUser} onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex-1 flex relative">
        <Sidebar 
          portalType="tier1-seller" 
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
      
      <AddTier2SellerForm
        isOpen={isAddTier2SellerOpen}
        onClose={() => setIsAddTier2SellerOpen(false)}
        onSuccess={loadTier2Sellers}
      />

      <EditSellerForm
        isOpen={isEditTier2SellerOpen}
        onClose={() => {
          setIsEditTier2SellerOpen(false);
          setEditingTier2Seller(null);
        }}
        seller={editingTier2Seller}
        sellerType="tier2"
        onSuccess={() => {
          setIsEditTier2SellerOpen(false);
          setEditingTier2Seller(null);
          loadTier2Sellers();
        }}
      />
    </div>
  );
};

export default Tier1SellerPortal;