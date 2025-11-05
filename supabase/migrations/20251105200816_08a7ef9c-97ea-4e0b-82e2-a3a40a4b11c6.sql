-- Create table for About Us content
CREATE TABLE public.about_us_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  hero_title TEXT NOT NULL DEFAULT 'Welcome to Lucksy',
  hero_description TEXT NOT NULL DEFAULT 'Your premier destination for exciting prize draws and gaming experiences.',
  mission_title TEXT NOT NULL DEFAULT 'Our Mission',
  mission_description TEXT NOT NULL,
  feature_1_title TEXT NOT NULL DEFAULT 'Exciting Prizes',
  feature_1_description TEXT NOT NULL DEFAULT 'Win amazing prizes every day',
  feature_2_title TEXT NOT NULL DEFAULT 'Secure',
  feature_2_description TEXT NOT NULL DEFAULT 'Safe and protected platform',
  feature_3_title TEXT NOT NULL DEFAULT 'Community',
  feature_3_description TEXT NOT NULL DEFAULT 'Join thousands of players',
  feature_4_title TEXT NOT NULL DEFAULT 'Fair Play',
  feature_4_description TEXT NOT NULL DEFAULT 'Transparent and fair draws',
  contact_title TEXT NOT NULL DEFAULT 'Get in Touch',
  contact_description TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.about_us_content ENABLE ROW LEVEL SECURITY;

-- Anyone can view the About Us content
CREATE POLICY "Anyone can view about us content"
  ON public.about_us_content
  FOR SELECT
  USING (true);

-- Only admins can update About Us content
CREATE POLICY "Admins can update about us content"
  ON public.about_us_content
  FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can insert About Us content
CREATE POLICY "Admins can insert about us content"
  ON public.about_us_content
  FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for updated_at
CREATE TRIGGER update_about_us_content_updated_at
  BEFORE UPDATE ON public.about_us_content
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

-- Insert initial content
INSERT INTO public.about_us_content (
  mission_description,
  contact_description
) VALUES (
  'At Lucksy, we believe everyone deserves a chance to win. Our platform combines cutting-edge technology with fair gaming practices to create an exciting and trustworthy experience for all our users.',
  'Have questions or feedback? We''d love to hear from you. Visit our Contact page to get in touch with our support team.'
);