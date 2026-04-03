'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function SimpleLoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simple demo login - bypass Supabase for now
    if (email && password) {
      // Simulate loading
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Determine role based on email
      const role = email.includes('admin') ? 'admin' : 
                   email.includes('runner') ? 'runner' : 'student';
      
      // Store demo session
      localStorage.setItem('demo_user', JSON.stringify({
        email,
        role,
        id: 'demo-' + Date.now()
      }));
      
      // Redirect
      router.push(`/${role}`);
    }
    
    setLoading(false);
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Demo Login</h2>
      <p className="text-sm text-gray-600 mb-4 text-center">
        Use any email/password. Add 'admin' or 'runner' in email for different roles.
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="student@example.com"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Any password"
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Signing in...' : 'Sign In (Demo)'}
        </button>
      </form>
      
      <div className="mt-4 text-xs text-gray-500">
        <p>Demo accounts:</p>
        <p>• student@test.com → Student Dashboard</p>
        <p>• runner@test.com → Runner Dashboard</p>
        <p>• admin@test.com → Admin Dashboard</p>
      </div>
    </div>
  );
}
