'use client';

import { useState, useRef } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { useStudent } from '@/lib/contexts/StudentContext';
import { useAuth } from '@/lib/contexts/AuthContext';
import { User, Save, Upload, Check, CheckCircle } from 'lucide-react';

const interestOptions = ['Pre-Med', 'Engineering', 'Business', 'Law', 'Education', 'Environment', 'Arts', 'STEM', 'Nonprofit', 'Community', 'Psychology', 'Computer Science'];
const gradeOptions = ['9', '10', '11', '12'];

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const { profile, updateProfile } = useStudent();
  const [saved, setSaved] = useState(false);
  const [local, setLocal] = useState({ ...profile });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const f = (key: keyof typeof local, val: string | string[] | boolean) =>
    setLocal(prev => ({ ...prev, [key]: val }));

  const toggleInterest = (i: string) =>
    f('interests', local.interests.includes(i)
      ? local.interests.filter(x => x !== i)
      : [...local.interests, i]);

  const handleSave = () => {
    updateProfile(local);
    // Sync the name to Auth if it changed
    if (local.name !== user?.name) {
      updateUser({ name: local.name });
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      updateUser({ avatar: base64String });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div style={{ display: 'flex', flex: 1 }}>
        <Sidebar />
        <main style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
          <div style={{ maxWidth: 640 }}>
            <div style={{ marginBottom: 28 }}>
              <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 4 }}>My Profile</h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Keep your profile updated for better opportunity matching</p>
            </div>

            {/* Avatar */}
            <div className="card" style={{ padding: '28px', marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 24 }}>
                <div style={{ position: 'relative' }}>
                  <div style={{
                    width: 100, height: 100, borderRadius: '50%',
                    background: user?.avatar ? `url(${user.avatar}) center/cover no-repeat` : 'linear-gradient(135deg, #6366f1, #a78bfa)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 40, fontWeight: 700, color: 'white',
                    border: '4px solid var(--bg-card)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                  }}>
                    {!user?.avatar && local.name.charAt(0)}
                  </div>
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      position: 'absolute', bottom: 0, right: 0,
                      width: 32, height: 32, borderRadius: '50%',
                      background: 'var(--accent)', color: 'white',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer', border: '2px solid var(--bg-card)',
                      boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
                    }}>
                    <Upload size={16} />
                  </button>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    hidden 
                    accept="image/*" 
                    onChange={handleAvatarUpload} 
                  />
                </div>
                <div>
                  <div style={{ fontSize: 24, fontWeight: 800 }}>{local.name}</div>
                  <div style={{ fontSize: 14, color: 'var(--text-muted)' }}>{user?.email}</div>
                  <div style={{ fontSize: 13, color: 'var(--accent-light)', fontWeight: 600, marginTop: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <CheckCircle size={14} /> Profile Verified
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div>
                    <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 5, fontWeight: 600 }}>FULL NAME</label>
                    <input className="input" value={local.name} onChange={e => f('name', e.target.value)} />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 5, fontWeight: 600 }}>GRADE</label>
                    <select className="input" value={local.grade} onChange={e => f('grade', e.target.value)}>
                      {gradeOptions.map(g => <option key={g} value={g}>Grade {g}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 5, fontWeight: 600 }}>HIGH SCHOOL</label>
                  <input className="input" value={local.school} onChange={e => f('school', e.target.value)} placeholder="School name" />
                </div>
                <div>
                  <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 5, fontWeight: 600 }}>BIO</label>
                  <textarea className="input" value={local.bio} onChange={e => f('bio', e.target.value)} placeholder="A short bio for your profile..." style={{ minHeight: 80 }} />
                </div>
              </div>
            </div>

            {/* Interests */}
            <div className="card" style={{ padding: '24px', marginBottom: 20 }}>
              <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Interests & Focus Areas</h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {interestOptions.map(i => (
                  <button
                    key={i}
                    onClick={() => toggleInterest(i)}
                    style={{
                      padding: '7px 14px', borderRadius: 20, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500,
                      background: local.interests.includes(i) ? 'rgba(99,102,241,0.18)' : 'rgba(255,255,255,0.04)',
                      color: local.interests.includes(i) ? 'var(--accent-light)' : 'var(--text-muted)',
                      outline: local.interests.includes(i) ? '1px solid var(--accent)' : '1px solid var(--border-subtle)',
                      transition: 'all 0.15s',
                    }}
                  >
                    {i}
                  </button>
                ))}
              </div>
            </div>

            <button onClick={handleSave} className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '13px', fontSize: 15 }}>
              {saved ? <><Check size={16} /> Saved!</> : <><Save size={16} /> Save Profile</>}
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
