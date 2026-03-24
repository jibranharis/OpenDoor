'use client';

import { useEffect, useState } from 'react';
import { supabase, hasSupabase } from '@/lib/supabase';
import Navbar from '@/components/layout/Navbar';

export default function DbTestPage() {
  const [status, setStatus] = useState<any>(null);

  useEffect(() => {
    async function testDb() {
      const results: any = {
        hasEnvVars: hasSupabase,
        urlConfigured: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        keyConfigured: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        urlLength: process.env.NEXT_PUBLIC_SUPABASE_URL?.length || 0,
        keyLength: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length || 0,
        connectionTest: 'Pending...',
        errorDetails: null,
      };

      if (!hasSupabase) {
        results.connectionTest = 'Failed - Missing Credentials';
        setStatus(results);
        return;
      }

      try {
        // Try a simple query that should just return empty if RLS is strict,
        // but it will return 401 if the key is totally invalid.
        const { data, error } = await supabase.from('profiles').select('id').limit(1);

        if (error) {
          results.connectionTest = 'Failed';
          results.errorDetails = error;
        } else {
          results.connectionTest = 'Success';
          results.data = data;
        }
      } catch (err: any) {
        results.connectionTest = 'Exception Thrown';
        results.errorDetails = err.message || JSON.stringify(err);
      }

      setStatus(results);
    }

    testDb();
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', color: 'white' }}>
      <Navbar />
      <main style={{ padding: '60px 24px', maxWidth: 800, margin: '0 auto' }}>
        <h1 style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 20 }}>Database Diagnostics</h1>
        <p style={{ marginBottom: 30, color: 'var(--text-secondary)' }}>
          This page tests your Supabase connection from the client-side to help diagnose 401 errors.
        </p>

        {status ? (
          <div className="card" style={{ padding: 24, background: 'rgba(255,255,255,0.05)', borderRadius: 12 }}>
            <h2 style={{ fontSize: 20, marginBottom: 16 }}>Test Results</h2>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <li>
                <strong>Credentials Configured:</strong>{' '}
                {status.hasEnvVars ? <span style={{ color: '#10b981' }}>Yes</span> : <span style={{ color: '#ef4444' }}>No (Missing in Vercel)</span>}
              </li>
              <li>
                <strong>URL Length:</strong> {status.urlLength} characters (Ensure there are no trailing slashes or spaces)
              </li>
              <li>
                <strong>Anon Key Length:</strong> {status.keyLength} characters (A valid JWT is usually very long)
              </li>
              <li>
                <strong>Connection Test:</strong>{' '}
                <span style={{ color: status.connectionTest === 'Success' ? '#10b981' : '#f59e0b' }}>
                  {status.connectionTest}
                </span>
              </li>
              
              {status.errorDetails && (
                <li style={{ marginTop: 16 }}>
                  <strong>Error Details:</strong>
                  <pre style={{ background: '#000', padding: 16, borderRadius: 8, marginTop: 8, overflowX: 'auto', fontSize: 13, color: '#ef4444' }}>
                    {JSON.stringify(status.errorDetails, null, 2)}
                  </pre>
                  {status.errorDetails.code === '401' || status.errorDetails.message?.includes('JWT') ? (
                    <div style={{ marginTop: 12, padding: 12, background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', borderRadius: 8 }}>
                      <strong>Diagnosis:</strong> A 401 error or JWT error means your `NEXT_PUBLIC_SUPABASE_ANON_KEY` is invalid. 
                      Please go to your Vercel project settings, carefully recopy the anon key from Supabase (Settings &gt; API), 
                      ensure there are no extra spaces or quotes around it, save it, and redeploy.
                    </div>
                  ) : status.errorDetails.code === 'PGRST116' || status.errorDetails.code === '42P01' ? (
                     <div style={{ marginTop: 12, padding: 12, background: 'rgba(245, 158, 11, 0.1)', border: '1px solid #f59e0b', borderRadius: 8 }}>
                      <strong>Diagnosis:</strong> The credentials work, but the table does not exist. Make sure you have created the `profiles`, `activities`, `custom_opportunities`, and `opportunities_status` tables in Supabase.
                    </div>
                  ) : null}
                </li>
              )}
            </ul>
          </div>
        ) : (
          <div>Running tests...</div>
        )}
      </main>
    </div>
  );
}
