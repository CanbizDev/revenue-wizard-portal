// Mock data for fallback when API is not available
export const mockDashboardData = {
  admin: {
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
      }
    ]
  },
  seller: {
    metrics: {
      total_clients: 78,
      active_projects: 24,
      monthly_revenue: 85000,
      growth_rate: 18.2
    },
    recent_activity: [
      {
        id: '1',
        type: 'project_completed',
        description: 'Project Dashboard Analytics completed',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
      }
    ]
  },
  client: {
    metrics: {
      total_projects: 8,
      completed_projects: 5,
      pending_tasks: 12,
      success_rate: 92.5
    },
    recent_activity: [
      {
        id: '1',
        type: 'task_completed',
        description: 'Analytics report generated',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
      }
    ]
  }
};

export const mockSellerData = {
  id: 'seller-1',
  name: 'MarketsTrendAI',
  subdomain: 'marketstrendai',
  admin_email: 'admin@marketstrendai.com',
  status: 'active',
  commission_value: 15,
  commission_type: 'percentage'
};

export const mockCompanyInfo = {
  jupiterbrains: {
    id: 'jupiterbrains',
    name: 'JupiterBrains',
    subdomain: 'jupiterbrains',
    type: 'root_admin' as const,
    color: '#3B82F6',
    clients: ['client1', 'client2', 'client3'],
    hasAdmin: true,
    description: 'JupiterBrains company description'
  },
  marketstrendai: {
    id: 'marketstrendai',
    name: 'MarketsTriendAI',
    subdomain: 'marketstrendai',
    type: 'tier1_seller' as const,
    color: '#10B981',
    clients: ['client1', 'client2'],
    hasAdmin: true,
    description: 'MarketsTriendAI company description'
  },
  xyzseller: {
    id: 'xyzseller',
    name: 'XYZ Seller',
    subdomain: 'xyzseller',
    type: 'tier2_seller' as const,
    color: '#8B5CF6',
    clients: ['client1'],
    hasAdmin: true,
    description: 'XYZ Seller company description'
  }
};

export const mockProjects = [
  {
    id: '1',
    name: 'E-commerce Analytics Dashboard',
    description: 'Advanced analytics dashboard for e-commerce metrics',
    project_type: 'Analytics',
    project_value: 50000,
    commission_percentage: 15,
    hourly_budget: 200,
    hours_used: 150,
    completion_percentage: 75,
    status: 'active',
    tier1_seller_id: 'tier1-1',
    tier2_seller_id: 'tier2-1',
    clients: [
      { id: 'client-1', name: 'TechCorp Solutions', company: 'TechCorp' }
    ]
  },
  {
    id: '2',
    name: 'Financial Reporting System',
    description: 'Comprehensive financial reporting and analysis system',
    project_type: 'Reporting',
    project_value: 75000,
    commission_percentage: 20,
    hourly_budget: 300,
    hours_used: 300,
    completion_percentage: 100,
    status: 'active',
    tier1_seller_id: 'tier1-1',
    tier2_seller_id: null,
    clients: [
      { id: 'client-2', name: 'FinanceFlow Inc', company: 'FinanceFlow' }
    ]
  },
  {
    id: '3',
    name: 'Customer Insights Platform',
    description: 'AI-powered customer behavior analysis platform',
    project_type: 'AI/ML',
    project_value: 120000,
    commission_percentage: 25,
    hourly_budget: 500,
    hours_used: 200,
    completion_percentage: 40,
    status: 'active',
    tier1_seller_id: 'tier1-1',
    tier2_seller_id: 'tier2-2',
    clients: [
      { id: 'client-3', name: 'RetailMax Corp', company: 'RetailMax' }
    ]
  }
];

export const mockClientConfig = {
  id: 'default',
  name: 'Default Client',
  company: 'Default Company',
  tagline: 'Your trusted analytics partner',
  description: 'Welcome to analytics portal',
  theme_config: {
    bgPattern: 'gradient',
    accentColor: '#3B82F6',
    isSpaceTheme: false,
    icon: 'BarChart3'
  }
};

export const mockBillingSummary = {
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