'use client';

import { useEffect, useState } from 'react';

interface User {
  id: number;
  email: string;
  role: string;
  name?: string;
}

export function UserDebug() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/user')
      .then(res => res.json())
      .then(data => {
        setUser(data.user || null);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch user:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-4 bg-yellow-100 text-yellow-800">Loading user...</div>;

  return (
    <div className="p-4 bg-blue-50 border border-blue-200 rounded-md mb-4">
      <h3 className="font-bold text-blue-900 mb-2">🐛 User Debug Info</h3>
      {user ? (
        <div className="text-sm text-blue-800">
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role}</p>
          <p><strong>Name:</strong> {user.name || 'Not set'}</p>
          <p><strong>ID:</strong> {user.id}</p>
          <p><strong>Is Employer:</strong> {user.role === 'employer' ? '✅ YES' : '❌ NO'}</p>
        </div>
      ) : (
        <p className="text-red-600">❌ No user found - not logged in</p>
      )}
    </div>
  );
}