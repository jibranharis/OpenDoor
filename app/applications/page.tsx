'use client';

import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { useStudent } from '@/lib/contexts/StudentContext';
import { Send, Clock, CheckCircle, XCircle, Eye } from 'lucide-react';

const statusConfig = {
  'Applied': { color: '#6366f1', bg: 'rgba(99,102,241,0.1)', icon: Send },
  'Under Review': { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', icon: Eye },
  'Accepted': { color: '#10b981', bg: 'rgba(16,185,129,0.1)', icon: CheckCircle },
  'Rejected': { color: '#ef4444', bg: 'rgba(239,68,68,0.1)', icon: XCircle },
};

const columns = ['Applied', 'Under Review', 'Accepted', 'Rejected'] as const;

export default function ApplicationsPage() {
  const { applications } = useStudent();

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div style={{ display: 'flex', flex: 1 }}>
        <Sidebar />
        <main style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
          <div style={{ marginBottom: 28 }}>
            <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 4 }}>My Applications</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>{applications.length} total applications</p>
          </div>

          {/* Kanban board */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, minWidth: 800 }}>
            {columns.map(status => {
              const config = statusConfig[status];
              const apps = applications.filter(a => a.status === status);
              const Icon = config.icon;
              return (
                <div key={status}>
                  {/* Column header */}
                  <div style={{
                    padding: '10px 14px', borderRadius: '10px 10px 0 0',
                    background: config.bg, border: `1px solid ${config.color}25`,
                    borderBottom: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Icon size={14} color={config.color} />
                      <span style={{ fontSize: 13, fontWeight: 700, color: config.color }}>{status}</span>
                    </div>
                    <span style={{
                      background: config.color, color: 'white',
                      borderRadius: '50%', width: 20, height: 20, fontSize: 11, fontWeight: 700,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {apps.length}
                    </span>
                  </div>

                  {/* Cards */}
                  <div style={{
                    background: 'rgba(255,255,255,0.02)', border: `1px solid ${config.color}15`,
                    borderRadius: '0 0 12px 12px', padding: '12px', minHeight: 300,
                    display: 'flex', flexDirection: 'column', gap: 10,
                  }}>
                    {apps.length === 0 && (
                      <div style={{ textAlign: 'center', padding: '30px 10px', color: 'var(--text-muted)', fontSize: 12 }}>
                        No applications
                      </div>
                    )}
                    {apps.map(app => (
                      <div key={app.id} className="card" style={{ padding: '14px', borderRadius: 10 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4, color: 'var(--text-primary)', lineHeight: 1.3 }}>
                          {app.opportunityTitle}
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>{app.organization}</div>
                        {app.message && (
                          <p style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 8, borderLeft: `2px solid ${config.color}40`, paddingLeft: 8 }}>
                            "{app.message.substring(0, 80)}{app.message.length > 80 ? '...' : ''}"
                          </p>
                        )}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--text-muted)' }}>
                          <Clock size={10} /> Applied {app.appliedDate}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}
