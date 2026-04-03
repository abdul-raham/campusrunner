# Quick Fix Guide - Run These Commands

## 🚀 Immediate Actions Required

### Step 1: Add matric_number Column to Profiles

**Where**: Supabase Dashboard → SQL Editor

**Copy and paste this SQL**:
```sql
-- Add matric_number column to profiles table
ALTER TABLE profiles ADD COLUMN matric_number TEXT;

-- Create index for faster lookups
CREATE INDEX idx_profiles_matric_number ON profiles(matric_number);
```

**Expected Result**: ✅ No errors, column added

---

### Step 2: Verify Runner Verification Status Works

**Test in browser**:
1. Go to http://localhost:3000/runner-signup
2. Create a runner account
3. Go to Supabase Dashboard → profiles table
4. Find your runner profile
5. Check `verification_status` field (should be 'pending')
6. Try accessing http://localhost:3000/runner
7. Should see "Verification Pending" screen ✅

---

### Step 3: Test All Auth Flows

**Student Flow**:
```
1. Signup at /student-signup
2. Should redirect to /student ✅
3. Should see student dashboard ✅
```

**Runner Flow**:
```
1. Signup at /runner-signup
2. Should redirect to /runner ✅
3. Should see "Verification Pending" screen ✅
```

**Admin Flow**:
```
1. Login at /login with admin account
2. Should redirect to /admin ✅
3. Should see admin dashboard ✅
```

---

## 📋 Optional: Enable Email Verification

**Where**: Supabase Dashboard → Authentication → Providers

**Steps**:
1. Click "Email" provider
2. Enable "Confirm email"
3. Save changes

**Result**: Users must verify email before accessing app

---

## 📋 Optional: Create Admin Account Manually

**Where**: Supabase Dashboard → Authentication → Users

**Steps**:
1. Click "Add user"
2. Enter email and password
3. Click "Create user"
4. Go to profiles table
5. Find the new user
6. Set `role` = 'admin'
7. Set `full_name`, `phone`, `university`, `hostel_location`

**Result**: Admin account created and ready to use

---

## ✅ Verification Checklist

After running the above commands, verify:

- [ ] matric_number column exists in profiles table
- [ ] Student signup works → redirects to /student
- [ ] Runner signup works → redirects to /runner
- [ ] Runner sees verification pending screen
- [ ] Admin can login → redirects to /admin
- [ ] Student can't access /runner
- [ ] Runner can't access /admin
- [ ] Logout works from all roles
- [ ] Unauthenticated users redirected to /login

---

## 🐛 Troubleshooting

### Issue: "Column already exists" error
**Solution**: The column might already exist. Check the profiles table in Supabase.

### Issue: Runner still sees dashboard instead of pending screen
**Solution**: 
1. Check `verification_status` in profiles table
2. Make sure it's set to 'pending' (not 'approved')
3. Refresh the page

### Issue: Admin can't login
**Solution**:
1. Check that admin profile exists in profiles table
2. Check that `role` = 'admin'
3. Check that email and password are correct

### Issue: Redirect loops
**Solution**:
1. Clear browser cookies
2. Clear browser cache
3. Try in incognito/private mode

---

## 📞 Need Help?

Check these files:
- `PHASE_1_2_REVIEW.md` - Detailed review
- `IMPLEMENTATION_GUIDE.md` - Implementation steps
- `PHASE_STATUS.md` - Current status
- `schema.sql` - Database schema
- `middleware.ts` - Route protection

---

**Time to Complete**: ~10 minutes
**Difficulty**: Easy
**Impact**: High (fixes critical issues)
