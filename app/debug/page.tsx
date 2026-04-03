'use client';

export default function DebugPage() {
  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">Supabase Debug Page</h1>
        <div className="bg-white p-4 rounded-lg border">
          <p><strong>NEXT_PUBLIC_SUPABASE_URL:</strong> {process.env.NEXT_PUBLIC_SUPABASE_URL || 'Not set'}</p>
          <p><strong>NEXT_PUBLIC_SUPABASE_ANON_KEY:</strong> {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set (hidden)' : 'Not set'}</p>
        </div>
      </div>
    </div>
  );
}
