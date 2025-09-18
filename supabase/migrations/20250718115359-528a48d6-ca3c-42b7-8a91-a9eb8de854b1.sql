-- Create sellers table
CREATE TABLE public.sellers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  subdomain TEXT UNIQUE NOT NULL,
  logo_url TEXT,
  stylesheet_url TEXT,
  site_content JSONB,
  admin_email TEXT NOT NULL,
  admin_password_hash TEXT NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'pending')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.sellers ENABLE ROW LEVEL SECURITY;

-- Create policies for sellers table (admin can manage all)
CREATE POLICY "Admins can view all sellers" 
ON public.sellers 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can create sellers" 
ON public.sellers 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admins can update sellers" 
ON public.sellers 
FOR UPDATE 
USING (true);

CREATE POLICY "Admins can delete sellers" 
ON public.sellers 
FOR DELETE 
USING (true);

-- Create storage buckets for seller assets
INSERT INTO storage.buckets (id, name, public) VALUES ('seller-logos', 'seller-logos', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('seller-stylesheets', 'seller-stylesheets', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('seller-content', 'seller-content', true);

-- Create storage policies for seller assets
CREATE POLICY "Anyone can view seller logos" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'seller-logos');

CREATE POLICY "Admins can upload seller logos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'seller-logos');

CREATE POLICY "Admins can update seller logos" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'seller-logos');

CREATE POLICY "Anyone can view seller stylesheets" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'seller-stylesheets');

CREATE POLICY "Admins can upload seller stylesheets" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'seller-stylesheets');

CREATE POLICY "Admins can update seller stylesheets" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'seller-stylesheets');

CREATE POLICY "Anyone can view seller content" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'seller-content');

CREATE POLICY "Admins can upload seller content" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'seller-content');

CREATE POLICY "Admins can update seller content" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'seller-content');

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
NEW.updated_at = now();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_sellers_updated_at
BEFORE UPDATE ON public.sellers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();