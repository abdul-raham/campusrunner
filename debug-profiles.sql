-- Debug: Check if profiles exist and RLS policies work
-- Run this in Supabase SQL editor to debug

-- Check all profiles
SELECT id, email, role, full_name, created_at FROM profiles ORDER BY created_at DESC;

-- Check RLS policies on profiles table
SELECT * FROM pg_policies WHERE tablename = 'profiles';

-- Test profile access for specific user (replace with actual user ID)
-- SELECT * FROM profiles WHERE id = 'your-user-id-here';

-- Check if there are any triggers on profiles table
SELECT trigger_name, event_manipulation, action_statement 
FROM information_schema.triggers 
WHERE event_object_table = 'profiles';