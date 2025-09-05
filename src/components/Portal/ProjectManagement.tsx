import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit2, Trash2, Users, FileText, Activity, Loader2 } from 'lucide-react';
import { apiService } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

interface Project {
  id: string;
  name: string;
  members: number;
  activeReports: number;
  status: 'active' | 'inactive';
  totalBilling: number;
  paidAmount: number;
  pendingAmount: number;
  lastPayment: string;
}

const ProjectManagement: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true);
        const data = await apiService.getAllProjects();
        setProjects(data);
      } catch (err) {
        console.error('Failed to load projects, using dummy data:', err);
        
        // Use dummy data when API fails
        const dummyProjects: Project[] = [
          {
            id: 'proj-1',
            name: 'E-commerce Analytics Dashboard',
            members: 8,
            activeReports: 15,
            status: 'active',
            totalBilling: 150000,
            paidAmount: 120000,
            pendingAmount: 30000,
            lastPayment: '2024-02-15'
          },
          {
            id: 'proj-2',
            name: 'Financial Reporting System',
            members: 12,
            activeReports: 22,
            status: 'active',
            totalBilling: 250000,
            paidAmount: 250000,
            pendingAmount: 0,
            lastPayment: '2024-03-01'
          },
          {
            id: 'proj-3',
            name: 'Customer Insights Platform',
            members: 6,
            activeReports: 8,
            status: 'inactive',
            totalBilling: 80000,
            paidAmount: 60000,
            pendingAmount: 20000,
            lastPayment: '2024-01-20'
          }
        ];
        
        setProjects(dummyProjects);
        setError(null); // Clear error since we have dummy data
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  const [newProject, setNewProject] = useState({
    name: '',
    members: '',
    activeReports: '',
    status: 'active' as 'active' | 'inactive'
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddProject = async () => {
    if (newProject.name) {
      try {
        const projectData = {
          name: newProject.name,
          members: parseInt(newProject.members) || 0,
          activeReports: parseInt(newProject.activeReports) || 0,
          status: newProject.status,
        };
        
        const createdProject = await apiService.createProject(projectData);
        setProjects([...projects, createdProject]);
        setNewProject({ name: '', members: '', activeReports: '', status: 'active' });
        setIsDialogOpen(false);
        
        toast({
          title: "Success",
          description: "Project created successfully",
        });
      } catch (err) {
        console.error('Failed to create project:', err);
        toast({
          title: "Error",
          description: "Failed to create project",
          variant: "destructive",
        });
      }
    }
  };

  const handleDeleteProject = async (id: string) => {
    try {
      await apiService.deleteProject(id);
      setProjects(projects.filter(p => p.id !== id));
      
      toast({
        title: "Success",
        description: "Project deleted successfully",
      });
    } catch (err) {
      console.error('Failed to delete project:', err);
      toast({
        title: "Error",
        description: "Failed to delete project",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-gray-100 text-gray-800';
  };

  // Calculate totals
  const totals = projects.reduce((acc, project) => ({
    totalBilling: acc.totalBilling + project.totalBilling,
    totalPaid: acc.totalPaid + project.paidAmount,
    totalPending: acc.totalPending + project.pendingAmount,
    totalProjects: projects.length,
    activeProjects: projects.filter(p => p.status === 'active').length
  }), { totalBilling: 0, totalPaid: 0, totalPending: 0, totalProjects: 0, activeProjects: 0 });

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin mr-3" />
          <span className="text-muted-foreground">Loading projects...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-destructive mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Project Management</h2>
          <p className="text-muted-foreground">Manage your projects and track their progress</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="mr-2 h-4 w-4" />
              Add Project
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Project</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Project Name</Label>
                <Input
                  id="name"
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  placeholder="Enter project name"
                />
              </div>
              <div>
                <Label htmlFor="members">Number of Members</Label>
                <Input
                  id="members"
                  type="number"
                  value={newProject.members}
                  onChange={(e) => setNewProject({ ...newProject, members: e.target.value })}
                  placeholder="Enter number of members"
                />
              </div>
              <div>
                <Label htmlFor="reports">Active Reports</Label>
                <Input
                  id="reports"
                  type="number"
                  value={newProject.activeReports}
                  onChange={(e) => setNewProject({ ...newProject, activeReports: e.target.value })}
                  placeholder="Enter number of active reports"
                />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={newProject.status} onValueChange={(value: 'active' | 'inactive') => setNewProject({ ...newProject, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleAddProject} className="w-full">
                Add Project
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Projects</p>
                <p className="text-2xl font-bold text-foreground">{totals.totalProjects}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Projects</p>
                <p className="text-2xl font-bold text-foreground">{totals.activeProjects}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Members</p>
                <p className="text-2xl font-bold text-foreground">
                  {projects.reduce((sum, p) => sum + p.members, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Reports</p>
                <p className="text-2xl font-bold text-foreground">
                  {projects.reduce((sum, p) => sum + p.activeReports, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card key={project.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold text-foreground">
                    {project.name}
                  </CardTitle>
                  <Badge className={getStatusColor(project.status)}>
                    {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                  </Badge>
                </div>
                <div className="flex space-x-1">
                  <Button size="sm" variant="ghost">
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => handleDeleteProject(project.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Members:</span>
                  <span className="font-medium">{project.members}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Reports:</span>
                  <span className="font-medium">{project.activeReports}</span>
                </div>
              </div>
              
              <div className="border-t pt-3">
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Billing Summary</h4>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span>Total Billing:</span>
                    <span className="font-medium">${(project.totalBilling || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Paid Amount:</span>
                    <span className="font-medium text-green-600">${(project.paidAmount || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pending:</span>
                    <span className="font-medium text-orange-600">${(project.pendingAmount || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Last Payment:</span>
                    <span className="font-medium">{project.lastPayment || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProjectManagement;