'use client';

import { useState, useMemo } from 'react';
import Navbar from '@/components/layout/Navbar';
import { categories, type Opportunity, type Category } from '@/lib/data/opportunities';
import { useOpportunities } from '@/lib/contexts/OpportunitiesContext';
import { useStudent } from '@/lib/contexts/StudentContext';
import { useAuth } from '@/lib/contexts/AuthContext';
import {
  Search, Bookmark, BookmarkCheck, CheckCircle, TrendingUp,
  Clock, MapPin, Star, Users, Filter, X, Zap, ExternalLink
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import ApplyModal from '@/components/opportunities/ApplyModal';

const categoryColors: Record<Category, string> = {
  Medical: '#ef4444', Nonprofit: '#10b981', Education: '#3b82f6',
  Business: '#f59e0b', STEM: '#8b5cf6', Arts: '#ec4899',
  Environment: '#22c55e', Community: '#06b6d4',
};

export default function OpportunitiesPage() {
  const { opportunities } = useOpportunities();
  const { savedOpportunities, toggleSaved } = useStudent();
  const { user } = useAuth();
  const router = useRouter();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [locationType, setLocationType] = useState<string>('All');
  const [timeCommitment, setTimeCommitment] = useState<string>('All');
  const [showFilters, setShowFilters] = useState(false);
  const [applyTarget, setApplyTarget] = useState<Opportunity | null>(null);

  const filtered = useMemo(() => {
    return opportunities.filter(o => {
      const q = search.toLowerCase();
      const matchSearch = !search ||
        o.title.toLowerCase().includes(q) ||
        o.organization.toLowerCase().includes(q) ||
        o.description.toLowerCase().includes(q) ||
        o.skills.some(s => s.toLowerCase().includes(q));
      const matchCat = selectedCategory === 'All' || o.category === selectedCategory;
      const matchLoc = locationType === 'All' || o.locationType === locationType;
      const matchTime = timeCommitment === 'All' || o.timeCommitment === timeCommitment;
      return matchSearch && matchCat && matchLoc && matchTime;
    });
  }, [search, selectedCategory, locationType, timeCommitment]);

  const trending = filtered.filter(o => o.trending).slice(0, 3);
  const recent = filtered.filter(o => o.postedDays <= 3).slice(0, 4);
  const allResults = filtered;

  const handleApply = (opp: Opportunity) => {
    if (!user) { router.push('/login'); return; }
    setApplyTarget(opp);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Navbar />

      {/* Hero bar */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(139,92,246,0.06))',
        borderBottom: '1px solid var(--border-subtle)',
        padding: '40px 24px',
      }}>
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ marginBottom: 32 }}>
            <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 6 }}>
              Explore Opportunities
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>
              Find the perfect project that matches your passion and schedule.
            </p>
          </div>
          {/* Search */}
          <div style={{ position: 'relative', maxWidth: 560, margin: '0 auto' }}>
            <Search size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              className="input"
              style={{ paddingLeft: 46, paddingRight: 120, height: 50, fontSize: 15, borderRadius: 14 }}
              placeholder="Search by keyword, org, or skill..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn-secondary"
              style={{ position: 'absolute', right: 6, top: 6, bottom: 6, padding: '0 16px', borderRadius: 10, fontSize: 13 }}
            >
              <Filter size={14} /> Filters
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>
        {/* Category pills */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
          {(['All', ...categories] as const).map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat as Category | 'All')}
              style={{
                padding: '7px 16px', borderRadius: 20, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600,
                background: selectedCategory === cat
                  ? cat === 'All' ? 'var(--accent)' : categoryColors[cat as Category]
                  : 'rgba(255,255,255,0.04)',
                color: selectedCategory === cat ? 'white' : 'var(--text-secondary)',
                transition: 'all 0.2s',
              }}
            >
              {cat}
              {cat !== 'All' && selectedCategory === cat && (
                <span style={{ marginLeft: 6, fontSize: 11 }}>({filtered.length})</span>
              )}
            </button>
          ))}
        </div>

        {/* Expandable filters */}
        {showFilters && (
          <div className="card" style={{ padding: 20, marginBottom: 24, display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <div style={{ flex: 1, minWidth: 150 }}>
              <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 6, fontWeight: 600 }}>LOCATION TYPE</label>
              <select className="input" value={locationType} onChange={e => setLocationType(e.target.value)}>
                <option value="All">All Locations</option>
                <option value="Remote">Remote</option>
                <option value="In-Person">In-Person</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>
            <div style={{ flex: 1, minWidth: 150 }}>
              <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 6, fontWeight: 600 }}>TIME COMMITMENT</label>
              <select className="input" value={timeCommitment} onChange={e => setTimeCommitment(e.target.value)}>
                <option value="All">All Commitments</option>
                <option value="One-time">One-time</option>
                <option value="Weekly">Weekly</option>
                <option value="Summer">Summer</option>
                <option value="Flexible">Flexible</option>
              </select>
            </div>
            <button onClick={() => { setLocationType('All'); setTimeCommitment('All'); setSearch(''); setSelectedCategory('All'); }} className="btn-secondary" style={{ padding: '10px 16px' }}>
              <X size={14} /> Reset
            </button>
          </div>
        )}

        {/* Trending */}
        {trending.length > 0 && !search && selectedCategory === 'All' && (
          <section style={{ marginBottom: 40 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
              <TrendingUp size={18} color="#f59e0b" />
              <h2 style={{ fontSize: 18, fontWeight: 700 }}>Trending Near You 🔥</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 16 }}>
              {trending.map(opp => (
                <OppCard key={opp.id} opp={opp} saved={savedOpportunities.includes(opp.id)} onToggleSave={() => toggleSaved(opp.id)} onApply={() => handleApply(opp)} catColor={categoryColors[opp.category]} highlight />
              ))}
            </div>
          </section>
        )}

        {/* Recent */}
        {recent.length > 0 && !search && selectedCategory === 'All' && (
          <section style={{ marginBottom: 40 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
              <Zap size={18} color="#3b82f6" />
              <h2 style={{ fontSize: 18, fontWeight: 700 }}>Recently Added ✨</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 16 }}>
              {recent.map(opp => (
                <OppCard key={opp.id} opp={opp} saved={savedOpportunities.includes(opp.id)} onToggleSave={() => toggleSaved(opp.id)} onApply={() => handleApply(opp)} catColor={categoryColors[opp.category]} />
              ))}
            </div>
          </section>
        )}

        {/* All results */}
        <section>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700 }}>
              {search || selectedCategory !== 'All' ? `Results (${allResults.length})` : `All Opportunities (${allResults.length})`}
            </h2>
          </div>

          {allResults.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--text-muted)' }}>
              <Search size={40} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
              <p style={{ fontSize: 16 }}>No opportunities match your filters.</p>
              <button onClick={() => { setSearch(''); setSelectedCategory('All'); setLocationType('All'); setTimeCommitment('All'); }} className="btn-secondary" style={{ marginTop: 14, padding: '8px 18px', fontSize: 13 }}>
                Clear Filters
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 16 }}>
              {allResults.map(opp => (
                <OppCard key={opp.id} opp={opp} saved={savedOpportunities.includes(opp.id)} onToggleSave={() => toggleSaved(opp.id)} onApply={() => handleApply(opp)} catColor={categoryColors[opp.category]} />
              ))}
            </div>
          )}
        </section>
      </div>

      {applyTarget && (
        <ApplyModal opportunity={applyTarget} onClose={() => setApplyTarget(null)} />
      )}
    </div>
  );
}

interface OppCardProps {
  opp: Opportunity;
  saved: boolean;
  onToggleSave: () => void;
  onApply: () => void;
  catColor: string;
  highlight?: boolean;
}

function OppCard({ opp, saved, onToggleSave, onApply, catColor, highlight }: OppCardProps) {
  return (
    <div className="card" style={{ padding: '22px', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      {/* ADDED: Kept the generated background image overlay but inside the original layout bounds */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'url(/assets/bento_discover_students_1773904749219.png)',
        backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.05,
        mixBlendMode: 'screen', filter: 'grayscale(50%)'
      }} />

      {highlight && (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${catColor}, ${catColor}88)` }} />
      )}

      {/* Header */}
      <div style={{ position: 'relative', zIndex: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
            <span className="badge" style={{ background: `${catColor}18`, color: catColor, border: `1px solid ${catColor}30` }}>
              {opp.category}
            </span>
            {opp.verified && (
              <span className="badge" style={{ background: 'rgba(16,185,129,0.12)', color: '#10b981', border: '1px solid rgba(16,185,129,0.25)' }}>
                <CheckCircle size={10} /> Verified
              </span>
            )}
            {opp.trending && (
              <span className="badge" style={{ background: 'rgba(245,158,11,0.12)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.25)' }}>
                🔥 Trending
              </span>
            )}
          </div>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.3, marginBottom: 4 }}>{opp.title}</h3>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 500 }}>{opp.organization}</p>
        </div>
        <button
          onClick={onToggleSave}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: saved ? 'var(--accent-light)' : 'var(--text-muted)', marginLeft: 8, flexShrink: 0 }}
        >
          {saved ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
        </button>
      </div>

      {/* Description */}
      <p style={{ position: 'relative', zIndex: 10, fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 14, flex: 1 }}>
        {opp.description.length > 120 ? opp.description.substring(0, 120) + '…' : opp.description}
      </p>

      {/* Meta info */}
      <div style={{ position: 'relative', zIndex: 10, display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 14 }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--text-muted)' }}>
          <MapPin size={12} /> {opp.locationType}
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--text-muted)' }}>
          <Clock size={12} /> {opp.timeCommitment} · {opp.hoursPerWeek}h/wk
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--text-muted)' }}>
          <Star size={12} fill="#f59e0b" color="#f59e0b" /> {opp.rating} ({opp.applicants} applied)
        </span>
      </div>

      {/* Skills */}
      <div style={{ position: 'relative', zIndex: 10, display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
        {opp.skills.slice(0, 3).map(s => (
          <span key={s} className="tag" style={{ fontSize: 11 }}>{s}</span>
        ))}
      </div>

      {/* Actions */}
      <div style={{ position: 'relative', zIndex: 10, display: 'flex', gap: 8 }}>
        <button onClick={onApply} className="btn-primary" style={{ flex: 1, justifyContent: 'center', padding: '9px 12px', fontSize: 13 }}>
          Apply Now
        </button>
        <span style={{ fontSize: 11, color: 'var(--text-muted)', alignSelf: 'center', whiteSpace: 'nowrap' }}>
          Gr. {opp.gradeEligibility}
        </span>
      </div>
    </div>
  );
}
