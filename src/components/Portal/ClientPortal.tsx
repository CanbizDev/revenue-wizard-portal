
import React, { useState } from 'react';
import Header from '@/components/Layout/Header';
import Sidebar from '@/components/Layout/Sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import DashboardCard from '@/components/Dashboard/DashboardCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ClientProjectDashboard from './ClientProjectDashboard';
import { 
  FileText, 
  CreditCard, 
  Users, 
  Eye,
  History,
  Calendar,
  Download
} from 'lucide-react';

interface ClientPortalProps {
  client?: string;
}

const ClientPortal: React.FC<ClientPortalProps> = ({ client = 'markettrendsai' }) => {
  const [activeTab, setActiveTab] = useState('projects');
  const [userRole] = useState<'client_admin' | 'client_viewer'>('client_admin');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();

  const mockUser = {
    name: 'Sarah Johnson',
    email: `sarah@${client.toLowerCase()}.com`,
    role: userRole === 'client_admin' ? 'Client Admin' : 'Client Viewer',
    company: client.charAt(0).toUpperCase() + client.slice(1)
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Client Dashboard</h2>
        <p className="text-gray-600">Welcome to your reporting portal, {mockUser.name}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <DashboardCard
          title="Active Reports"
          value={8}
          description="Available this month"
          icon={FileText}
        />
        {userRole === 'client_admin' && (
          <DashboardCard
            title="Team Members"
            value={12}
            description="Active users"
            icon={Users}
          />
        )}
        <DashboardCard
          title="Subscription"
          value="Premium"
          description="Active until Dec 2025"
          icon={CreditCard}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Recent Reports</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { title: 'Q4 Analytics Report', date: '2024-12-15', status: 'Published', sections: 5 },
                { title: 'Monthly Performance Review', date: '2024-12-10', status: 'Published', sections: 3 },
                { title: 'Customer Insights Report', date: '2024-12-05', status: 'Draft', sections: 4 },
              ].map((report, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{report.title}</p>
                    <p className="text-xs text-gray-500">{report.sections} sections • {report.date}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge 
                      variant={report.status === 'Published' ? 'default' : 'secondary'}
                      className={report.status === 'Published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}
                    >
                      {report.status}
                    </Badge>
                    <Button size="sm" variant="ghost">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Upcoming Reports</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { title: 'Year-End Summary', dueDate: '2024-12-30', priority: 'high' },
                { title: 'January Forecast', dueDate: '2025-01-05', priority: 'medium' },
                { title: 'Team Performance Review', dueDate: '2025-01-15', priority: 'low' },
              ].map((report, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{report.title}</p>
                    <p className="text-xs text-gray-500">Due: {report.dueDate}</p>
                  </div>
                  <Badge 
                    variant="outline"
                    className={
                      report.priority === 'high' ? 'border-red-200 text-red-800' :
                      report.priority === 'medium' ? 'border-yellow-200 text-yellow-800' :
                      'border-green-200 text-green-800'
                    }
                  >
                    {report.priority}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Current Reports</h2>
          <p className="text-gray-600">Access your latest reports and insights</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {[
          { 
            title: 'Q4 Analytics Report', 
            description: 'Comprehensive quarterly analysis',
            sections: ['Executive Summary', 'Revenue Analysis', 'Market Trends', 'Recommendations'],
            lastUpdated: '2024-12-15',
            status: 'Published'
          },
          { 
            title: 'Monthly Performance Review', 
            description: 'December performance metrics',
            sections: ['KPI Overview', 'Team Performance', 'Goal Progress'],
            lastUpdated: '2024-12-10',
            status: 'Published'
          },
          { 
            title: 'Customer Insights Report', 
            description: 'Customer behavior and satisfaction analysis',
            sections: ['Survey Results', 'Behavior Analysis', 'Satisfaction Scores', 'Action Items'],
            lastUpdated: '2024-12-05',
            status: 'Draft'
          },
        ].map((report, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg">{report.title}</CardTitle>
                <Badge 
                  variant={report.status === 'Published' ? 'default' : 'secondary'}
                  className={report.status === 'Published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}
                >
                  {report.status}
                </Badge>
              </div>
              <p className="text-sm text-gray-600">{report.description}</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Sections:</p>
                  <div className="space-y-1">
                    {report.sections.map((section, sectionIndex) => (
                      <div key={sectionIndex} className="flex items-center justify-between text-xs">
                        <span className="text-gray-600">{section}</span>
                        <Eye className="h-3 w-3 text-gray-400" />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t">
                  <span className="text-xs text-gray-500">Updated: {report.lastUpdated}</span>
                  <div className="flex space-x-1">
                    <Button size="sm" variant="ghost">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
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
      case 'projects':
        return <ClientProjectDashboard client={client} />;
      case 'dashboard':
        return renderDashboard();
      case 'reports':
        return renderReports();
      case 'history':
        return <div className="p-8 text-center text-gray-500">Report history coming soon...</div>;
      case 'users':
        return userRole === 'client_admin' ? 
          <div className="p-8 text-center text-gray-500">User management coming soon...</div> : 
          renderDashboard();
      case 'billing':
        return <div className="p-8 text-center text-gray-500">Billing management coming soon...</div>;
      default:
        return <ClientProjectDashboard client={client} />;
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <Header portalType="client" user={mockUser} onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex-1 flex relative">
        <Sidebar 
          portalType="client" 
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

export default ClientPortal;
