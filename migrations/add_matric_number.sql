-- Add matric_number column to profiles table
ALTER TABLE profiles ADD COLUMN matric_number TEXT;

-- Create index for faster lookups
CREATE INDEX idx_profiles_matric_number ON profiles(matric_number);
