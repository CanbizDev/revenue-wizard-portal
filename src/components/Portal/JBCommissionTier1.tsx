import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Building2, 
  DollarSign, 
  Users, 
  Settings,
  Save,
  Edit
} from 'lucide-react';

interface Project {
  id: string;
  name: string;
  tier2_seller_name: string;
  tier2_seller_id: string;
  project_value: number;
  commission_received: number;
  status: 'active' | 'completed' | 'on_hold';
  completion_percentage: number;
}

const JBCommissionTier1: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [jbCommissionPercentage, setJbCommissionPercentage] = useState<number>(0);
  const [isEditingPercentage, setIsEditingPercentage] = useState(false);
  const [tempPercentage, setTempPercentage] = useState<number>(0);
  const { toast } = useToast();

  // Mock data for projects from tier2 sellers
  const mockProjects: Project[] = [
    {
      id: '1',
      name: 'Analytics Dashboard Development',
      tier2_seller_name: 'DataTech Solutions',
      tier2_seller_id: 'tier2_1',
      project_value: 500000,
      commission_received: 25000,
      status: 'active',
      completion_percentage: 65
    },
    {
      id: '2',
      name: 'E-commerce Platform',
      tier2_seller_name: 'TechFlow Systems',
      tier2_seller_id: 'tier2_2',
      project_value: 750000,
      commission_received: 37500,
      status: 'active',
      completion_percentage: 40
    },
    {
      id: '3',
      name: 'CRM Integration',
      tier2_seller_name: 'InnovateX',
      tier2_seller_id: 'tier2_3',
      project_value: 300000,
      commission_received: 30000,
      status: 'completed',
      completion_percentage: 100
    },
    {
      id: '4',
      name: 'Mobile App Development',
      tier2_seller_name: 'DataTech Solutions',
      tier2_seller_id: 'tier2_1',
      project_value: 600000,
      commission_received: 18000,
      status: 'active',
      completion_percentage: 30
    }
  ];

  useEffect(() => {
    // Load mock data
    setProjects(mockProjects);
    setJbCommissionPercentage(15); // Default 15% commission for JB
    setTempPercentage(15);
  }, []);

  const handleSavePercentage = () => {
    setJbCommissionPercentage(tempPercentage);
    setIsEditingPercentage(false);
    toast({
      title: 'Success',
      description: 'JB Commission percentage updated successfully'
    });
  };

  const handleCancelEdit = () => {
    setTempPercentage(jbCommissionPercentage);
    setIsEditingPercentage(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'on_hold':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const totalCommissionReceived = projects.reduce((sum, project) => sum + project.commission_received, 0);
  const totalProjectValue = projects.reduce((sum, project) => sum + project.project_value, 0);
  const jbCommissionAmount = (totalCommissionReceived * jbCommissionPercentage) / 100;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Commission (For JB)</h2>
        <p className="text-gray-600">Manage JB commission settings and view project commission details</p>
      </div>

      {/* Commission Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>JB Commission Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="jb-commission">Commission % (For JB)</Label>
              <div className="flex items-center space-x-2">
                {isEditingPercentage ? (
                  <>
                    <Input
                      id="jb-commission"
                      type="number"
                      value={tempPercentage}
                      onChange={(e) => setTempPercentage(Number(e.target.value))}
                      placeholder="Enter percentage"
                      min="0"
                      max="100"
                      step="0.1"
                      className="w-32"
                    />
                    <span className="text-gray-500">%</span>
                    <Button size="sm" onClick={handleSavePercentage}>
                      <Save className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-md">
                      <span className="font-medium">{jbCommissionPercentage}%</span>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => setIsEditingPercentage(true)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Total Commission Received</Label>
              <div className="p-2 bg-green-50 rounded-md">
                <span className="font-medium text-green-800">₹{totalCommissionReceived.toLocaleString()}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Commission to JB</Label>
              <div className="p-2 bg-blue-50 rounded-md">
                <span className="font-medium text-blue-800">₹{jbCommissionAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Projects List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Building2 className="h-5 w-5" />
            <span>Tier-2 Seller Projects</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {projects.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No projects found from Tier-2 sellers.
              </div>
            ) : (
              projects.map((project) => (
                <div key={project.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-3 md:space-y-0">
                    <div className="flex-1">
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                          <Building2 className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{project.name}</h3>
                          <p className="text-sm text-gray-500 flex items-center space-x-1">
                            <Users className="h-3 w-3" />
                            <span>{project.tier2_seller_name}</span>
                          </p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge className={getStatusColor(project.status)}>
                              {project.status.replace('_', ' ')}
                            </Badge>
                            <span className="text-xs text-gray-500">
                              {project.completion_percentage}% complete
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm w-full md:w-auto">
                      <div className="text-center">
                        <p className="text-gray-500">Project Value</p>
                        <p className="font-medium">₹{project.project_value.toLocaleString()}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-gray-500">Commission Received</p>
                        <p className="font-medium text-green-600">₹{project.commission_received.toLocaleString()}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-gray-500">JB Commission</p>
                        <p className="font-medium text-blue-600">
                          ₹{((project.commission_received * jbCommissionPercentage) / 100).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Building2 className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm text-gray-500">Total Projects</p>
                <p className="font-medium">{projects.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm text-gray-500">Total Project Value</p>
                <p className="font-medium">₹{totalProjectValue.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-orange-600" />
              <div>
                <p className="text-sm text-gray-500">Commission Received</p>
                <p className="font-medium">₹{totalCommissionReceived.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-purple-600" />
              <div>
                <p className="text-sm text-gray-500">JB Commission</p>
                <p className="font-medium">₹{jbCommissionAmount.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default JBCommissionTier1;