'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function CreateTestUserPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>('');

  const createTestUsers = async () => {
    setLoading(true);
    setResult('');

    try {
      const testUsers = [
        { email: 'student@test.com', password: 'password123', role: 'student', name: 'Test Student' },
        { email: 'runner@test.com', password: 'password123', role: 'runner', name: 'Test Runner' },
        { email: 'admin@test.com', password: 'password123', role: 'admin', name: 'Test Admin' }
      ];

      let results = [];

      for (const user of testUsers) {
        console.log(`Creating ${user.role}:`, user.email);
        
        // Create auth user
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: user.email,
          password: user.password,
        });

        if (authError) {
          results.push(`❌ ${user.email}: ${authError.message}`);
          continue;
        }

        if (!authData.user) {
          results.push(`❌ ${user.email}: No user created`);
          continue;
        }

        // Create profile
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            full_name: user.name,
            email: user.email,
            phone: '+234 800 000 0000',
            role: user.role,
            university: 'Test University',
            hostel_location: 'Test Hostel'
          });

        if (profileError) {
          results.push(`⚠️ ${user.email}: Auth created but profile failed - ${profileError.message}`);
        } else {
          results.push(`✅ ${user.email}: Created successfully as ${user.role}`);
        }
      }

      setResult(results.join('\n'));
    } catch (err) {
      setResult(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Create Test Users</h1>
        
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Test Accounts</h2>
          <div className="space-y-2 text-sm">
            <p><strong>Student:</strong> student@test.com / password123</p>
            <p><strong>Runner:</strong> runner@test.com / password123</p>
            <p><strong>Admin:</strong> admin@test.com / password123</p>
          </div>
        </div>

        <button
          onClick={createTestUsers}
          disabled={loading}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 mb-6"
        >
          {loading ? 'Creating Users...' : 'Create Test Users'}
        </button>

        {result && (
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold mb-2">Results:</h3>
            <pre className="text-sm whitespace-pre-wrap">{result}</pre>
          </div>
        )}

        <div className="mt-6">
          <a href="/login" className="text-blue-600 hover:underline">
            ← Back to Login
          </a>
        </div>
      </div>
    </div>
  );
}
