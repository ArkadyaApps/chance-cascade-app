-- Add notification preferences to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS notifications_enabled boolean DEFAULT true;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email_notifications boolean DEFAULT true;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS push_notifications boolean DEFAULT true;