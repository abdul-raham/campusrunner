-- Fix RLS Policies for Orders - Complete Reset
-- Run this in Supabase SQL Editor

-- First, disable RLS temporarily to drop all policies
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE order_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE order_meta DISABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies on orders
DO $$ 
DECLARE 
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'orders') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON orders';
    END LOOP;
END $$;

-- Drop ALL existing policies on order_items
DO $$ 
DECLARE 
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'order_items') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON order_items';
    END LOOP;
END $$;

-- Drop ALL existing policies on order_meta
DO $$ 
DECLARE 
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'order_meta') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON order_meta';
    END LOOP;
END $$;

-- Re-enable RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_meta ENABLE ROW LEVEL SECURITY;

-- ============================================
-- ORDERS TABLE POLICIES
-- ============================================

-- Students can INSERT their own orders
CREATE POLICY "students_insert_orders"
ON orders FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = student_id);

-- Students can SELECT their own orders
CREATE POLICY "students_select_orders"
ON orders FOR SELECT
TO authenticated
USING (auth.uid() = student_id);

-- Students can UPDATE their own pending orders
CREATE POLICY "students_update_orders"
ON orders FOR UPDATE
TO authenticated
USING (auth.uid() = student_id AND status = 'pending')
WITH CHECK (auth.uid() = student_id);

-- Runners can SELECT available and assigned orders
CREATE POLICY "runners_select_orders"
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

-- Runners can UPDATE assigned orders
CREATE POLICY "runners_update_orders"
ON orders FOR UPDATE
TO authenticated
USING (auth.uid() = runner_id)
WITH CHECK (auth.uid() = runner_id);

-- Admins have full access
CREATE POLICY "admins_all_orders"
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

-- Students can INSERT items for their orders
CREATE POLICY "students_insert_items"
ON order_items FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM orders
    WHERE orders.id = order_items.order_id
    AND orders.student_id = auth.uid()
  )
);

-- Users can SELECT items for orders they're involved in
CREATE POLICY "users_select_items"
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

-- Students can INSERT meta for their orders
CREATE POLICY "students_insert_meta"
ON order_meta FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM orders
    WHERE orders.id = order_meta.order_id
    AND orders.student_id = auth.uid()
  )
);

-- Users can SELECT meta for orders they're involved in
CREATE POLICY "users_select_meta"
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

-- Verify policies were created
SELECT schemaname, tablename, policyname, cmd 
FROM pg_policies 
WHERE tablename IN ('orders', 'order_items', 'order_meta')
ORDER BY tablename, policyname;
