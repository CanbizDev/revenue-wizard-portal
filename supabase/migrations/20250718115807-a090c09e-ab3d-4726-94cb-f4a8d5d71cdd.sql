-- Create tier2_sellers table
CREATE TABLE public.tier2_sellers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  subdomain TEXT UNIQUE NOT NULL,
  logo_url TEXT,
  stylesheet_url TEXT,
  site_content JSONB,
  admin_email TEXT NOT NULL,
  admin_password_hash TEXT NOT NULL,
  tier1_seller_id UUID REFERENCES public.sellers(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'pending')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.tier2_sellers ENABLE ROW LEVEL SECURITY;

-- Create policies for tier2_sellers table
CREATE POLICY "Admins can view all tier2 sellers" 
ON public.tier2_sellers 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can create tier2 sellers" 
ON public.tier2_sellers 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admins can update tier2 sellers" 
ON public.tier2_sellers 
FOR UPDATE 
USING (true);

CREATE POLICY "Admins can delete tier2 sellers" 
ON public.tier2_sellers 
FOR DELETE 
USING (true);

-- Create storage buckets for tier2 seller assets
INSERT INTO storage.buckets (id, name, public) VALUES ('tier2-logos', 'tier2-logos', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('tier2-stylesheets', 'tier2-stylesheets', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('tier2-content', 'tier2-content', true);

-- Create storage policies for tier2 seller assets
CREATE POLICY "Anyone can view tier2 logos" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'tier2-logos');

CREATE POLICY "Admins can upload tier2 logos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'tier2-logos');

CREATE POLICY "Admins can update tier2 logos" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'tier2-logos');

CREATE POLICY "Anyone can view tier2 stylesheets" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'tier2-stylesheets');

CREATE POLICY "Admins can upload tier2 stylesheets" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'tier2-stylesheets');

CREATE POLICY "Admins can update tier2 stylesheets" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'tier2-stylesheets');

CREATE POLICY "Anyone can view tier2 content" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'tier2-content');

CREATE POLICY "Admins can upload tier2 content" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'tier2-content');

CREATE POLICY "Admins can update tier2 content" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'tier2-content');

-- Create trigger for automatic timestamp updates on tier2_sellers
CREATE TRIGGER update_tier2_sellers_updated_at
BEFORE UPDATE ON public.tier2_sellers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();