-- Fix RLS Policies for Orders Table
-- Run this in Supabase SQL Editor

-- Drop existing policies
DROP POLICY IF EXISTS "Students can create their own orders" ON orders;
DROP POLICY IF EXISTS "Students can view their own orders" ON orders;
DROP POLICY IF EXISTS "Students can update their own orders" ON orders;
DROP POLICY IF EXISTS "Runners can view accepted orders" ON orders;
DROP POLICY IF EXISTS "Runners can update accepted orders" ON orders;
DROP POLICY IF EXISTS "Admins can view all orders" ON orders;
DROP POLICY IF EXISTS "Admins can update all orders" ON orders;

-- Enable RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Students can INSERT their own orders
CREATE POLICY "Students can create orders"
ON orders FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = student_id
);

-- Students can SELECT their own orders
CREATE POLICY "Students can view own orders"
ON orders FOR SELECT
TO authenticated
USING (
  auth.uid() = student_id
);

-- Students can UPDATE their own pending orders
CREATE POLICY "Students can update own pending orders"
ON orders FOR UPDATE
TO authenticated
USING (
  auth.uid() = student_id AND status = 'pending'
)
WITH CHECK (
  auth.uid() = student_id
);

-- Runners can SELECT orders assigned to them or pending orders
CREATE POLICY "Runners can view available orders"
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

-- Runners can UPDATE orders assigned to them
CREATE POLICY "Runners can update assigned orders"
ON orders FOR UPDATE
TO authenticated
USING (
  auth.uid() = runner_id
)
WITH CHECK (
  auth.uid() = runner_id
);

-- Admins can do everything
CREATE POLICY "Admins full access"
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

-- Fix order_items RLS
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view order items" ON order_items;
DROP POLICY IF EXISTS "Users can insert order items" ON order_items;

-- Allow insert for order items
CREATE POLICY "Students can create order items"
ON order_items FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM orders
    WHERE orders.id = order_items.order_id
    AND orders.student_id = auth.uid()
  )
);

-- Allow select for order items
CREATE POLICY "Users can view order items"
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

-- Fix order_meta RLS
ALTER TABLE order_meta ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view order meta" ON order_meta;
DROP POLICY IF EXISTS "Users can insert order meta" ON order_meta;

-- Allow insert for order meta
CREATE POLICY "Students can create order meta"
ON order_meta FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM orders
    WHERE orders.id = order_meta.order_id
    AND orders.student_id = auth.uid()
  )
);

-- Allow select for order meta
CREATE POLICY "Users can view order meta"
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
