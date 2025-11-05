-- Add draw_date column to products table for scheduled draws
ALTER TABLE products ADD COLUMN IF NOT EXISTS draw_date TIMESTAMPTZ;

-- Add index for efficient querying of products ready for draw
CREATE INDEX IF NOT EXISTS idx_products_draw_date ON products(draw_date) WHERE winner_id IS NULL;

-- Enable pg_cron and pg_net extensions for scheduled tasks
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;