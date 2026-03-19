'use client';

import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { useStudent } from '@/lib/contexts/StudentContext';
import { opportunities } from '@/lib/data/opportunities';
import { BookmarkCheck, Bookmark, MapPin, Clock, Star, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const categoryColors: Record<string, string> = {
  Medical: '#ef4444', Nonprofit: '#10b981', Education: '#3b82f6',
  Business: '#f59e0b', STEM: '#8b5cf6', Arts: '#ec4899',
  Environment: '#22c55e', Community: '#06b6d4',
};

export default function SavedPage() {
  const { savedOpportunities, toggleSaved } = useStudent();
  const saved = opportunities.filter(o => savedOpportunities.includes(o.id));

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div style={{ display: 'flex', flex: 1 }}>
        <Sidebar />
        <main style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
          <div style={{ marginBottom: 28 }}>
            <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 4 }}>Saved Opportunities</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>{saved.length} saved</p>
          </div>

          {saved.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--text-muted)' }}>
              <BookmarkCheck size={48} style={{ margin: '0 auto 14px', opacity: 0.2 }} />
              <p style={{ fontSize: 16, marginBottom: 16 }}>No saved opportunities yet.</p>
              <Link href="/opportunities" className="btn-primary" style={{ textDecoration: 'none', padding: '10px 20px', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                Browse Opportunities <ArrowRight size={16} />
              </Link>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 16 }}>
              {saved.map(opp => {
                const color = categoryColors[opp.category] || '#6366f1';
                return (
                  <div key={opp.id} className="card" style={{ padding: '22px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                      <span className="badge" style={{ background: `${color}18`, color, border: `1px solid ${color}30` }}>{opp.category}</span>
                      <button onClick={() => toggleSaved(opp.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent-light)' }}>
                        <BookmarkCheck size={18} />
                      </button>
                    </div>
                    <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>{opp.title}</h3>
                    <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 12 }}>{opp.organization}</p>
                    <div style={{ display: 'flex', gap: 14, marginBottom: 14, flexWrap: 'wrap' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--text-muted)' }}>
                        <MapPin size={12} /> {opp.locationType}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--text-muted)' }}>
                        <Clock size={12} /> {opp.timeCommitment}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--text-muted)' }}>
                        <Star size={12} fill="#f59e0b" color="#f59e0b" /> {opp.rating}
                      </span>
                    </div>
                    <Link href="/opportunities" className="btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: 13, textDecoration: 'none', padding: '9px 12px' }}>
                      Apply Now
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
