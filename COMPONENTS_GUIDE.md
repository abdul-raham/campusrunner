# CampusRunner UI Components - Quick Reference

## 🎨 New Components Available

### 1. AnimatedLoader
**Purpose**: Advanced loading screen with particle effects
**Usage**:
```tsx
import AnimatedLoader from '@/components/AnimatedLoader';

<AnimatedLoader onComplete={() => setLoading(false)} />
```
**Features**:
- Particle system animation
- Logo morphing effects
- Multi-stage animation sequence
- Duration: ~2.8 seconds

---

### 2. MinimalLoader
**Purpose**: Lightweight loading indicator
**Usage**:
```tsx
import MinimalLoader from '@/components/MinimalLoader';

<MinimalLoader />
```
**Features**:
- Smooth scale animations
- Progress bar
- Minimal footprint
- Perfect for inline loading states

---

### 3. MobileNavbar
**Purpose**: Mobile-first navigation with role-based routing
**Usage**:
```tsx
import { MobileNavbar } from '@/components/MobileNavbar';

<MobileNavbar 
  userRole="student" 
  userName="John Doe"
  userAvatar="/avatar.jpg"
/>
```
**Props**:
- `userRole`: 'student' | 'runner' | 'admin'
- `userName`: string (optional)
- `userAvatar`: string (optional)

**Features**:
- Animated sidebar
- Role-based navigation items
- User profile section
- Logout functionality
- Auto-closes on route change

---

### 4. WelcomeLoader (Enhanced)
**Purpose**: Premium welcome screen
**Usage**:
```tsx
import WelcomeLoader from '@/components/WelcomeLoader';

<WelcomeLoader onComplete={() => setLoading(false)} />
```
**Features**:
- Background star pattern
- Multi-stage animations
- Corner decorations
- Welcome message
- Duration: ~3.2 seconds

---

### 5. ErrorBoundary
**Purpose**: Catch and display errors gracefully
**Usage**:
```tsx
import { ErrorBoundary } from '@/components/ErrorBoundary';

<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>
```
**Features**:
- Error catching
- User-friendly error UI
- Refresh button
- Console logging

---

## 🎯 Hooks

### useProtectedRoute
**Purpose**: Protect routes based on user authentication and role
**Usage**:
```tsx
import { useProtectedRoute } from '@/src/hooks/useProtectedRoute';

export default function AdminPage() {
  const { user, profile, loading } = useProtectedRoute(['admin']);
  
  if (loading) return <MinimalLoader />;
  
  return <div>Admin Content</div>;
}
```

---

## 🎨 Styling

### New CSS Classes
- `.clean-shell` - Glass morphism shell
- `.fin-card` - Fintech-style card
- `.fin-card-dark` - Dark fintech card
- `.fin-badge` - Badge styling
- `.fin-grid` - Grid layout
- `.animate-soft-pulse` - Soft pulse animation
- `.animate-slide-up` - Slide up animation

### CSS Variables
```css
--bg: #f6f7fb
--surface: #ffffff
--text: #0b0e11
--violet: #6200ee
--teal: #03dac5
--success: #00c853
--shadow: 0 12px 30px rgba(98, 0, 238, 0.08)
```

---

## 📦 Constants

### SERVICE_CATEGORIES
Structured service data with IDs, slugs, and descriptions
```tsx
import { SERVICE_CATEGORIES } from '@/src/constants';

SERVICE_CATEGORIES.map(service => (
  <div key={service.id}>{service.name}</div>
))
```

### COLORS
Centralized color palette
```tsx
import { COLORS } from '@/src/constants';

backgroundColor: COLORS.primary // #6200EE
```

### Pricing
```tsx
import { BASE_FEES, PLATFORM_FEE_PERCENTAGE, URGENT_SURCHARGE } from '@/src/constants';
```

---

## 🚀 Implementation Examples

### Example 1: Page with Welcome Loader
```tsx
'use client';
import { useState } from 'react';
import WelcomeLoader from '@/components/WelcomeLoader';

export default function HomePage() {
  const [loading, setLoading] = useState(true);

  return (
    <>
      {loading && <WelcomeLoader onComplete={() => setLoading(false)} />}
      {!loading && <div>Your content here</div>}
    </>
  );
}
```

### Example 2: Protected Admin Page
```tsx
'use client';
import { useProtectedRoute } from '@/src/hooks/useProtectedRoute';
import MinimalLoader from '@/components/MinimalLoader';

export default function AdminDashboard() {
  const { user, profile, loading } = useProtectedRoute(['admin']);

  if (loading) return <MinimalLoader />;

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>Welcome, {profile?.name}</p>
    </div>
  );
}
```

### Example 3: Mobile Layout with Navigation
```tsx
'use client';
import { MobileNavbar } from '@/components/MobileNavbar';

export default function StudentLayout() {
  return (
    <>
      <MobileNavbar 
        userRole="student"
        userName="Jane Doe"
      />
      <main className="p-4">
        {/* Your content */}
      </main>
    </>
  );
}
```

---

## ✅ Checklist for Integration

- [ ] Import new components where needed
- [ ] Update page layouts with MobileNavbar
- [ ] Replace old loaders with new ones
- [ ] Wrap app with ErrorBoundary
- [ ] Use useProtectedRoute for protected pages
- [ ] Test on mobile devices
- [ ] Verify animations performance
- [ ] Check color consistency with COLORS constant

---

## 📝 Notes

- All components are fully typed with TypeScript
- Animations use Framer Motion
- Mobile-first responsive design
- Tailwind CSS for styling
- No external dependencies beyond existing ones

---

## 🔗 File Locations

```
components/
├── AnimatedLoader.tsx
├── MinimalLoader.tsx
├── MobileNavbar.tsx
├── WelcomeLoader.tsx
├── ErrorBoundary.tsx
├── auth/
└── ui/
    ├── BrandMark.tsx
    └── button.tsx

src/
├── constants/
│   └── index.ts (merged)
└── hooks/
    └── useProtectedRoute.ts (new)
```

---

**Last Updated**: Sync Complete ✅
