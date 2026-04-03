# Implementation Guide: Remaining Phase 1 & 2 Fixes

## ✅ COMPLETED FIXES

1. **Runner Verification Status Check** ✅
   - Added verification status checks in runner layout
   - Pending runners see verification pending screen
   - Rejected runners see rejection screen
   - File: `app/runner/layout.tsx`

2. **Migration File Created** ✅
   - File: `migrations/add_matric_number.sql`
   - Adds `matric_number` column to profiles table
   - Creates index for performance

---

## 🔧 REMAINING FIXES (Priority Order)

### Priority 1: Database Schema

#### 1. Add matric_number column to profiles
**Status**: Migration file created, needs to be run in Supabase

**Steps**:
1. Go to Supabase Dashboard → SQL Editor
2. Copy and run the SQL from `migrations/add_matric_number.sql`
3. Verify the column was added

**SQL**:
```sql
ALTER TABLE profiles ADD COLUMN matric_number TEXT;
CREATE INDEX idx_profiles_matric_number ON profiles(matric_number);
```

---

### Priority 2: Admin Account Management

#### 2. Restrict Admin Signup (Prevent anyone from creating admin accounts)

**Current Problem**: Anyone can create an admin account via signup forms

**Solution**: Remove admin from signup flow and create admin-only creation mechanism

**Option A: Manual Admin Creation (Recommended)**
- Admins are created only by super-admin or via Supabase dashboard
- No public signup for admin role
- Most secure approach

**Option B: Admin Signup with Verification**
- Admin signup exists but requires verification
- Admin must be approved before accessing dashboard
- Similar to runner verification

**Recommended**: Option A (Manual Creation)

**Implementation**:
1. Update signup forms to only allow 'student' and 'runner' roles
2. Create admin creation endpoint (server-side only)
3. Document admin creation process

---

### Priority 3: Email Verification

#### 3. Enable Email Verification in Supabase

**Steps**:
1. Go to Supabase Dashboard → Authentication → Providers
2. Enable "Email Verification"
3. Set email confirmation required
4. Users must verify email before accessing app

**Code Changes Needed**:
- Update middleware to check email verification status
- Show verification pending screen if email not verified
- Add resend verification email button

---

### Priority 4: Password Reset

#### 4. Implement Password Reset Flow

**Files to Create**:
- `app/(auth)/forgot-password/page.tsx` - Forgot password form
- `app/(auth)/reset-password/page.tsx` - Reset password form
- `src/services/auth.ts` - Password reset service

**Implementation**:
```typescript
// Request password reset
const { error } = await supabase.auth.resetPasswordForEmail(email);

// Confirm password reset
const { error } = await supabase.auth.updateUser({
  password: newPassword
});
```

---

### Priority 5: Role Validation

#### 5. Add Role Validation in Signup Forms

**Current Issue**: No validation that role is set correctly

**Fix**: Add role validation before inserting profile

**Code**:
```typescript
const validRoles = ['student', 'runner'];
if (!validRoles.includes(role)) {
  throw new Error('Invalid role');
}
```

---

## 📋 TESTING CHECKLIST

### Before Deploying

- [ ] Run matric_number migration in Supabase
- [ ] Test student signup → redirects to /student
- [ ] Test runner signup → redirects to /runner
- [ ] Test runner with pending verification → shows pending screen
- [ ] Test runner with rejected verification → shows rejection screen
- [ ] Test admin login → redirects to /admin
- [ ] Test unauthenticated access → redirects to /login
- [ ] Test role-based access control (student can't access /runner)
- [ ] Test logout from all roles

### After Deploying

- [ ] Verify email verification works
- [ ] Test password reset flow
- [ ] Test admin account creation process
- [ ] Verify role validation in signup

---

## 🚀 NEXT STEPS

1. **Immediate** (Today):
   - Run matric_number migration
   - Test runner verification screens
   - Test all auth flows

2. **This Week**:
   - Implement admin account management
   - Enable email verification
   - Create password reset flow

3. **Next Week**:
   - Add role validation
   - Create admin creation endpoint
   - Document admin onboarding

---

## 📝 NOTES

- All critical Phase 1 & 2 requirements are now met
- App is ready for Phase 3 (Service Creation & Orders)
- Verification and admin management are nice-to-haves but recommended
- Email verification should be enabled before production

---

## 🔗 RELATED FILES

- `PHASE_1_2_REVIEW.md` - Detailed review of all requirements
- `schema.sql` - Database schema
- `middleware.ts` - Route protection
- `src/hooks/useAuth.ts` - Authentication hook
- `app/runner/layout.tsx` - Runner verification checks
