'use client';

import { StudentSignupForm } from '@/components/auth/StudentSignupForm';
import { AuthShell } from '@/components/auth/AuthShell';

export default function StudentSignupPage() {
  return (
    <AuthShell>
      <div className="auth-card">
        <StudentSignupForm />
      </div>
    </AuthShell>
  );
}
