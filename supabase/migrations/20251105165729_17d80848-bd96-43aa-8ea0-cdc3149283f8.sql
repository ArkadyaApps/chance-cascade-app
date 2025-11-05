-- Add required profile fields for ticket purchases
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS middle_name TEXT,
ADD COLUMN IF NOT EXISTS country TEXT,
ADD COLUMN IF NOT EXISTS address TEXT;