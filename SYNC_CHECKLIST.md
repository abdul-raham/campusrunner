# Quick Sync Checklist - Redesign to Current

Use this checklist to sync the redesign changes to your current codebase.

## ✅ NEW FILES TO CREATE

### Authentication & Constants
- [ ] Create `src/lib/demo-auth.ts` - Demo auth system with localStorage
- [ ] Create `src/constants/mock-data.ts` - Service cards, stats, orders, jobs, metrics

### Components
- [ ] Create `components/ui/BrandMark.tsx` - Brand logo component with gradient

### Pages
- [ ] Create `app/admin/page.tsx` - Admin dashboard landing page

## ✅ FILES TO SIGNIFICANTLY MODIFY

### Configuration (Critical)
- [ ] `package.json` - REMOVE: @supabase/*, @hookform/*, @base-ui/*, shadcn, class-variance-authority, clsx, prettier, zod, zustand, tailwind-merge, tw-animate-css, @tailwindcss/forms
  - KEEP: framer-motion, lucide-react, next, react, react-dom
  - UPDATE: Versions to Redesign versions (next: ^15, etc.)

- [ ] `tsconfig.json` 
  - Change `strict: true` → `false`
  - Change `jsx: "react-jsx"` → `"preserve"`
  - Add `baseUrl: "."`
  - Expand paths to include `@/src/*`

### Authentication
- [ ] `src/hooks/useAuth.ts` - COMPLETE REWRITE
  - Remove Supabase calls
  - Use `getDemoSession()` from demo-auth
  - Simplify to use localStorage

### Pages (Redesign UI)
- [ ] `app/page.tsx` - Complete redesign
  - Use `BrandMark` component
  - Import `serviceCards` from mock-data
  - Simplify layout and remove verbose styling

- [ ] `app/student/page.tsx` - Significant simplification
  - Use `recentOrders`, `serviceCards` from mock-data
  - Use new `useAuth()` hook
  - Reduce component size to ~50 lines
  - Remove local order/stats data

- [ ] `app/runner/page.tsx` - Significant simplification
  - Use `runnerJobs` from mock-data
  - Add status toggle button (Available/Offline)
  - Reduce component size to ~40 lines
  - Remove local job data

### Auth Components
- [ ] `components/auth/LoginForm.tsx` 
  - Use `getDemoSession()` instead of Supabase
  - Simplify authentication flow

- [ ] `components/auth/StudentSignupForm.tsx`
  - Use `registerDemoUser()` with role: 'student'
  - Remove Supabase calls
  - Condense form fields using map pattern

- [ ] `components/auth/RunnerSignupForm.tsx`
  - Use `registerDemoUser()` with role: 'runner'
  - Remove Supabase calls
  - Condense form fields using map pattern

### Type Definitions (Check & Update)
- [ ] `src/types/index.ts` - May need simplification due to demo-auth
- [ ] `src/lib/schemas.ts` - May be simplified (no zod needed)

## ✅ LAYOUT FILES (Check if Modified)
- [ ] `app/layout.tsx` - Verify identical (appears same)
- [ ] `app/student/layout.tsx` - Compare and update if needed
- [ ] `app/runner/layout.tsx` - Compare and update if needed  
- [ ] `app/admin/layout.tsx` - Compare and update if needed

## ✅ FILES TO DELETE

### Configuration
- [ ] `middleware.ts` - Not needed for demo
- [ ] `next.config.ts` - Remove custom Supabase config
- [ ] `tailwind.config.ts` - Remove custom theme (use defaults)
- [ ] `eslint.config.mjs` - Remove custom ESLint config

### Environment
- [ ] `.env.example` - Remove example env file
- [ ] `.env.local` - Remove local env (not in redesign)
- [ ] Optionally: `.gitignore` (compare first)

### Documentation
- [ ] `README_MVP.md` - Remove MVP docs
- [ ] `SETUP.md` - Remove setup instructions
- [ ] `build-output.txt` - Remove build output
- [ ] `debug-profiles.sql` - Remove debug script

### Database/SQL (All)
- [ ] `schema.sql`
- [ ] `supabase-auto-profile-trigger.sql`
- [ ] `add-role-column.sql`
- [ ] `fix-rls-policies.sql`
- [ ] `fix-role-column.sql`
- [ ] `delete-old-user.sql`

### UI/Component Config
- [ ] `components.json` - Remove Shadcn config

### Public Assets (Cleanup)
- [ ] Keep: `public/logo.png`, `public/logo.svg`
- [ ] Delete: `public/Delivery Exchange Scene.png`
- [ ] Delete: `public/Delivery in Motion.png`
- [ ] Delete: `public/favicon.svg`
- [ ] Delete: `public/file.svg`
- [ ] Delete: `public/Gemini_Generated_Image_*.png` (all)
- [ ] Delete: `public/globe.svg`
- [ ] Delete: `public/next.svg`
- [ ] Delete: `public/Package Delivery Scene.png`
- [ ] Delete: `public/vercel.svg`
- [ ] Delete: `public/window.svg`

### Duplicate Source Code
- [ ] Remove: `src/components/auth/` (duplicate of `components/auth/`)
- [ ] Remove: `src/components/ErrorBoundary.tsx`
- [ ] Remove: `src/components/AuthDebug.tsx`
- [ ] Remove: `src/components/MobileNavbar.tsx`
- [ ] Remove: `src/components/` directory entirely (keep `components/` root)

## ✅ CONTENT UPDATES (No Major Changes)
- [ ] `components/ErrorBoundary.tsx` - Same (no update needed)
- [ ] `components/AnimatedLoader.tsx` - Same (no update needed)
- [ ] `components/WelcomeLoader.tsx` - Same (no update needed)
- [ ] `components/MinimalLoader.tsx` - Same (no update needed)
- [ ] `app/admin/dashboard/page.tsx` - Same (no update needed)
- [ ] Other sub-page COMPONENTS - Check individually but likely same

## ✅ VERIFICATION STEPS

After making changes:
1. [ ] Run `npm install` (should have fewer dependencies now)
2. [ ] Run `npm run dev` - Should start without errors
3. [ ] Test login with admin@campusrunner.app / admin123
4. [ ] Test student signup - Create demo student account
5. [ ] Test runner signup - Create demo runner account
6. [ ] Verify admin dashboard loads at `/admin`
7. [ ] Check student dashboard at `/student` shows mock data
8. [ ] Check runner dashboard at `/runner` shows mock jobs
9. [ ] Verify no console errors about missing dependencies
10. [ ] Verify TypeScript compilation passes (with strict: false)

## 📋 DEPENDENCY REMOVAL COMMANDS

When ready to clean up run:

```bash
# Remove all Supabase packages
npm uninstall @supabase/auth-helpers-nextjs @supabase/ssr @supabase/supabase-js

# Remove form & validation libraries
npm uninstall @hookform/resolvers react-hook-form zod class-variance-authority

# Remove UI component libraries
npm uninstall @base-ui/react @tailwindcss/forms shadcn clsx tailwind-merge

# Remove other utilities
npm uninstall prettier tw-animate-css zustand

# Verify package.json has only:
# - framer-motion
# - lucide-react  
# - next
# - react
# - react-dom
# - @types/* (for dev)
# - typescript (for dev)
```

## 🔍 KEY TECHNOLOGY SHIFTS

| Aspect | Current | Redesign | Action |
|--------|---------|----------|--------|
| **Auth** | Supabase | localStorage demo | Replace all auth calls |
| **Forms** | react-hook-form + Zod | Simple state | Remove form validation |
| **UI Components** | Custom + Shadcn | Custom only | Remove UI library code |
| **Database** | SQL migrations | In-memory (localStorage) | Delete SQL files |
| **Data** | Runtime generated | Mock constants | Create mock-data.ts |
| **TypeScript** | Strict mode | Loose mode | Update tsconfig |

## 💡 IMPORTANT NOTES

1. **Demo Auth:** The redesign uses `localStorage` for demo purposes. To add real Supabase auth later, you'll only need to update `src/hooks/useAuth.ts` and auth components - the UI won't change.

2. **Mock Data:** All mock data is centralized in `src/constants/mock-data.ts`, making it easy to replace with real API calls later.

3. **Component Size:** Components are significantly smaller because they import data from constants instead of defining it inline.

4. **No Build Config:** By using Next.js defaults (no custom next.config.ts, eslint.config.mjs, tailwind.config.ts), the build is simpler and easier to debug.

5. **Minimal Dependencies:** Fewer dependencies = smaller bundle size, faster installs, fewer security updates to manage.

## 📝 ESTIMATED EFFORT

- **Easy (< 30 min):** Delete files, update tsconfig, delete SQL files
- **Medium (30-60 min):** Update package.json, create new files, update useAuth hook
- **Hard (> 1 hour):** Redesign pages (homepage, student dashboard, runner dashboard)
- **Total:** ~2-3 hours for complete sync

---

**Created:** 2026-03-12  
**Redesign Version:** campusrunner_redesign_demo
**Current Branch:** main

