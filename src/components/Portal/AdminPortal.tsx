
import React, { useState, useEffect } from 'react';
import Header from '@/components/Layout/Header';
import Sidebar from '@/components/Layout/Sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import DashboardCard from '@/components/Dashboard/DashboardCard';
import AddSellerForm from '@/components/Forms/AddSellerForm';
import AddTier2SellerForm from '@/components/Forms/AddTier2SellerForm';
import { EditSellerForm } from '@/components/Forms/EditSellerForm';
import RevenueOverview from '@/components/Revenue/RevenueOverview';
import ServiceControlPanel from '@/components/Portal/ServiceControlPanel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { apiService, AdminDashboardData } from '@/services/api';
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

const AdminPortal: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAddSellerOpen, setIsAddSellerOpen] = useState(false);
  const [isAddTier2SellerOpen, setIsAddTier2SellerOpen] = useState(false);
  const [isEditSellerOpen, setIsEditSellerOpen] = useState(false);
  const [editingSeller, setEditingSeller] = useState<any>(null);
  const [editingSellerType, setEditingSellerType] = useState<'tier1' | 'tier2'>('tier1');
  const [sellers, setSellers] = useState<any[]>([]);
  const [tier2Sellers, setTier2Sellers] = useState<any[]>([]);
  const [dashboardData, setDashboardData] = useState<AdminDashboardData | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const mockUser = {
    name: 'Admin User',
    email: 'admin@jupiterbrains.com',
    role: 'JB Administrator',
    company: 'JupiterBrains'
  };

  const loadSellers = async () => {
    try {
      const sellersData = await apiService.getAllTier1Sellers();
      setSellers(sellersData);
    } catch (error: any) {
      console.error('Error loading sellers:', error);
      toast({
        title: 'Error',
        description: 'Failed to load sellers',
        variant: 'destructive'
      });
    }
  };

  const loadTier2Sellers = async () => {
    try {
      const tier2Data = await apiService.getAllTier2Sellers();
      setTier2Sellers(tier2Data);
    } catch (error: any) {
      console.error('Error loading tier2 sellers:', error);
      toast({
        title: 'Error',
        description: 'Failed to load Tier-2 sellers',
        variant: 'destructive'
      });
    }
  };

  const loadDashboardData = async () => {
    try {
      const data = await apiService.getAdminDashboardData();
      setDashboardData(data);
    } catch (error: any) {
      console.error('Error loading dashboard data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load dashboard data',
        variant: 'destructive'
      });
    }
  };

  const handleDeleteTier1Seller = async (sellerId: string) => {
    try {
      await apiService.deleteTier1Seller(sellerId);
      toast({
        title: 'Success',
        description: 'Tier-1 seller deleted successfully'
      });
      loadSellers();
    } catch (error: any) {
      console.error('Error deleting seller:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete seller',
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
    loadSellers();
    loadTier2Sellers();
    loadDashboardData();
  }, []);


  const renderDashboard = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">JB Admin Dashboard</h2>
        <p className="text-gray-600">Overview of the entire ReportingPortal.ai ecosystem</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <DashboardCard
          title="Total Tier-1 Sellers"
          value={dashboardData?.stats.total_tier1_sellers || 0}
          description="Active seller accounts"
          icon={Building2}
        />
        <DashboardCard
          title="Total Tier-2 Sellers"
          value={dashboardData?.stats.total_tier2_sellers || 0}
          description="Managed by Tier-1s"
          icon={Users}
        />
        <DashboardCard
          title="Total Projects"
          value={dashboardData?.stats.total_projects || 0}
          description="Active projects"
          icon={UserPlus}
        />
        <DashboardCard
          title="Monthly Revenue"
          value={`₹${dashboardData?.stats.monthly_revenue?.toLocaleString('en-IN') || '0'}`}
          description="Total platform revenue"
          icon={DollarSign}
        />
      </div>

    </div>
  );

  const renderTier1Sellers = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Tier-1 Sellers</h2>
          <p className="text-gray-600">Manage primary seller accounts</p>
        </div>
        <Button className="flex items-center space-x-2 w-full sm:w-auto" onClick={() => setIsAddSellerOpen(true)}>
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
            {sellers.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No sellers found. Add your first Tier-1 seller to get started.
              </div>
            ) : (
              sellers.map((seller) => (
                <div key={seller.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border border-gray-200 rounded-lg space-y-3 sm:space-y-0">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        {seller.logo_url ? (
                          <img src={seller.logo_url} alt={seller.name} className="w-8 h-8 rounded-full object-cover" />
                        ) : (
                          <Building2 className="h-5 w-5 text-blue-600" />
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
                          setEditingSeller(seller);
                          setEditingSellerType('tier1');
                          setIsEditSellerOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteTier1Seller(seller.id)}
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

  const renderTier2Sellers = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Tier-2 Sellers</h2>
          <p className="text-gray-600">Manage secondary seller accounts</p>
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
                <div key={seller.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
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
                        <p className="text-xs text-blue-600">Under: {seller.tier1_seller?.name}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-6 text-sm text-gray-600">
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
                          setEditingSeller(seller);
                          setEditingSellerType('tier2');
                          setIsEditSellerOpen(true);
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
      case 'tier1-sellers':
        return renderTier1Sellers();
      case 'tier2-sellers':
        return renderTier2Sellers();
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
        onSuccess={loadSellers}
      />
      
      <AddTier2SellerForm
        isOpen={isAddTier2SellerOpen}
        onClose={() => setIsAddTier2SellerOpen(false)}
        onSuccess={loadTier2Sellers}
      />

      <EditSellerForm
        isOpen={isEditSellerOpen}
        onClose={() => {
          setIsEditSellerOpen(false);
          setEditingSeller(null);
        }}
        seller={editingSeller}
        sellerType={editingSellerType}
        onSuccess={() => {
          setIsEditSellerOpen(false);
          setEditingSeller(null);
          if (editingSellerType === 'tier1') {
            loadSellers();
          } else {
            loadTier2Sellers();
          }
        }}
      />
    </div>
  );
};

export default AdminPortal;
