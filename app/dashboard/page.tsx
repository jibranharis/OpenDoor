'use client';

import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { useStudent } from '@/lib/contexts/StudentContext';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useOpportunities } from '@/lib/contexts/OpportunitiesContext';
import { getEarnedBadges, getNextMilestone, badges } from '@/lib/data/badges';
import {
  Clock, Compass, Send, BookmarkCheck, Award,
  TrendingUp, Activity, Sparkles, ArrowRight, CheckCircle
} from 'lucide-react';
import Link from 'next/link';

const categoryColors: Record<string, string> = {
  Medical: '#ef4444', Nonprofit: '#10b981', Education: '#3b82f6',
  Business: '#f59e0b', STEM: '#8b5cf6', Arts: '#ec4899',
  Environment: '#22c55e', Community: '#06b6d4',
};

export default function StudentDashboard() {
  const { profile, activities, totalHours, savedOpportunities, applications, notifications } = useStudent();
  const { user } = useAuth();
  const { opportunities } = useOpportunities();

  const earnedBadges = getEarnedBadges(totalHours);
  const nextMilestone = getNextMilestone(totalHours);
  const progressPct = Math.min((totalHours / nextMilestone) * 100, 100);

  // Category breakdown
  const categoryBreakdown = activities.reduce<Record<string, number>>((acc, a) => {
    acc[a.category] = (acc[a.category] || 0) + a.totalHours;
    return acc;
  }, {});

  const unreadNotifs = notifications.filter(n => !n.read).length;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div style={{ display: 'flex', flex: 1 }}>
        <Sidebar />

        <main style={{ flex: 1, padding: '32px', overflowY: 'auto', maxWidth: 'calc(100% - 220px)' }}>
          {!user ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', textAlign: 'center' }}>
              <div style={{ width: 64, height: 64, borderRadius: 20, background: 'linear-gradient(135deg, #6366f1, #4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24, boxShadow: '0 10px 25px rgba(99,102,241,0.3)' }}>
                <Compass size={32} color="white" />
              </div>
              <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 16 }}>Unlock Your Potential</h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: 16, maxWidth: 420, marginBottom: 32, lineHeight: 1.6 }}>
                Create a free account to track your volunteer hours, save opportunities, and generate your college resume using AI.
              </p>
              <div style={{ display: 'flex', gap: 16 }}>
                <Link href="/register" className="btn-primary" style={{ padding: '12px 28px', fontSize: 15, textDecoration: 'none' }}>
                  Create Account
                </Link>
                <Link href="/login" className="btn-secondary" style={{ padding: '12px 28px', fontSize: 15, textDecoration: 'none' }}>
                  Sign In
                </Link>
              </div>
            </div>
          ) : (
            <>
              {/* Welcome header */}
              <div style={{ marginBottom: 32 }}>
                <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 4 }}>
                  Explore Your Impact{user?.name ? `, ${user.name.split(' ')[0]}` : ''} 👋
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>
                  Track your community journey and discover your next great opportunity.
                </p>
              </div>

              {/* Stats row */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, marginBottom: 32 }}>
                {[
                  { label: 'Total Hours', value: totalHours, icon: Clock, color: '#6366f1', link: '/activities' },
                  { label: 'Activities', value: activities.length, icon: Activity, color: '#10b981', link: '/activities' },
                  { label: 'Saved Opps', value: savedOpportunities.length, icon: BookmarkCheck, color: '#f59e0b', link: '/saved' },
                  { label: 'Applications', value: applications.length, icon: Send, color: '#ec4899', link: '/applications' },
                  { label: 'Impact Milestones', value: earnedBadges.length, icon: Award, color: '#8b5cf6', link: '/activities' },
                ].map(({ label, value, icon: Icon, color, link }) => (
                  <Link key={label} href={link} style={{ textDecoration: 'none' }}>
                    <div className="card" style={{ padding: '20px', cursor: 'pointer' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                        <div style={{ width: 36, height: 36, borderRadius: 10, background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Icon size={18} color={color} />
                        </div>
                        <TrendingUp size={14} color="var(--success)" />
                      </div>
                      <div style={{ fontSize: 28, fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>{value}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{label}</div>
                    </div>
                  </Link>
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
                {/* Milestone progress */}
                <div className="card" style={{ padding: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
                    <Award size={18} color="var(--accent-light)" />
                    <h2 style={{ fontSize: 15, fontWeight: 700 }}>Impact Journey</h2>
                  </div>
                  <div style={{ marginBottom: 14 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 8 }}>
                      <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>{totalHours}h completed</span>
                      <span style={{ color: 'var(--accent-light)', fontWeight: 700 }}>Next Level: {nextMilestone}h</span>
                    </div>
                    <div className="progress-bar" style={{ height: 10 }}>
                      <div className="progress-fill" style={{ width: `${progressPct}%` }} />
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>
                      {nextMilestone - totalHours} more hours to reach your next milestone!
                    </div>
                  </div>

                  {/* All Available Badges */}
                  <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid var(--border-subtle)' }}>
                    <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 12 }}>Service Milestones</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 10 }}>
                      {badges.map(b => {
                        const earned = totalHours >= b.requirement;
                        return (
                          <div key={b.id} title={b.description} style={{
                            padding: '10px', borderRadius: 10,
                            background: earned ? `${b.color}18` : 'rgba(255,255,255,0.02)',
                            border: `1px solid ${earned ? b.color + '40' : 'var(--border-subtle)'}`,
                            display: 'flex', alignItems: 'center', gap: 10, opacity: earned ? 1 : 0.5,
                          }}>
                            <div style={{ fontSize: 20 }}>{b.emoji}</div>
                            <div>
                              <div style={{ fontSize: 12, fontWeight: 700, color: earned ? b.color : 'var(--text-primary)' }}>{b.name}</div>
                              <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{b.requirement}h required</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Category breakdown (CLEAN DESIGN) */}
                <div className="card" style={{ padding: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                    <Activity size={18} color="var(--accent-light)" />
                    <h2 style={{ fontSize: 16, fontWeight: 700 }}>Hours by Category</h2>
                  </div>
                  {Object.entries(categoryBreakdown).length === 0 ? (
                    <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 14, background: 'rgba(255,255,255,0.02)', borderRadius: 12 }}>
                      No hours logged yet. Start an activity to see your breakdown!
                    </div>
                  ) : Object.entries(categoryBreakdown).map(([cat, hrs]) => {
                    const pct = Math.min((hrs / totalHours) * 100, 100);
                    const color = categoryColors[cat] || '#6366f1';
                    
                    return (
                      <div key={cat} style={{ marginBottom: 18 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 8, alignItems: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: color }} />
                            <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{cat}</span>
                          </div>
                          <span style={{ color: 'var(--text-secondary)', fontWeight: 700, fontSize: 13 }}>{hrs}h <span style={{ color: 'var(--text-muted)', fontWeight: 400, fontSize: 11, marginLeft: 4 }}>({Math.round(pct)}%)</span></span>
                        </div>
                        <div className="progress-bar" style={{ height: 10, background: 'rgba(255,255,255,0.03)' }}>
                          <div style={{ 
                            height: '100%', borderRadius: 5, 
                            background: `linear-gradient(90deg, ${color} 0%, ${color}dd 100%)`,
                            width: `${pct}%`, transition: 'width 0.8s ease',
                            boxShadow: `0 0 10px ${color}30`
                          }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Recent activities */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                <div className="card" style={{ padding: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
                    <h2 style={{ fontSize: 15, fontWeight: 700 }}>Recent Activities</h2>
                    <Link href="/activities" style={{ fontSize: 12, color: 'var(--accent-light)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
                      View all <ArrowRight size={12} />
                    </Link>
                  </div>
                  {activities.slice(0, 3).map(a => (
                    <div key={a.id} style={{ display: 'flex', gap: 12, marginBottom: 14, padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: 10 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 10, background: `${categoryColors[a.category] || '#6366f1'}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Activity size={16} color={categoryColors[a.category] || '#6366f1'} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.role}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{a.orgName}</div>
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--accent-light)', fontWeight: 700, flexShrink: 0 }}>{a.totalHours}h</div>
                    </div>
                  ))}
                  <Link href="/activities" className="btn-secondary" style={{ width: '100%', justifyContent: 'center', fontSize: 13, textDecoration: 'none', padding: '9px 12px' }}>
                    + Add Activity
                  </Link>
                </div>

                {/* Quick actions */}
                <div className="card" style={{ padding: '24px' }}>
                  <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 18 }}>Quick Actions</h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {[
                      { label: 'Discover new opportunities', desc: `${opportunities.length} listings available`, icon: Compass, href: '/opportunities', color: '#6366f1' },
                      { label: 'Generate impact portfolio', desc: 'AI-powered in seconds', icon: Sparkles, href: '/ai-tools', color: '#f59e0b' },
                      { label: 'Track an application', desc: `${applications.length} in progress`, icon: Send, href: '/applications', color: '#10b981' },
                      { label: 'Update your profile', desc: 'Keep it fresh for discovery', icon: CheckCircle, href: '/profile', color: '#ec4899' },
                    ].map(({ label, desc, icon: Icon, href, color }) => (
                      <Link key={label} href={href} style={{ textDecoration: 'none' }}>
                        <div style={{
                          display: 'flex', alignItems: 'center', gap: 14, padding: '12px 14px',
                          background: 'rgba(255,255,255,0.02)', borderRadius: 10,
                          border: '1px solid var(--border-subtle)', transition: 'all 0.2s', cursor: 'pointer',
                        }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = color + '40'; e.currentTarget.style.background = `${color}06`; }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }}
                        >
                          <div style={{ width: 36, height: 36, borderRadius: 10, background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <Icon size={16} color={color} />
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{label}</div>
                            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{desc}</div>
                          </div>
                          <ArrowRight size={14} color="var(--text-muted)" />
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
