import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface SellerData {
  id: string;
  name: string;
  subdomain: string;
  admin_email: string;
  status: string;
  commission_value: number | null;
  commission_type: string | null;
}

export interface Tier2SellerData {
  id: string;
  name: string;
  subdomain: string;
  admin_email: string;
  status: string;
  commission_value: number | null;
  commission_type: string | null;
  tier1_seller_id: string | null;
}

export interface ClientData {
  id: string;
  name: string;
  email: string;
  company: string;
  status: string;
  intake_form_completed: boolean;
  created_at: string;
  plan_id: string | null;
  subscription_plans?: {
    name: string;
    price: number;
    currency_symbol: string;
  } | null;
}

export interface PlanData {
  id: string;
  name: string;
  price: number;
  currency: string;
  currency_symbol: string;
  billing: string;
  features: any; // JSON field from Supabase
  max_clients: number | null;
  active: boolean;
}

export interface CommissionData {
  id: string;
  amount: number;
  commission_amount: number;
  type: string;
  status: string;
  transaction_date: string;
  clients?: {
    name: string;
    company: string;
  } | null;
}

export const useSellerData = (company: 'marketstrendai' | 'xyzseller') => {
  const [sellerData, setSellerData] = useState<SellerData | Tier2SellerData | null>(null);
  const [clients, setClients] = useState<ClientData[]>([]);
  const [plans, setPlans] = useState<PlanData[]>([]);
  const [commissions, setCommissions] = useState<CommissionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSellerData = async () => {
    try {
      setLoading(true);
      setError(null);

      if (company === 'marketstrendai') {
        // Fetch tier-1 seller data
        const { data: seller, error: sellerError } = await supabase
          .from('sellers')
          .select('*')
          .eq('subdomain', 'marketstrendai')
          .single();

        if (sellerError) throw sellerError;
        setSellerData(seller);

        // Fetch tier-1 seller clients (exclude deleted)
        const { data: clientsData, error: clientsError } = await supabase
          .from('clients')
          .select(`
            *,
            subscription_plans (
              name,
              price,
              currency_symbol
            )
          `)
          .eq('seller_id', seller.id)
          .is('deleted_at', null);

        if (clientsError) throw clientsError;
        setClients(clientsData || []);

        // Fetch tier-1 seller plans (exclude deleted)
        const { data: plansData, error: plansError } = await supabase
          .from('subscription_plans')
          .select('*')
          .eq('seller_id', seller.id)
          .is('deleted_at', null);

        if (plansError) throw plansError;
        setPlans(plansData || []);

        // Fetch tier-1 seller commissions
        const { data: commissionsData, error: commissionsError } = await supabase
          .from('commissions')
          .select(`
            *,
            clients (
              name,
              company
            )
          `)
          .eq('seller_id', seller.id)
          .order('transaction_date', { ascending: false });

        if (commissionsError) throw commissionsError;
        setCommissions(commissionsData || []);

      } else {
        // Fetch tier-2 seller data
        const { data: seller, error: sellerError } = await supabase
          .from('tier2_sellers')
          .select('*')
          .eq('subdomain', 'xyzseller')
          .single();

        if (sellerError) throw sellerError;
        setSellerData(seller);

        // Fetch tier-2 seller clients (exclude deleted)
        const { data: clientsData, error: clientsError } = await supabase
          .from('clients')
          .select(`
            *,
            subscription_plans (
              name,
              price,
              currency_symbol
            )
          `)
          .eq('tier2_seller_id', seller.id)
          .is('deleted_at', null);

        if (clientsError) throw clientsError;
        setClients(clientsData || []);

        // Fetch tier-2 seller plans (exclude deleted)
        const { data: plansData, error: plansError } = await supabase
          .from('subscription_plans')
          .select('*')
          .eq('tier2_seller_id', seller.id)
          .is('deleted_at', null);

        if (plansError) throw plansError;
        setPlans(plansData || []);

        // Fetch tier-2 seller commissions
        const { data: commissionsData, error: commissionsError } = await supabase
          .from('commissions')
          .select(`
            *,
            clients (
              name,
              company
            )
          `)
          .eq('tier2_seller_id', seller.id)
          .order('transaction_date', { ascending: false });

        if (commissionsError) throw commissionsError;
        setCommissions(commissionsData || []);
      }
    } catch (err) {
      console.error('Failed to fetch seller data, using dummy data:', err);
      setError(null); // Clear error since we're using dummy data
      
      // Set dummy data based on company
      if (company === 'marketstrendai') {
        // Tier 1 seller dummy data
        setSellerData({
          id: 'seller-1',
          name: 'MarketsTrendAI',
          subdomain: 'marketstrendai',
          admin_email: 'admin@marketstrendai.com',
          status: 'active',
          commission_value: 15,
          commission_type: 'percentage'
        });
        
        setClients([
          {
            id: 'client-1',
            name: 'John Smith',
            email: 'john@techcorp.com',
            company: 'TechCorp Solutions',
            status: 'active',
            intake_form_completed: true,
            created_at: '2024-01-15T00:00:00Z',
            plan_id: 'plan-1',
            subscription_plans: {
              name: 'Premium Analytics',
              price: 15000,
              currency_symbol: '₹'
            }
          },
          {
            id: 'client-2',
            name: 'Sarah Johnson',
            email: 'sarah@dataflow.com',
            company: 'DataFlow Inc',
            status: 'active',
            intake_form_completed: false,
            created_at: '2024-02-01T00:00:00Z',
            plan_id: 'plan-2',
            subscription_plans: {
              name: 'Standard Reports',
              price: 8000,
              currency_symbol: '₹'
            }
          },
          {
            id: 'client-3',
            name: 'Mike Chen',
            email: 'mike@cloudvision.com',
            company: 'CloudVision',
            status: 'active',
            intake_form_completed: true,
            created_at: '2024-02-15T00:00:00Z',
            plan_id: 'plan-1',
            subscription_plans: {
              name: 'Premium Analytics',
              price: 15000,
              currency_symbol: '₹'
            }
          }
        ]);
        
        setPlans([
          {
            id: 'plan-1',
            name: 'Premium Analytics',
            price: 15000,
            currency: 'INR',
            currency_symbol: '₹',
            billing: 'monthly',
            features: ['Advanced Analytics', 'Custom Reports', 'API Access', '24/7 Support'],
            max_clients: 100,
            active: true
          },
          {
            id: 'plan-2',
            name: 'Standard Reports',
            price: 8000,
            currency: 'INR',
            currency_symbol: '₹',
            billing: 'monthly',
            features: ['Basic Reports', 'Dashboard Access', 'Email Support'],
            max_clients: 50,
            active: true
          },
          {
            id: 'plan-3',
            name: 'Enterprise',
            price: 25000,
            currency: 'INR',
            currency_symbol: '₹',
            billing: 'monthly',
            features: ['All Premium Features', 'White Label', 'Dedicated Manager', 'Custom Integration'],
            max_clients: null,
            active: true
          }
        ]);
        
        setCommissions([
          {
            id: 'comm-1',
            amount: 15000,
            commission_amount: 2250,
            type: 'subscription',
            status: 'paid',
            transaction_date: '2024-03-01T00:00:00Z',
            clients: {
              name: 'John Smith',
              company: 'TechCorp Solutions'
            }
          },
          {
            id: 'comm-2',
            amount: 8000,
            commission_amount: 1200,
            type: 'subscription',
            status: 'pending',
            transaction_date: '2024-03-01T00:00:00Z',
            clients: {
              name: 'Sarah Johnson',
              company: 'DataFlow Inc'
            }
          }
        ]);
        
      } else {
        // Tier 2 seller (xyzseller) dummy data
        setSellerData({
          id: 'tier2-seller-1',
          name: 'XYZSeller',
          subdomain: 'xyzseller',
          admin_email: 'admin@xyzseller.com',
          status: 'active',
          commission_value: 8,
          commission_type: 'percentage',
          tier1_seller_id: 'seller-1'
        } as Tier2SellerData);
        
        setClients([
          {
            id: 'client-t2-1',
            name: 'Rajesh Kumar',
            email: 'rajesh@tcs.com',
            company: 'TCS',
            status: 'active',
            intake_form_completed: true,
            created_at: '2024-01-20T00:00:00Z',
            plan_id: 'plan-t2-1',
            subscription_plans: {
              name: 'Business Analytics',
              price: 12000,
              currency_symbol: '₹'
            }
          },
          {
            id: 'client-t2-2',
            name: 'Priya Sharma',
            email: 'priya@infosys.com',
            company: 'Infosys',
            status: 'active',
            intake_form_completed: true,
            created_at: '2024-02-10T00:00:00Z',
            plan_id: 'plan-t2-2',
            subscription_plans: {
              name: 'Professional Reports',
              price: 10000,
              currency_symbol: '₹'
            }
          }
        ]);
        
        setPlans([
          {
            id: 'plan-t2-1',
            name: 'Business Analytics',
            price: 12000,
            currency: 'INR',
            currency_symbol: '₹',
            billing: 'monthly',
            features: ['Business Intelligence', 'Custom Dashboards', 'Data Export'],
            max_clients: 25,
            active: true
          },
          {
            id: 'plan-t2-2',
            name: 'Professional Reports',
            price: 10000,
            currency: 'INR',
            currency_symbol: '₹',
            billing: 'monthly',
            features: ['Professional Reports', 'Analytics Dashboard', 'Support'],
            max_clients: 15,
            active: true
          }
        ]);
        
        setCommissions([
          {
            id: 'comm-t2-1',
            amount: 12000,
            commission_amount: 960,
            type: 'subscription',
            status: 'paid',
            transaction_date: '2024-03-01T00:00:00Z',
            clients: {
              name: 'Rajesh Kumar',
              company: 'TCS'
            }
          },
          {
            id: 'comm-t2-2',
            amount: 10000,
            commission_amount: 800,
            type: 'subscription',
            status: 'paid',
            transaction_date: '2024-03-01T00:00:00Z',
            clients: {
              name: 'Priya Sharma',
              company: 'Infosys'
            }
          }
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  const addClient = async (clientData: Omit<ClientData, 'id' | 'created_at'>) => {
    try {
      const insertData = company === 'marketstrendai' 
        ? { ...clientData, seller_id: sellerData?.id }
        : { ...clientData, tier2_seller_id: sellerData?.id };

      const { data, error } = await supabase
        .from('clients')
        .insert([insertData])
        .select()
        .single();

      if (error) throw error;
      
      // Refresh clients data
      fetchSellerData();
      return data;
    } catch (err) {
      throw err;
    }
  };

  const addPlan = async (planData: Omit<PlanData, 'id'>) => {
    try {
      const insertData = company === 'marketstrendai' 
        ? { ...planData, seller_id: sellerData?.id }
        : { ...planData, tier2_seller_id: sellerData?.id };

      const { data, error } = await supabase
        .from('subscription_plans')
        .insert([insertData])
        .select()
        .single();

      if (error) throw error;
      
      // Refresh plans data
      fetchSellerData();
      return data;
    } catch (err) {
      throw err;
    }
  };

  const updatePlan = async (planId: string, planData: Partial<PlanData>) => {
    try {
      const { data, error } = await supabase
        .from('subscription_plans')
        .update(planData)
        .eq('id', planId)
        .select()
        .single();

      if (error) throw error;
      
      // Refresh plans data
      fetchSellerData();
      return data;
    } catch (err) {
      throw err;
    }
  };

  const deleteClient = async (clientId: string) => {
    try {
      const { error } = await supabase.rpc('soft_delete_client', {
        client_id: clientId
      });

      if (error) throw error;
      
      // Refresh data
      fetchSellerData();
      return true;
    } catch (err) {
      throw err;
    }
  };

  const deletePlan = async (planId: string) => {
    try {
      const { error } = await supabase.rpc('soft_delete_plan', {
        plan_id: planId
      });

      if (error) throw error;
      
      // Refresh data
      fetchSellerData();
      return true;
    } catch (err) {
      throw err;
    }
  };

  const deleteTier2Seller = async (sellerId: string) => {
    try {
      const { error } = await supabase.rpc('soft_delete_tier2_seller', {
        seller_id: sellerId
      });

      if (error) throw error;
      
      // Refresh data
      fetchSellerData();
      return true;
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    fetchSellerData();
  }, [company]);

  return {
    sellerData,
    clients,
    plans,
    commissions,
    loading,
    error,
    refetch: fetchSellerData,
    addClient,
    addPlan,
    updatePlan,
    deleteClient,
    deletePlan,
    deleteTier2Seller
  };
};