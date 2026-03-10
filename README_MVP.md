# CampusRunner 🚀

**Campus logistics and errand marketplace for students**

A production-ready MVP web app that connects students who need help with campus errands (gas refills, market runs, food pickup, etc.) with student runners who can complete those tasks and earn money.

---

## 🎯 Features

### For Students
- ✅ Request various campus errand services
- ✅ Get instant offers from nearby student runners
- ✅ Real-time order tracking
- ✅ Digital wallet for payments
- ✅ Rate and review runners
- ✅ Order history and analytics
- ✅ In-app notifications

### For Runners
- ✅ Browse available jobs in campus
- ✅ Accept and start earning instantly
- ✅ Build reputation with ratings
- ✅ Earnings tracking and analytics
- ✅ Instant payout system
- ✅ Tier system (Campus Hero rewards)
- ✅ Availability toggle

### For Admins
- ✅ Platform overview and KPIs
- ✅ Manage runner verifications
- ✅ Monitor all orders and transactions
- ✅ View user management
- ✅ Revenue tracking
- ✅ Service category management

### Services Offered
1. **Gas Refill** - LPG cylinder refills with vendor options
2. **Market Run** - Shopping from local markets with item lists
3. **Laundry Pickup** - Full laundry service (wash, fold, iron)
4. **Printing & Photocopy** - Document printing with file upload
5. **Food Pickup** - Restaurant order delivery
6. **Parcel Delivery** - Safe parcel delivery
7. **Pharmacy / Essentials** - Medicine and essentials delivery
8. **Errand Assistant** - General campus errands

---

## 🏗️ Tech Stack

- **Frontend**: Next.js 14+, TypeScript, React
- **UI**: Tailwind CSS, shadcn/ui, Lucide Icons
- **State Management**: Zustand, Context API
- **Forms**: React Hook Form + Zod validation
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Authentication**: Supabase Auth
- **Deployment**: Vercel-ready
- **Code Quality**: ESLint, Prettier

---

## 📋 Project Structure

```
campusrunner/
├── app/                              # Next.js App Router
│   ├── (auth)/                      # Auth routes (signup, login)
│   │   ├── login/
│   │   ├── signup/
│   │   ├── student-signup/
│   │   └── runner-signup/
│   ├── (student)/                   # Student dashboard routes
│   │   ├── layout.tsx               # Student layout with sidebar
│   │   ├── page.tsx                 # Student dashboard
│   │   ├── orders/
│   │   ├── wallet/
│   │   ├── notifications/
│   │   └── profile/
│   ├── (runner)/                    # Runner dashboard routes
│   │   ├── layout.tsx               # Runner layout
│   │   ├── page.tsx                 # Runner dashboard
│   │   ├── jobs/
│   │   ├── my-jobs/
│   │   ├── earnings/
│   │   └── profile/
│   ├── (admin)/                     # Admin dashboard routes
│   │   ├── layout.tsx               # Admin layout
│   │   ├── page.tsx                 # Admin dashboard
│   │   ├── orders/
│   │   ├── runners/
│   │   ├── students/
│   │   ├── transactions/
│   │   └── settings/
│   ├── (marketing)/                 # Marketing pages
│   ├── api/                         # API routes (future)
│   ├── page.tsx                     # Landing page
│   ├── layout.tsx                   # Root layout
│   └── globals.css                  # Global styles
├── src/
│   ├── components/                  # Reusable components
│   │   └── auth/                    # Auth forms
│   ├── hooks/                       # Custom React hooks
│   │   ├── useAuth.ts              # Auth state management
│   │   └── useProtectedRoute.ts    # Route protection
│   ├── lib/                         # Utilities
│   │   ├── utils.ts                # Helper functions
│   │   └── schemas.ts              # Zod validation schemas
│   ├── services/                    # API service layer
│   │   └── api.ts                  # Supabase queries
│   ├── supabase/
│   │   └── client.ts               # Supabase client config
│   ├── types/                       # TypeScript types
│   │   └── index.ts                # All type definitions
│   ├── constants/                   # App constants
│   │   └── index.ts                # Services, fees, config
│   ├── utils/                       # Utilities
│   └── store/                       # Zustand (if needed)
├── schema.sql                       # Database schema
├── .env.example                     # Environment variables template
├── .prettierrc.json                # Prettier config
├── tailwind.config.ts              # Tailwind config
├── tsconfig.json                   # TypeScript config
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18+ and npm/yarn
- **Supabase** account (free tier works)
- **Git**

### 1. Setup Supabase

1. Create a [Supabase project](https://app.supabase.com)
2. Get your project credentials:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (for admin operations)

### 2. Initialize Database

1. In Supabase SQL Editor, run the SQL from `schema.sql`
2. This creates all tables, indexes, RLS policies, and seeds service categories

### 3. Setup Local Environment

```bash
# Clone the repository
git clone <repository-url>
cd campusrunner

# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local

# Edit .env.local with your Supabase credentials
nano .env.local
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 5. Test the App

**Marketing/Landing Page:**
- Visit `http://localhost:3000`

**Student Flow:**
- Sign up: `/auth/student-signup`
- Login: `/auth/login`
- Dashboard: `/student`

**Runner Flow:**
- Sign up: `/auth/runner-signup`
- Dashboard: `/runner`

**Admin Flow:**
- Manual DB entry required (no public signup)
- Use Supabase dashboard to create admin profile
- Dashboard: `/admin`

---

## 📊 Database Schema

### Key Tables
- **profiles** - User accounts (students, runners, admins)
- **runners** - Runner-specific data (verification, rating, stats)
- **service_categories** - Available services
- **orders** - Order requests from students
- **order_items** - Individual items in an order
- **order_meta** - Flexible service-specific data
- **transactions** - Payment/earning records
- **notifications** - In-app notifications

### Row Level Security (RLS)
- Students can only see their own orders
- Runners see assigned orders
- Admins see all orders
- User profiles are public but editable only by owner

---

## 🔐 Authentication

### How It Works
1. User signs up with email/password → Supabase Auth
2. Profile created in `profiles` table
3. Role assigned (student/runner/admin)
4. Login redirects to appropriate dashboard

### Protected Routes
Routes are protected using `useProtectedRoute()` hook:

```typescript
// In any component
const { user, profile, loading } = useProtectedRoute('student');
```

---

## 💰 Pricing Logic

**Formula:** `Base Fee + Service Fee (10%) + Urgency Fee (if applicable)`

**Base Fees by Service:**
- Gas Refill: ₦50
- Market Run: ₦75
- Laundry: ₦60
- Printing: ₦40
- Food Pickup: ₦50
- Parcel Delivery: ₦75
- Pharmacy: ₦45
- Errand Assistant: ₦100

**Urgency Surcharge:** +₦50 for urgent orders

---

## 🎨 Design System

### Brand Colors
- **Primary** (Electric Violet): `#6200EE`
- **Secondary** (Cyber Teal): `#03DAC5`
- **Success**: `#00C853`
- **Background**: `#F6F7FB`

### Components
- Mobile-first responsive design
- Rounded corners (12-16px)
- Subtle shadows
- Clear hierarchy
- App-like feel on mobile

---

## 📱 Responsive Design

- **Mobile** ≤ 640px - Bottom nav, mobile-optimized
- **Tablet** 640px - 1024px - Adaptive layouts
- **Desktop** ≥ 1024px - Full sidebar, expanded views

---

## 🔄 Order Flow

1. **Student creates order** → Status: `pending`
2. **Runners see available jobs** → Filtered by service category
3. **Runner accepts** → Status: `accepted`, runner assigned
4. **Runner starts work** → Status: `in_progress`
5. **Runner completes** → Status: `completed`
6. **Student rates runner** → Review submitted

---

## 🧪 Testing the MVP

### Test Accounts (Create in Auth)

**Student Account:**
```
Email: student@test.com
Password: TestPass123
Role: student
```

**Runner Account:**
```
Email: runner@test.com
Password: TestPass123
Role: runner
Student ID: STU/2024/001
```

**Admin Account:**
```
Email: admin@test.com
Password: TestPass123
Role: admin
```

---

## 📦 Scripts

```bash
# Development
npm run dev              # Start dev server on :3000

# Build & Production
npm run build            # Build for production
npm start                # Start production server
npm run lint             # Run ESLint
npm run format           # Format code with Prettier

# Database
# Run schema.sql in Supabase dashboard manually
```

---

## 🌐 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import repository on [Vercel Dashboard](https://vercel.com)
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Deploy!

### Manual Deployment

```bash
npm run build
# Deploy 'out' or '.next' folder to your server
```

---

## 🔄 Git Workflow

### Recommended Branch Structure

```
main (production)
├── develop
│   ├── feature/auth
│   ├── feature/student-dashboard
│   ├── feature/runner-dashboard
│   ├── feature/admin-dashboard
│   ├── feature/orders
│   ├── feature/payments
│   └── bugfixes/...
```

### Workflow

```bash
# Create feature branch
git checkout -b feature/your-feature

# Make changes and commit
git add .
git commit -m "feat: describe your feature"

# Push and create PR
git push origin feature/your-feature

# After review, merge to develop
# After testing, merge develop to main
```

---

## 🛠️ Development Tips

### Adding New Services

1. Add to `SERVICE_CATEGORIES` in `src/constants/index.ts`
2. Create service form in `src/lib/schemas.ts`
3. Create service component (if complex)
4. Link to order creation flow

### Adding New Routes

**Student Route:**
```typescript
// app/(student)/new-page/page.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Title - CampusRunner',
};

export default function NewPage() {
  const { user, profile, loading } = useProtectedRoute('student');
  
  return <div>{/* Your content */}</div>;
}
```

### State Management

For simple state, use React `useState` and `useContext`.
For complex state, use Zustand (already installed, see `src/store/`).

---

## 🐛 Troubleshooting

### "Cannot find module '@/...'"
- Check `tsconfig.json` paths are correct
- Paths should point to `src/` directory

### "Supabase client not initialized"
- Verify `.env.local` has correct credentials
- Check `NEXT_PUBLIC_SUPABASE_URL` is set

### "Unauthorized" errors on protected routes
- Check user is authenticated in Supabase dashboard
- Verify RLS policies are correctly applied
- Check user role matches allowed roles

### Build fails
```bash
npm run lint          # Check for lint errors
npm run build         # Full build test
```

---

## 🚀 Next Steps (Post-MVP)

- [ ] Real payment integration (Paystack, Flutterwave)
- [ ] Real-time notifications (Pusher)
- [ ] In-app chat between student & runner
- [ ] Map integration (Google Maps)
- [ ] GPS tracking
- [ ] Push notifications
- [ ] Advanced analytics
- [ ] Rating/review system refinement
- [ ] Dispute resolution system
- [ ] Multi-campus support
- [ ] Admin analytics dashboard
- [ ] Mobile app (React Native)

---

## 📞 Support

For issues, questions, or suggestions:
1. Check existing issues on GitHub
2. Create a detailed bug report
3. Include reproduction steps
4. Add screenshots/logs if applicable

---

## 📄 License

MIT License - Available to use and modify freely.

---

## 👥 Contributors

Built with ❤️ for the campus community.

---

**Last Updated:** March 10, 2026  
**Version:** 1.0.0 (MVP)
