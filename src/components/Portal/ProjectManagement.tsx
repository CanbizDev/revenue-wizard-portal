import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Edit2, Trash2, Users, FileText, Activity, Loader2 } from 'lucide-react';
import { apiService } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

interface Client {
  id: string;
  name: string;
  company?: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  project_type: string;
  project_value: number;
  hourly_budget: number;
  hours_used: number;
  completion_percentage: number;
  status: 'active' | 'inactive';
  tier1_seller_id: string;
  tier2_seller_id: string | null;
  clients: Client[];
}

const ProjectManagement: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Edit project state
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editProjectData, setEditProjectData] = useState({
    name: '',
    description: '',
    project_type: '',
    tier2_seller_id: ''
  });

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true);
        const data = await apiService.getProjects();
        setProjects(data);
      } catch (err) {
        console.error('Failed to load projects:', err);
        setError('Failed to load projects. Please try again.');
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    project_type: '',
    status: 'active' as 'active' | 'inactive',
    tier2_seller_id: ''
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isClientDialogOpen, setIsClientDialogOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [newClient, setNewClient] = useState({
    name: '',
    company: ''
  });

  const handleAddProject = async () => {
    if (newProject.name && newProject.description && newProject.project_type) {
      try {
        const projectData = {
          name: newProject.name,
          description: newProject.description,
          project_type: newProject.project_type,
          status: newProject.status,
          tier2_seller_id: newProject.tier2_seller_id.trim() || null
        };
        
        await apiService.createProject(projectData);
        
        // Refresh the projects list to get the complete project data
        const updatedProjects = await apiService.getProjects();
        setProjects(updatedProjects);
        
        setNewProject({ 
          name: '', 
          description: '', 
          project_type: '', 
          status: 'active',
          tier2_seller_id: ''
        });
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

  const openEditDialog = (project: Project) => {
    setEditingProject(project);
    setEditProjectData({
      name: project.name,
      description: project.description,
      project_type: project.project_type,
      tier2_seller_id: project.tier2_seller_id || ''
    });
    setIsEditDialogOpen(true);
  };

  const closeEditDialog = () => {
    setIsEditDialogOpen(false);
    setEditingProject(null);
    setEditProjectData({
      name: '',
      description: '',
      project_type: '',
      tier2_seller_id: ''
    });
  };

  const handleEditProject = async () => {
    if (!editingProject || !editProjectData.name.trim()) {
      toast({
        title: "Error",
        description: "Project name is required",
        variant: "destructive",
      });
      return;
    }

    try {
      const projectData = {
        name: editProjectData.name,
        description: editProjectData.description,
        project_type: editProjectData.project_type,
        tier2_seller_id: editProjectData.tier2_seller_id.trim() || null
      };

      await apiService.updateProject(editingProject.id, projectData);
      
      // Refresh the projects list to get the updated data
      const updatedProjects = await apiService.getProjects();
      setProjects(updatedProjects);
      
      closeEditDialog();
      
      toast({
        title: "Success",
        description: "Project updated successfully",
      });
    } catch (err) {
      console.error('Failed to update project:', err);
      toast({
        title: "Error",
        description: "Failed to update project",
        variant: "destructive",
      });
    }
  };

  const handleAddClient = async () => {
    if (newClient.name && selectedProjectId) {
      try {
        const clientData = {
          name: newClient.name,
          company: newClient.company || '',
          project_id: selectedProjectId
        };
        
        await apiService.createProjectClient(clientData);
        
        // Refresh projects to show the new client
        const updatedProjects = await apiService.getProjects();
        setProjects(updatedProjects);
        
        setNewClient({ name: '', company: '' });
        setIsClientDialogOpen(false);
        setSelectedProjectId('');
        
        toast({
          title: "Success",
          description: "Client added successfully",
        });
      } catch (err) {
        console.error('Failed to add client:', err);
        toast({
          title: "Error",
          description: "Failed to add client",
          variant: "destructive",
        });
      }
    }
  };

  const openAddClientDialog = (projectId: string) => {
    setSelectedProjectId(projectId);
    setIsClientDialogOpen(true);
  };

  const getStatusColor = (status: string) => {
    if (!status) return 'bg-gray-100 text-gray-800';
    return status === 'active' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-gray-100 text-gray-800';
  };

  // Calculate totals
  const totals = projects.reduce((acc, project) => ({
    totalClients: acc.totalClients + (project.clients?.length || 0),
    totalProjects: projects.length,
    activeProjects: projects.filter(p => p.status === 'active').length
  }), { totalClients: 0, totalProjects: 0, activeProjects: 0 });

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
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  placeholder="Enter project description"
                />
              </div>
              <div>
                <Label htmlFor="project_type">Project Type</Label>
                <Input
                  id="project_type"
                  value={newProject.project_type}
                  onChange={(e) => setNewProject({ ...newProject, project_type: e.target.value })}
                  placeholder="Enter project type"
                />
              </div>
              <div>
                <Label htmlFor="tier2_seller_id">Tier 2 Seller ID (Optional)</Label>
                <Input
                  id="tier2_seller_id"
                  value={newProject.tier2_seller_id}
                  onChange={(e) => setNewProject({ ...newProject, tier2_seller_id: e.target.value })}
                  placeholder="Enter tier2 seller ID if applicable"
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

        {/* Add Client Dialog */}
        <Dialog open={isClientDialogOpen} onOpenChange={setIsClientDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Client to Project</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="clientName">Client Name</Label>
                <Input
                  id="clientName"
                  value={newClient.name}
                  onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                  placeholder="Enter client name"
                />
              </div>
              <div>
                <Label htmlFor="clientCompany">Company (Optional)</Label>
                <Input
                  id="clientCompany"
                  value={newClient.company}
                  onChange={(e) => setNewClient({ ...newClient, company: e.target.value })}
                  placeholder="Enter company name"
                />
              </div>
              <Button onClick={handleAddClient} className="w-full">
                Add Client
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
                <p className="text-sm font-medium text-muted-foreground">Total Clients</p>
                <p className="text-2xl font-bold text-foreground">
                  {totals.totalClients}
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
                <p className="text-sm font-medium text-muted-foreground">Total Projects</p>
                <p className="text-2xl font-bold text-foreground">
                  {totals.totalProjects}
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
                    {project.status ? project.status.charAt(0).toUpperCase() + project.status.slice(1) : 'Unknown'}
                  </Badge>
                </div>
                <div className="flex space-x-1">
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => openAddClientDialog(project.id)}
                    title="Add Client"
                  >
                    <Users className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => openEditDialog(project)}
                    title="Edit Project"
                  >
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
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Project Name</p>
                  <p className="text-base font-semibold text-foreground">{project.name}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Clients</p>
                  <p className="text-sm text-foreground">
                    {(project.clients || []).length > 0 
                      ? (project.clients || []).map(client => client.name).join(', ')
                      : 'No clients assigned'
                    }
                  </p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Type</p>
                  <p className="text-sm text-foreground">{project.project_type}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Description</p>
                  <p className="text-sm text-foreground">{project.description || 'No description available'}</p>
                </div>
                
                {project.tier2_seller_id && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Tier 2 Seller ID</p>
                    <p className="text-sm text-foreground">{project.tier2_seller_id}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Project Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Project Name</Label>
              <Input
                id="edit-name"
                value={editProjectData.name}
                onChange={(e) => setEditProjectData({ ...editProjectData, name: e.target.value })}
                placeholder="Enter project name"
              />
            </div>
            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={editProjectData.description}
                onChange={(e) => setEditProjectData({ ...editProjectData, description: e.target.value })}
                placeholder="Enter project description"
              />
            </div>
            <div>
              <Label htmlFor="edit-project_type">Project Type</Label>
              <Input
                id="edit-project_type"
                value={editProjectData.project_type}
                onChange={(e) => setEditProjectData({ ...editProjectData, project_type: e.target.value })}
                placeholder="Enter project type"
              />
            </div>
            <div>
              <Label htmlFor="edit-tier2_seller_id">Tier 2 Seller ID (Optional)</Label>
              <Input
                id="edit-tier2_seller_id"
                value={editProjectData.tier2_seller_id}
                onChange={(e) => setEditProjectData({ ...editProjectData, tier2_seller_id: e.target.value })}
                placeholder="Enter tier 2 seller ID"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={closeEditDialog}>
                Cancel
              </Button>
              <Button onClick={handleEditProject}>
                Update Project
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjectManagement;