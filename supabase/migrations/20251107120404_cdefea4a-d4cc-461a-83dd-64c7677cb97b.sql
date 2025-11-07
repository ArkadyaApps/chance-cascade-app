-- Add available_countries column to products table
ALTER TABLE products ADD COLUMN available_countries text[] DEFAULT '{}';

COMMENT ON COLUMN products.available_countries IS 'Array of ISO country codes where this product is available for shipping';