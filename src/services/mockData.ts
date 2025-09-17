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

export const mockRevenueData = {
  summary: {
    total_bills: 25,
    paid_bills: 18,
    pending_bills: 5,
    overdue_bills: 2,
    total_value: 485000,
    collected_amount: 365000,
    outstanding_amount: 120000
  },
  billing_details: [
    {
      client_name: "TechCorp Solutions",
      invoice_id: "INV-2024-001",
      bill_amount: 75000,
      due_date: "2024-03-15",
      payment_date: "2024-03-10",
      status: "Paid",
      tier: "Tier-1"
    },
    {
      client_name: "FinanceFlow Inc",
      invoice_id: "INV-2024-002", 
      bill_amount: 120000,
      due_date: "2024-03-20",
      status: "Pending",
      tier: "Tier-1"
    },
    {
      client_name: "DataCorp Ltd",
      invoice_id: "INV-2024-003",
      bill_amount: 95000,
      due_date: "2024-02-28",
      status: "Overdue",
      tier: "Tier-2"
    },
    {
      client_name: "Analytics Pro",
      invoice_id: "INV-2024-004",
      bill_amount: 65000,
      due_date: "2024-03-25",
      payment_date: "2024-03-20",
      status: "Paid",
      tier: "Tier-1"
    },
    {
      client_name: "ReportMaster Inc",
      invoice_id: "INV-2024-005",
      bill_amount: 85000,
      due_date: "2024-04-01",
      status: "Pending",
      tier: "Tier-2"
    }
  ]
};