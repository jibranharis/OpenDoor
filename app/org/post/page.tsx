'use client';

import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useOpportunities } from '@/lib/contexts/OpportunitiesContext';
import { useRouter } from 'next/navigation';
import { CheckCircle } from 'lucide-react';

const categories = ['Medical', 'Nonprofit', 'Education', 'Business', 'STEM', 'Arts', 'Environment', 'Community'];

export default function OrgPostPage() {
  const { user } = useAuth();
  const { addOpportunity } = useOpportunities();
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    title: '', description: '', category: 'Medical',
    location: '', locationType: 'In-Person',
    timeCommitment: 'Weekly', hoursPerWeek: '4',
    gradeEligibility: '9-12', requirements: '', contactEmail: '',
  });

  const f = (k: string, v: string) => setForm(prev => ({ ...prev, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addOpportunity(form as any);
    setSubmitted(true);
    setTimeout(() => router.push('/org/dashboard'), 2500);
  };

  if (submitted) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <div style={{ display: 'flex', flex: 1 }}>
          <Sidebar />
          <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <CheckCircle size={64} color="var(--success)" style={{ margin: '0 auto 20px' }} />
              <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Opportunity Submitted!</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>It will appear after admin review. Redirecting...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div style={{ display: 'flex', flex: 1 }}>
        <Sidebar />
        <main style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
          <div style={{ maxWidth: 620 }}>
            <div style={{ marginBottom: 28 }}>
              <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 4 }}>Post an Opportunity</h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Fill out the form below. Listings are reviewed by our team within 48 hours.</p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 2 }}>Basic Information</h2>
                <div>
                  <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 5, fontWeight: 600 }}>OPPORTUNITY TITLE *</label>
                  <input className="input" value={form.title} onChange={e => f('title', e.target.value)} placeholder="e.g., Hospital Volunteer Assistant" required />
                </div>
                <div>
                  <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 5, fontWeight: 600 }}>DESCRIPTION *</label>
                  <textarea className="input" value={form.description} onChange={e => f('description', e.target.value)} placeholder="Describe what volunteers will be doing, the impact, and what they'll learn..." style={{ minHeight: 100 }} required />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div>
                    <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 5, fontWeight: 600 }}>CATEGORY *</label>
                    <select className="input" value={form.category} onChange={e => f('category', e.target.value)}>
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 5, fontWeight: 600 }}>GRADE ELIGIBILITY</label>
                    <select className="input" value={form.gradeEligibility} onChange={e => f('gradeEligibility', e.target.value)}>
                      {['9-12', '10-12', '11-12', '9-10', '11', '12'].map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 2 }}>Logistics</h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div>
                    <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 5, fontWeight: 600 }}>LOCATION TYPE</label>
                    <select className="input" value={form.locationType} onChange={e => f('locationType', e.target.value)}>
                      <option value="In-Person">In-Person</option>
                      <option value="Remote">Remote</option>
                      <option value="Hybrid">Hybrid</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 5, fontWeight: 600 }}>CITY / STATE</label>
                    <input className="input" value={form.location} onChange={e => f('location', e.target.value)} placeholder="Chicago, IL" />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div>
                    <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 5, fontWeight: 600 }}>TIME COMMITMENT</label>
                    <select className="input" value={form.timeCommitment} onChange={e => f('timeCommitment', e.target.value)}>
                      <option value="One-time">One-time</option>
                      <option value="Weekly">Weekly</option>
                      <option value="Summer">Summer</option>
                      <option value="Flexible">Flexible</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 5, fontWeight: 600 }}>HOURS / WEEK</label>
                    <input className="input" type="number" min={1} value={form.hoursPerWeek} onChange={e => f('hoursPerWeek', e.target.value)} />
                  </div>
                </div>
              </div>

              <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 2 }}>Requirements & Contact</h2>
                <div>
                  <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 5, fontWeight: 600 }}>REQUIREMENTS</label>
                  <textarea className="input" value={form.requirements} onChange={e => f('requirements', e.target.value)} placeholder="Any prerequisites, age requirements, or skills needed..." style={{ minHeight: 70 }} />
                </div>
                <div>
                  <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 5, fontWeight: 600 }}>CONTACT EMAIL *</label>
                  <input className="input" type="email" value={form.contactEmail} onChange={e => f('contactEmail', e.target.value)} placeholder="contact@yourorg.org" required />
                </div>
              </div>

              <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: 15 }}>
                Submit for Review
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
