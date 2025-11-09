-- Add partner/affiliate fields to products table
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS partner_name text,
ADD COLUMN IF NOT EXISTS partner_logo_url text,
ADD COLUMN IF NOT EXISTS partner_website text,
ADD COLUMN IF NOT EXISTS partner_description text;

-- Create index for faster partner lookups
CREATE INDEX IF NOT EXISTS idx_products_partner_name ON products(partner_name);
