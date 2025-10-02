import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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

import { apiService, UserProfile } from '@/services/api';
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
  DollarSign,
  FileText,
  Eye,
  Edit,
  Trash2,
  Plus,
  Building2,
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
  
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  
  // These are placeholders, to be populated from other API calls as needed
  const clients: any[] = [];
  const plans: any[] = [];
  const commissions: any[] = [];

  // Mock functions for actions that might not be implemented yet
  const addClient = async (clientData: any) => console.log('Mock add client:', clientData);
  const addPlan = async (planData: any) => console.log('Mock add plan:', planData);
  const updatePlan = async (planId: string, planData: any) => console.log('Mock update plan:', planId, planData);
  const deleteClient = async (clientId: string) => console.log('Mock delete client:', clientId);
  const deletePlan = async (planId: string) => console.log('Mock delete plan:', planId);
  const deleteTier2Seller = async (sellerId: string) => console.log('Mock delete tier2 seller:', sellerId);

  useEffect(() => {
    const fetchPortalData = async () => {
      try {
        setLoading(true);
        const user = apiService.getCurrentUser();
        if (!user) {
          setError("No user found. Please log in again.");
          toast({ title: "Authentication Error", description: "Please log in again.", variant: "destructive" });
          return;
        }

        let response;
        if (company === 'marketstrendai') { // Tier-1 Seller
          response = await apiService.getTier1DashboardData(user.id);
        } else if (company === 'xyzseller') { // Tier-2 Seller
          response = await apiService.getTier2DashboardData(user.id);
        }

        if (response) {
          setDashboardData(response.stats);
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Could not load dashboard data.');
        toast({ title: "Error", description: "Could not load dashboard data.", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };

    fetchPortalData();
  }, [company, toast]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userProfile = await apiService.getUserProfile();
        setCurrentUser(userProfile);
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (propActiveTab && propActiveTab !== activeTab) {
      setActiveTab(propActiveTab);
    }
  }, [propActiveTab, activeTab]);

  const renderDashboard = () => {
    // Correctly extract data from the API response
    const totalProjects = dashboardData?.total_projects || 0;
    const totalTier2Sellers = dashboardData?.total_tier2_sellers || 0;
    const totalRevenue = dashboardData?.total_revenue || 0;
    const totalPaid = dashboardData?.total_paid || 0;
    const pendingAmount = dashboardData?.pending_amount || 0;

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {company === 'xyzseller' ? 'Tier-2 Seller Dashboard' : 'Tier-1 Seller Dashboard'}
          </h2>
          <p className="text-gray-600">Overview of your business operations</p>
        </div>
        
        <div className={`grid grid-cols-1 sm:grid-cols-2 ${company === 'marketstrendai' ? 'lg:grid-cols-5' : 'lg:grid-cols-4'} gap-4 sm:gap-6`}>
          <DashboardCard
            title="Total Projects"
            value={totalProjects.toString()}
            description="Your direct projects"
            icon={FileText}
          />
          {company === 'marketstrendai' && (
            <>
              <DashboardCard
                title="Total Tier-2 Sellers"
                value={totalTier2Sellers.toString()}
                description="Managed by you"
                icon={Building2}
              />
              <DashboardCard
                title="Total Revenue"
                value={`₹${totalRevenue.toLocaleString()}`}
                description="Commission from Tier-2s"
                icon={DollarSign}
              />
              <DashboardCard
                title="Paid to Admin"
                value={`₹${totalPaid.toLocaleString()}`}
                description="Commission paid"
                icon={CheckCircle}
              />
              <DashboardCard
                title="Pending to Admin"
                value={`₹${pendingAmount.toLocaleString()}`}
                description="Commission pending"
                icon={Clock}
              />
            </>
          )}
          {company === 'xyzseller' && (
             <>
              <DashboardCard
                title="Paid Amount"
                value={`₹${totalPaid.toLocaleString()}`}
                description="Total payments to Tier-1"
                icon={CheckCircle}
              />
              <DashboardCard
                title="Pending Amount"
                value={`₹${pendingAmount.toLocaleString()}`}
                description="Pending payments to Tier-1"
                icon={Clock}
              />
            </>
          )}
        </div>
      </div>
    );
  };

  // --- RESTORED RENDER FUNCTION ---
  const renderSubscriptionPlans = () => (
    <Tier1SubscriptionPlanManagement />
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'projects':
        return <ProjectManagement userRole={company === 'xyzseller' ? 'tier2' : 'tier1'} />;
      case 'tier2-sellers':
        return company === 'marketstrendai' ? <SellerAdminTier2Management currentTier1SellerId={currentUser?.id} currentTier1SellerName={currentUser?.name} /> : renderDashboard();
      // --- RESTORED CASE FOR SUBSCRIPTION PLANS ---
      case 'subscription-plans':
        return renderSubscriptionPlans();
      case 'billing':
        return company === 'xyzseller' ? <ProjectBilling /> : <ProjectBillingTier1 />;
      default:
        return renderDashboard();
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
          {loading ? (
             <div className="flex h-full items-center justify-center">
               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
             </div>
          ) : error ? (
            <div className="text-red-500 text-center">{error}</div>
          ) : (
            renderContent()
          )}
        </main>
      </div>
    </div>
  );
};

export default SellerAdminPortal;