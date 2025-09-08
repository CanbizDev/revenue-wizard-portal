import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

// API service layer for Flask backend communication
const API_BASE_URL = 'http://localhost:5021/api';

export interface LoginRequest {
  email: string;
  password: string;
  userType: 'seller' | 'client' | 'admin';
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    userType: 'seller' | 'client' | 'admin';
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

export interface Project {
  id: string;
  name: string;
  client: string;
  status: string;
  progress: number;
  deadline: string;
  description: string;
}

class ApiService {
  private axiosInstance: AxiosInstance;
  private token: string | null = null;

  constructor() {
    // Load token from localStorage on initialization
    this.token = localStorage.getItem('auth_token');

    // Create axios instance with base configuration
    this.axiosInstance = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor to include auth token
    this.axiosInstance.interceptors.request.use(
      (config) => {
        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Add response interceptor to handle auth errors
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          this.logout();
        }
        return Promise.reject(error);
      }
    );
  }

  private async makeRequest<T>(
    method: string,
    endpoint: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      const response = await this.axiosInstance.request({
        method,
        url: endpoint,
        data,
        ...config,
      });
      return response.data;
    } catch (error) {
      console.error(`API request failed: ${method} ${endpoint}`, error);
      // Return dummy data for development
      return this.getDummyData(endpoint) as T;
    }
  }

  private getDummyData(endpoint: string): any {
    // Dashboard data
    if (endpoint.includes('/dashboard')) {
      return {
        metrics: {
          total_clients: 156,
          active_projects: 42,
          monthly_revenue: 125000,
          growth_rate: 23.5
        },
        recent_activity: [
          {
            id: '1',
            type: 'client_added',
            description: 'New client ABC Corp added',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
          },
          {
            id: '2',
            type: 'payment_received',
            description: 'Payment of ₹50,000 received from XYZ Ltd',
            timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
          },
          {
            id: '3',
            type: 'project_completed',
            description: 'Project Dashboard Analytics completed',
            timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
          }
        ]
      };
    }

    // Billing summary
    if (endpoint.includes('/billing-summary')) {
      return {
        billing_summary: {
          total_revenue: 1250000,
          total_paid: 1000000,
          total_pending: 250000,
          collection_rate: 80
        },
        projects: [
          {
            project_name: 'E-commerce Analytics',
            client_company: 'TechCorp Solutions',
            total_billed: 150000,
            paid_amount: 120000,
            completion_percentage: 85
          },
          {
            project_name: 'Financial Dashboard',
            client_company: 'FinanceFlow Inc',
            total_billed: 200000,
            paid_amount: 200000,
            completion_percentage: 100
          }
        ]
      };
    }

    // Company info
    if (endpoint.includes('/company/') && endpoint.includes('/info')) {
      const company = endpoint.split('/')[2];
      return {
        id: company,
        name: company === 'jupiterbrains' ? 'JupiterBrains' : 
              company === 'marketstrendai' ? 'MarketsTriendAI' : 'XYZ Seller',
        subdomain: company,
        type: company === 'jupiterbrains' ? 'root_admin' : 
              company === 'marketstrendai' ? 'tier1_seller' : 'tier2_seller',
        color: company === 'jupiterbrains' ? '#3B82F6' :
               company === 'marketstrendai' ? '#10B981' : '#8B5CF6',
        clients: ['client1', 'client2', 'client3'],
        hasAdmin: true,
        description: `${company} company description`
      };
    }

    // Projects
    if (endpoint.includes('/projects')) {
      return [
        {
          id: '1',
          name: 'E-commerce Analytics Dashboard',
          client: 'TechCorp Solutions',
          status: 'In Progress',
          progress: 75,
          deadline: '2024-03-15',
          description: 'Advanced analytics dashboard for e-commerce metrics'
        },
        {
          id: '2',
          name: 'Financial Reporting System',
          client: 'FinanceFlow Inc',
          status: 'Completed',
          progress: 100,
          deadline: '2024-02-28',
          description: 'Comprehensive financial reporting and analysis system'
        }
      ];
    }

    // Client config
    if (endpoint.includes('/client/') && endpoint.includes('/config')) {
      const clientName = endpoint.split('/')[2];
      return {
        id: clientName,
        name: clientName,
        company: `${clientName} Company`,
        tagline: 'Your trusted analytics partner',
        description: `Welcome to ${clientName} analytics portal`,
        theme_config: {
          bgPattern: 'gradient',
          accentColor: '#3B82F6',
          isSpaceTheme: false,
          icon: 'BarChart3'
        }
      };
    }

    // Default empty response
    return {};
  }

  // Authentication
  async login(email: string, password: string, userType: 'seller' | 'client' | 'admin'): Promise<LoginResponse> {
    const response = await this.makeRequest<LoginResponse>('POST', '/auth/login', {
      email,
      password,
      userType,
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

  // Company endpoints
  async getCompanyInfo(companyName: string): Promise<CompanyInfo> {
    return this.makeRequest<CompanyInfo>('GET', `/company/${companyName}/info`);
  }

  // Dashboard endpoints
  async getAdminDashboardData(): Promise<DashboardData> {
    return this.makeRequest<DashboardData>('GET', '/admin/dashboard');
  }

  async getSellerDashboardData(): Promise<DashboardData> {
    return this.makeRequest<DashboardData>('GET', '/seller/dashboard');
  }

  async getClientDashboardData(): Promise<DashboardData> {
    return this.makeRequest<DashboardData>('GET', '/client/dashboard');
  }

  // Project endpoints
  async getProjects(): Promise<Project[]> {
    return this.makeRequest<Project[]>('GET', '/projects');
  }

  // Legacy methods for compatibility
  async getSellerDashboard(): Promise<DashboardData> {
    return this.getSellerDashboardData();
  }

  async getClientDashboard(): Promise<DashboardData> {
    return this.getClientDashboardData();
  }

  async getAdminDashboard(): Promise<DashboardData> {
    return this.getAdminDashboardData();
  }

  // Billing endpoints
  async getBillingSummary(): Promise<BillingSummary> {
    return this.makeRequest<BillingSummary>('GET', '/seller/billing-summary');
  }

  async getProjectBillingDetails(projectId: string): Promise<any> {
    return this.makeRequest('GET', `/seller/project/${projectId}/billing-details`);
  }

  // Management endpoints
  async addClient(clientData: any): Promise<any> {
    return this.makeRequest('POST', '/seller/clients', clientData);
  }

  async createPlan(planData: any): Promise<any> {
    return this.makeRequest('POST', '/seller/plans', planData);
  }

  // Project endpoints
  async getClientProjects(clientName: string): Promise<any[]> {
    return this.makeRequest<any[]>('GET', `/client/${clientName}/projects`);
  }

  async getProjectBilling(clientName: string): Promise<any[]> {
    return this.makeRequest<any[]>('GET', `/client/${clientName}/billing`);
  }

  async getAllProjects(): Promise<any[]> {
    return this.makeRequest<any[]>('GET', '/projects');
  }

  async createProject(projectData: any): Promise<any> {
    return this.makeRequest('POST', '/projects', projectData);
  }

  async deleteProject(projectId: string): Promise<any> {
    return this.makeRequest('DELETE', `/projects/${projectId}`);
  }

  // Company and client endpoints  
  async getClientConfig(clientName: string): Promise<ClientConfig> {
    return this.makeRequest<ClientConfig>('GET', `/client/${clientName}/config`);
  }

  async getCompanyClients(company: string): Promise<string[]> {
    return this.makeRequest<string[]>('GET', `/company/${company}/clients`);
  }

  async authenticateClient(clientName: string, credentials: { email: string; password: string }): Promise<LoginResponse> {
    return this.makeRequest<LoginResponse>('POST', `/client/${clientName}/login`, credentials);
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