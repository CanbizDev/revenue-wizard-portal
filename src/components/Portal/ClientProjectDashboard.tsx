import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, FileText, Calendar, TrendingUp } from 'lucide-react';

interface ClientProjectDashboardProps {
  client: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'pending';
  lastUpdated: string;
  type: string;
}

const CLIENT_PROJECTS: Record<string, Project[]> = {
  'markettrendsai': [
    {
      id: 'forte',
      name: 'Forte',
      description: 'Real estate analytics and market insights platform',
      status: 'active',
      lastUpdated: '2024-01-15',
      type: 'Analytics'
    },
    {
      id: 'servicon',
      name: 'Servicon',
      description: 'Critical cleaning services management system',
      status: 'active',
      lastUpdated: '2024-01-12',
      type: 'Management'
    }
  ],
  'margin': [
    {
      id: 'email-classifier',
      name: 'Email Classifier',
      description: 'AI-powered email categorization and routing system',
      status: 'active',
      lastUpdated: '2024-01-14',
      type: 'AI/ML'
    },
    {
      id: 'document-classifier',
      name: 'Document Classifier',
      description: 'Document processing and classification platform',
      status: 'active',
      lastUpdated: '2024-01-13',
      type: 'AI/ML'
    }
  ]
};

const ClientProjectDashboard: React.FC<ClientProjectDashboardProps> = ({ client }) => {
  const projects = CLIENT_PROJECTS[client.toLowerCase()] || [];
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'analytics':
        return 'bg-purple-100 text-purple-800';
      case 'management':
        return 'bg-blue-100 text-blue-800';
      case 'ai/ml':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Projects Dashboard</h2>
          <p className="text-muted-foreground">
            Welcome back! Here are your {client} projects.
          </p>
        </div>
        <Badge className="bg-primary/10 text-primary">
          {projects.length} {projects.length === 1 ? 'Project' : 'Projects'}
        </Badge>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Projects</p>
                <p className="text-2xl font-bold text-foreground">{projects.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Projects</p>
                <p className="text-2xl font-bold text-foreground">
                  {projects.filter(p => p.status === 'active').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
                <p className="text-sm font-bold text-foreground">
                  {projects.length > 0 ? new Date(Math.max(...projects.map(p => new Date(p.lastUpdated).getTime()))).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Projects Grid */}
      {projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card key={project.id} className="hover:shadow-lg transition-all duration-300 border border-border bg-card">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1 flex-1">
                    <CardTitle className="text-lg font-semibold text-foreground">
                      {project.name}
                    </CardTitle>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(project.status)}>
                        {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                      </Badge>
                      <Badge variant="outline" className={getTypeColor(project.type)}>
                        {project.type}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {project.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="text-xs text-muted-foreground">
                    <span className="font-medium">Updated:</span> {new Date(project.lastUpdated).toLocaleDateString()}
                  </div>
                </div>
                
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No Projects Found</h3>
            <p className="text-muted-foreground">
              No projects are currently available for {client}. Contact your administrator for access.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ClientProjectDashboard;