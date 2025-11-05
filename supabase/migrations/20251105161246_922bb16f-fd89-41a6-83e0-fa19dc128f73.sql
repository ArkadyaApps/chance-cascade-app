-- Create table to track daily spins
CREATE TABLE IF NOT EXISTS daily_spins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  last_spin_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  won_ticket BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE daily_spins ENABLE ROW LEVEL SECURITY;

-- Users can view their own spin history
CREATE POLICY "Users can view their own spins"
  ON daily_spins
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own spins
CREATE POLICY "Users can insert their own spins"
  ON daily_spins
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own spins
CREATE POLICY "Users can update their own spins"
  ON daily_spins
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX idx_daily_spins_user_id ON daily_spins(user_id);
CREATE INDEX idx_daily_spins_last_spin_at ON daily_spins(last_spin_at);