-- Update the existing MarketsTrendAI seller to have the correct subdomain
UPDATE public.sellers 
SET subdomain = 'marketstrendai' 
WHERE name = 'MarketsTrendAI';

-- Insert the XYZSeller as a tier2_seller (moving it from regular seller to tier2_seller)
INSERT INTO public.tier2_sellers (
  name, 
  subdomain, 
  admin_email, 
  admin_password_hash, 
  commission_value, 
  commission_type, 
  status,
  tier1_seller_id
) 
SELECT 
  'XYZSeller',
  'xyzseller',
  admin_email,
  admin_password_hash,
  commission_value,
  commission_type,
  status,
  (SELECT id FROM public.sellers WHERE subdomain = 'marketstrendai' LIMIT 1)
FROM public.sellers 
WHERE name = 'XYZRetail';

-- Remove the XYZRetail from sellers table since it should be a tier2_seller
DELETE FROM public.sellers WHERE name = 'XYZRetail';

-- Now update our sample data to use the correct seller IDs
-- First, let's update the plans that were created to use the correct seller IDs
UPDATE public.subscription_plans 
SET seller_id = (SELECT id FROM public.sellers WHERE subdomain = 'marketstrendai')
WHERE seller_id IS NOT NULL;

UPDATE public.subscription_plans 
SET tier2_seller_id = (SELECT id FROM public.tier2_sellers WHERE subdomain = 'xyzseller')
WHERE tier2_seller_id IS NOT NULL;

-- Update clients to use correct seller IDs
UPDATE public.clients 
SET seller_id = (SELECT id FROM public.sellers WHERE subdomain = 'marketstrendai')
WHERE seller_id IS NOT NULL;

UPDATE public.clients 
SET tier2_seller_id = (SELECT id FROM public.tier2_sellers WHERE subdomain = 'xyzseller')
WHERE tier2_seller_id IS NOT NULL;