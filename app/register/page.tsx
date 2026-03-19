'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Compass, User, Building2 } from 'lucide-react';
import type { UserRole } from '@/lib/contexts/AuthContext';

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [orgName, setOrgName] = useState('');
  const [grade, setGrade] = useState('11');
  const [interests, setInterests] = useState<string[]>([]);
  const [error, setError] = useState('');

  const interestOptions = ['Pre-Med', 'Engineering', 'Business', 'Law', 'Education', 'Environment', 'Arts', 'STEM', 'Nonprofit', 'Community'];

  const toggleInterest = (i: string) =>
    setInterests(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError('');
      register(name, email, password, role, orgName);
      if (role === 'org') router.push('/org/dashboard');
      else router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg-primary)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px',
    }}>
      <div className="animated-bg">
        <div className="bg-blob" style={{ width: 500, height: 500, background: '#6366f1', top: -100, right: -100 }} />
      </div>

      <div style={{ width: '100%', maxWidth: 460, position: 'relative', zIndex: 1 }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', justifyContent: 'center', marginBottom: 32 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg, #6366f1, #4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Compass size={22} color="white" />
          </div>
          <span style={{ fontWeight: 800, fontSize: 22, color: '#f1f5f9' }}>Open<span style={{ color: '#818cf8' }}>Door</span></span>
        </Link>

        <div className="glass-strong" style={{ borderRadius: 20, padding: 36 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 6 }}>Create your account</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 24 }}>Start building your college-ready profile today.</p>

          {/* Role */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 24 }}>
            {([
              { id: 'student' as UserRole, label: "I'm a Student", icon: User },
              { id: 'org' as UserRole, label: "I'm an Org", icon: Building2 },
            ]).map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setRole(id)}
                style={{
                  padding: '14px 10px', borderRadius: 12, border: 'none', cursor: 'pointer',
                  background: role === id ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.03)',
                  outline: role === id ? '1.5px solid var(--accent)' : '1px solid var(--border-subtle)',
                  textAlign: 'center', transition: 'all 0.2s',
                }}
              >
                <Icon size={20} color={role === id ? 'var(--accent-light)' : 'var(--text-muted)'} style={{ margin: '0 auto 6px' }} />
                <div style={{ fontSize: 13, fontWeight: 600, color: role === id ? 'var(--accent-light)' : 'var(--text-secondary)' }}>{label}</div>
              </button>
            ))}
          </div>

          {error && (
            <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '12px', borderRadius: '10px', marginBottom: '16px', fontSize: '13px', textAlign: 'center', fontWeight: 500 }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', display: 'block', marginBottom: 5 }}>Full Name</label>
              <input className="input" value={name} onChange={e => setName(e.target.value)} placeholder="Your name" required />
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', display: 'block', marginBottom: 5 }}>Email</label>
              <input className="input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@email.com" required />
            </div>
            {role === 'org' && (
              <div>
                <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', display: 'block', marginBottom: 5 }}>Organization Name</label>
                <input className="input" value={orgName} onChange={e => setOrgName(e.target.value)} placeholder="Your org name" required />
              </div>
            )}
            {role === 'student' && (
              <div>
                <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', display: 'block', marginBottom: 5 }}>Grade</label>
                <select className="input" value={grade} onChange={e => setGrade(e.target.value)}>
                  {['9', '10', '11', '12'].map(g => <option key={g} value={g}>Grade {g}</option>)}
                </select>
              </div>
            )}
            <div>
              <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', display: 'block', marginBottom: 5 }}>Password</label>
              <input className="input" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required minLength={8} />
            </div>

            {role === 'student' && (
              <div>
                <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', display: 'block', marginBottom: 8 }}>Interests (select all that apply)</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {interestOptions.map(i => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => toggleInterest(i)}
                      style={{
                        padding: '5px 12px', borderRadius: 20, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 500,
                        background: interests.includes(i) ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.04)',
                        color: interests.includes(i) ? 'var(--accent-light)' : 'var(--text-muted)',
                        outline: interests.includes(i) ? '1px solid var(--accent)' : '1px solid var(--border-subtle)',
                        transition: 'all 0.15s',
                      }}
                    >
                      {i}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '13px', fontSize: 15, marginTop: 8 }}>
              Create Account
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'var(--text-muted)' }}>
            Already have an account? <Link href="/login" style={{ color: 'var(--accent-light)', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
