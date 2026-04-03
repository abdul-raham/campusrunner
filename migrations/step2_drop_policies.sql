-- Step 2: Drop all existing policies manually
-- Run this SECOND after checking what exists

-- Drop orders policies
DROP POLICY IF EXISTS "Students can view own orders" ON orders;
DROP POLICY IF EXISTS "Students can create orders" ON orders;
DROP POLICY IF EXISTS "Students can update own pending orders" ON orders;
DROP POLICY IF EXISTS "Runners can view available orders" ON orders;
DROP POLICY IF EXISTS "Runners can update assigned orders" ON orders;
DROP POLICY IF EXISTS "Admins full access" ON orders;
DROP POLICY IF EXISTS "students_insert_orders" ON orders;
DROP POLICY IF EXISTS "students_select_orders" ON orders;
DROP POLICY IF EXISTS "students_update_orders" ON orders;
DROP POLICY IF EXISTS "runners_select_orders" ON orders;
DROP POLICY IF EXISTS "runners_update_orders" ON orders;
DROP POLICY IF EXISTS "admins_all_orders" ON orders;

-- Drop order_items policies
DROP POLICY IF EXISTS "Users can view order items" ON order_items;
DROP POLICY IF EXISTS "Users can insert order items" ON order_items;
DROP POLICY IF EXISTS "Students can create order items" ON order_items;
DROP POLICY IF EXISTS "students_insert_items" ON order_items;
DROP POLICY IF EXISTS "users_select_items" ON order_items;

-- Drop order_meta policies
DROP POLICY IF EXISTS "Users can view order meta" ON order_meta;
DROP POLICY IF EXISTS "Users can insert order meta" ON order_meta;
DROP POLICY IF EXISTS "Students can create order meta" ON order_meta;
DROP POLICY IF EXISTS "students_insert_meta" ON order_meta;
DROP POLICY IF EXISTS "users_select_meta" ON order_meta;
