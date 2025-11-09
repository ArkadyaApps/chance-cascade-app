-- Add explicit denial policies for wallet_transactions to prevent client-side modifications
CREATE POLICY "Deny client-side transaction inserts"
  ON wallet_transactions FOR INSERT
  TO authenticated
  WITH CHECK (false);

CREATE POLICY "Deny client-side transaction updates"
  ON wallet_transactions FOR UPDATE
  TO authenticated
  USING (false)
  WITH CHECK (false);

CREATE POLICY "Deny client-side transaction deletes"
  ON wallet_transactions FOR DELETE
  TO authenticated
  USING (false);

-- Strengthen profiles UPDATE policy to protect both wallet_balance and total_wins
DROP POLICY IF EXISTS "Users can update their own profile (excluding wallet)" ON profiles;

CREATE POLICY "Users can update profile fields only"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id AND
    wallet_balance = (SELECT wallet_balance FROM profiles WHERE id = auth.uid()) AND
    total_wins = (SELECT total_wins FROM profiles WHERE id = auth.uid())
  );