'use client';

import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';

export default function AuthDebug() {
  const { user, profile, loading, error } = useAuth();
  const [manualProfile, setManualProfile] = useState<any>(null);
  const [manualError, setManualError] = useState<any>(null);

  useEffect(() => {
    const testProfileFetch = async () => {
      if (user) {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
          
          setManualProfile(data);
          setManualError(error);
        } catch (err) {
          setManualError(err);
        }
      }
    };

    testProfileFetch();
  }, [user]);

  return (
    <div className="p-8 bg-white rounded-lg shadow-lg max-w-2xl mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Auth Debug</h1>
      
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold">Loading:</h3>
          <p>{loading ? 'true' : 'false'}</p>
        </div>

        <div>
          <h3 className="font-semibold">User:</h3>
          <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
            {user ? JSON.stringify(user, null, 2) : 'null'}
          </pre>
        </div>

        <div>
          <h3 className="font-semibold">Profile (from useAuth):</h3>
          <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
            {profile ? JSON.stringify(profile, null, 2) : 'null'}
          </pre>
        </div>

        <div>
          <h3 className="font-semibold">Manual Profile Fetch:</h3>
          <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
            {manualProfile ? JSON.stringify(manualProfile, null, 2) : 'null'}
          </pre>
        </div>

        <div>
          <h3 className="font-semibold">Errors:</h3>
          <p className="text-red-600">useAuth error: {error || 'none'}</p>
          <p className="text-red-600">Manual error: {manualError ? JSON.stringify(manualError) : 'none'}</p>
        </div>
      </div>
    </div>
  );
}
