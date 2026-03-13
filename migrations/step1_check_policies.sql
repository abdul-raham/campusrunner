-- Step 1: Check existing policies
-- Run this FIRST to see what policies exist

SELECT schemaname, tablename, policyname, cmd 
FROM pg_policies 
WHERE tablename IN ('orders', 'order_items', 'order_meta')
ORDER BY tablename, policyname;
