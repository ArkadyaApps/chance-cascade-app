-- Add preferred_language column to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS preferred_language text DEFAULT 'en';

-- Add check constraint to ensure valid language codes
ALTER TABLE profiles ADD CONSTRAINT valid_language_code 
  CHECK (preferred_language IN ('en', 'fr', 'es', 'ar', 'th'));