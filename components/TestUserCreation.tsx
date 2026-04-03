'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export function TestUserCreation() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>('');

  const createTestUser = async () => {
    setLoading(true);
    setResult('');

    try {
      // Try to create a test user
      const testEmail = `test${Date.now()}@example.com`;
      const testPassword = 'TestPassword123!';

      console.log('Creating test user:', testEmail);

      const { data, error } = await supabase.auth.signUp({
        email: testEmail,
        password: testPassword,
      });

      if (error) {
        setResult(`Error: ${error.message}`);
        console.error('Signup error:', error);
      } else {
        setResult(`Success! User created: ${data.user?.email}`);
        console.log('Signup success:', data);
      }
    } catch (err) {
      setResult(`Exception: ${err instanceof Error ? err.message : 'Unknown error'}`);
      console.error('Exception:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <h3 className="font-semibold mb-2">Test User Creation</h3>
      <button
        onClick={createTestUser}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Creating...' : 'Create Test User'}
      </button>
      {result && (
        <div className="mt-2 p-2 bg-white border rounded text-sm">
          {result}
        </div>
      )}
    </div>
  );
}
