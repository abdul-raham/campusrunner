# Admin Account Creation Guide

## How to Create an Admin Account

Since admin accounts should not be created through the public signup flow, follow these steps to create an admin account manually:

### Step 1: Create Auth User in Supabase

1. Go to [Supabase Dashboard](https://supabase.com)
2. Select your project
3. Go to **Authentication** → **Users**
4. Click **Add user**
5. Fill in:
   - Email: `admin@campusrunner.com` (or your admin email)
   - Password: Create a strong password
6. Click **Create user**

### Step 2: Create Admin Profile

1. Go to **SQL Editor**
2. Run this SQL:

```sql
INSERT INTO profiles (
  id,
  full_name,
  email,
  phone,
  role,
  university,
  hostel_location,
  matric_number
) VALUES (
  '[USER_ID_FROM_STEP_1]',
  'Admin User',
  'admin@campusrunner.com',
  '+234 80 0000 0000',
  'admin',
  'CampusRunner',
  'Admin Office',
  'ADMIN001'
);
```

**Replace `[USER_ID_FROM_STEP_1]` with the user ID from Step 1**

### Step 3: Verify Admin Account

1. Go to **profiles** table
2. Find your admin user
3. Verify:
   - `role` = 'admin'
   - `email` = correct email
   - All fields are filled

### Step 4: Login as Admin

1. Go to http://localhost:3000/login
2. Enter admin email and password
3. Should redirect to `/admin`
4. Should see admin dashboard

---

## Admin Dashboard Features

Once logged in as admin, you can:
- View all orders
- Manage runners
- Manage students
- View transactions
- Access settings

---

## Security Notes

- ✅ Admin accounts are created manually only
- ✅ No public signup for admin role
- ✅ Admin credentials should be kept secure
- ✅ Consider using strong passwords
- ✅ Consider enabling 2FA for admin accounts

---

## Troubleshooting

### Admin can't login
- Check email is correct
- Check password is correct
- Verify profile exists in database
- Check role = 'admin'

### Admin redirects to login
- Check middleware.ts
- Check admin layout
- Verify role in database

### Admin can't access dashboard
- Check browser console for errors
- Clear cookies and cache
- Try incognito mode

---

## Next Steps

1. Create your first admin account using this guide
2. Test admin login
3. Verify admin dashboard works
4. Move to Phase 3

---

**Status**: Ready to create admin accounts
**Time**: 5 minutes per account
**Difficulty**: Easy
