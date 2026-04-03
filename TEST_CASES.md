# Phase 1 & 2 Test Cases

## 🧪 Test Environment Setup

**Prerequisites**:
- App running at http://localhost:3000
- Supabase connected
- Browser with cookies enabled
- Incognito/private mode for clean testing

---

## ✅ Phase 1 Tests: Core Backend Foundation

### Test 1.1: Supabase Connection
**Expected**: App loads without errors
```
1. Go to http://localhost:3000
2. Open browser console (F12)
3. Check for any Supabase errors
4. Result: ✅ No errors, app loads
```

### Test 1.2: Database Tables Exist
**Expected**: All tables created in Supabase
```
1. Go to Supabase Dashboard
2. Check SQL Editor
3. Run: SELECT * FROM profiles LIMIT 1;
4. Result: ✅ Query succeeds (may be empty)
5. Repeat for: runners, orders, service_categories, etc.
```

### Test 1.3: Service Categories Seeded
**Expected**: 8 service categories in database
```
1. Go to Supabase Dashboard → service_categories table
2. Count rows
3. Result: ✅ Should have 8 rows
4. Check names: Gas Refill, Market Run, Laundry, etc.
```

### Test 1.4: Authentication Works
**Expected**: Can create account and login
```
1. Go to /student-signup
2. Fill form with test data
3. Submit
4. Result: ✅ Account created, redirected to /student
```

### Test 1.5: Role System Works
**Expected**: Role stored correctly
```
1. Go to Supabase Dashboard → profiles table
2. Find your test account
3. Check `role` column
4. Result: ✅ Should be 'student'
```

---

## ✅ Phase 2 Tests: Authentication & User Routing

### Test 2.1: Student Signup Flow
**Expected**: Student can signup and access dashboard
```
1. Go to http://localhost:3000/student-signup
2. Fill form:
   - Full Name: Test Student
   - Email: student@test.com
   - Phone: +234 80 0000 0001
   - University: Test University
   - Hostel: Test Hostel
   - Password: TestPass123!
3. Click "Create Account"
4. Result: ✅ Redirects to /student
5. Result: ✅ See student dashboard
```

### Test 2.2: Student Login Flow
**Expected**: Student can login
```
1. Go to http://localhost:3000/login
2. Enter email: student@test.com
3. Enter password: TestPass123!
4. Click "Sign In"
5. Result: ✅ Redirects to /student
6. Result: ✅ See student dashboard
```

### Test 2.3: Student Logout
**Expected**: Student can logout
```
1. While logged in as student
2. Click "Logout" button
3. Result: ✅ Redirects to home page
4. Result: ✅ Session cleared
```

### Test 2.4: Student Session Persistence
**Expected**: Session persists after page refresh
```
1. Login as student
2. Go to /student
3. Refresh page (F5)
4. Result: ✅ Still logged in, still on /student
5. Close browser tab
6. Open new tab, go to /student
7. Result: ✅ Still logged in
```

### Test 2.5: Runner Signup Flow
**Expected**: Runner can signup and access dashboard
```
1. Go to http://localhost:3000/runner-signup
2. Fill form:
   - Full Name: Test Runner
   - Email: runner@test.com
   - Phone: +234 80 0000 0002
   - University: Test University
   - Hostel: Test Hostel
   - Password: TestPass123!
3. Click "Become a Runner"
4. Result: ✅ Redirects to /runner
5. Result: ✅ See "Verification Pending" screen (NEW)
```

### Test 2.6: Runner Verification Pending
**Expected**: Pending runner can't access dashboard
```
1. Signup as runner (verification_status = 'pending')
2. Try to access /runner
3. Result: ✅ See "Verification Pending" screen
4. Result: ✅ Can logout
```

### Test 2.7: Runner Verification Approved
**Expected**: Approved runner can access dashboard
```
1. Go to Supabase Dashboard → profiles table
2. Find runner profile
3. Set verification_status = 'approved'
4. Go to /runner
5. Result: ✅ See runner dashboard
```

### Test 2.8: Runner Verification Rejected
**Expected**: Rejected runner can't access dashboard
```
1. Go to Supabase Dashboard → profiles table
2. Find runner profile
3. Set verification_status = 'rejected'
4. Go to /runner
5. Result: ✅ See "Verification Rejected" screen
6. Result: ✅ Can logout
```

### Test 2.9: Admin Login Flow
**Expected**: Admin can login
```
1. Create admin account in Supabase:
   - Go to Authentication → Users
   - Add user with email: admin@test.com
   - Set password: TestPass123!
2. Go to profiles table
3. Find admin profile
4. Set role = 'admin'
5. Go to /login
6. Enter admin email and password
7. Result: ✅ Redirects to /admin
8. Result: ✅ See admin dashboard
```

### Test 2.10: Admin Logout
**Expected**: Admin can logout
```
1. While logged in as admin
2. Click "Logout" button
3. Result: ✅ Redirects to home page
```

---

## 🔐 Access Control Tests

### Test 3.1: Student Can't Access Runner Dashboard
**Expected**: Student redirected when accessing /runner
```
1. Login as student
2. Go to http://localhost:3000/runner
3. Result: ✅ Redirected to /login or home
4. Result: ✅ Not on /runner
```

### Test 3.2: Student Can't Access Admin Dashboard
**Expected**: Student redirected when accessing /admin
```
1. Login as student
2. Go to http://localhost:3000/admin
3. Result: ✅ Redirected to /login or home
4. Result: ✅ Not on /admin
```

### Test 3.3: Runner Can't Access Student Dashboard
**Expected**: Runner redirected when accessing /student
```
1. Login as runner (with verification_status = 'approved')
2. Go to http://localhost:3000/student
3. Result: ✅ Redirected to /login or home
4. Result: ✅ Not on /student
```

### Test 3.4: Runner Can't Access Admin Dashboard
**Expected**: Runner redirected when accessing /admin
```
1. Login as runner
2. Go to http://localhost:3000/admin
3. Result: ✅ Redirected to /login or home
4. Result: ✅ Not on /admin
```

### Test 3.5: Admin Can't Access Student Dashboard
**Expected**: Admin redirected when accessing /student
```
1. Login as admin
2. Go to http://localhost:3000/student
3. Result: ✅ Redirected to /login or home
4. Result: ✅ Not on /student
```

### Test 3.6: Admin Can't Access Runner Dashboard
**Expected**: Admin redirected when accessing /runner
```
1. Login as admin
2. Go to http://localhost:3000/runner
3. Result: ✅ Redirected to /login or home
4. Result: ✅ Not on /runner
```

---

## 🚫 Unauthenticated Access Tests

### Test 4.1: Unauthenticated Can't Access Student Dashboard
**Expected**: Redirected to login
```
1. Clear cookies (Ctrl+Shift+Delete)
2. Go to http://localhost:3000/student
3. Result: ✅ Redirected to /login
```

### Test 4.2: Unauthenticated Can't Access Runner Dashboard
**Expected**: Redirected to login
```
1. Clear cookies
2. Go to http://localhost:3000/runner
3. Result: ✅ Redirected to /login
```

### Test 4.3: Unauthenticated Can't Access Admin Dashboard
**Expected**: Redirected to login
```
1. Clear cookies
2. Go to http://localhost:3000/admin
3. Result: ✅ Redirected to /login
```

### Test 4.4: Unauthenticated Can Access Home Page
**Expected**: Can view home page
```
1. Clear cookies
2. Go to http://localhost:3000
3. Result: ✅ See home page
4. Result: ✅ See login/signup links
```

---

## 🔄 Redirect Tests

### Test 5.1: Authenticated Student Accessing Login
**Expected**: Redirected to /student
```
1. Login as student
2. Go to /login
3. Result: ✅ Redirected to /student
```

### Test 5.2: Authenticated Runner Accessing Login
**Expected**: Redirected to /runner
```
1. Login as runner
2. Go to /login
3. Result: ✅ Redirected to /runner
```

### Test 5.3: Authenticated Admin Accessing Login
**Expected**: Redirected to /admin
```
1. Login as admin
2. Go to /login
3. Result: ✅ Redirected to /admin
```

### Test 5.4: Authenticated Student Accessing Signup
**Expected**: Redirected to /student
```
1. Login as student
2. Go to /student-signup
3. Result: ✅ Redirected to /student
```

---

## 📊 Test Results Template

```
Test Case: [Name]
Expected: [What should happen]
Actual: [What actually happened]
Status: ✅ PASS / ❌ FAIL
Notes: [Any additional notes]
```

---

## 🎯 Quick Test Checklist

- [ ] Test 1.1: Supabase Connection
- [ ] Test 1.2: Database Tables
- [ ] Test 1.3: Service Categories
- [ ] Test 1.4: Authentication
- [ ] Test 1.5: Role System
- [ ] Test 2.1: Student Signup
- [ ] Test 2.2: Student Login
- [ ] Test 2.3: Student Logout
- [ ] Test 2.4: Student Session
- [ ] Test 2.5: Runner Signup
- [ ] Test 2.6: Runner Pending
- [ ] Test 2.7: Runner Approved
- [ ] Test 2.8: Runner Rejected
- [ ] Test 2.9: Admin Login
- [ ] Test 2.10: Admin Logout
- [ ] Test 3.1: Student Can't Access Runner
- [ ] Test 3.2: Student Can't Access Admin
- [ ] Test 3.3: Runner Can't Access Student
- [ ] Test 3.4: Runner Can't Access Admin
- [ ] Test 3.5: Admin Can't Access Student
- [ ] Test 3.6: Admin Can't Access Runner
- [ ] Test 4.1: Unauth Can't Access Student
- [ ] Test 4.2: Unauth Can't Access Runner
- [ ] Test 4.3: Unauth Can't Access Admin
- [ ] Test 4.4: Unauth Can Access Home
- [ ] Test 5.1: Auth Student Accessing Login
- [ ] Test 5.2: Auth Runner Accessing Login
- [ ] Test 5.3: Auth Admin Accessing Login
- [ ] Test 5.4: Auth Student Accessing Signup

**Total Tests**: 30
**Estimated Time**: 30-45 minutes

---

## 🐛 Common Issues & Solutions

### Issue: "Verification Pending" screen not showing
**Solution**: 
1. Check verification_status in profiles table
2. Make sure it's 'pending' (not 'approved')
3. Refresh page

### Issue: Redirect loop
**Solution**:
1. Clear cookies
2. Clear cache
3. Try incognito mode

### Issue: Can't login
**Solution**:
1. Check email is correct
2. Check password is correct
3. Check account exists in Supabase

### Issue: Wrong redirect after login
**Solution**:
1. Check role in profiles table
2. Check middleware.ts is correct
3. Check layout files have role checks

---

**Total Estimated Time**: 1-2 hours
**Difficulty**: Easy
**Importance**: Critical
