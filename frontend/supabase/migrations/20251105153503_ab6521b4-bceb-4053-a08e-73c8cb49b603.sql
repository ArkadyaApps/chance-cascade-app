-- Fix critical security issue: Restrict profile visibility to own profile only
-- Drop the overly permissive policy that allows viewing all profiles
DROP POLICY IF EXISTS "Users can view all profiles" ON profiles;

-- Create a restricted policy that only allows users to view their own profile
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);