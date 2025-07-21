
-- Add soft delete capability to clients table
ALTER TABLE public.clients ADD COLUMN deleted_at TIMESTAMP WITH TIME ZONE;

-- Create index for better performance when querying non-deleted clients
CREATE INDEX idx_clients_not_deleted ON public.clients(id) WHERE deleted_at IS NULL;

-- Add soft delete capability to subscription_plans table
ALTER TABLE public.subscription_plans ADD COLUMN deleted_at TIMESTAMP WITH TIME ZONE;

-- Create index for better performance when querying non-deleted plans
CREATE INDEX idx_plans_not_deleted ON public.subscription_plans(id) WHERE deleted_at IS NULL;

-- Add soft delete capability to tier2_sellers table
ALTER TABLE public.tier2_sellers ADD COLUMN deleted_at TIMESTAMP WITH TIME ZONE;

-- Create index for better performance when querying non-deleted tier2 sellers
CREATE INDEX idx_tier2_sellers_not_deleted ON public.tier2_sellers(id) WHERE deleted_at IS NULL;

-- Create a function to soft delete a client and handle related data
CREATE OR REPLACE FUNCTION public.soft_delete_client(client_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if client exists and is not already deleted
  IF NOT EXISTS (
    SELECT 1 FROM public.clients 
    WHERE id = client_id AND deleted_at IS NULL
  ) THEN
    RETURN FALSE;
  END IF;

  -- Soft delete the client
  UPDATE public.clients 
  SET deleted_at = now(), status = 'deleted'
  WHERE id = client_id;

  -- Note: We intentionally keep commissions intact for audit purposes
  -- They will reference the deleted client but remain for historical records

  RETURN TRUE;
END;
$$;

-- Create a function to soft delete a subscription plan
CREATE OR REPLACE FUNCTION public.soft_delete_plan(plan_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  active_clients_count INTEGER;
BEGIN
  -- Check if plan exists and is not already deleted
  IF NOT EXISTS (
    SELECT 1 FROM public.subscription_plans 
    WHERE id = plan_id AND deleted_at IS NULL
  ) THEN
    RETURN FALSE;
  END IF;

  -- Check for active clients using this plan
  SELECT COUNT(*) INTO active_clients_count
  FROM public.clients 
  WHERE plan_id = plan_id AND deleted_at IS NULL AND status = 'active';

  -- If there are active clients, don't allow deletion
  IF active_clients_count > 0 THEN
    RAISE EXCEPTION 'Cannot delete plan with active clients. Found % active clients.', active_clients_count;
  END IF;

  -- Soft delete the plan
  UPDATE public.subscription_plans 
  SET deleted_at = now(), active = false
  WHERE id = plan_id;

  RETURN TRUE;
END;
$$;

-- Create a function to soft delete a tier2 seller
CREATE OR REPLACE FUNCTION public.soft_delete_tier2_seller(seller_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  active_clients_count INTEGER;
BEGIN
  -- Check if seller exists and is not already deleted
  IF NOT EXISTS (
    SELECT 1 FROM public.tier2_sellers 
    WHERE id = seller_id AND deleted_at IS NULL
  ) THEN
    RETURN FALSE;
  END IF;

  -- Check for active clients
  SELECT COUNT(*) INTO active_clients_count
  FROM public.clients 
  WHERE tier2_seller_id = seller_id AND deleted_at IS NULL AND status = 'active';

  -- If there are active clients, don't allow deletion
  IF active_clients_count > 0 THEN
    RAISE EXCEPTION 'Cannot delete tier2 seller with active clients. Found % active clients.', active_clients_count;
  END IF;

  -- Soft delete the tier2 seller
  UPDATE public.tier2_sellers 
  SET deleted_at = now(), status = 'deleted'
  WHERE id = seller_id;

  -- Soft delete all plans belonging to this seller
  UPDATE public.subscription_plans 
  SET deleted_at = now(), active = false
  WHERE tier2_seller_id = seller_id AND deleted_at IS NULL;

  RETURN TRUE;
END;
$$;
