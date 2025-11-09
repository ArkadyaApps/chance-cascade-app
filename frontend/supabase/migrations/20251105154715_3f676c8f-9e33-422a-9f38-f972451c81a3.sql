-- Restrict client-side wallet balance updates
-- Users can only update their profile fields EXCEPT wallet_balance
-- Only server-side code (edge functions) with SERVICE_ROLE_KEY can update wallet_balance

-- Drop the existing update policy
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;

-- Create a new policy that prevents wallet_balance updates from client
CREATE POLICY "Users can update their own profile (excluding wallet)"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id AND
    -- Ensure wallet_balance hasn't changed
    wallet_balance = (SELECT wallet_balance FROM profiles WHERE id = auth.uid())
  );
