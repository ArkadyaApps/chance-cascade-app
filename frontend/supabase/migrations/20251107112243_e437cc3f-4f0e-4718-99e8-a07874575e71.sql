-- Create partners table
CREATE TABLE public.partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  logo_url TEXT,
  website TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;

-- Anyone can view partners
CREATE POLICY "Anyone can view partners"
ON public.partners
FOR SELECT
USING (true);

-- Admins can insert partners
CREATE POLICY "Admins can insert partners"
ON public.partners
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Admins can update partners
CREATE POLICY "Admins can update partners"
ON public.partners
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Admins can delete partners
CREATE POLICY "Admins can delete partners"
ON public.partners
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Update products table to reference partners
ALTER TABLE public.products ADD COLUMN partner_id UUID REFERENCES public.partners(id) ON DELETE SET NULL;

-- Trigger for updating updated_at
CREATE TRIGGER update_partners_updated_at
BEFORE UPDATE ON public.partners
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();