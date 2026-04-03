'use client';

import { RunnerSignupForm } from '@/components/auth/RunnerSignupForm';
import { AuthShell } from '@/components/auth/AuthShell';

export default function RunnerSignupPage() {
  return (
    <AuthShell>
      <div className="auth-card">
        <RunnerSignupForm />
      </div>
    </AuthShell>
  );
}
