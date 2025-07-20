-- Add commission fields to tier2_sellers table
ALTER TABLE public.tier2_sellers 
ADD COLUMN commission_type text CHECK (commission_type IN ('fixed', 'percentage')),
ADD COLUMN commission_value decimal(10,2);