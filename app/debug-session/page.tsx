'use client';

import React from 'react';
import { useSession } from 'next-auth/react';

export default function DebugSessionPage() {
  const { data: session, status } = useSession();

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Session Debug Page</h1>
      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f0f0f0', borderRadius: '5px' }}>
        <h3>Session Status:</h3>
        <p><strong>Status:</strong> {status}</p>
        <p><strong>Session:</strong> {session ? 'Logged in' : 'Not logged in'}</p>
        {session && (
          <div>
            <p><strong>User ID:</strong> {session.user?.id}</p>
            <p><strong>Email:</strong> {session.user?.email}</p>
            <p><strong>Name:</strong> {session.user?.name}</p>
          </div>
        )}
      </div>
      
      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#e0f2fe', borderRadius: '5px' }}>
        <h3>Next Steps:</h3>
        <p>If you see "Not logged in", you need to:</p>
        <ol>
          <li>Go to the login page</li>
          <li>Login with admin credentials</li>
          <li>Then try the booking pages</li>
        </ol>
      </div>
    </div>
  );
}

