import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { apiService } from '@/services/api';
import {
  Building2,
  Users,
  FolderOpen,
  Settings,
  Shield,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

interface ServiceStatus {
  id: string;
  name: string;
  type: 'tier1' | 'tier2' | 'project';
  parentId?: string;
  parentName?: string;
  isActive: boolean;
  email?: string;
  subdomain?: string;
  serviceType?: 'doc' | 'email' | 'project';
  tierLevel?: 'Tier 1' | 'Tier 2';
}

const ServiceControlPanel: React.FC = () => {
  const [services, setServices] = useState<ServiceStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [showExamples, setShowExamples] = useState(false);
  const [serviceStatuses, setServiceStatuses] = useState<{[key: string]: boolean}>({});
  const { toast } = useToast();

  useEffect(() => {
    loadServicesData();
  }, []);

  // Initialize service statuses when services load
  useEffect(() => {
    const statuses: {[key: string]: boolean} = {};
    services.forEach(service => {
      if (service.type === 'tier1' || service.type === 'tier2') {
        statuses[`${service.id}-doc`] = service.isActive;
        statuses[`${service.id}-email`] = service.isActive;
      } else if (service.type === 'project') {
        statuses[service.id] = service.isActive;
      }
    });
    setServiceStatuses(statuses);
  }, [services]);

  // Example data for demonstration
  const getExampleServices = (): ServiceStatus[] => [
    // Tier-1 Sellers
    {
      id: 'example-tier1-1',
      name: 'MarketsTrendsAI',
      type: 'tier1',
      isActive: true,
      email: 'admin@marketstrendsai.com',
      subdomain: 'marketstrendsai'
    },
    {
      id: 'example-tier1-2',
      name: 'Margin',
      type: 'tier1',
      isActive: true,
      email: 'admin@margin.com',
      subdomain: 'margin'
    },
    {
      id: 'example-tier1-3',
      name: 'DataFlow Analytics',
      type: 'tier1',
      isActive: false,
      email: 'admin@dataflow.com',
      subdomain: 'dataflow'
    },
    // Projects
    {
      id: 'example-project-1',
      name: 'Forte',
      type: 'project',
      parentId: 'example-tier1-1',
      parentName: 'MarketsTrendsAI',
      isActive: true,
      email: 'projects@forte.com'
    },
    {
      id: 'example-project-2',
      name: 'Servicon',
      type: 'project',
      parentId: 'example-tier1-1',
      parentName: 'MarketsTrendsAI',
      isActive: true,
      email: 'admin@servicon.com'
    },
    {
      id: 'example-project-3',
      name: 'Cementech',
      type: 'project',
      parentId: 'example-tier1-2',
      parentName: 'Margin',
      isActive: false,
      email: 'contact@cementech.com'
    },
    {
      id: 'example-project-4',
      name: 'PPI Manufacturing',
      type: 'project',
      parentId: 'example-tier1-2',
      parentName: 'Margin',
      isActive: false,
      email: 'info@ppi.com'
    }
  ];

  const loadServicesData = async () => {
    try {
      setLoading(true);

      // Load Tier-1 Sellers from API
      const tier1Data = await apiService.getAllTier1Sellers();
      
      // Load Tier-2 Sellers from API
      const tier2Data = await apiService.getAllTier2Sellers();

      // Load Projects from API
      const projectsData = await apiService.getProjects();

      // Transform data into service status format
      const allServices: ServiceStatus[] = [];

      // Add Tier-1 Sellers
      tier1Data?.forEach(seller => {
        allServices.push({
          id: seller.id,
          name: seller.name,
          type: 'tier1',
          isActive: seller.status === 'active',
          email: seller.admin_email,
          subdomain: seller.subdomain,
          tierLevel: 'Tier 1'
        });
      });

      // Add Tier-2 Sellers
      tier2Data?.forEach(seller => {
        allServices.push({
          id: seller.id,
          name: seller.name,
          type: 'tier2',
          isActive: seller.status === 'active',
          email: seller.admin_email,
          subdomain: seller.subdomain,
          tierLevel: 'Tier 2'
        });
      });

      // Add Projects
      projectsData?.forEach(project => {
        let parentName = 'Unknown Seller';
        let tierLevel: 'Tier 1' | 'Tier 2' = 'Tier 1';
        let parentId = project.tier1_seller_id;

        // Check if project belongs to Tier 2 seller
        if (project.tier2_seller_id) {
          parentId = project.tier2_seller_id;
          tierLevel = 'Tier 2';
          parentName = tier2Data.find(seller => seller.id === project.tier2_seller_id)?.name || 'Unknown Tier 2 Seller';
        } else if (project.tier1_seller_id) {
          // Project belongs to Tier 1 seller
          parentName = tier1Data.find(seller => seller.id === project.tier1_seller_id)?.name || 'Unknown Tier 1 Seller';
        }

        allServices.push({
          id: project.id,
          name: project.name,
          type: 'project',
          parentId: parentId,
          parentName: parentName,
          isActive: project.status === 'active',
          email: project.clients?.[0]?.company || 'No client assigned',
          tierLevel: tierLevel
        });
      });

      setServices(allServices);
    } catch (error: any) {
      console.error('Error loading services data:', error);
      
      // If there's an error loading real data, show example data
      setServices(getExampleServices());
      setShowExamples(true);
      
      toast({
        title: 'Demo Mode',
        description: 'Showing example data. Connect to database for real services.',
        variant: 'default'
      });
    } finally {
      setLoading(false);
    }
  };

  // Toggle individual service status
  const toggleServiceStatus = async (serviceKey: string, serviceType: string) => {
    try {
      // For projects, call the API to toggle status
      if (serviceType === 'project') {
        await apiService.toggleProjectStatus(serviceKey);
      }
      
      // Update local state
      setServiceStatuses(prev => ({
        ...prev,
        [serviceKey]: !prev[serviceKey]
      }));
      
      toast({
        title: 'Service Updated',
        description: `Service ${!serviceStatuses[serviceKey] ? 'activated' : 'deactivated'} successfully`,
      });
    } catch (error: any) {
      console.error('Error toggling service status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update service status',
        variant: 'destructive'
      });
    }
  };

  // Flatten services for table view
  const flattenedServices: Array<{
    company: string;
    tier: string;
    service: string;
    status: boolean;
    id: string;
    type: string;
  }> = [];

  services.forEach(service => {
    // if (service.type === 'tier1') {
    //   // Add Doc and Email services for Tier 1 using independent statuses
    //   flattenedServices.push({
    //     company: service.name,
    //     tier: 'Tier 1',
    //     service: 'Doc',
    //     status: serviceStatuses[`${service.id}-doc`] ?? service.isActive,
    //     id: `${service.id}-doc`,
    //     type: service.type
    //   });
    //   flattenedServices.push({
    //     company: service.name,
    //     tier: 'Tier 1',
    //     service: 'Email',
    //     status: serviceStatuses[`${service.id}-email`] ?? service.isActive,
    //     id: `${service.id}-email`,
    //     type: service.type
    //   });
     if (service.type === 'project') {
      // Add project as service using independent status
      flattenedServices.push({
        company: service.parentName || 'Unknown Parent',
        tier: service.tierLevel || 'Tier 1',
        service: service.name,
        status: serviceStatuses[service.id] ?? service.isActive,
        id: service.id,
        type: service.type
      });
    }
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Service Control Panel</h2>
          <p className="text-gray-600">Loading services...</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Service Control Panel</h2>
          <p className="text-gray-600">
            Manually control service access for all levels
            {showExamples && <span className="text-orange-600"> • Showing example data</span>}
          </p>
        </div>
      </div>

      {/* Service Control Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>Service Management</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="space-y-3">
              {flattenedServices.map((item, index) => (
                <div 
                  key={`${item.id}-${item.service}`}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="flex items-center space-x-2 min-w-0 flex-1">
                      <span className="font-medium text-gray-900 truncate">
                        {item.company}
                      </span>
                      <span className="text-gray-500">•</span>
                      <Badge variant="secondary" className="whitespace-nowrap">
                        {item.tier}
                      </Badge>
                      <span className="text-gray-500">•</span>
                      <span className="text-gray-700 truncate">
                        {item.service}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge 
                      variant={item.status ? "default" : "secondary"}
                      className={`${
                        item.status 
                          ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                          : 'bg-red-100 text-red-800 hover:bg-red-200'
                      }`}
                    >
                      {item.status ? 'Active' : 'Inactive'}
                    </Badge>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant={item.status ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleServiceStatus(item.id, item.type)}
                        className={item.status ? "bg-green-600 hover:bg-green-700" : ""}
                      >
                        {item.status ? 'Active' : 'Inactive'}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              {flattenedServices.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                  <p>No services found</p>
                  <p className="text-sm">Add some companies to see services here</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Warning Notice */}
      <Card className="border-orange-200 bg-orange-50">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-orange-900 mb-1">Service Control Notice</h4>
              <p className="text-sm text-orange-800">
                {showExamples ? (
                  <>
                    Currently showing example data for demonstration. These are sample companies including 
                    MarketsTrendsAI, Margin, Forte, Servicon, Cementech, and PPI. 
                    Toggle buttons work in demo mode to show functionality.
                  </>
                ) : (
                  <>
                    Deactivating a service will immediately prevent access to the respective portal. 
                    Use this control carefully, especially for active clients with ongoing projects.
                    Reactivation will restore full access immediately.
                  </>
                )}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ServiceControlPanel;