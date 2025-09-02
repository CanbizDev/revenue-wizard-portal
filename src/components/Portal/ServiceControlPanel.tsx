import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
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
}

const ServiceControlPanel: React.FC = () => {
  const [services, setServices] = useState<ServiceStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [showExamples, setShowExamples] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadServicesData();
  }, []);

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
      name: 'TechCorp Solutions',
      type: 'tier1',
      isActive: true,
      email: 'admin@techcorp.com',
      subdomain: 'techcorp'
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
      parentName: 'TechCorp Solutions',
      isActive: true,
      email: 'admin@bicorp.com',
      subdomain: 'bicorp'
    },
    {
      id: 'example-tier2-3',
      name: 'Smart Analytics Ltd',
      type: 'tier2',
      parentId: 'example-tier1-1',
      parentName: 'MarketsTrendsAI',
      isActive: false,
      email: 'admin@smartanalytics.com',
      subdomain: 'smartanalytics'
    },
    // Projects
    {
      id: 'example-project-1',
      name: 'Forte Construction',
      type: 'project',
      parentId: 'example-tier1-1',
      parentName: 'MarketsTrendsAI',
      isActive: true,
      email: 'projects@forte.com'
    },
    {
      id: 'example-project-2',
      name: 'Servicon Industries',
      type: 'project',
      parentId: 'example-tier1-1',
      parentName: 'MarketsTrendsAI',
      isActive: true,
      email: 'admin@servicon.com'
    },
    {
      id: 'example-project-3',
      name: 'Cementech Ltd',
      type: 'project',
      parentId: 'example-tier1-1',
      parentName: 'MarketsTrendsAI',
      isActive: true,
      email: 'contact@cementech.com'
    },
    {
      id: 'example-project-4',
      name: 'PPI Manufacturing',
      type: 'project',
      parentId: 'example-tier1-2',
      parentName: 'TechCorp Solutions',
      isActive: false,
      email: 'info@ppi.com'
    },
    {
      id: 'example-project-5',
      name: 'Global Logistics Inc',
      type: 'project',
      parentId: 'example-tier2-1',
      parentName: 'Analytics Pro',
      isActive: true,
      email: 'admin@globallogistics.com'
    },
    {
      id: 'example-project-6',
      name: 'RetailTech Solutions',
      type: 'project',
      parentId: 'example-tier2-2',
      parentName: 'Business Intelligence Corp',
      isActive: false,
      email: 'support@retailtech.com'
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

  const getServiceIcon = (type: string) => {
    switch (type) {
      case 'tier1':
        return Building2;
      case 'tier2':
        return Users;
      case 'project':
        return FolderOpen;
      default:
        return Settings;
    }
  };

  const getServiceTypeLabel = (type: string) => {
    switch (type) {
      case 'tier1':
        return 'Tier-1 Seller';
      case 'tier2':
        return 'Tier-2 Seller';
      case 'project':
        return 'Project';
      default:
        return 'Service';
    }
  };

  const groupedServices = {
    tier1: services.filter(s => s.type === 'tier1'),
    tier2: services.filter(s => s.type === 'tier2'),
    projects: services.filter(s => s.type === 'project')
  };

  const getActiveCount = (serviceList: ServiceStatus[]) => {
    return serviceList.filter(s => s.isActive).length;
  };

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

      {/* Service Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover-scale border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100/50">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center justify-between text-base">
              <span className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-blue-100">
                  <Building2 className="h-5 w-5 text-blue-600" />
                </div>
                <span className="text-gray-900">Tier-1 Sellers</span>
              </span>
              <Badge 
                variant="outline" 
                className="bg-white/80 border-blue-300 text-blue-700 font-medium"
              >
                {getActiveCount(groupedServices.tier1)}/{groupedServices.tier1.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span className="text-sm text-gray-700 font-medium">
                  {getActiveCount(groupedServices.tier1)} active services
                </span>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-blue-600">
                  {groupedServices.tier1.length}
                </p>
                <p className="text-xs text-gray-500">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-scale border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100/50">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center justify-between text-base">
              <span className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-purple-100">
                  <Users className="h-5 w-5 text-purple-600" />
                </div>
                <span className="text-gray-900">Tier-2 Sellers</span>
              </span>
              <Badge 
                variant="outline" 
                className="bg-white/80 border-purple-300 text-purple-700 font-medium"
              >
                {getActiveCount(groupedServices.tier2)}/{groupedServices.tier2.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span className="text-sm text-gray-700 font-medium">
                  {getActiveCount(groupedServices.tier2)} active services
                </span>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-purple-600">
                  {groupedServices.tier2.length}
                </p>
                <p className="text-xs text-gray-500">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-scale border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100/50">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center justify-between text-base">
              <span className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-orange-100">
                  <FolderOpen className="h-5 w-5 text-orange-600" />
                </div>
                <span className="text-gray-900">Projects</span>
              </span>
              <Badge 
                variant="outline" 
                className="bg-white/80 border-orange-300 text-orange-700 font-medium"
              >
                {getActiveCount(groupedServices.projects)}/{groupedServices.projects.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span className="text-sm text-gray-700 font-medium">
                  {getActiveCount(groupedServices.projects)} active services
                </span>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-orange-600">
                  {groupedServices.projects.length}
                </p>
                <p className="text-xs text-gray-500">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Service Controls */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Tier-1 Sellers */}
        <Card className="border-blue-200 shadow-sm">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100/50 border-b border-blue-200">
            <CardTitle className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-blue-100">
                <Building2 className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <span className="text-gray-900">Tier-1 Sellers</span>
                <p className="text-sm text-gray-600 font-normal mt-1">
                  Primary seller accounts
                </p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {groupedServices.tier1.length === 0 ? (
                <div className="text-center py-12">
                  <Building2 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-sm">No Tier-1 sellers found</p>
                </div>
              ) : (
                groupedServices.tier1.map(service => {
                  const Icon = getServiceIcon(service.type);
                  return (
                    <div 
                      key={service.id} 
                      className="animate-fade-in flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-sm transition-all duration-200"
                    >
                      <div className="flex items-center space-x-4 flex-1">
                        <div className="p-2 rounded-lg bg-blue-50">
                          <Icon className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 truncate">{service.name}</p>
                          <p className="text-sm text-gray-500 truncate">{service.email}</p>
                          {service.subdomain && (
                            <p className="text-xs text-blue-600 truncate">
                              {service.subdomain}.reportingportal.ai
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 ml-4">
                        <Badge 
                          variant={service.isActive ? 'default' : 'secondary'}
                          className={`${
                            service.isActive 
                              ? 'bg-green-100 text-green-800 border-green-200' 
                              : 'bg-red-100 text-red-800 border-red-200'
                          } font-medium`}
                        >
                          {service.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                        <Switch
                          checked={service.isActive}
                          onCheckedChange={() => toggleService(service.id, service.isActive, service.type)}
                          className="data-[state=checked]:bg-blue-600"
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>

        {/* Tier-2 Sellers */}
        <Card className="border-purple-200 shadow-sm">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100/50 border-b border-purple-200">
            <CardTitle className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-purple-100">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <span className="text-gray-900">Tier-2 Sellers</span>
                <p className="text-sm text-gray-600 font-normal mt-1">
                  Secondary seller accounts
                </p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {groupedServices.tier2.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-sm">No Tier-2 sellers found</p>
                </div>
              ) : (
                groupedServices.tier2.map(service => {
                  const Icon = getServiceIcon(service.type);
                  return (
                    <div 
                      key={service.id} 
                      className="animate-fade-in flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-purple-300 hover:shadow-sm transition-all duration-200"
                    >
                      <div className="flex items-center space-x-4 flex-1">
                        <div className="p-2 rounded-lg bg-purple-50">
                          <Icon className="h-4 w-4 text-purple-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 truncate">{service.name}</p>
                          <p className="text-sm text-gray-500 truncate">{service.email}</p>
                          {service.parentName && (
                            <p className="text-xs text-blue-600 truncate">Under: {service.parentName}</p>
                          )}
                          {service.subdomain && (
                            <p className="text-xs text-purple-600 truncate">
                              {service.subdomain}.reportingportal.ai
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 ml-4">
                        <Badge 
                          variant={service.isActive ? 'default' : 'secondary'}
                          className={`${
                            service.isActive 
                              ? 'bg-green-100 text-green-800 border-green-200' 
                              : 'bg-red-100 text-red-800 border-red-200'
                          } font-medium`}
                        >
                          {service.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                        <Switch
                          checked={service.isActive}
                          onCheckedChange={() => toggleService(service.id, service.isActive, service.type)}
                          className="data-[state=checked]:bg-purple-600"
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>

        {/* Projects */}
        <Card className="border-orange-200 shadow-sm">
          <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-100/50 border-b border-orange-200">
            <CardTitle className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-orange-100">
                <FolderOpen className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <span className="text-gray-900">Projects</span>
                <p className="text-sm text-gray-600 font-normal mt-1">
                  Client project accounts
                </p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {groupedServices.projects.length === 0 ? (
                <div className="text-center py-12">
                  <FolderOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-sm">No projects found</p>
                </div>
              ) : (
                groupedServices.projects.map(service => {
                  const Icon = getServiceIcon(service.type);
                  return (
                    <div 
                      key={service.id} 
                      className="animate-fade-in flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-orange-300 hover:shadow-sm transition-all duration-200"
                    >
                      <div className="flex items-center space-x-4 flex-1">
                        <div className="p-2 rounded-lg bg-orange-50">
                          <Icon className="h-4 w-4 text-orange-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 truncate">{service.name}</p>
                          <p className="text-sm text-gray-500 truncate">{service.email}</p>
                          {service.parentName && (
                            <p className="text-xs text-blue-600 truncate">Seller: {service.parentName}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 ml-4">
                        <Badge 
                          variant={service.isActive ? 'default' : 'secondary'}
                          className={`${
                            service.isActive 
                              ? 'bg-green-100 text-green-800 border-green-200' 
                              : 'bg-red-100 text-red-800 border-red-200'
                          } font-medium`}
                        >
                          {service.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                        <Switch
                          checked={service.isActive}
                          onCheckedChange={() => toggleService(service.id, service.isActive, service.type)}
                          className="data-[state=checked]:bg-orange-600"
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>
      </div>

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
                    MarketsTrendsAI, TechCorp Solutions, Forte, Servicon, Cementech, and PPI. 
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