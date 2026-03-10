-- Add missing role column to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'student';

-- Update existing profiles to have student role if null
UPDATE profiles SET role = 'student' WHERE role IS NULL;