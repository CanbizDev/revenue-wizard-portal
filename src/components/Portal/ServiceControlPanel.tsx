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
  const { toast } = useToast();

  useEffect(() => {
    loadServicesData();
  }, []);

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
      toast({
        title: 'Error',
        description: 'Failed to load services data',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleService = async (serviceId: string, currentStatus: boolean, type: string) => {
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
          <p className="text-gray-600">Manually control service access for all levels</p>
        </div>
        <Button 
          variant="outline" 
          onClick={loadServicesData}
          className="flex items-center space-x-2"
        >
          <Settings className="h-4 w-4" />
          <span>Refresh</span>
        </Button>
      </div>

      {/* Service Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-sm">
              <span className="flex items-center space-x-2">
                <Building2 className="h-4 w-4 text-blue-600" />
                <span>Tier-1 Sellers</span>
              </span>
              <Badge variant="outline">
                {getActiveCount(groupedServices.tier1)}/{groupedServices.tier1.length} Active
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <span className="text-sm text-gray-600">
                {getActiveCount(groupedServices.tier1)} services running
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-sm">
              <span className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-purple-600" />
                <span>Tier-2 Sellers</span>
              </span>
              <Badge variant="outline">
                {getActiveCount(groupedServices.tier2)}/{groupedServices.tier2.length} Active
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <span className="text-sm text-gray-600">
                {getActiveCount(groupedServices.tier2)} services running
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-sm">
              <span className="flex items-center space-x-2">
                <FolderOpen className="h-4 w-4 text-orange-600" />
                <span>Projects</span>
              </span>
              <Badge variant="outline">
                {getActiveCount(groupedServices.projects)}/{groupedServices.projects.length} Active
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <span className="text-sm text-gray-600">
                {getActiveCount(groupedServices.projects)} services running
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Service Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tier-1 Sellers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Building2 className="h-5 w-5 text-blue-600" />
              <span>Tier-1 Sellers</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {groupedServices.tier1.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-4">No Tier-1 sellers found</p>
              ) : (
                groupedServices.tier1.map(service => {
                  const Icon = getServiceIcon(service.type);
                  return (
                    <div key={service.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Icon className="h-4 w-4 text-blue-600" />
                        <div>
                          <p className="font-medium text-sm text-gray-900">{service.name}</p>
                          <p className="text-xs text-gray-500">{service.email}</p>
                          {service.subdomain && (
                            <p className="text-xs text-blue-600">{service.subdomain}.reportingportal.ai</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge 
                          variant={service.isActive ? 'default' : 'secondary'}
                          className={service.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                        >
                          {service.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                        <Switch
                          checked={service.isActive}
                          onCheckedChange={() => toggleService(service.id, service.isActive, service.type)}
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
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-purple-600" />
              <span>Tier-2 Sellers</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {groupedServices.tier2.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-4">No Tier-2 sellers found</p>
              ) : (
                groupedServices.tier2.map(service => {
                  const Icon = getServiceIcon(service.type);
                  return (
                    <div key={service.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Icon className="h-4 w-4 text-purple-600" />
                        <div>
                          <p className="font-medium text-sm text-gray-900">{service.name}</p>
                          <p className="text-xs text-gray-500">{service.email}</p>
                          {service.parentName && (
                            <p className="text-xs text-blue-600">Under: {service.parentName}</p>
                          )}
                          {service.subdomain && (
                            <p className="text-xs text-purple-600">{service.subdomain}.reportingportal.ai</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge 
                          variant={service.isActive ? 'default' : 'secondary'}
                          className={service.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                        >
                          {service.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                        <Switch
                          checked={service.isActive}
                          onCheckedChange={() => toggleService(service.id, service.isActive, service.type)}
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
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FolderOpen className="h-5 w-5 text-orange-600" />
              <span>Projects</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {groupedServices.projects.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-4">No projects found</p>
              ) : (
                groupedServices.projects.map(service => {
                  const Icon = getServiceIcon(service.type);
                  return (
                    <div key={service.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Icon className="h-4 w-4 text-orange-600" />
                        <div>
                          <p className="font-medium text-sm text-gray-900">{service.name}</p>
                          <p className="text-xs text-gray-500">{service.email}</p>
                          {service.parentName && (
                            <p className="text-xs text-blue-600">Seller: {service.parentName}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge 
                          variant={service.isActive ? 'default' : 'secondary'}
                          className={service.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                        >
                          {service.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                        <Switch
                          checked={service.isActive}
                          onCheckedChange={() => toggleService(service.id, service.isActive, service.type)}
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
                Deactivating a service will immediately prevent access to the respective portal. 
                Use this control carefully, especially for active clients with ongoing projects.
                Reactivation will restore full access immediately.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ServiceControlPanel;