// API service layer for Flask backend communication
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { mockDashboardData, mockCompanyInfo, mockProjects, mockClientConfig, mockBillingSummary } from './mockData';

const API_BASE_URL = 'http://localhost:5021/api';

export interface LoginRequest {
  email: string;
  password: string;
  user_type: 'admin' | 'tier1_seller' | 'tier2_seller';
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: 'admin' | 'tier1_seller' | 'tier2_seller';
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


export interface AdminDashboardData {
  stats: {
    total_tier1_sellers: number;
    total_tier2_sellers: number;
    total_projects: number;
    monthly_revenue: number;
  };
}

export interface RevenueData {
  summary: {
    total_bills: number;
    paid_bills: number;
    pending_bills: number;
    overdue_bills: number;
    total_value: number;
    collected_amount: number;
    outstanding_amount: number;
  };
  billing_details: Array<{
    client_name: string;
    invoice_id: string;
    bill_amount: number;
    due_date: string;
    payment_date?: string;
    status: 'Paid' | 'Pending' | 'Overdue';
    tier: string;
  }>;
}

// Legacy interface for components that need mock data
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

export interface UserProfile {
  id: string;
  role: string;
  email: string;
  name: string;
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
    this.axiosInstance.interceptors.request.use((config) => {
      // Refresh the token from localStorage for each request
      const currentToken = localStorage.getItem('auth_token');
      if (currentToken) {
        config.headers.Authorization = `Bearer ${currentToken}`;
      }
      return config;
    });

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

  private async request<T>(endpoint: string, options: any = {}): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.axiosInstance(endpoint, options);
      return response.data;
    } catch (error) {
      console.error('API request failed:', error);
      // For dashboard endpoints, throw the error instead of returning mock data
      if (endpoint.includes('/dashboard')) {
        throw error;
      }
      // Return mock data for other endpoints
      return this.getMockData(endpoint) as T;
    }
  }

  private getMockData(endpoint: string): any {
    // Dashboard endpoints now throw errors instead of returning mock data

    // Billing summary
    if (endpoint.includes('/billing-summary')) {
      return mockBillingSummary;
    }

    // Company info
    if (endpoint.includes('/company/') && endpoint.includes('/info')) {
      const company = endpoint.split('/')[2];
      return mockCompanyInfo[company as keyof typeof mockCompanyInfo] || mockCompanyInfo.jupiterbrains;
    }

    // Projects
    if (endpoint.includes('/projects')) {
      return mockProjects;
    }

    // Client config
    if (endpoint.includes('/client/') && endpoint.includes('/config')) {
      return mockClientConfig;
    }

    // Tier1 sellers mock data
    if (endpoint.includes('/seller/tier1')) {
      return [
        {
          id: '1',
          name: 'TechSolutions Inc',
          admin_email: 'admin@techsolutions.com',
          subdomain: 'techsolutions',
          logo_url: null,
          client_count: 15,
          revenue: 75000,
          status: 'active'
        },
        {
          id: '2',
          name: 'DataFlow Corp',
          admin_email: 'admin@dataflow.com',
          subdomain: 'dataflow',
          logo_url: null,
          client_count: 8,
          revenue: 45000,
          status: 'active'
        }
      ];
    }

    // Tier2 sellers mock data
    if (endpoint.includes('/seller/tier2')) {
      return [
        {
          id: '1',
          name: 'Analytics Pro',
          admin_email: 'admin@analyticspro.com',
          subdomain: 'analyticspro',
          logo_url: null,
          client_count: 5,
          revenue: 25000,
          status: 'active',
          tier1_seller: { name: 'TechSolutions Inc' }
        },
        {
          id: '2',
          name: 'ReportMaster',
          admin_email: 'admin@reportmaster.com',
          subdomain: 'reportmaster',
          logo_url: null,
          client_count: 3,
          revenue: 15000,
          status: 'active',
          tier1_seller: { name: 'DataFlow Corp' }
        }
      ];
    }

    // Default empty array for endpoints that should return arrays
    return [];
  }

  // Authentication
  async login(email: string, password: string, userType: 'admin' | 'tier1_seller' | 'tier2_seller'): Promise<LoginResponse> {
    const response = await this.axiosInstance.post<LoginResponse>('/auth/login', {
      email,
      password,
      user_type: userType,
    });
    
    this.token = response.data.access_token;
    localStorage.setItem('auth_token', response.data.access_token);
    localStorage.setItem('refresh_token', response.data.refresh_token);
    localStorage.setItem('user_data', JSON.stringify(response.data.user));
    
    return response.data;
  }

  async logout(): Promise<void> {
    try {
      // Call the backend logout endpoint.
      // The auth token is sent automatically by the axios interceptor.
      await this.axiosInstance.post('/auth/logout');
    } catch (error) {
      console.error('Logout API call failed, but clearing client-side session anyway.', error);
    } finally {
      // This part runs whether the API call succeeds or fails, ensuring the user is logged out on the frontend.
      this.token = null;
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user_data');
    }
  }
  
  async getUserProfile(): Promise<UserProfile> {
    return this.request<UserProfile>('/auth/profile');
  }

  // Dashboard endpoints
  async getAdminDashboardData(): Promise<AdminDashboardData> {
    return this.request<AdminDashboardData>('/admin/dashboard');
  }

  // Tier1 seller dashboard endpoint
  async getTier1DashboardData(tier1Id: string): Promise<any> {
    return this.request<any>(`/admin/dashboard/tier1/${tier1Id}`);
  }

  async getTier2DashboardData(tier2Id: string): Promise<any> {
    return this.request<any>(`/admin/dashboard/tier2/${tier2Id}`);
  }

  // Legacy methods for components that need mock data
  async getSellerDashboardData(): Promise<DashboardData> {
    // Return mock data for seller dashboard
    return {
      metrics: {
        total_clients: 0,
        active_projects: 0,
        monthly_revenue: 0,
        growth_rate: 0,
      },
      recent_activity: []
    };
  }

  async getClientDashboardData(): Promise<DashboardData> {
    // Return mock data for client dashboard
    return {
      metrics: {
        total_clients: 0,
        active_projects: 0,
        monthly_revenue: 0,
        growth_rate: 0,
      },
      recent_activity: []
    };
  }

  // Billing endpoints
  async getBillingSummary(): Promise<BillingSummary> {
    return this.request<BillingSummary>('/seller/billing-summary');
  }

  async getRevenueData(): Promise<RevenueData> {
    return this.request<RevenueData>('/billing/revenue');
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
  async getProjects(): Promise<any[]> {
    return this.request<any[]>('/projects/');
  }

  async toggleProjectStatus(projectId: string): Promise<any> {
    return this.request(`/projects/services/${projectId}/toggle`, {
      method: 'POST',
    });
  }

  async getClientProjects(clientName: string): Promise<any[]> {
    return this.request<any[]>(`/client/${clientName}/projects`);
  }

  async getProjectBilling(clientName: string): Promise<any[]> {
    return this.request<any[]>(`/client/${clientName}/billing`);
  }

  async createProject(projectData: any): Promise<any> {
    try {
      const response = await this.axiosInstance.post('/projects/', projectData);
      return response.data;
    } catch (error) {
      console.error('Failed to create project:', error);
      throw error;
    }
  }

  async deleteProject(projectId: string): Promise<any> {
    return this.request(`/projects/${projectId}`, {
      method: 'DELETE',
    });
  }

  async createProjectClient(clientData: any): Promise<any> {
    try {
      const response = await this.axiosInstance.post('/projects/clients', clientData);
      return response.data;
    } catch (error) {
      console.error('Failed to create project client:', error);
      throw error;
    }
  }

  // Company and client endpoints
  async getCompanyInfo(companyName: string): Promise<CompanyInfo> {
    return this.request<CompanyInfo>(`/company/${companyName}/info`);
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

  // Legacy API methods for forms (keeping for backward compatibility)
  async createSeller(sellerData: any): Promise<any> {
    // Redirect to new Tier1 seller creation endpoint
    return this.createTier1Seller(sellerData);
  }

  async getTier1Sellers(): Promise<any[]> {
    try {
      const response = await this.axiosInstance.get('/admin/tier1-sellers');
      return response.data;
    } catch (error) {
      return [
        { id: '1', name: 'MarketsTrendAI' },
        { id: '2', name: 'TechAnalytics' }
      ];
    }
  }

  // Tier1 Seller Management (Admin Only)
  async createTier1Seller(sellerData: any): Promise<any> {
    return this.request('/seller/tier1', {
      method: 'POST',
      data: sellerData,
    });
  }

  async getAllTier1Sellers(): Promise<any[]> {
    return this.request<any[]>('/seller/tier1');
  }

  async getTier1Seller(id: string): Promise<any> {
    return this.request(`/seller/tier1/${id}`);
  }

  async updateTier1Seller(id: string, sellerData: any): Promise<any> {
    return this.request(`/seller/tier1/${id}`, {
      method: 'PUT',
      data: sellerData,
    });
  }

  async deleteTier1Seller(id: string): Promise<any> {
    return this.request(`/seller/tier1/${id}`, {
      method: 'DELETE',
    });
  }

  // Tier2 Seller Management (Admin + Tier1)
  async createTier2Seller(sellerData: any): Promise<any> {
    return this.request('/seller/tier2', {
      method: 'POST',
      data: sellerData,
    });
  }

  async getAllTier2Sellers(): Promise<any[]> {
    return this.request<any[]>('/seller/tier2');
  }

  async getTier2Seller(id: string): Promise<any> {
    return this.request(`/seller/tier2/${id}`);
  }

  async updateTier2Seller(id: string, sellerData: any): Promise<any> {
    return this.request(`/seller/tier2/${id}`, {
      method: 'PUT',
      data: sellerData,
    });
  }

  async deleteTier2Seller(id: string): Promise<any> {
    return this.request(`/seller/tier2/${id}`, {
      method: 'DELETE',
    });
  }

  async updateProject(projectId: string, projectData: any): Promise<any> {
    return this.request(`/projects/${projectId}`, {
      method: 'PUT',
      data: projectData,
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
  
  // ===============================================================
  // NEW TIERED SUBSCRIPTION MANAGEMENT
  // ===============================================================
  
  async getAvailablePlans(): Promise<any[]> {
    try {
      const response = await this.axiosInstance.get('/subscription/plans');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch available subscription plans:', error);
      throw error;
    }
  }

  async createMasterPlan(planData: { name: string; price: number; admin_commission_pct: number; description?: string }): Promise<any> {
    try {
      const response = await this.axiosInstance.post('/subscription/admin/plans', planData);
      return response.data;
    } catch (error) {
      console.error('Failed to create master plan:', error);
      throw error;
    }
  }
  
  async createTier1Plan(planData: { master_plan_id: string; tier1_commission_pct: number }): Promise<any> {
    try {
      const response = await this.axiosInstance.post('/subscription/tier1/plans', planData);
      return response.data;
    } catch (error) {
      console.error('Failed to create Tier 1 plan:', error);
      throw error;
    }
  }

  async subscribeToPlan(planId: string): Promise<any> {
    try {
      const response = await this.axiosInstance.post('/subscription/subscribe', { plan_id: planId });
      return response.data;
    } catch (error) {
      console.error('Failed to subscribe to plan:', error);
      throw error;
    }
  }


  async getSubscriptionPlan(planId: string): Promise<any> {
    try {
      const response = await this.axiosInstance.get(`/subscription/plans/${planId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch subscription plan:', error);
      throw error;
    }
  }

  async updateSubscriptionPlan(planId: string, planData: any): Promise<any> {
    try {
      const response = await this.axiosInstance.put(`/subscription/plans/${planId}`, planData);
      return response.data;
    } catch (error) {
      console.error('Failed to update subscription plan:', error);
      throw error;
    }
  }

  async deleteSubscriptionPlan(planId: string): Promise<any> {
    try {
      const response = await this.axiosInstance.delete(`/subscription/plans/${planId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to delete subscription plan:', error);
      throw error;
    }
  }
}

export const apiService = new ApiService();