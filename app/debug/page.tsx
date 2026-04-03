'use client';

import { ConnectionTest } from '@/components/ConnectionTest';
import { TestUserCreation } from '@/components/TestUserCreation';

export default function DebugPage() {
  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">Supabase Debug Page</h1>
        
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Environment Variables</h2>
          <div className="bg-white p-4 rounded-lg border">
            <p><strong>NEXT_PUBLIC_SUPABASE_URL:</strong> {process.env.NEXT_PUBLIC_SUPABASE_URL || 'Not set'}</p>
            <p><strong>NEXT_PUBLIC_SUPABASE_ANON_KEY:</strong> {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set (hidden)' : 'Not set'}</p>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Connection Test</h2>
          <ConnectionTest />
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">User Creation Test</h2>
          <TestUserCreation />
        </div>
      </div>
    </div>
  );
}
