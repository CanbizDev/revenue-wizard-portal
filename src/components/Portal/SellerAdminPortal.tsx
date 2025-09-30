import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/Layout/Header';
import Sidebar from '@/components/Layout/Sidebar';
import DashboardCard from '@/components/Dashboard/DashboardCard';
import AddClientForm from '@/components/Forms/AddClientForm';
import { ClientIntakeForm } from '@/components/Forms/ClientIntakeForm';
import SellerAdminTier2Management from '@/components/Portal/SellerAdminTier2Management';
import AddPlanForm from '@/components/Forms/AddPlanForm';
import Tier1SubscriptionPlanManagement from '@/components/Portal/Tier1SubscriptionPlanManagement';
import CommissionsView from './CommissionsView';
import ProjectManagement from './ProjectManagement';
import ProjectBilling from './ProjectBilling';
import ProjectBillingTier1 from './ProjectBillingTier1';

import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

import { apiService,UserProfile } from '@/services/api';
import { mockSellerData } from '@/services/mockData';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  BarChart3,
  Users,
  TrendingUp,
  DollarSign,
  FileText,
  Settings,
  Eye,
  Edit,
  Trash2,
  Plus,
  Building2,
  Percent,
  CheckCircle,
  Clock
} from 'lucide-react';

interface SellerAdminPortalProps {
  company?: 'marketstrendai' | 'xyzseller';
  onNavigate?: (path: string) => void;
  activeTab?: string;
}

const SellerAdminPortal: React.FC<SellerAdminPortalProps> = ({ company = 'marketstrendai', onNavigate, activeTab: propActiveTab }) => {
  const [activeTab, setActiveTab] = useState(propActiveTab || 'dashboard');
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null); 
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAddClientForm, setShowAddClientForm] = useState(false);
  const [showIntakeForm, setShowIntakeForm] = useState(false);
  
  const [showAddPlanForm, setShowAddPlanForm] = useState(false);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [editingPlan, setEditingPlan] = useState<any>(null);
  
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  // Dashboard data state
  const [loading, setLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const sellerData = mockSellerData;
  const clients: any[] = [];
  const plans: any[] = [];
  const commissions: any[] = [];
  const error = null;
  
  const addClient = async (clientData: any) => {
    console.log('Mock add client:', clientData);
  };
  
  const addPlan = async (planData: any) => {
    console.log('Mock add plan:', planData);
  };
  
  const updatePlan = async (planId: string, planData: any) => {
    console.log('Mock update plan:', planId, planData);
  };
  
  const deleteClient = async (clientId: string) => {
    console.log('Mock delete client:', clientId);
  };
  
  const deletePlan = async (planId: string) => {
    console.log('Mock delete plan:', planId);
  };
  
  const deleteTier2Seller = async (sellerId: string) => {
    console.log('Mock delete tier2 seller:', sellerId);
  };

  // Fetch tier2 sellers from database
  const [tier2Sellers, setTier2Sellers] = useState<any[]>([]);

  // Fetch dashboard data and tier2 sellers if this is a tier1 seller
  // Fetch dashboard data based on user role (Tier-1 or Tier-2)
  React.useEffect(() => {
    const fetchPortalData = async () => {
      try {
        setLoading(true);
        const currentUser = apiService.getCurrentUser();
        if (!currentUser) {
          console.error("No user found");
          toast({ title: "Authentication Error", description: "Please log in again.", variant: "destructive" });
          return;
        }

        let dashboardResponse;

        // Check the user's role based on the company prop
        if (company === 'marketstrendai') { // This is a Tier-1 Seller
          const tier1Id = currentUser.id;
          dashboardResponse = await apiService.getTier1DashboardData(tier1Id);
          
          // You can also fetch the actual Tier-2 sellers here instead of mock data
          // const tier2Data = await apiService.getTier2SellersForTier1(tier1Id);
          // setTier2Sellers(tier2Data);

        } else if (company === 'xyzseller') { // This is a Tier-2 Seller
          const tier2Id = currentUser.id;
          dashboardResponse = await apiService.getTier2DashboardData(tier2Id);
        }

        if (dashboardResponse) {
          setDashboardData(dashboardResponse.stats);
        }

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // Added toast for better user feedback on error
        toast({
          title: "Error",
          description: "Could not load dashboard data.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPortalData();
  }, [company, toast]); // Dependencies updated for correctness
  // Update active tab when prop changes

  React.useEffect(() => {
    const fetchUser = async () => {
      try {
        const userProfile = await apiService.getUserProfile();
        setCurrentUser(userProfile);
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
        toast({
          title: "Error",
          description: "Could not fetch user details.",
          variant: "destructive",
        });
      }
    };

    fetchUser();
  }, [toast]);

  React.useEffect(() => {
    if (propActiveTab && propActiveTab !== activeTab) {
      setActiveTab(propActiveTab);
    }
  }, [propActiveTab, activeTab]);

  // const getCompanyData = () => {
  //   if (!sellerData) {
  //     return {
  //       name: 'Loading...',
  //       email: 'loading@example.com',
  //       role: 'Loading...',
  //       company: 'Loading...'
  //     };
  //   }

  //   if (company === 'xyzseller') {
  //     return {
  //       name: `${sellerData.name} Admin`,
  //       email: sellerData.admin_email,
  //       role: 'Tier-2 Seller Admin',
  //       company: sellerData.name
  //     };
  //   }
  //   return {
  //     name: `${sellerData.name} Admin`,
  //     email: sellerData.admin_email,
  //     role: 'Tier-1 Seller Admin',
  //     company: sellerData.name
  //   };
  // };

  // const mockUser = getCompanyData();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading seller data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">Error loading seller data: {error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  const renderDashboard = () => {
    // Use data from API if available, otherwise fallback to mock calculations
    const totalProjects = dashboardData?.total_projects || 0;
    const myTier2Sellers = dashboardData?.total_tier2_sellers || tier2Sellers.length;
    const monthlyRevenue = dashboardData?.monthly_revenue || 0;
    
    const activePlans = plans.filter(plan => plan.active).length;
    const totalCommissions = commissions.reduce((sum, commission) => sum + commission.commission_amount, 0);

    // Calculate commission percentage and billing amounts for tier2 sellers
    const avgCommissionPercentage = dashboardData?.commission_percentage || 15; // Default to 15%
    const paidAmount = dashboardData?.paid_amount || 75000;
    const pendingAmount = dashboardData?.pending_amount || 25000;

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {company === 'xyzseller' ? 'Tier-2 Seller Dashboard' : 'Tier-1 Seller Dashboard'}
          </h2>
          <p className="text-gray-600">Overview of your business operations</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <DashboardCard
            title="Total Projects"
            value={totalProjects.toString()}
            description="All projects under your management"
            icon={FileText}
          />
          {company === 'marketstrendai' && (
            <DashboardCard
              title="Total Tier-2 Sellers"
              value={myTier2Sellers.toString()}
              description="Managed by you"
              icon={Building2}
            />
          )}
          {company === 'xyzseller' && (
            <>
              <DashboardCard
                title="Commission %"
                value={`${avgCommissionPercentage}%`}
                description="Your commission rate"
                icon={Percent}
              />
              <DashboardCard
                title="Paid Amount"
                value={`₹${paidAmount.toLocaleString()}`}
                description="Total payments received"
                icon={CheckCircle}
              />
              <DashboardCard
                title="Pending Amount"
                value={`₹${pendingAmount.toLocaleString()}`}
                description="Pending payments"
                icon={Clock}
              />
            </>
          )}
          {/* <DashboardCard
            title="Active Plans"
            value={activePlans.toString()}
            description="Subscription plans"
            icon={BarChart3}
          /> */}
          <DashboardCard
            title="Monthly Revenue"
            value={`₹${monthlyRevenue.toLocaleString()}`}
            description="Total revenue"
            icon={DollarSign}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* <Card>
            <CardHeader>
              <CardTitle>Recent Clients</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {clients.slice(0, 5).map((client) => (
                  <div key={client.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{client.name}</h4>
                      <p className="text-sm text-muted-foreground">{client.company}</p>
                    </div>
                    <Badge variant={client.status === 'active' ? 'default' : 'secondary'}>
                      {client.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card> */}

          {/* <Card>
            <CardHeader>
              <CardTitle>Plan Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {plans.map((plan) => {
                  const planClients = clients.filter(c => c.subscription_plans?.name === plan.name).length;
                  return (
                    <div key={plan.id} className="flex items-center justify-between">
                      <span className="font-medium">{plan.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {planClients} clients
                      </span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card> */}
        </div>
      </div>
    );
  };

  const renderClients = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Client Management</h1>
        <Dialog open={showAddClientForm} onOpenChange={setShowAddClientForm}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Client
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Client</DialogTitle>
              <DialogDescription>
                Add a new client to your portfolio
              </DialogDescription>
            </DialogHeader>
            <AddClientForm 
              isOpen={showAddClientForm}
              onClose={() => setShowAddClientForm(false)}
              onSubmit={handleAddClient} 
            />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Clients</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Intake Form</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell className="font-medium">{client.name}</TableCell>
                  <TableCell>{client.company}</TableCell>
                  <TableCell>{client.subscription_plans?.name || 'No Plan'}</TableCell>
                  <TableCell>
                    <Badge variant={client.status === 'active' ? 'default' : 'secondary'}>
                      {client.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={client.intake_form_completed ? 'default' : 'destructive'}>
                      {client.intake_form_completed ? 'Completed' : 'Pending'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setSelectedClient(client);
                          setShowIntakeForm(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Client</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete {client.name}? This action will soft-delete the client and preserve commission history for audit purposes.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteClient(client.id)}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );

  const renderPlans = () => (
    <Tier1SubscriptionPlanManagement />
  );

  const renderSubscriptionPlans = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Subscription Plans</h2>
        <p className="text-gray-600">Manage subscription plans with JB commission settings</p>
      </div>
      
      {renderPlans()}
    </div>
  );

  const renderTier2Sellers = () => (
    <SellerAdminTier2Management 
      currentTier1SellerId={sellerData?.id}
      currentTier1SellerName={sellerData?.name}
    />
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'clients':
        return renderClients();
      case 'projects':
        return <ProjectManagement userRole={company === 'xyzseller' ? 'tier2' : 'tier1'} />;
      case 'plans':
        return renderPlans();
      case 'tier2-sellers':
        return company === 'marketstrendai' ? renderTier2Sellers() : renderDashboard();
      case 'commissions':
        return <CommissionsView userRole={company === 'xyzseller' ? 'tier2_seller' : 'tier1_seller'} company={company} />;
      case 'subscription-plans':
        return renderSubscriptionPlans();
      case 'billing':
        return company === 'xyzseller' ? <ProjectBilling /> : <ProjectBillingTier1 />;
      case 'reports':
        return <div className="p-8 text-center text-gray-500">Reports coming soon...</div>;
      default:
        return renderDashboard();
    }
  };

  const handleAddClient = async (clientData: any) => {
    try {
      await addClient({
        name: clientData.name,
        email: clientData.email,
        company: clientData.company,
        plan_id: clientData.planId,
        status: 'active',
        intake_form_completed: false
      });
      setShowAddClientForm(false);
      toast({
        title: "Client Added",
        description: "New client has been successfully added.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add client. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleIntakeFormSubmit = (intakeData: any) => {
    console.log('Intake form submitted:', intakeData);
    if (selectedClient) {
      // Update client intake form status
      // This would typically be handled by the useSellerData hook
    }
    setShowIntakeForm(false);
    setSelectedClient(null);
    toast({
      title: "Intake Form Submitted",
      description: "Client intake form has been successfully submitted.",
    });
  };

  const handleAddPlan = async (planData: any) => {
    try {
      await addPlan({
        name: planData.name,
        price: planData.price,
        currency: planData.currency || 'INR',
        currency_symbol: planData.currencySymbol || '₹',
        billing: planData.billing || 'monthly',
        features: planData.features || [],
        max_clients: planData.maxClients,
        active: true
      });
      setShowAddPlanForm(false);
      setEditingPlan(null);
      toast({
        title: "Plan Added",
        description: "New subscription plan has been successfully added.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add plan. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleEditPlan = async (planData: any) => {
    try {
      await updatePlan(planData.id, planData);
      setEditingPlan(null);
      toast({
        title: "Plan Updated",
        description: "Subscription plan has been successfully updated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update plan. Please try again.",
        variant: "destructive"
      });
    }
  };

  const togglePlanStatus = async (planId: string) => {
    try {
      const plan = plans.find(p => p.id === planId);
      if (plan) {
        await updatePlan(planId, { active: !plan.active });
        toast({
          title: "Plan Status Updated",
          description: "Plan status has been successfully updated.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update plan status. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteClient = async (clientId: string) => {
    try {
      await deleteClient(clientId);
      toast({
        title: "Client Deleted",
        description: "Client has been successfully deleted.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete client. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDeletePlan = async (planId: string) => {
    try {
      await deletePlan(planId);
      toast({
        title: "Plan Deleted",
        description: "Plan has been successfully deleted.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete plan. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteTier2Seller = async (sellerId: string) => {
    try {
      await deleteTier2Seller(sellerId);
      toast({
        title: "Tier-2 Seller Deleted",
        description: "Tier-2 seller has been successfully deleted.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete tier-2 seller. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        user={currentUser}
        onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        portalType="seller"
        onNavigate={onNavigate}
      />
      
      <div className="flex">
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          userRole={company === 'xyzseller' ? 'tier2_seller' : 'tier1_seller'}
          portalType="seller"
        />
        
        <main className="flex-1 p-6">
          {renderContent()}
        </main>
      </div>

      {showAddClientForm && (
        <Dialog open={showAddClientForm} onOpenChange={setShowAddClientForm}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Client</DialogTitle>
              <DialogDescription>
                Add a new client to your portfolio
              </DialogDescription>
            </DialogHeader>
            <AddClientForm 
              isOpen={showAddClientForm}
              onClose={() => setShowAddClientForm(false)}
              onSubmit={handleAddClient}
              availablePlans={plans}
            />
          </DialogContent>
        </Dialog>
      )}

      {showAddPlanForm && (
        <Dialog open={showAddPlanForm} onOpenChange={(open) => {
          setShowAddPlanForm(open);
          if (!open) setEditingPlan(null);
        }}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingPlan ? 'Edit Plan' : 'Add New Plan'}</DialogTitle>
              <DialogDescription>
                {editingPlan ? 'Update the subscription plan details' : 'Create a new subscription plan for your clients'}
              </DialogDescription>
            </DialogHeader>
            <AddPlanForm 
              isOpen={showAddPlanForm}
              onClose={() => {
                setShowAddPlanForm(false);
                setEditingPlan(null);
              }}
              onSubmit={editingPlan ? handleEditPlan : handleAddPlan}
              editingPlan={editingPlan}
              formType="seller_admin"
            />
          </DialogContent>
        </Dialog>
      )}

      {showIntakeForm && (
        <Dialog open={showIntakeForm} onOpenChange={setShowIntakeForm}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Client Intake Form</DialogTitle>
              <DialogDescription>
                Complete the intake form for {selectedClient?.name}
              </DialogDescription>
            </DialogHeader>
            <ClientIntakeForm 
              isOpen={showIntakeForm}
              onClose={() => setShowIntakeForm(false)}
              onSubmit={handleIntakeFormSubmit} 
            />
          </DialogContent>
        </Dialog>
      )}

    </div>
  );
};

export default SellerAdminPortal;