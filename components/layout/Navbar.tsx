'use client';

import { useAuth } from '@/lib/contexts/AuthContext';
import { useStudent } from '@/lib/contexts/StudentContext';
import { Bell, LogOut, Menu, X, Compass } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { notifications } = useStudent();
  const [mobileOpen, setMobileOpen] = useState(false);
  const unread = notifications.filter(n => !n.read).length;

  const dashboardLink =
    user?.role === 'student' ? '/dashboard'
    : user?.role === 'org' ? '/org/dashboard'
    : '/admin';

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: 'rgba(8, 14, 26, 0.85)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(99,102,241,0.12)',
      padding: '0 24px', height: '60px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    }}>
      {/* Logo */}
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
        <div style={{
          width: 34, height: 34, borderRadius: 10,
          backgroundImage: 'url(/assets/bento_logo_key_1773904636925.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 15px rgba(247, 183, 51, 0.3)',
        }} />
        <span style={{ fontWeight: 800, fontSize: 18, color: '#f1f5f9', letterSpacing: '-0.02em' }}>
          Open<span style={{ color: '#818cf8' }}>Door</span>
        </span>
      </Link>

      {/* Center links */}
      <div style={{ display: 'flex', gap: 4, alignItems: 'center' }} className="nav-center">
        <Link href="/opportunities" style={{
          padding: '6px 14px', borderRadius: 8, fontSize: 14, fontWeight: 500,
          color: 'var(--text-secondary)', textDecoration: 'none', transition: 'all 0.2s',
        }} onMouseEnter={e => (e.currentTarget.style.color = '#f1f5f9')} onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}>
          Discover
        </Link>
        {user && (
          <>
            <Link href={dashboardLink} style={{
              padding: '6px 14px', borderRadius: 8, fontSize: 14, fontWeight: 500,
              color: 'var(--text-secondary)', textDecoration: 'none', transition: 'all 0.2s',
            }} onMouseEnter={e => (e.currentTarget.style.color = '#f1f5f9')} onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}>
              Dashboard
            </Link>
            <Link href="/awards" style={{
              padding: '6px 14px', borderRadius: 8, fontSize: 14, fontWeight: 500,
              color: 'var(--text-secondary)', textDecoration: 'none', transition: 'all 0.2s',
            }} onMouseEnter={e => (e.currentTarget.style.color = '#f1f5f9')} onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}>
              Awards
            </Link>
          </>
        )}
        {!user && (
          <Link href="/opportunities" style={{
            padding: '6px 14px', borderRadius: 8, fontSize: 14, fontWeight: 500,
            color: 'var(--text-secondary)', textDecoration: 'none', transition: 'all 0.2s',
          }} onMouseEnter={e => (e.currentTarget.style.color = '#f1f5f9')} onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}>
            For Orgs
          </Link>
        )}
      </div>

      {/* Right */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {user ? (
          <>
            <Link href="/notifications" style={{ position: 'relative', color: 'var(--text-secondary)', display: 'flex' }}>
              <Bell size={20} />
              {unread > 0 && (
                <span style={{
                  position: 'absolute', top: -4, right: -4,
                  background: 'var(--accent)', color: 'white',
                  borderRadius: '50%', width: 16, height: 16,
                  fontSize: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700,
                }}>
                  {unread}
                </span>
              )}
            </Link>
            <Link href={user.role === 'student' ? '/profile' : '/org/dashboard'} style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                background: user.avatar ? `url(${user.avatar}) center/cover no-repeat` : 'linear-gradient(135deg, #6366f1, #a78bfa)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, fontWeight: 700, color: 'white',
                border: user.avatar ? '1.5px solid var(--accent)' : 'none',
              }}>
                {!user.avatar && user.name.charAt(0)}
              </div>
              <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>{user.name.split(' ')[0]}</span>
            </Link>
            <button onClick={logout} className="btn-secondary" style={{ padding: '6px 12px', fontSize: 12, marginLeft: 8 }}>
              <LogOut size={14} /> Sign Out
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className="btn-secondary" style={{ padding: '7px 16px', fontSize: 13, textDecoration: 'none' }}>
              Log In
            </Link>
            <Link href="/register" className="btn-primary" style={{ padding: '7px 16px', fontSize: 13, textDecoration: 'none' }}>
              Get Started
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
