import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
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
  serviceType?: 'doc' | 'email' | 'project'; // Track specific service type
}

const ServiceControlPanel: React.FC = () => {
  const [services, setServices] = useState<ServiceStatus[]>([]);
  const [serviceStates, setServiceStates] = useState<{[key: string]: boolean}>({});
  const [loading, setLoading] = useState(true);
  const [showExamples, setShowExamples] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadServicesData();
  }, []);

  // Initialize service states for independent control
  useEffect(() => {
    const initialStates: {[key: string]: boolean} = {};
    services.forEach(service => {
      if (service.type === 'tier1') {
        // Create independent states for Doc and Email services
        initialStates[`${service.id}-doc`] = service.isActive;
        initialStates[`${service.id}-email`] = service.isActive;
      } else if (service.type === 'project') {
        initialStates[service.id] = service.isActive;
      }
    });
    setServiceStates(initialStates);
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
    // Tier-2 Sellers
    {
      id: 'example-tier2-1',
      name: 'Analytics Pro',
      type: 'tier2',
      parentId: 'example-tier1-1',
      parentName: 'MarketsTrendsAI',
      isActive: true,
      email: 'admin@analyticspro.com',
      subdomain: 'analyticspro'
    },
    {
      id: 'example-tier2-2',
      name: 'Business Intelligence Corp',
      type: 'tier2',
      parentId: 'example-tier1-2',
      parentName: 'Margin',
      isActive: true,
      email: 'admin@bicorp.com',
      subdomain: 'bicorp'
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

      // Load Tier-1 Sellers
      const { data: tier1Data, error: tier1Error } = await supabase
        .from('sellers')
        .select('id, name, admin_email, subdomain, status')
        .order('name');

      if (tier1Error) throw tier1Error;

      // Load Tier-2 Sellers
      const { data: tier2Data, error: tier2Error } = await supabase
        .from('tier2_sellers')
        .select(`
          id, 
          name, 
          admin_email, 
          subdomain, 
          status,
          tier1_seller_id,
          tier1_seller:sellers(name)
        `)
        .order('name');

      if (tier2Error) throw tier2Error;

      // Load Clients (Projects) - assuming clients table represents projects
      const { data: clientsData, error: clientsError } = await supabase
        .from('clients')
        .select(`
          id,
          company,
          email,
          status,
          seller_id,
          seller:sellers(name)
        `)
        .order('company');

      if (clientsError) throw clientsError;

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
          subdomain: seller.subdomain
        });
      });

      // Add Tier-2 Sellers
      tier2Data?.forEach(seller => {
        allServices.push({
          id: seller.id,
          name: seller.name,
          type: 'tier2',
          parentId: seller.tier1_seller_id,
          parentName: seller.tier1_seller?.name,
          isActive: seller.status === 'active',
          email: seller.admin_email,
          subdomain: seller.subdomain
        });
      });

      // Add Projects (Clients)
      clientsData?.forEach(client => {
        allServices.push({
          id: client.id,
          name: client.company,
          type: 'project',
          parentId: client.seller_id,
          parentName: client.seller?.name,
          isActive: client.status === 'active',
          email: client.email
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

  // New toggle function for independent services
  const toggleIndependentService = (serviceKey: string) => {
    setServiceStates(prev => ({
      ...prev,
      [serviceKey]: !prev[serviceKey]
    }));
    
    toast({
      title: 'Demo Mode',
      description: `Service ${!serviceStates[serviceKey] ? 'activated' : 'deactivated'} independently`,
    });
  };

  const toggleService = async (serviceId: string, currentStatus: boolean, type: string) => {
    // If showing examples, just update local state
    if (showExamples || serviceId.startsWith('example-')) {
      setServices(prev => prev.map(service => 
        service.id === serviceId 
          ? { ...service, isActive: !currentStatus }
          : service
      ));
      
      toast({
        title: 'Demo Mode',
        description: `Service ${!currentStatus ? 'activated' : 'deactivated'} in demo mode`,
      });
      return;
    }
    try {
      const newStatus = currentStatus ? 'inactive' : 'active';
      
      let table: 'sellers' | 'tier2_sellers' | 'clients';
      switch (type) {
        case 'tier1':
          table = 'sellers';
          break;
        case 'tier2':
          table = 'tier2_sellers';
          break;
        case 'project':
          table = 'clients';
          break;
        default:
          throw new Error('Invalid service type');
      }

      const { error } = await supabase
        .from(table)
        .update({ status: newStatus })
        .eq('id', serviceId);

      if (error) throw error;

      // Update local state
      setServices(prev => prev.map(service => 
        service.id === serviceId 
          ? { ...service, isActive: !currentStatus }
          : service
      ));

      toast({
        title: 'Success',
        description: `Service ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`,
      });
    } catch (error: any) {
      console.error('Error toggling service:', error);
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
    if (service.type === 'tier1') {
      // Add Doc and Email services for Tier 1 using independent states
      flattenedServices.push({
        company: service.name,
        tier: 'Tier 1',
        service: 'Doc',
        status: serviceStates[`${service.id}-doc`] ?? service.isActive,
        id: `${service.id}-doc`,
        type: service.type
      });
      flattenedServices.push({
        company: service.name,
        tier: 'Tier 1',
        service: 'Email',
        status: serviceStates[`${service.id}-email`] ?? service.isActive,
        id: `${service.id}-email`,
        type: service.type
      });
    } else if (service.type === 'project') {
      // Add project as service
      flattenedServices.push({
        company: service.parentName || 'Unknown Parent',
        tier: 'Tier 1',
        service: service.name,
        status: serviceStates[service.id] ?? service.isActive,
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
        <div className="flex items-center space-x-2">
          {!showExamples && (
            <Button 
              variant="outline" 
              onClick={loadServicesData}
              className="flex items-center space-x-2"
            >
              <Settings className="h-4 w-4" />
              <span>Refresh</span>
            </Button>
          )}
          <Button 
            variant={showExamples ? "default" : "outline"}
            onClick={() => {
              if (showExamples) {
                loadServicesData();
                setShowExamples(false);
              } else {
                setServices(getExampleServices());
                setShowExamples(true);
              }
            }}
            className="flex items-center space-x-2"
          >
            <Shield className="h-4 w-4" />
            <span>{showExamples ? 'Load Real Data' : 'Show Examples'}</span>
          </Button>
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
                    <Switch
                      checked={item.status}
                      onCheckedChange={() => {
                        if (item.service === 'Doc' || item.service === 'Email') {
                          // Use independent toggle for Doc/Email services
                          toggleIndependentService(item.id);
                        } else {
                          // Use regular toggle for project services
                          toggleService(item.id, item.status, item.type);
                        }
                      }}
                      className="data-[state=checked]:bg-green-600"
                    />
                  </div>
                </div>
              ))}
              {flattenedServices.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                  <p>No services found</p>
                  <p className="text-sm">Click "Show Examples" to see demo data</p>
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
                    Toggle switches work in demo mode to show functionality.
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