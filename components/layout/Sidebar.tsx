'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Compass, ListChecks, Sparkles, BookmarkCheck,
  Send, Bell, User, Building2, PlusCircle, Settings, Shield
} from 'lucide-react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useStudent } from '@/lib/contexts/StudentContext';

const studentLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/opportunities', label: 'Discover', icon: Compass },
  { href: '/activities', label: 'My Activities', icon: ListChecks },
  { href: '/ai-tools', label: 'AI Tools', icon: Sparkles },
  { href: '/saved', label: 'Saved', icon: BookmarkCheck },
  { href: '/applications', label: 'Applications', icon: Send },
  { href: '/notifications', label: 'Notifications', icon: Bell },
  { href: '/profile', label: 'Profile', icon: User },
];

const orgLinks = [
  { href: '/org/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/org/post', label: 'Post Opportunity', icon: PlusCircle },
  { href: '/opportunities', label: 'Browse All', icon: Compass },
];

const adminLinks = [
  { href: '/admin', label: 'Admin Panel', icon: Shield },
  { href: '/opportunities', label: 'All Opportunities', icon: Compass },
];

export default function Sidebar() {
  const { user } = useAuth();
  const { notifications, totalHours } = useStudent();
  const pathname = usePathname();
  const unread = notifications.filter(n => !n.read).length;

  const links = user?.role === 'org' ? orgLinks : user?.role === 'admin' ? adminLinks : studentLinks;

  return (
    <aside style={{
      width: 220, minHeight: '100vh', flexShrink: 0,
      background: 'var(--bg-secondary)',
      borderRight: '1px solid var(--border-subtle)',
      padding: '24px 12px',
      display: 'flex', flexDirection: 'column', gap: 4,
    }}>
      {/* Profile mini card */}
      {user && (
        <div style={{
          padding: '12px', borderRadius: 12,
          background: 'rgba(99,102,241,0.06)',
          border: '1px solid var(--border)',
          marginBottom: 16,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              background: 'linear-gradient(135deg, #6366f1, #a78bfa)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 15, fontWeight: 700, color: 'white',
            }}>
              {user.name.charAt(0)}
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{user.name.split(' ')[0]}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                {user.role === 'org' ? user.orgName || 'Organization' : `Grade ${user.role === 'student' ? '11' : '-'}`}
              </div>
            </div>
          </div>
          {user.role === 'student' && (
            <div style={{ marginTop: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>
                <span>Total Hours</span>
                <span style={{ color: 'var(--accent-light)', fontWeight: 600 }}>{totalHours}h</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${Math.min((totalHours / 200) * 100, 100)}%` }} />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Nav links */}
      {links.map(({ href, label, icon: Icon }) => {
        const isActive = pathname === href;
        const hasUnread = label === 'Notifications' && unread > 0;
        return (
          <Link
            key={href}
            href={!user && href !== '/opportunities' ? '/register' : href}
            className={`sidebar-link ${isActive && user ? 'active' : ''}`}
            style={{ textDecoration: 'none', justifyContent: 'space-between' }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Icon size={16} />
              {label}
            </span>
            {hasUnread && (
              <span style={{
                background: 'var(--accent)', color: 'white', borderRadius: 10,
                minWidth: 18, height: 18, fontSize: 10, fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px',
              }}>
                {unread}
              </span>
            )}
          </Link>
        );
      })}

    </aside>
  );
}
