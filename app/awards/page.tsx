'use client';

import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { useStudent } from '@/lib/contexts/StudentContext';
import { badges } from '@/lib/data/badges';
import { Award, Lock, CheckCircle, TrendingUp, Star, Sparkles } from 'lucide-react';

export default function AwardsPage() {
  const { totalHours } = useStudent();

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div style={{ display: 'flex', flex: 1 }}>
        <Sidebar />
        <main style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
          <div style={{ maxWidth: 1000, margin: '0 auto' }}>
            <div style={{ marginBottom: 40, textAlign: 'center' }}>
              <div style={{ 
                width: 60, height: 60, borderRadius: 16, background: 'rgba(99,102,241,0.1)', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' 
              }}>
                <Award size={32} color="var(--accent)" />
              </div>
              <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 6 }}>
                Service Milestones
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>
                Celebrating your dedication and impact in the community.
              </p>
            </div>

            {/* Current Status Card */}
            <div className="card shadow-lg" style={{ 
              padding: '32px', marginBottom: 48, background: 'linear-gradient(135deg, var(--bg-card) 0%, #1a2540 100%)',
              border: '1px solid rgba(99,102,241,0.2)' 
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 40, flexWrap: 'wrap' }}>
                <div style={{ flex: 1 }}>
                  <h2 style={{ fontSize: 14, fontWeight: 700, color: 'var(--accent-light)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>
                    Current Community Standing
                  </h2>
                  <div style={{ fontSize: 36, fontWeight: 900, marginBottom: 4 }}>{totalHours} hrs</div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 20 }}>
                    Of verified community contribution
                  </p>
                  <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>
                    You've unlocked {badges.filter(b => totalHours >= b.requirement).length} out of {badges.length} service badges.
                  </p>
                </div>
                <div style={{ display: 'flex', gap: 16 }}>
                  <div style={{ textAlign: 'center', padding: '16px 24px', background: 'rgba(255,255,255,0.03)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.05)' }}>
                    <Star size={20} color="#f59e0b" style={{ marginBottom: 8 }} />
                    <div style={{ fontSize: 18, fontWeight: 800 }}>Top 5%</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Percentile</div>
                  </div>
                  <div style={{ textAlign: 'center', padding: '16px 24px', background: 'rgba(255,255,255,0.03)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.05)' }}>
                    <Sparkles size={20} color="var(--accent)" style={{ marginBottom: 8 }} />
                    <div style={{ fontSize: 18, fontWeight: 800 }}>Master</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Current Title</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Badge Grid */}
            <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
              The Road to Excellence
              <div style={{ flex: 1, height: 1, background: 'var(--border-subtle)' }} />
            </h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
              {badges.map(badge => {
                const isEarned = totalHours >= badge.requirement;
                const progress = Math.min((totalHours / badge.requirement) * 100, 100);
                
                return (
                  <div key={badge.id} className="card" style={{ 
                    padding: '24px', 
                    opacity: isEarned ? 1 : 0.7, 
                    border: isEarned ? `1px solid ${badge.color}40` : '1px solid var(--border-subtle)',
                    background: isEarned ? `${badge.color}08` : 'var(--bg-card)',
                    position: 'relative', overflow: 'hidden'
                  }}>
                    {!isEarned && (
                      <div style={{ position: 'absolute', top: 16, right: 16, color: 'var(--text-muted)' }}>
                        <Lock size={16} />
                      </div>
                    )}
                    {isEarned && (
                      <div style={{ position: 'absolute', top: 16, right: 16, color: badge.color }}>
                        <CheckCircle size={18} fill={`${badge.color}20`} />
                      </div>
                    )}

                    <div style={{ fontSize: 48, marginBottom: 16 }}>{badge.emoji}</div>
                    <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 8, color: isEarned ? 'white' : 'var(--text-secondary)' }}>
                      {badge.name}
                    </h3>
                    <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: 20 }}>
                      {badge.description}
                    </p>

                    <div style={{ marginTop: 'auto' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontWeight: 700, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        <span style={{ color: isEarned ? badge.color : 'var(--text-muted)' }}>
                          {isEarned ? 'UNLOCKED' : `${badge.requirement - totalHours}h TO GO`}
                        </span>
                        <span style={{ color: 'var(--text-muted)' }}>{badge.requirement}h Target</span>
                      </div>
                      <div className="progress-bar" style={{ height: 6, background: 'rgba(255,255,255,0.05)' }}>
                        <div style={{ 
                          height: '100%', borderRadius: 3, 
                          background: isEarned ? badge.color : 'var(--text-muted)', 
                          width: `${progress}%`, transition: 'width 1s ease' 
                        }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
