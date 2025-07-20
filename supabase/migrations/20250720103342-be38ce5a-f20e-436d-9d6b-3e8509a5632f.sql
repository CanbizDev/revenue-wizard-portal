-- Add commission fields to sellers table
ALTER TABLE public.sellers 
ADD COLUMN commission_type text CHECK (commission_type IN ('fixed', 'percentage')),
ADD COLUMN commission_value decimal(10,2);