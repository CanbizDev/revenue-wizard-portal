import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit2, Trash2, Users, FileText, Activity, Mail, Phone, Calendar } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'member' | 'viewer';
  project: string;
  status: 'active' | 'inactive';
  lastLogin: string;
  joinedDate: string;
}

interface Project {
  id: string;
  name: string;
  members: number;
  activeReports: number;
  status: 'active' | 'inactive';
  description?: string;
  createdDate: string;
  lastActivity: string;
}

const ClientUserManagement: React.FC<{ client: string }> = ({ client }) => {
  const [activeTab, setActiveTab] = useState<'users' | 'projects'>('users');
  
  // Mock data for users
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'John Smith',
      email: 'john@markettrendsai.com',
      role: 'admin',
      project: 'Forte',
      status: 'active',
      lastLogin: '2024-01-15',
      joinedDate: '2023-06-15'
    },
    {
      id: '2',
      name: 'Sarah Wilson',
      email: 'sarah@markettrendsai.com',
      role: 'member',
      project: 'Servicon',
      status: 'active',
      lastLogin: '2024-01-14',
      joinedDate: '2023-08-20'
    },
    {
      id: '3',
      name: 'Mike Johnson',
      email: 'mike@markettrendsai.com',
      role: 'viewer',
      project: 'Forte',
      status: 'inactive',
      lastLogin: '2024-01-10',
      joinedDate: '2023-09-10'
    }
  ]);

  // Mock data for projects
  const [projects, setProjects] = useState<Project[]>([
    {
      id: '1',
      name: 'Forte',
      members: 8,
      activeReports: 12,
      status: 'active',
      description: 'Real estate analytics and market insights platform',
      createdDate: '2023-05-01',
      lastActivity: '2024-01-15'
    },
    {
      id: '2',
      name: 'Servicon',
      members: 5,
      activeReports: 7,
      status: 'active',
      description: 'Critical cleaning services management system',
      createdDate: '2023-07-15',
      lastActivity: '2024-01-12'
    },
    {
      id: '3',
      name: 'Cementech',
      members: 10,
      activeReports: 15,
      status: 'active',
      description: 'Cement industry analytics and reporting',
      createdDate: '2023-09-01',
      lastActivity: '2024-01-10'
    },
    {
      id: '4',
      name: 'PPI Platform',
      members: 3,
      activeReports: 4,
      status: 'inactive',
      description: 'Producer Price Index tracking and analysis',
      createdDate: '2023-11-01',
      lastActivity: '2023-12-20'
    }
  ]);

  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'member' as 'admin' | 'member' | 'viewer',
    project: ''
  });

  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    members: '',
    activeReports: '',
    status: 'active' as 'active' | 'inactive'
  });

  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);

  const handleAddUser = () => {
    if (newUser.name && newUser.email) {
      const user: User = {
        id: Date.now().toString(),
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        project: newUser.project,
        status: 'active',
        lastLogin: 'Never',
        joinedDate: new Date().toLocaleDateString()
      };
      setUsers([...users, user]);
      setNewUser({ name: '', email: '', role: 'member', project: '' });
      setIsUserDialogOpen(false);
    }
  };

  const handleAddProject = () => {
    if (newProject.name) {
      const project: Project = {
        id: Date.now().toString(),
        name: newProject.name,
        description: newProject.description,
        members: parseInt(newProject.members) || 0,
        activeReports: parseInt(newProject.activeReports) || 0,
        status: newProject.status,
        createdDate: new Date().toLocaleDateString(),
        lastActivity: new Date().toLocaleDateString()
      };
      setProjects([...projects, project]);
      setNewProject({ name: '', description: '', members: '', activeReports: '', status: 'active' });
      setIsProjectDialogOpen(false);
    }
  };

  const handleDeleteUser = (id: string) => {
    setUsers(users.filter(u => u.id !== id));
  };

  const handleDeleteProject = (id: string) => {
    setProjects(projects.filter(p => p.id !== id));
  };

  const getStatusColor = (status: string) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-gray-100 text-gray-800';
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800';
      case 'member':
        return 'bg-blue-100 text-blue-800';
      case 'viewer':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Calculate summary stats
  const userStats = {
    totalUsers: users.length,
    activeUsers: users.filter(u => u.status === 'active').length,
    adminUsers: users.filter(u => u.role === 'admin').length
  };

  const projectStats = {
    totalProjects: projects.length,
    activeProjects: projects.filter(p => p.status === 'active').length,
    totalMembers: projects.reduce((sum, p) => sum + p.members, 0),
    totalReports: projects.reduce((sum, p) => sum + p.activeReports, 0)
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">User & Project Management</h2>
          <p className="text-muted-foreground">Manage users and projects for {client}</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-border">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('users')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'users'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300'
            }`}
          >
            <Users className="inline-block w-4 h-4 mr-2" />
            Users ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'projects'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300'
            }`}
          >
            <Activity className="inline-block w-4 h-4 mr-2" />
            Projects ({projects.length})
          </button>
        </nav>
      </div>

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          {/* User Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                    <p className="text-2xl font-bold text-foreground">{userStats.totalUsers}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Activity className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Active Users</p>
                    <p className="text-2xl font-bold text-foreground">{userStats.activeUsers}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Admin Users</p>
                    <p className="text-2xl font-bold text-foreground">{userStats.adminUsers}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Add User Button */}
          <div className="flex justify-end">
            <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90">
                  <Plus className="mr-2 h-4 w-4" />
                  Add User
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New User</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="userName">Full Name</Label>
                    <Input
                      id="userName"
                      value={newUser.name}
                      onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                      placeholder="Enter full name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="userEmail">Email Address</Label>
                    <Input
                      id="userEmail"
                      type="email"
                      value={newUser.email}
                      onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                      placeholder="Enter email address"
                    />
                  </div>
                  <div>
                    <Label htmlFor="userRole">Role</Label>
                    <Select value={newUser.role} onValueChange={(value: 'admin' | 'member' | 'viewer') => setNewUser({ ...newUser, role: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="member">Member</SelectItem>
                        <SelectItem value="viewer">Viewer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="userProject">Assign to Project</Label>
                    <Select value={newUser.project} onValueChange={(value) => setNewUser({ ...newUser, project: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a project" />
                      </SelectTrigger>
                      <SelectContent>
                        {projects.map((project) => (
                          <SelectItem key={project.id} value={project.name}>
                            {project.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={handleAddUser} className="w-full">
                    Add User
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Users Table */}
          <Card>
            <CardHeader>
              <CardTitle>All Users</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Project</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge className={getRoleColor(user.role)}>
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>{user.project || 'Unassigned'}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(user.status)}>
                          {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>{user.lastLogin}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Projects Tab */}
      {activeTab === 'projects' && (
        <div className="space-y-6">
          {/* Project Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Activity className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Projects</p>
                    <p className="text-2xl font-bold text-foreground">{projectStats.totalProjects}</p>
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
                    <p className="text-2xl font-bold text-foreground">{projectStats.activeProjects}</p>
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
                    <p className="text-2xl font-bold text-foreground">{projectStats.totalMembers}</p>
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
                    <p className="text-2xl font-bold text-foreground">{projectStats.totalReports}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Add Project Button */}
          <div className="flex justify-end">
            <Dialog open={isProjectDialogOpen} onOpenChange={setIsProjectDialogOpen}>
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
                    <Label htmlFor="projectName">Project Name</Label>
                    <Input
                      id="projectName"
                      value={newProject.name}
                      onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                      placeholder="Enter project name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="projectDescription">Description</Label>
                    <Input
                      id="projectDescription"
                      value={newProject.description}
                      onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                      placeholder="Enter project description"
                    />
                  </div>
                  <div>
                    <Label htmlFor="projectMembers">Number of Members</Label>
                    <Input
                      id="projectMembers"
                      type="number"
                      value={newProject.members}
                      onChange={(e) => setNewProject({ ...newProject, members: e.target.value })}
                      placeholder="Enter number of members"
                    />
                  </div>
                  <div>
                    <Label htmlFor="projectReports">Active Reports</Label>
                    <Input
                      id="projectReports"
                      type="number"
                      value={newProject.activeReports}
                      onChange={(e) => setNewProject({ ...newProject, activeReports: e.target.value })}
                      placeholder="Enter number of active reports"
                    />
                  </div>
                  <div>
                    <Label htmlFor="projectStatus">Status</Label>
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
                  <p className="text-sm text-muted-foreground">{project.description}</p>
                  
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
                  
                  <div className="border-t pt-3 text-xs text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Created: {project.createdDate}</span>
                      <span>Last Activity: {project.lastActivity}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientUserManagement;