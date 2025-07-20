
-- Create clients table to store client relationships with sellers
CREATE TABLE public.clients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  seller_id UUID REFERENCES public.sellers(id) ON DELETE CASCADE,
  tier2_seller_id UUID REFERENCES public.tier2_sellers(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT NOT NULL,
  plan_id UUID,
  status TEXT DEFAULT 'active',
  intake_form_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT clients_seller_check CHECK (
    (seller_id IS NOT NULL AND tier2_seller_id IS NULL) OR 
    (seller_id IS NULL AND tier2_seller_id IS NOT NULL)
  )
);

-- Create subscription plans table for seller-specific plans
CREATE TABLE public.subscription_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  seller_id UUID REFERENCES public.sellers(id) ON DELETE CASCADE,
  tier2_seller_id UUID REFERENCES public.tier2_sellers(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  price NUMERIC NOT NULL,
  currency TEXT NOT NULL DEFAULT 'INR',
  currency_symbol TEXT NOT NULL DEFAULT '₹',
  billing TEXT NOT NULL DEFAULT 'monthly',
  features JSONB,
  max_clients INTEGER,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT plans_seller_check CHECK (
    (seller_id IS NOT NULL AND tier2_seller_id IS NULL) OR 
    (seller_id IS NULL AND tier2_seller_id IS NOT NULL)
  )
);

-- Create commissions table to track actual commission data
CREATE TABLE public.commissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  seller_id UUID REFERENCES public.sellers(id) ON DELETE CASCADE,
  tier2_seller_id UUID REFERENCES public.tier2_sellers(id) ON DELETE CASCADE,
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL,
  commission_amount NUMERIC NOT NULL,
  type TEXT NOT NULL, -- 'client_payment', 'tier2_commission'
  status TEXT DEFAULT 'pending', -- 'pending', 'paid'
  transaction_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT commissions_seller_check CHECK (
    (seller_id IS NOT NULL AND tier2_seller_id IS NULL) OR 
    (seller_id IS NULL AND tier2_seller_id IS NOT NULL)
  )
);

-- Add foreign key from clients to plans
ALTER TABLE public.clients ADD CONSTRAINT clients_plan_fk 
  FOREIGN KEY (plan_id) REFERENCES public.subscription_plans(id);

-- Create indexes for better performance
CREATE INDEX idx_clients_seller_id ON public.clients(seller_id);
CREATE INDEX idx_clients_tier2_seller_id ON public.clients(tier2_seller_id);
CREATE INDEX idx_plans_seller_id ON public.subscription_plans(seller_id);
CREATE INDEX idx_plans_tier2_seller_id ON public.subscription_plans(tier2_seller_id);
CREATE INDEX idx_commissions_seller_id ON public.commissions(seller_id);
CREATE INDEX idx_commissions_tier2_seller_id ON public.commissions(tier2_seller_id);

-- Enable RLS on all tables
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commissions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for clients
CREATE POLICY "Admins can manage all clients" ON public.clients FOR ALL USING (true);

-- Create RLS policies for subscription_plans
CREATE POLICY "Admins can manage all plans" ON public.subscription_plans FOR ALL USING (true);

-- Create RLS policies for commissions
CREATE POLICY "Admins can manage all commissions" ON public.commissions FOR ALL USING (true);

-- Add triggers for updated_at
CREATE TRIGGER update_clients_updated_at 
  BEFORE UPDATE ON public.clients 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_plans_updated_at 
  BEFORE UPDATE ON public.subscription_plans 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_commissions_updated_at 
  BEFORE UPDATE ON public.commissions 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample data for MarketsTrendAI (assuming it exists with a specific ID)
-- We'll need to get the actual seller IDs, but for now let's create sample data structure

-- Sample plans for MarketsTrendAI
INSERT INTO public.subscription_plans (seller_id, name, price, currency, currency_symbol, billing, features, max_clients, active)
SELECT id, 'Basic', 15000, 'INR', '₹', 'monthly', 
  '["Monthly Reports", "Basic Analytics", "Email Support"]'::jsonb, 5, true
FROM public.sellers WHERE subdomain = 'marketstrendai'
UNION ALL
SELECT id, 'Premium', 25000, 'INR', '₹', 'monthly', 
  '["Weekly Reports", "Advanced Analytics", "Priority Support", "Custom Dashboards"]'::jsonb, 15, true
FROM public.sellers WHERE subdomain = 'marketstrendai'
UNION ALL
SELECT id, 'Enterprise', 45000, 'INR', '₹', 'monthly', 
  '["Daily Reports", "Real-time Analytics", "24/7 Support", "White-label Solutions", "API Access"]'::jsonb, 50, true
FROM public.sellers WHERE subdomain = 'marketstrendai';

-- Sample plans for XYZSeller (Tier-2)
INSERT INTO public.subscription_plans (tier2_seller_id, name, price, currency, currency_symbol, billing, features, max_clients, active)
SELECT id, 'Starter', 12000, 'INR', '₹', 'monthly', 
  '["Bi-weekly Reports", "Standard Analytics", "Email Support"]'::jsonb, 3, true
FROM public.tier2_sellers WHERE subdomain = 'xyzseller'
UNION ALL
SELECT id, 'Professional', 20000, 'INR', '₹', 'monthly', 
  '["Weekly Reports", "Advanced Analytics", "Priority Support"]'::jsonb, 10, true
FROM public.tier2_sellers WHERE subdomain = 'xyzseller';

-- Sample clients for MarketsTrendAI
INSERT INTO public.clients (seller_id, name, email, company, plan_id, status, intake_form_completed)
SELECT s.id, 'Servicon', 'contact@servicon.com', 'Servicon Ltd', p.id, 'active', true
FROM public.sellers s, public.subscription_plans p 
WHERE s.subdomain = 'marketstrendai' AND p.name = 'Premium' AND p.seller_id = s.id
UNION ALL
SELECT s.id, 'Forte', 'info@forte.com', 'Forte Inc', p.id, 'active', false
FROM public.sellers s, public.subscription_plans p 
WHERE s.subdomain = 'marketstrendai' AND p.name = 'Enterprise' AND p.seller_id = s.id;

-- Sample clients for XYZSeller
INSERT INTO public.clients (tier2_seller_id, name, email, company, plan_id, status, intake_form_completed)
SELECT s.id, 'TCS', 'contact@tcs.com', 'Tata Consultancy Services', p.id, 'active', true
FROM public.tier2_sellers s, public.subscription_plans p 
WHERE s.subdomain = 'xyzseller' AND p.name = 'Professional' AND p.tier2_seller_id = s.id
UNION ALL
SELECT s.id, 'Infosys', 'info@infosys.com', 'Infosys Limited', p.id, 'active', false
FROM public.tier2_sellers s, public.subscription_plans p 
WHERE s.subdomain = 'xyzseller' AND p.name = 'Starter' AND p.tier2_seller_id = s.id;
