-- Add missing role column to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'student';

-- Update existing profiles to have student role if null
UPDATE profiles SET role = 'student' WHERE role IS NULL;

-- Add constraint to ensure role is either 'student' or 'runner'
ALTER TABLE profiles ADD CONSTRAINT profiles_role_check CHECK (role IN ('student', 'runner'));