'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // In a real application, you would fetch the user profile from the backend
    // using the HTTP-Only cookie to authenticate the request.
    const fetchProfile = async () => {
      try {
        const res = await fetch('http://localhost:3000/auth/me', {
          credentials: 'omit', // would be 'include' when testing with real backend
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
          // If 401, middleware or axios interceptor should handle refresh.
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = async () => {
    await fetch('http://localhost:3000/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">User Dashboard</h1>
          <button 
            onClick={handleLogout}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md"
          >
            Logout
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm md:col-span-2">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">My Purchases</h2>
            <div className="flex items-center justify-center h-32 border-2 border-dashed border-gray-300 dark:border-zinc-700 rounded-lg text-gray-500">
              No movies purchased yet.
            </div>
          </div>
          
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Profile</h2>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <p>Welcome back to Christian Movies Streaming.</p>
              <p>Your session is active.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
