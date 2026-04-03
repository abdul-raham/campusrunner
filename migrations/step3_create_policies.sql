-- Step 3: Create new policies
-- Run this THIRD after dropping all policies

-- Enable RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_meta ENABLE ROW LEVEL SECURITY;

-- ============================================
-- ORDERS TABLE POLICIES
-- ============================================

CREATE POLICY "student_insert_order"
ON orders FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = student_id);

CREATE POLICY "student_view_order"
ON orders FOR SELECT
TO authenticated
USING (auth.uid() = student_id);

CREATE POLICY "student_update_order"
ON orders FOR UPDATE
TO authenticated
USING (auth.uid() = student_id AND status = 'pending')
WITH CHECK (auth.uid() = student_id);

CREATE POLICY "runner_view_order"
ON orders FOR SELECT
TO authenticated
USING (
  auth.uid() = runner_id OR 
  status = 'pending' OR
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'runner'
  )
);

CREATE POLICY "runner_update_order"
ON orders FOR UPDATE
TO authenticated
USING (auth.uid() = runner_id)
WITH CHECK (auth.uid() = runner_id);

CREATE POLICY "admin_all_order"
ON orders FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- ============================================
-- ORDER_ITEMS TABLE POLICIES
-- ============================================

CREATE POLICY "student_insert_item"
ON order_items FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM orders
    WHERE orders.id = order_items.order_id
    AND orders.student_id = auth.uid()
  )
);

CREATE POLICY "user_view_item"
ON order_items FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM orders
    WHERE orders.id = order_items.order_id
    AND (
      orders.student_id = auth.uid() OR
      orders.runner_id = auth.uid() OR
      EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
      )
    )
  )
);

-- ============================================
-- ORDER_META TABLE POLICIES
-- ============================================

CREATE POLICY "student_insert_meta_data"
ON order_meta FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM orders
    WHERE orders.id = order_meta.order_id
    AND orders.student_id = auth.uid()
  )
);

CREATE POLICY "user_view_meta_data"
ON order_meta FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM orders
    WHERE orders.id = order_meta.order_id
    AND (
      orders.student_id = auth.uid() OR
      orders.runner_id = auth.uid() OR
      EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
      )
    )
  )
);

-- Verify
SELECT tablename, policyname, cmd 
FROM pg_policies 
WHERE tablename IN ('orders', 'order_items', 'order_meta')
ORDER BY tablename, policyname;
