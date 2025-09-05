// API service layer for backend communication
const API_BASE_URL = 'http://localhost:5021/api';

export interface LoginRequest {
  email: string;
  password: string;
  user_type: 'seller' | 'client' | 'admin';
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    user_type: 'seller' | 'client' | 'admin';
    company?: string;
  };
}

export interface BillingSummary {
  billing_summary: {
    total_revenue: number;
    total_paid: number;
    total_pending: number;
    collection_rate: number;
  };
  projects: Array<{
    project_name: string;
    client_company: string;
    total_billed: number;
    paid_amount: number;
    completion_percentage: number;
  }>;
}

export interface DashboardData {
  metrics: {
    total_clients: number;
    active_projects: number;
    monthly_revenue: number;
    growth_rate: number;
  };
  recent_activity: Array<{
    id: string;
    type: string;
    description: string;
    timestamp: string;
  }>;
}

export interface CompanyInfo {
  id: string;
  name: string;
  subdomain: string;
  type: 'root_admin' | 'tier1_seller' | 'tier2_seller';
  color: string;
  clients: string[];
  hasAdmin: boolean;
  description: string;
}

export interface ClientConfig {
  id: string;
  name: string;
  company: string;
  tagline: string;
  description: string;
  theme_config: {
    bgPattern: string;
    accentColor: string;
    isSpaceTheme?: boolean;
    icon: string;
  };
}

class ApiService {
  private token: string | null = null;

  constructor() {
    // Load token from localStorage on initialization
    this.token = localStorage.getItem('auth_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      if (response.status === 401) {
        this.logout();
        throw new Error('Authentication failed');
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Authentication
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await this.request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    this.token = response.token;
    localStorage.setItem('auth_token', response.token);
    localStorage.setItem('user_data', JSON.stringify(response.user));
    
    return response;
  }

  logout(): void {
    this.token = null;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
  }

  // Dashboard endpoints
  async getSellerDashboard(): Promise<DashboardData> {
    return this.request<DashboardData>('/seller/dashboard');
  }

  async getClientDashboard(): Promise<DashboardData> {
    return this.request<DashboardData>('/client/dashboard');
  }

  async getAdminDashboard(): Promise<DashboardData> {
    return this.request<DashboardData>('/admin/dashboard');
  }

  // Billing endpoints
  async getBillingSummary(): Promise<BillingSummary> {
    return this.request<BillingSummary>('/seller/billing-summary');
  }

  async getProjectBillingDetails(projectId: string): Promise<any> {
    return this.request(`/seller/project/${projectId}/billing-details`);
  }

  // Management endpoints
  async addClient(clientData: any): Promise<any> {
    return this.request('/seller/clients', {
      method: 'POST',
      body: JSON.stringify(clientData),
    });
  }

  async createPlan(planData: any): Promise<any> {
    return this.request('/seller/plans', {
      method: 'POST',
      body: JSON.stringify(planData),
    });
  }

  // Project endpoints
  async getClientProjects(clientName: string): Promise<any[]> {
    return this.request<any[]>(`/client/${clientName}/projects`);
  }

  async getProjectBilling(clientName: string): Promise<any[]> {
    return this.request<any[]>(`/client/${clientName}/billing`);
  }

  async getAllProjects(): Promise<any[]> {
    return this.request<any[]>('/projects');
  }

  async createProject(projectData: any): Promise<any> {
    return this.request('/projects', {
      method: 'POST',
      body: JSON.stringify(projectData),
    });
  }

  async deleteProject(projectId: string): Promise<any> {
    return this.request(`/projects/${projectId}`, {
      method: 'DELETE',
    });
  }

  // Company and client endpoints
  async getCompanyInfo(company: string): Promise<CompanyInfo> {
    return this.request<CompanyInfo>(`/company/${company}/info`);
  }

  async getClientConfig(clientName: string): Promise<ClientConfig> {
    return this.request<ClientConfig>(`/client/${clientName}/config`);
  }

  async getCompanyClients(company: string): Promise<string[]> {
    return this.request<string[]>(`/company/${company}/clients`);
  }

  async authenticateClient(clientName: string, credentials: { email: string; password: string }): Promise<LoginResponse> {
    return this.request<LoginResponse>(`/client/${clientName}/login`, {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  // Utility methods
  isAuthenticated(): boolean {
    return !!this.token;
  }

  getCurrentUser(): any {
    const userData = localStorage.getItem('user_data');
    return userData ? JSON.parse(userData) : null;
  }
}

export const apiService = new ApiService();