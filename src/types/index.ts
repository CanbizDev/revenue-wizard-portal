
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
  status: 'pending' | 'active' | 'suspended';
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

export interface Report {
  id: string;
  title: string;
  client_id: string;
  sections: ReportSection[];
  created_at: string;
  status: 'draft' | 'published';
}

export interface ReportSection {
  id: string;
  title: string;
  content: string;
  visible_to: string[]; // user IDs who can view this section
}
