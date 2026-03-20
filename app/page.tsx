'use client';

import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import {
  Compass, Activity, Sparkles, ArrowRight, Star, CheckCircle,
  Users, Clock, TrendingUp, Shield, Zap, Target, Heart
} from 'lucide-react';

const features = [
  {
    icon: Compass,
    title: 'Discover Opportunities',
    desc: '30+ verified volunteering and internship listings — filtered by category, location, and time commitment.',
    color: '#6366f1',
  },
  {
    icon: Activity,
    title: 'Track Your Journey',
    desc: 'Log activities, auto-calculate hours, and get a real-time dashboard of your entire service record.',
    color: '#10b981',
  },
  {
    icon: Sparkles,
    title: 'AI-Powered Tools',
    desc: 'Generate polished resume bullets and Common App descriptions from your activities in seconds.',
    color: '#f59e0b',
  },
];

const stats = [
  { label: 'Opportunities', value: '32+', icon: Compass },
  { label: 'Students Active', value: '1,400+', icon: Users },
  { label: 'Hours Logged', value: '28,000+', icon: Clock },
  { label: 'Colleges Reached', value: '120+', icon: TrendingUp },
];

const testimonials = [
  {
    name: 'Shanzay K.',
    grade: 'Grade 11 · Pre-Med',
    text: 'OpenDoor helped me find a hospital volunteer position and automatically generated my Common App description. This app is a game changer.',
    avatar: 'S',
    stars: 5,
  },
  {
    name: 'Marcus T.',
    grade: 'Grade 12 · CS Track',
    text: 'I landed a remote coding TA role and the AI resume bullet tool saved me hours of work. My college counselor was impressed.',
    avatar: 'M',
    stars: 5,
  },
  {
    name: 'Priya L.',
    grade: 'Grade 10 · Nonprofit Focus',
    text: 'The activity tracker is exactly what I needed. I can see all my hours in one place and track progress toward my 100-hour goal.',
    avatar: 'P',
    stars: 5,
  },
];

export default function LandingPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Animated background blobs */}
      <div className="animated-bg">
        <div className="bg-blob" style={{ width: 600, height: 600, background: '#6366f1', top: -200, left: -100, animationDelay: '0s' }} />
        <div className="bg-blob" style={{ width: 500, height: 500, background: '#8b5cf6', top: 200, right: -100, animationDelay: '7s' }} />
        <div className="bg-blob" style={{ width: 400, height: 400, background: '#10b981', bottom: 0, left: '40%', animationDelay: '14s' }} />
      </div>

      <Navbar />

      {/* Hero */}
      <section style={{ position: 'relative', zIndex: 1, padding: '100px 24px 80px', textAlign: 'center', maxWidth: 800, margin: '0 auto' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.3)',
          borderRadius: 20, padding: '6px 16px', marginBottom: 28,
        }}>
          <Zap size={14} color="#818cf8" />
          <span style={{ fontSize: 13, color: '#818cf8', fontWeight: 600 }}>The College Prep Activity Platform</span>
        </div>

        <h1 style={{ fontSize: 62, fontWeight: 900, marginBottom: 24, letterSpacing: '-0.04em', lineHeight: 1.05 }}>
          Unlock Your <span className="gradient-text">Next Opportunity.</span>
        </h1>
        <p style={{ fontSize: 20, color: 'var(--text-secondary)', marginBottom: 40, maxWidth: 600, margin: '0 auto 40px', lineHeight: 1.6 }}>
          The best place for students to discover meaningful volunteer opportunities, track their community impact, and build a portfolio that matters.
        </p>

        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/register" className="btn-primary" style={{ padding: '14px 28px', fontSize: 16, textDecoration: 'none' }}>
            Start Building Your Profile <ArrowRight size={18} />
          </Link>
          <Link href="/opportunities" className="btn-secondary" style={{ padding: '14px 28px', fontSize: 16, textDecoration: 'none' }}>
            <Compass size={18} /> Browse Opportunities
          </Link>
        </div>

        {/* Mini trust indicators */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginTop: 32, flexWrap: 'wrap' }}>
          {['Free to use', 'Verified listings', 'AI-powered'].map(t => (
            <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-muted)' }}>
              <CheckCircle size={14} color="var(--success)" /> {t}
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section style={{ position: 'relative', zIndex: 1, padding: '0 24px 80px', maxWidth: 900, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
          {stats.map(({ label, value, icon: Icon }) => (
            <div key={label} className="card" style={{ padding: '24px', textAlign: 'center' }}>
              <Icon size={24} color="var(--accent-light)" style={{ marginBottom: 10, margin: '0 auto 10px' }} />
              <div style={{ fontSize: 32, fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>{value}</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ position: 'relative', zIndex: 1, padding: '0 24px 100px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <h2 style={{ fontSize: 40, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 12 }}>
            Everything you need to{' '}
            <span className="gradient-text">stand out</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 16 }}>Not just a volunteer board — a complete college prep toolkit.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
          {features.map(({ icon: Icon, title, desc, color }) => (
            <div key={title} className="card" style={{ padding: '32px', position: 'relative', overflow: 'hidden' }}>
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: 3,
                background: `linear-gradient(90deg, ${color}, ${color}88)`,
              }} />
              <div style={{
                width: 50, height: 50, borderRadius: 14,
                background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 18, border: `1px solid ${color}30`,
              }}>
                <Icon size={22} color={color} />
              </div>
              <h3 style={{ fontSize: 19, fontWeight: 700, marginBottom: 10, color: 'var(--text-primary)' }}>{title}</h3>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section style={{ position: 'relative', zIndex: 1, padding: '0 24px 100px', maxWidth: 900, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 12 }}>
            Your path to a stronger application
          </h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[
            { step: '01', title: 'Create your student profile', desc: 'Set your grade, interests, and goals in 2 minutes.', icon: Target },
            { step: '02', title: 'Discover opportunities', desc: 'Search 30+ verified listings filtered to match your interests and schedule.', icon: Compass },
            { step: '03', title: 'Track every activity', desc: 'Log your hours, roles, and descriptions. See your dashboard grow in real time.', icon: Activity },
            { step: '04', title: 'Generate AI content', desc: 'Get polished resume bullets and Common App descriptions from your activities instantly.', icon: Sparkles },
          ].map(({ step, title, desc, icon: Icon }) => (
            <div key={step} className="card" style={{ padding: '24px', display: 'flex', alignItems: 'flex-start', gap: 20 }}>
              <div style={{
                minWidth: 44, height: 44, borderRadius: 12,
                background: 'rgba(99,102,241,0.1)', border: '1px solid var(--border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon size={20} color="var(--accent-light)" />
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--accent-light)', marginBottom: 4, letterSpacing: '0.06em' }}>STEP {step}</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>{title}</div>
                <div style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ position: 'relative', zIndex: 1, padding: '0 24px 100px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 12 }}>
            Students love OpenDoor
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
          {testimonials.map(({ name, grade, text, avatar, stars }) => (
            <div key={name} className="card" style={{ padding: '28px' }}>
              <div style={{ display: 'flex', gap: 4, marginBottom: 16 }}>
                {Array.from({ length: stars }).map((_, i) => (
                  <Star key={i} size={14} fill="#f59e0b" color="#f59e0b" />
                ))}
              </div>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 20 }}>"{text}"</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #6366f1, #a78bfa)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, color: 'white', fontSize: 15,
                }}>
                  {avatar}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{grade}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{
        position: 'relative', zIndex: 1, padding: '60px 24px 100px', textAlign: 'center',
      }}>
        <div style={{
          maxWidth: 600, margin: '0 auto', padding: '60px 40px',
          background: 'linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(139,92,246,0.08) 100%)',
          border: '1px solid rgba(99,102,241,0.25)',
          borderRadius: 24,
        }}>
          <Heart size={40} color="#6366f1" style={{ marginBottom: 16 }} />
          <h2 style={{ fontSize: 36, fontWeight: 800, marginBottom: 14, letterSpacing: '-0.02em' }}>
            Ready to open your door?
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 16, marginBottom: 32 }}>
            Join thousands of students building college-ready profiles.
          </p>
          <Link href="/register" className="btn-primary" style={{ padding: '16px 36px', fontSize: 16, textDecoration: 'none' }}>
            Create Free Account <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        position: 'relative', zIndex: 1,
        borderTop: '1px solid var(--border-subtle)',
        padding: '32px 24px', textAlign: 'center',
        color: 'var(--text-muted)', fontSize: 13,
      }}>
        <div style={{ marginBottom: 12, fontWeight: 700, fontSize: 15 }}>
          Open<span style={{ color: '#818cf8' }}>Door</span>
        </div>
        <p>© 2026 OpenDoor. Built for students, by students.</p>
      </footer>
    </div>
  );
}
