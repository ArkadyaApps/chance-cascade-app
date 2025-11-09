-- Create atomic function to handle entry creation with proper locking
-- This prevents race conditions and double-spending of tickets
CREATE OR REPLACE FUNCTION public.create_entry_atomic(
  _user_id UUID,
  _product_id UUID,
  _tickets_spent INTEGER
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _current_balance INTEGER;
  _entry_id UUID;
  _product_name TEXT;
  _result JSON;
BEGIN
  -- Lock the user's profile row for update to prevent concurrent modifications
  SELECT wallet_balance INTO _current_balance
  FROM profiles
  WHERE id = _user_id
  FOR UPDATE;

  -- Check if user has sufficient balance
  IF _current_balance < _tickets_spent THEN
    RAISE EXCEPTION 'Insufficient ticket balance';
  END IF;

  -- Get product name for transaction description
  SELECT name INTO _product_name
  FROM products
  WHERE id = _product_id;

  -- Create entry
  INSERT INTO entries (user_id, product_id, tickets_spent, status)
  VALUES (_user_id, _product_id, _tickets_spent, 'active')
  RETURNING id INTO _entry_id;

  -- Deduct tickets (atomic with entry creation)
  UPDATE profiles
  SET wallet_balance = wallet_balance - _tickets_spent
  WHERE id = _user_id;

  -- Update product tickets_sold
  UPDATE products
  SET tickets_sold = tickets_sold + _tickets_spent
  WHERE id = _product_id;

  -- Create transaction record
  INSERT INTO wallet_transactions (user_id, type, amount, description, product_id)
  VALUES (_user_id, 'spend', -_tickets_spent, 'Entered draw: ' || COALESCE(_product_name, 'Unknown'), _product_id);

  -- Return success with entry details
  SELECT json_build_object(
    'entry_id', _entry_id,
    'success', true,
    'new_balance', _current_balance - _tickets_spent
  ) INTO _result;
  
  RETURN _result;
END;
$$;