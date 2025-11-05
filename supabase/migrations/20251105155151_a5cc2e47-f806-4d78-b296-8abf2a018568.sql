-- Add Stripe payment tracking fields to wallet_transactions
ALTER TABLE wallet_transactions 
ADD COLUMN IF NOT EXISTS stripe_payment_id text,
ADD COLUMN IF NOT EXISTS stripe_session_id text,
ADD COLUMN IF NOT EXISTS receipt_url text;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_stripe_payment_id 
ON wallet_transactions(stripe_payment_id);

CREATE INDEX IF NOT EXISTS idx_wallet_transactions_stripe_session_id 
ON wallet_transactions(stripe_session_id);
