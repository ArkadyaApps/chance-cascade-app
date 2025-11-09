-- Create partner inquiries table
CREATE TABLE IF NOT EXISTS public.partner_inquiries (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_name text NOT NULL,
  contact_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  website text,
  product_category text NOT NULL,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.partner_inquiries ENABLE ROW LEVEL SECURITY;

-- Create policy for admins to view all inquiries
CREATE POLICY "Admins can view all partner inquiries"
  ON public.partner_inquiries
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Add trigger for updated_at
CREATE TRIGGER update_partner_inquiries_updated_at
  BEFORE UPDATE ON public.partner_inquiries
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_partner_inquiries_status ON public.partner_inquiries(status);
CREATE INDEX IF NOT EXISTS idx_partner_inquiries_created_at ON public.partner_inquiries(created_at DESC);
