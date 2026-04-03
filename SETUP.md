# CampusRunner Setup Instructions

## Supabase Configuration

To fix the authentication 401 errors, you need to set up Supabase:

1. Go to [Supabase](https://supabase.com) and create a new project
2. Go to Settings > API in your Supabase dashboard
3. Copy your project URL and anon key
4. Update `.env.local` with your actual credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

## Database Schema

Create these tables in your Supabase SQL editor:

```sql
-- Profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  university TEXT,
  hostel_location TEXT,
  matric_number TEXT,
  role TEXT DEFAULT 'student',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Runners table
CREATE TABLE runners (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  verification_status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE runners ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
```

## Logo Usage

The app now uses `/public/logo.png` for:
- Favicon
- Header logo
- Authentication forms
- Footer branding

Make sure `logo.png` exists in the public folder.

## Fix Email Rate Limit

To bypass "email rate limit exceeded":
1. Go to Supabase Dashboard > Authentication > Settings
2. Turn OFF "Enable email confirmations"
3. This allows immediate signups without email verification

## Create Database Tables

**IMPORTANT:** You must run the SQL commands above in your Supabase SQL Editor to create the tables. The app will not work without these tables.

1. Go to Supabase Dashboard > SQL Editor
2. Copy and paste the SQL commands from the Database Schema section
3. Click "Run" to create the tables