'use client';

export function EnvDebug() {
  if (process.env.NODE_ENV === 'production') {
    return null; // Hide in production
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded text-xs max-w-sm">
      <h3>Env Debug:</h3>
      <p>URL: {process.env.NEXT_PUBLIC_SUPABASE_URL || 'MISSING'}</p>
      <p>Key: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'MISSING'}</p>
    </div>
  );
}