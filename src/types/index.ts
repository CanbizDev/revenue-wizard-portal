export interface User {
  id: string;
  email: string;
  role: 'jb_admin' | 'tier1_seller' | 'tier2_seller' | 'client_admin' | 'client_viewer';
  company?: string;
  created_at: string;
}

export interface Company {
  id: string;
  name: string;
  type: 'tier1_seller' | 'tier2_seller' | 'client';
  parent_id?: string;
  status: 'pending' | 'active' ;
  created_at: string;
}

export interface FeeStructure {
  setup_fee: number;
  setup_fee_split: number; // percentage to creator
  recurring_fee: number;
  recurring_fee_split: number; // percentage to creator
  currency: 'INR' | 'USD';
}

export interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  current: boolean;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  project_type: string;
  project_value: number;
  commission_percentage: number;
  hourly_budget: number;
  hours_used: number;
  completion_percentage: number;
  status: 'active' | 'inactive';
  tier1_seller_id: string;
  tier2_seller_id: string | null;
  clients: Client[];
}

export interface Client {
  id: string;
  name: string;
  company?: string;
}

export interface Report {
  id: string;
  title: string;
  generated_at: string;
  data: any;
}

export interface Tier1Seller {
    id: string;
    name: string;
    admin_email: string;
    subdomain: string;
    project_count: number;
    revenue: number;
}

export interface Tier2Seller {
    id: string;
    name: string;
    admin_email: string;
    subdomain: string;
    project_count: number;
    revenue: number;
    tier1_seller: {
        name: string;
    };
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: string;
  creator_type: 'admin' | 'tier1_seller';
  admin_commission_pct?: string;
  tier1_commission_pct?: string;
}