'use client';

interface UserDebugProps {
  user: any;
}

export function UserDebug({ user }: UserDebugProps) {
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-gray-800 text-white p-4 rounded-lg shadow-lg max-w-sm">
      <h3 className="text-sm font-bold mb-2">Debug User</h3>
      <pre className="text-xs overflow-auto">
        {JSON.stringify(user, null, 2)}
      </pre>
    </div>
  );
}
