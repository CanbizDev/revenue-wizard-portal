import React, { useState } from 'react';
import Header from '@/components/Layout/Header';
import Sidebar from '@/components/Layout/Sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import DashboardCard from '@/components/Dashboard/DashboardCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  DollarSign, 
  FileText, 
  TrendingUp,
  CreditCard,
  CheckCircle,
  XCircle,
  Eye,
  Send,
  Users,
  Building2
} from 'lucide-react';

const SellerAdminPortal: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();

  const mockUser = {
    name: 'MarketsTrendAI Admin',
    email: 'admin@marketstrendai.com',
    role: 'Tier-1 Seller Admin',
    company: 'MarketsTrendAI'
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Seller Admin Dashboard</h2>
        <p className="text-gray-600">Manage your clients, billing, and reports</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <DashboardCard
          title="Active Clients"
          value={15}
          description="Paying customers"
          icon={Users}
          trend={{ value: 12, isPositive: true }}
        />
        <DashboardCard
          title="Monthly Revenue"
          value="₹7,50,000"
          description="This month's earnings"
          icon={DollarSign}
          trend={{ value: 18, isPositive: true }}
        />
        <DashboardCard
          title="Pending Reports"
          value={8}
          description="Awaiting review"
          icon={FileText}
          trend={{ value: -2, isPositive: false }}
        />
        <DashboardCard
          title="Published Reports"
          value={156}
          description="This month"
          icon={CheckCircle}
          trend={{ value: 23, isPositive: true }}
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
            <CardTitle>Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { activity: 'Report approved for Servicon', time: '2 hours ago', type: 'success' },
                { activity: 'New client Forte onboarded', time: '5 hours ago', type: 'info' },
                { activity: 'Payment received ₹45,000', time: '1 day ago', type: 'success' },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{item.activity}</p>
                    <p className="text-xs text-gray-500">{item.time}</p>
                  </div>
                  <div className={`w-2 h-2 rounded-full ${item.type === 'success' ? 'bg-green-500' : 'bg-blue-500'}`} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderBilling = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Billing & Payment</h2>
        <p className="text-gray-600">Manage your payment methods and billing information</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CreditCard className="h-5 w-5" />
              <span>Payment Methods</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-6 bg-blue-600 rounded flex items-center justify-center">
                    <span className="text-white text-xs font-bold">VISA</span>
                  </div>
                  <span className="text-sm font-medium">•••• •••• •••• 4242</span>
                </div>
                <Badge variant="secondary">Primary</Badge>
              </div>
              <p className="text-xs text-gray-500">Expires 12/2025</p>
            </div>
            
            <Button variant="outline" className="w-full">
              <CreditCard className="h-4 w-4 mr-2" />
              Add New Card
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Add New Payment Method</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiry">Expiry Date</Label>
                <Input id="expiry" placeholder="MM/YY" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvv">CVV</Label>
                <Input id="cvv" placeholder="123" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cardName">Cardholder Name</Label>
              <Input id="cardName" placeholder="John Doe" />
            </div>
            <Button className="w-full">
              Add Payment Method
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { date: '2024-01-15', amount: '₹75,000', status: 'Paid', invoice: 'INV-001' },
              { date: '2023-12-15', amount: '₹68,000', status: 'Paid', invoice: 'INV-002' },
              { date: '2023-11-15', amount: '₹72,000', status: 'Paid', invoice: 'INV-003' },
            ].map((bill, index) => (
              <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border border-gray-200 rounded-lg space-y-2 sm:space-y-0">
                <div>
                  <p className="font-medium text-gray-900">{bill.invoice}</p>
                  <p className="text-sm text-gray-500">{bill.date}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-lg font-semibold text-gray-900">{bill.amount}</span>
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    {bill.status}
                  </Badge>
                  <Button variant="outline" size="sm">
                    Download
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderReports = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Report Review</h2>
          <p className="text-gray-600">Review and approve reports before publishing</p>
        </div>
      </div>

      <div className="space-y-4">
        {[
          { 
            id: 'RPT-001', 
            client: 'Servicon', 
            title: 'Q4 Financial Analysis Report', 
            status: 'pending', 
            submittedBy: 'John Smith',
            submittedDate: '2024-01-18',
            description: 'Comprehensive financial analysis for Q4 2023 including revenue breakdown and market trends.'
          },
          { 
            id: 'RPT-002', 
            client: 'Forte', 
            title: 'Market Research Summary', 
            status: 'approved', 
            submittedBy: 'Sarah Johnson',
            submittedDate: '2024-01-17',
            description: 'Market research findings and recommendations for product positioning strategy.'
          },
          { 
            id: 'RPT-003', 
            client: 'Servicon', 
            title: 'Risk Assessment Report', 
            status: 'rejected', 
            submittedBy: 'Mike Davis',
            submittedDate: '2024-01-16',
            description: 'Assessment of operational risks and mitigation strategies for business continuity.'
          },
        ].map((report, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row items-start justify-between space-y-4 lg:space-y-0">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{report.title}</h3>
                    <Badge 
                      variant="secondary"
                      className={
                        report.status === 'pending' 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : report.status === 'approved'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }
                    >
                      {report.status}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p><span className="font-medium">Report ID:</span> {report.id}</p>
                    <p><span className="font-medium">Client:</span> {report.client}</p>
                    <p><span className="font-medium">Submitted by:</span> {report.submittedBy}</p>
                    <p><span className="font-medium">Date:</span> {report.submittedDate}</p>
                  </div>
                  <p className="text-sm text-gray-700 mt-3">{report.description}</p>
                </div>
                
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full lg:w-auto">
                  <Button variant="outline" size="sm" className="flex items-center">
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                  {report.status === 'pending' && (
                    <>
                      <Button size="sm" className="bg-green-600 hover:bg-green-700 flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve
                      </Button>
                      <Button variant="destructive" size="sm" className="flex items-center">
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                    </>
                  )}
                  {report.status === 'approved' && (
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700 flex items-center">
                      <Send className="h-4 w-4 mr-2" />
                      Publish
                    </Button>
                  )}
                </div>
              </div>
              
              {report.status === 'pending' && (
                <div className="mt-4 border-t pt-4">
                  <Label htmlFor={`feedback-${index}`} className="text-sm font-medium">
                    Review Comments
                  </Label>
                  <Textarea 
                    id={`feedback-${index}`}
                    placeholder="Add your review comments here..."
                    className="mt-2"
                    rows={3}
                  />
                </div>
              )}
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
      case 'billing':
        return renderBilling();
      case 'reports':
        return renderReports();
      case 'clients':
        return <div className="p-8 text-center text-gray-500">Client management coming soon...</div>;
      default:
        return renderDashboard();
    }
  };

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Building2 },
    { id: 'clients', label: 'My Clients', icon: Users },
    { id: 'reports', label: 'Report Review', icon: FileText },
    { id: 'billing', label: 'Billing & Cards', icon: CreditCard },
  ];

  return (
    <div className="h-screen flex flex-col">
      <Header 
        portalType="admin" 
        user={mockUser} 
        onMenuToggle={() => setSidebarOpen(!sidebarOpen)} 
      />
      <div className="flex-1 flex relative">
        <div className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
          isMobile ? "top-16" : "top-0"
        )}>
          <div className="flex flex-col h-full">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <nav className="mt-5 flex-1 px-2 space-y-1">
                {sidebarItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      if (isMobile) setSidebarOpen(false);
                    }}
                    className={cn(
                      "group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full text-left transition-colors",
                      activeTab === item.id
                        ? "bg-gray-100 text-gray-900"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    )}
                  >
                    <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </div>

        {sidebarOpen && isMobile && (
          <div 
            className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75" 
            onClick={() => setSidebarOpen(false)}
          />
        )}

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

export default SellerAdminPortal;