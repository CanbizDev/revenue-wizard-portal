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
import AddTier2SellerForm from '@/components/Forms/AddTier2SellerForm';
import AddPlanForm from '@/components/Forms/AddPlanForm';
import CommissionsView from './CommissionsView';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { useSellerData } from '@/hooks/useSellerData';
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
  Plus
} from 'lucide-react';

const SellerAdminPortal: React.FC<{company?: 'marketstrendai' | 'xyzseller'}> = ({ company = 'marketstrendai' }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAddClientForm, setShowAddClientForm] = useState(false);
  const [showIntakeForm, setShowIntakeForm] = useState(false);
  const [showAddTier2SellerForm, setShowAddTier2SellerForm] = useState(false);
  const [showAddPlanForm, setShowAddPlanForm] = useState(false);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [editingPlan, setEditingPlan] = useState<any>(null);
  
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  // Use the custom hook to fetch seller-specific data
  const { 
    sellerData, 
    clients, 
    plans, 
    commissions, 
    loading, 
    error, 
    addClient, 
    addPlan, 
    updatePlan 
  } = useSellerData(company);

  // Mock tier2 sellers data (if needed for tier-1 sellers)
  const [tier2Sellers] = useState([
    {
      id: 1,
      name: 'Regional Partner A',
      email: 'partner.a@email.com',
      company: 'Partner A Corp',
      commission: '15%',
      clients: 12,
      status: 'Active',
      joinedDate: '2024-01-10'
    },
    {
      id: 2,
      name: 'Regional Partner B',
      email: 'partner.b@email.com',
      company: 'Partner B LLC',
      commission: '12%',
      clients: 8,
      status: 'Active',
      joinedDate: '2024-01-20'
    }
  ]);

  const getCompanyData = () => {
    if (!sellerData) {
      return {
        name: 'Loading...',
        email: 'loading@example.com',
        role: 'Loading...',
        company: 'Loading...'
      };
    }

    if (company === 'xyzseller') {
      return {
        name: `${sellerData.name} Admin`,
        email: sellerData.admin_email,
        role: 'Tier-2 Seller Admin',
        company: sellerData.name
      };
    }
    return {
      name: `${sellerData.name} Admin`,
      email: sellerData.admin_email,
      role: 'Tier-1 Seller Admin',
      company: sellerData.name
    };
  };

  const mockUser = getCompanyData();

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
    const totalClients = clients.length;
    const monthlyRevenue = clients.reduce((sum, client) => {
      if (client.subscription_plans) {
        return sum + client.subscription_plans.price;
      }
      return sum;
    }, 0);
    const activePlans = plans.filter(plan => plan.active).length;
    const totalCommissions = commissions.reduce((sum, commission) => sum + commission.commission_amount, 0);

    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <DashboardCard
            title="Total Clients"
            value={totalClients.toString()}
            icon={<Users className="h-6 w-6" />}
            trend="+12%"
          />
          <DashboardCard
            title="Monthly Revenue"
            value={`₹${monthlyRevenue.toLocaleString()}`}
            icon={<DollarSign className="h-6 w-6" />}
            trend="+8%"
          />
          <DashboardCard
            title="Active Plans"
            value={activePlans.toString()}
            icon={<BarChart3 className="h-6 w-6" />}
            trend="0%"
          />
          <DashboardCard
            title="Commission Earned"
            value={`₹${totalCommissions.toLocaleString()}`}
            icon={<TrendingUp className="h-6 w-6" />}
            trend="+15%"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
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
          </Card>

          <Card>
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
          </Card>
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
            <AddClientForm onSubmit={handleAddClient} />
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
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the client.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction>Delete</AlertDialogAction>
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Subscription Plans</h1>
        <Dialog open={showAddPlanForm} onOpenChange={setShowAddPlanForm}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Plan
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Plan</DialogTitle>
              <DialogDescription>
                Create a new subscription plan
              </DialogDescription>
            </DialogHeader>
            <AddPlanForm onSubmit={handleAddPlan} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card key={plan.id} className={!plan.active ? 'opacity-50' : ''}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle>{plan.name}</CardTitle>
                <Badge variant={plan.active ? 'default' : 'secondary'}>
                  {plan.active ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-3xl font-bold">
                  {plan.currency_symbol}{plan.price.toLocaleString()}
                  <span className="text-sm font-normal text-muted-foreground">/{plan.billing}</span>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Features:</p>
                  <ul className="space-y-1">
                    {Array.isArray(plan.features) ? plan.features.map((feature, index) => (
                      <li key={index} className="text-sm flex items-center">
                        <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                        {feature}
                      </li>
                    )) : <li className="text-sm text-muted-foreground">No features listed</li>}
                  </ul>
                </div>
                
                <div className="text-sm text-muted-foreground">
                  Max Clients: {plan.max_clients || 'Unlimited'}
                </div>
                
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => {
                      setEditingPlan(plan);
                      setShowAddPlanForm(true);
                    }}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => togglePlanStatus(plan.id)}
                  >
                    {plan.active ? 'Deactivate' : 'Activate'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'commissions':
        return <CommissionsView userRole={company === 'xyzseller' ? 'tier2_seller' : 'tier1_seller'} company={company} />;
      case 'clients':
        return renderClients();
      case 'plans':
        return renderPlans();
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        user={mockUser}
        onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      
      <div className="flex">
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          userRole="seller"
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
            <AddClientForm onSubmit={handleAddClient} />
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
              onSubmit={editingPlan ? handleEditPlan : handleAddPlan} 
              initialData={editingPlan}
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