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
      setError(err instanceof Error ? err.message : 'An error occurred');
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