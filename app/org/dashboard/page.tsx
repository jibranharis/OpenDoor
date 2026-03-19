'use client';

import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { useAuth } from '@/lib/contexts/AuthContext';
import { Plus, LayoutDashboard, Users, CheckCircle, Edit3, Trash2, Eye } from 'lucide-react';
import { useOpportunities } from '@/lib/contexts/OpportunitiesContext';

export default function OrgDashboard() {
  const { user } = useAuth();
  const { opportunities, deleteOpportunity } = useOpportunities();
  
  const orgListings = opportunities.filter(o => o.organization === user?.orgName);

  const stats = [
    { label: 'Active Listings', value: orgListings.length, icon: LayoutDashboard, color: '#6366f1' },
    { label: 'Total Applicants', value: orgListings.reduce((s, o) => s + o.applicants, 0), icon: Users, color: '#10b981' },
    { label: 'Verified', value: orgListings.filter(o => o.verified).length, icon: CheckCircle, color: '#f59e0b' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div style={{ display: 'flex', flex: 1 }}>
        <Sidebar />
        <main style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
            <div>
              <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 4 }}>
                {user?.orgName || 'Organization'} Dashboard
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Manage your opportunity listings and applicants</p>
            </div>
            <a href="/org/post" className="btn-primary" style={{ padding: '10px 18px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <Plus size={16} /> Post Opportunity
            </a>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 28 }}>
            {stats.map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="card" style={{ padding: '20px' }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                  <Icon size={18} color={color} />
                </div>
                <div style={{ fontSize: 28, fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>{value}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{label}</div>
              </div>
            ))}
          </div>

          {/* Listings table */}
          <div className="card" style={{ padding: '24px' }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 18 }}>Your Listings</h2>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Opportunity</th>
                  <th>Category</th>
                  <th>Applicants</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orgListings.map(listing => (
                  <tr key={listing.id}>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: 14 }}>{listing.title}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{listing.timeCommitment} · {listing.locationType}</div>
                    </td>
                    <td><span className="tag">{listing.category}</span></td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Users size={14} color="var(--text-muted)" />
                        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{listing.applicants}</span>
                      </div>
                    </td>
                    <td>
                      <span className="badge" style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981', border: '1px solid rgba(16,185,129,0.2)' }}>
                        ● Active
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-subtle)', borderRadius: 7, padding: '6px 10px', cursor: 'pointer', color: 'var(--text-secondary)', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Eye size={12} /> View
                        </button>
                        <button style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-subtle)', borderRadius: 7, padding: '6px 10px', cursor: 'pointer', color: 'var(--text-secondary)', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Edit3 size={12} /> Edit
                        </button>
                        <button
                          onClick={() => deleteOpportunity(listing.id)}
                          style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 7, padding: '6px 10px', cursor: 'pointer', color: '#ef4444', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Trash2 size={12} /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}
