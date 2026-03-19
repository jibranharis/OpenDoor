'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import type { Opportunity } from '@/lib/data/opportunities';
import { useOpportunities } from '@/lib/contexts/OpportunitiesContext';
import type { AuthUser } from '@/lib/contexts/AuthContext';
import { Shield, Users, Compass, CheckCircle, Trash2, Check, X, BarChart2 } from 'lucide-react';

export default function AdminPage() {
  const { opportunities, updateOpportunity, deleteOpportunity } = useOpportunities();
  const pending = opportunities.filter(o => !o.verified);
  
  const [activeTab, setActiveTab] = useState<'listings' | 'users'>('listings');
  const [users, setUsers] = useState<AuthUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<AuthUser | null>(null);
  const [studentDetails, setStudentDetails] = useState<any>(null);

  useEffect(() => {
    const usersStr = localStorage.getItem('opendoor_users');
    if (usersStr) {
      setUsers(Object.values(JSON.parse(usersStr)));
    }
  }, []);

  const handleApprove = (o: Opportunity) => {
    updateOpportunity(o.id, { verified: true });
  };

  const handleReject = (id: string) => {
    deleteOpportunity(id);
  };

  const handleUserClick = (u: AuthUser) => {
    setSelectedUser(u);
    if (u.role === 'student') {
      const detailsStr = localStorage.getItem(`opendoor_student_${u.email}`);
      setStudentDetails(detailsStr ? JSON.parse(detailsStr) : null);
    } else {
      setStudentDetails(null);
    }
  };

  const stats = [
    { label: 'Total Users', value: users.length, icon: Users, color: '#ec4899' },
    { label: 'Total Opportunities', value: opportunities.length, icon: Compass, color: '#6366f1' },
    { label: 'Verified Listings', value: opportunities.filter(o => o.verified).length, icon: CheckCircle, color: '#10b981' },
    { label: 'Pending Review', value: pending.length, icon: Shield, color: '#ef4444' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div style={{ display: 'flex', flex: 1 }}>
        <Sidebar />
        <main style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
          <div style={{ marginBottom: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(99,102,241,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Shield size={18} color="var(--accent-light)" />
              </div>
              <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.02em' }}>Admin Panel</h1>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Manage listings, users, and platform analytics</p>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 28 }}>
            {stats.map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="card" style={{ padding: '18px' }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
                  <Icon size={15} color={color} />
                </div>
                <div style={{ fontSize: 24, fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>{value}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{label}</div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: 16, borderBottom: '1px solid var(--border-subtle)', marginBottom: 24 }}>
            <button 
              onClick={() => setActiveTab('listings')}
              style={{ padding: '10px 16px', background: 'none', border: 'none', borderBottom: activeTab === 'listings' ? '2px solid var(--accent-light)' : '2px solid transparent', color: activeTab === 'listings' ? 'var(--text-primary)' : 'var(--text-muted)', fontWeight: 600, cursor: 'pointer', fontSize: 14 }}>
              Listings Management
            </button>
            <button 
              onClick={() => setActiveTab('users')}
              style={{ padding: '10px 16px', background: 'none', border: 'none', borderBottom: activeTab === 'users' ? '2px solid var(--accent-light)' : '2px solid transparent', color: activeTab === 'users' ? 'var(--text-primary)' : 'var(--text-muted)', fontWeight: 600, cursor: 'pointer', fontSize: 14 }}>
              User Directory
            </button>
          </div>

          {activeTab === 'listings' ? (
            <>
              {/* Pending approvals */}
              <div className="card" style={{ padding: '24px', marginBottom: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
                  <Shield size={16} color="#f59e0b" />
                  <h2 style={{ fontSize: 16, fontWeight: 700 }}>Pending Approvals</h2>
                  {pending.length > 0 && (
                    <span style={{ background: '#ef4444', color: 'white', borderRadius: 10, padding: '1px 8px', fontSize: 11, fontWeight: 700 }}>
                      {pending.length}
                    </span>
                  )}
                </div>

                {pending.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)', fontSize: 14 }}>
                    <CheckCircle size={32} color="#10b981" style={{ margin: '0 auto 10px', opacity: 0.6 }} />
                    All caught up! No pending listings.
                  </div>
                ) : (
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Listing</th>
                        <th>Organization</th>
                        <th>Category</th>
                        <th>Location</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pending.map(opp => (
                        <tr key={opp.id}>
                          <td>
                            <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: 13 }}>{opp.title}</div>
                            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{opp.timeCommitment} · {opp.hoursPerWeek}h/wk</div>
                          </td>
                          <td style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>{opp.organization}</td>
                          <td><span className="tag" style={{ fontSize: 11 }}>{opp.category}</span></td>
                          <td style={{ fontSize: 12 }}>{opp.locationType}</td>
                          <td>
                            <div style={{ display: 'flex', gap: 6 }}>
                              <button
                                onClick={() => handleApprove(opp)}
                                style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', color: '#10b981', fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                                <Check size={12} /> Approve
                              </button>
                              <button
                                onClick={() => handleReject(opp.id)}
                                style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', color: '#ef4444', fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                                <X size={12} /> Reject
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {/* All listings brief */}
              <div className="card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
                  <BarChart2 size={16} color="var(--accent-light)" />
                  <h2 style={{ fontSize: 16, fontWeight: 700 }}>All Listings ({opportunities.length})</h2>
                </div>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Org</th>
                      <th>Category</th>
                      <th>Applicants</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {opportunities.slice(0, 10).map(o => (
                      <tr key={o.id}>
                        <td style={{ fontWeight: 500, color: 'var(--text-primary)', fontSize: 13 }}>{o.title}</td>
                        <td style={{ fontSize: 12 }}>{o.organization}</td>
                        <td><span className="tag" style={{ fontSize: 10 }}>{o.category}</span></td>
                        <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{o.applicants}</td>
                        <td>
                          {o.verified ? (
                            <span className="badge" style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981', border: '1px solid rgba(16,185,129,0.2)', fontSize: 10 }}>✓ Verified</span>
                          ) : (
                            <span className="badge" style={{ background: 'rgba(245,158,11,0.1)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.2)', fontSize: 10 }}>Pending</span>
                          )}
                        </td>
                        <td>
                          <button 
                            onClick={() => deleteOpportunity(o.id)}
                            style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 7, padding: '4px 10px', cursor: 'pointer', color: '#ef4444', fontSize: 11, display: 'flex', alignItems: 'center', gap: 3 }}>
                            <Trash2 size={11} /> Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div className="card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
                <Users size={16} color="var(--accent-light)" />
                <h2 style={{ fontSize: 16, fontWeight: 700 }}>Registered Users</h2>
              </div>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Name / Org</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id}>
                      <td style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: 13 }}>
                        {u.role === 'org' ? u.orgName : u.name}
                      </td>
                      <td style={{ fontSize: 13, color: 'var(--text-muted)' }}>{u.email}</td>
                      <td>
                        <span className="badge" style={{ 
                          background: u.role === 'student' ? 'rgba(99,102,241,0.1)' : u.role === 'org' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', 
                          color: u.role === 'student' ? '#6366f1' : u.role === 'org' ? '#10b981' : '#ef4444' 
                        }}>
                          {u.role}
                        </span>
                      </td>
                      <td>
                        <button onClick={() => handleUserClick(u)} className="btn-secondary" style={{ padding: '6px 12px', fontSize: 12 }}>
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr>
                      <td colSpan={4} style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>No users registered yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div className="card" style={{ width: '100%', maxWidth: 700, maxHeight: '90vh', overflowY: 'auto', padding: 32, position: 'relative' }}>
            <button onClick={() => setSelectedUser(null)} style={{ position: 'absolute', top: 20, right: 20, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
              <X size={24} />
            </button>
            <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 10 }}>
              {selectedUser.role === 'org' ? selectedUser.orgName : selectedUser.name}
              <span className="badge" style={{ 
                background: selectedUser.role === 'student' ? 'rgba(99,102,241,0.1)' : selectedUser.role === 'org' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', 
                color: selectedUser.role === 'student' ? '#6366f1' : selectedUser.role === 'org' ? '#10b981' : '#ef4444',
                fontSize: 12
              }}>
                {selectedUser.role}
              </span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 24, fontSize: 14 }}>{selectedUser.email}</p>

            {selectedUser.role === 'org' && (
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>Posted Opportunities</h3>
                {opportunities.filter(o => o.organization === selectedUser.orgName).length === 0 ? (
                  <p style={{ color: 'var(--text-muted)', fontSize: 14, background: 'rgba(255,255,255,0.02)', padding: 16, borderRadius: 10 }}>No opportunities posted yet.</p>
                ) : (
                  <div style={{ display: 'grid', gap: 12 }}>
                    {opportunities.filter(o => o.organization === selectedUser.orgName).map(o => (
                      <div key={o.id} style={{ padding: 16, border: '1px solid var(--border-subtle)', borderRadius: 12, background: 'rgba(255,255,255,0.02)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                          <div style={{ fontWeight: 600 }}>{o.title}</div>
                          {o.verified ? (
                            <span style={{ fontSize: 12, color: '#10b981', fontWeight: 600 }}>Verified</span>
                          ) : (
                            <span style={{ fontSize: 12, color: '#f59e0b', fontWeight: 600 }}>Pending Review</span>
                          )}
                        </div>
                        <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{o.category} • {o.applicants} applicants</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {selectedUser.role === 'student' && studentDetails && (
              <div style={{ display: 'grid', gap: 24 }}>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>Profile Detail</h3>
                  <div style={{ padding: 16, background: 'rgba(255,255,255,0.02)', borderRadius: 12, border: '1px solid var(--border-subtle)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(100px, max-content) 1fr', gap: '8px 16px', fontSize: 14 }}>
                      <span style={{ color: 'var(--text-muted)' }}>School</span>
                      <strong style={{ color: 'var(--text-primary)' }}>{studentDetails.profile.school || 'Not specified'}</strong>
                      <span style={{ color: 'var(--text-muted)' }}>Grade</span>
                      <strong style={{ color: 'var(--text-primary)' }}>{studentDetails.profile.grade || 'Not specified'}</strong>
                      <span style={{ color: 'var(--text-muted)' }}>Interests</span>
                      <strong style={{ color: 'var(--text-primary)' }}>{studentDetails.profile.interests?.length > 0 ? studentDetails.profile.interests.join(', ') : 'None'}</strong>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>Tracked Activities ({studentDetails.activities?.length || 0})</h3>
                  {studentDetails.activities?.length > 0 ? (
                    <div style={{ display: 'grid', gap: 12 }}>
                      {studentDetails.activities.map((a: any) => (
                        <div key={a.id} style={{ padding: 16, border: '1px solid var(--border-subtle)', borderRadius: 12, background: 'rgba(255,255,255,0.02)', display: 'flex', justifyContent: 'space-between' }}>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-primary)' }}>{a.role} at {a.orgName}</div>
                            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>{a.category} • {a.hoursPerWeek} hrs/week</div>
                          </div>
                          <div style={{ fontWeight: 800, color: 'var(--accent-light)', fontSize: 16 }}>{a.totalHours}h</div>
                        </div>
                      ))}
                    </div>
                  ) : <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>No activities logged yet.</p>}
                </div>
              </div>
            )}
            
            {selectedUser.role === 'student' && !studentDetails && (
              <p style={{ color: 'var(--text-muted)', background: 'rgba(255,255,255,0.02)', padding: 16, borderRadius: 10 }}>This student has not yet personalized their profile or logged any hours.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
