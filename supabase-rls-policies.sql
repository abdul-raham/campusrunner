-- ============================================================
-- Run this in Supabase Dashboard → SQL Editor
-- ============================================================

-- 1. Allow runners to accept pending unclaimed orders
DROP POLICY IF EXISTS "Runners can accept pending orders" ON orders;
CREATE POLICY "Runners can accept pending orders"
ON orders FOR UPDATE
TO authenticated
USING (
  status = 'pending'
  AND runner_id IS NULL
  AND EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'runner'
  )
)
WITH CHECK (
  runner_id = auth.uid()
);

-- 2. Allow runners to update orders they already own (in_progress, completed)
DROP POLICY IF EXISTS "Runners can update their own orders" ON orders;
CREATE POLICY "Runners can update their own orders"
ON orders FOR UPDATE
TO authenticated
USING (
  runner_id = auth.uid()
  AND EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'runner'
  )
)
WITH CHECK (
  runner_id = auth.uid()
);

-- 3. Allow runners to read all pending orders (to see available jobs)
DROP POLICY IF EXISTS "Runners can read pending orders" ON orders;
CREATE POLICY "Runners can read pending orders"
ON orders FOR SELECT
TO authenticated
USING (
  (status = 'pending' AND runner_id IS NULL)
  OR runner_id = auth.uid()
  OR student_id = auth.uid()
);

-- 4. Allow students to read their own orders
DROP POLICY IF EXISTS "Students can read own orders" ON orders;
CREATE POLICY "Students can read own orders"
ON orders FOR SELECT
TO authenticated
USING (student_id = auth.uid() OR runner_id = auth.uid());

-- 5. Allow students to insert orders
DROP POLICY IF EXISTS "Students can create orders" ON orders;
CREATE POLICY "Students can create orders"
ON orders FOR INSERT
TO authenticated
WITH CHECK (
  student_id = auth.uid()
  AND EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'student'
  )
);

-- 6. Notifications: users read their own
DROP POLICY IF EXISTS "Users read own notifications" ON notifications;
CREATE POLICY "Users read own notifications"
ON notifications FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- 7. Notifications: users update (mark read) their own
DROP POLICY IF EXISTS "Users update own notifications" ON notifications;
CREATE POLICY "Users update own notifications"
ON notifications FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- 8. Make sure RLS is enabled on both tables
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
