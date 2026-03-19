'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Compass, User, Building2, Shield, Eye, EyeOff } from 'lucide-react';
import type { UserRole } from '@/lib/contexts/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError('');
      login(email, password, role);
      if (role === 'org') router.push('/org/dashboard');
      else if (role === 'admin') router.push('/admin');
      else router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const roles = [
    { id: 'student' as UserRole, label: 'Student', icon: User, desc: 'Track activities & apply' },
    { id: 'org' as UserRole, label: 'Organization', icon: Building2, desc: 'Post opportunities' },
    { id: 'admin' as UserRole, label: 'Admin', icon: Shield, desc: 'Manage platform' },
  ];

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg-primary)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
    }}>
      <div className="animated-bg">
        <div className="bg-blob" style={{ width: 500, height: 500, background: '#6366f1', top: -100, left: -100 }} />
      </div>

      <div style={{ width: '100%', maxWidth: 420, position: 'relative', zIndex: 1 }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', justifyContent: 'center', marginBottom: 32 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12,
            background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Compass size={22} color="white" />
          </div>
          <span style={{ fontWeight: 800, fontSize: 22, color: '#f1f5f9' }}>Open<span style={{ color: '#818cf8' }}>Door</span></span>
        </Link>

        <div className="glass-strong" style={{ borderRadius: 20, padding: 36 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 6 }}>Welcome back</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 28 }}>Sign in to your account to continue</p>

          {/* Role Selector */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 24 }}>
            {roles.map(({ id, label, icon: Icon, desc }) => (
              <button
                key={id}
                onClick={() => setRole(id)}
                style={{
                  padding: '12px 6px', borderRadius: 10, border: 'none', cursor: 'pointer',
                  background: role === id ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.03)',
                  outline: role === id ? '1.5px solid var(--accent)' : '1px solid var(--border-subtle)',
                  transition: 'all 0.2s', textAlign: 'center',
                }}
              >
                <Icon size={18} color={role === id ? 'var(--accent-light)' : 'var(--text-muted)'} style={{ margin: '0 auto 4px' }} />
                <div style={{ fontSize: 12, fontWeight: 600, color: role === id ? 'var(--accent-light)' : 'var(--text-secondary)' }}>{label}</div>
              </button>
            ))}
          </div>

          {error && (
            <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '12px', borderRadius: '10px', marginBottom: '16px', fontSize: '13px', textAlign: 'center', fontWeight: 500 }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Email</label>
              <input className="input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@email.com" required />
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input className="input" type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required style={{ paddingRight: 40 }} />
                <button type="button" onClick={() => setShowPw(!showPw)} style={{
                  position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)',
                }}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '13px', fontSize: 15, marginTop: 8 }}>
              Sign In
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'var(--text-muted)' }}>
            Don&apos;t have an account?{' '}
            <Link href="/register" style={{ color: 'var(--accent-light)', fontWeight: 600, textDecoration: 'none' }}>Sign up free</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
