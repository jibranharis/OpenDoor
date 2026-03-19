'use client';

import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { useStudent } from '@/lib/contexts/StudentContext';
import { Bell, CheckCheck } from 'lucide-react';

export default function NotificationsPage() {
  const { notifications, markNotifRead } = useStudent();

  const typeEmoji = { opportunity: '🔍', application: '📋', milestone: '🏆' };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div style={{ display: 'flex', flex: 1 }}>
        <Sidebar />
        <main style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
          <div style={{ maxWidth: 680 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
              <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.02em' }}>Notifications</h1>
              <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                {notifications.filter(n => !n.read).length} unread
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {notifications.map(n => (
                <div
                  key={n.id}
                  onClick={() => markNotifRead(n.id)}
                  className="card"
                  style={{
                    padding: '18px 20px', cursor: 'pointer',
                    borderLeft: n.read ? '3px solid transparent' : '3px solid var(--accent)',
                    opacity: n.read ? 0.7 : 1,
                    display: 'flex', alignItems: 'flex-start', gap: 14,
                  }}
                >
                  <div style={{
                    width: 40, height: 40, borderRadius: 12,
                    background: n.type === 'milestone' ? 'rgba(245,158,11,0.1)' : n.type === 'application' ? 'rgba(16,185,129,0.1)' : 'rgba(99,102,241,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0,
                  }}>
                    {typeEmoji[n.type]}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 14, color: 'var(--text-primary)', lineHeight: 1.5, marginBottom: 4 }}>{n.message}</p>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{n.time}</span>
                  </div>
                  {!n.read && (
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)', flexShrink: 0, marginTop: 6 }} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
