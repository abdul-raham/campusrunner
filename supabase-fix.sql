-- ============================================================
-- Run this in Supabase Dashboard → SQL Editor
-- ============================================================

-- 1. Add missing columns that triggers are trying to insert
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS type text DEFAULT 'order_update';
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS related_order_id uuid REFERENCES orders(id) ON DELETE SET NULL;

-- Profiles: payout/bank details for runners
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS bank_name text,
  ADD COLUMN IF NOT EXISTS bank_account_number text,
  ADD COLUMN IF NOT EXISTS bank_account_name text;

-- 2. Ensure RLS allows authenticated users to read their own notifications
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users read own notifications" ON notifications;
CREATE POLICY "Users read own notifications"
ON notifications FOR SELECT
TO authenticated
USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users update own notifications" ON notifications;
CREATE POLICY "Users update own notifications"
ON notifications FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- 3. Allow service role / triggers to insert notifications (anon insert for triggers)
DROP POLICY IF EXISTS "Service role insert notifications" ON notifications;
CREATE POLICY "Service role insert notifications"
ON notifications FOR INSERT
TO authenticated
WITH CHECK (true);

-- 4. Pricing + Wallet tables for prepaid orders
ALTER TABLE service_categories
  ADD COLUMN IF NOT EXISTS base_price numeric(10,2) DEFAULT 0;

ALTER TABLE order_items
  ADD COLUMN IF NOT EXISTS price numeric(10,2) DEFAULT 0;

-- Wallets
CREATE TABLE IF NOT EXISTS wallets (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  student_id uuid UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  balance numeric(12,2) DEFAULT 0,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

-- Wallet holds (funds locked until order completes or cancels)
CREATE TABLE IF NOT EXISTS wallet_holds (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  amount numeric(12,2) NOT NULL,
  status text DEFAULT 'held' CHECK (status IN ('held', 'released', 'refunded')),
  created_at timestamp DEFAULT now()
);

-- Wallet transactions (ledger)
CREATE TABLE IF NOT EXISTS wallet_transactions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  order_id uuid REFERENCES orders(id) ON DELETE SET NULL,
  amount numeric(12,2) NOT NULL,
  type text NOT NULL CHECK (type IN ('credit', 'debit')),
  status text DEFAULT 'completed' CHECK (status IN ('held', 'completed', 'refunded')),
  reference text,
  note text,
  created_at timestamp DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_wallets_user_id ON wallets(user_id);
CREATE INDEX IF NOT EXISTS idx_wallet_holds_order_id ON wallet_holds(order_id);
CREATE INDEX IF NOT EXISTS idx_wallet_tx_user_id ON wallet_transactions(user_id);
ALTER TABLE wallet_transactions ADD COLUMN IF NOT EXISTS reference text;
CREATE UNIQUE INDEX IF NOT EXISTS idx_wallet_tx_reference ON wallet_transactions(reference) WHERE reference IS NOT NULL;

-- Withdrawal requests
CREATE TABLE IF NOT EXISTS withdrawal_requests (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  amount numeric(12,2) NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'paid')),
  created_at timestamp DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_withdrawal_user_id ON withdrawal_requests(user_id);

-- RLS for wallet tables
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallet_holds ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallet_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE withdrawal_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own wallet" ON wallets;
CREATE POLICY "Users can read own wallet"
ON wallets FOR SELECT
TO authenticated
USING (user_id = auth.uid() OR student_id = auth.uid());

DROP POLICY IF EXISTS "Users can update own wallet" ON wallets;
CREATE POLICY "Users can update own wallet"
ON wallets FOR UPDATE
TO authenticated
USING (user_id = auth.uid() OR student_id = auth.uid())
WITH CHECK (user_id = auth.uid() OR student_id = auth.uid());

DROP POLICY IF EXISTS "Users can insert own wallet" ON wallets;
CREATE POLICY "Users can insert own wallet"
ON wallets FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid() OR student_id = auth.uid());

DROP POLICY IF EXISTS "Users can read own wallet holds" ON wallet_holds;
CREATE POLICY "Users can read own wallet holds"
ON wallet_holds FOR SELECT
TO authenticated
USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can insert own wallet holds" ON wallet_holds;
CREATE POLICY "Users can insert own wallet holds"
ON wallet_holds FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can read own wallet tx" ON wallet_transactions;
CREATE POLICY "Users can read own wallet tx"
ON wallet_transactions FOR SELECT
TO authenticated
USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can insert own wallet tx" ON wallet_transactions;
CREATE POLICY "Users can insert own wallet tx"
ON wallet_transactions FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can read own withdrawals" ON withdrawal_requests;
CREATE POLICY "Users can read own withdrawals"
ON withdrawal_requests FOR SELECT
TO authenticated
USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can insert own withdrawals" ON withdrawal_requests;
CREATE POLICY "Users can insert own withdrawals"
ON withdrawal_requests FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Storage: avatars bucket + policies
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Avatar read" ON storage.objects;
CREATE POLICY "Avatar read"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "Avatar upload" ON storage.objects;
CREATE POLICY "Avatar upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'avatars' AND auth.uid() = owner);

DROP POLICY IF EXISTS "Avatar update" ON storage.objects;
CREATE POLICY "Avatar update"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'avatars' AND auth.uid() = owner)
WITH CHECK (bucket_id = 'avatars' AND auth.uid() = owner);
