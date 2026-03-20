'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import {
  Compass, Activity, Sparkles, ArrowRight, Star, CheckCircle,
  Users, Clock, TrendingUp, Shield, Zap, Target, Heart, ExternalLink
} from 'lucide-react';

const features = [
  {
    icon: Compass,
    title: 'Explore Opportunities',
    desc: '30+ verified volunteering and internship listings filtered by your passion and schedule.',
    color: '#6366f1',
    className: 'bento-1',
  },
  {
    icon: Activity,
    title: 'Impact Dashboard',
    desc: 'Auto-calculate hours and track your growth toward service milestones.',
    color: '#10b981',
    className: 'bento-2',
  },
  {
    icon: Sparkles,
    title: 'Impact Portfolio Builder',
    desc: 'Turn your volunteering hours into professional summaries with AI.',
    color: '#f59e0b',
    className: 'bento-3',
  },
  {
    icon: Shield,
    title: 'Verified Records',
    desc: 'Ensure your community impact is backed by platform-verified signatures.',
    color: '#ec4899',
    className: 'bento-4',
  },
];

const stats = [
  { label: 'Verified Listings', value: '32+', icon: Compass },
  { label: 'Students Active', value: '1,400+', icon: Users },
  { label: 'Impact Hours', value: '28,000+', icon: Clock },
  { label: 'Global reach', value: '120+', icon: TrendingUp },
];

export default function LandingPage() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', overflowX: 'hidden' }}>
      {/* Premium Background Layer */}
      <div className="mesh-gradient" style={{ position: 'fixed', inset: 0, opacity: 0.6, zIndex: 0 }} />
      <div style={{ 
        position: 'fixed', inset: 0, 
        background: 'radial-gradient(circle at 50% -20%, rgba(99,102,241,0.15) 0%, transparent 70%)',
        pointerEvents: 'none', zIndex: 0 
      }} />

      <Navbar />

      <main style={{ position: 'relative', zIndex: 1 }}>
        {/* Hero Section */}
        <section style={{ padding: '120px 24px 100px', textAlign: 'center', maxWidth: 1000, margin: '0 auto' }}>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 30, padding: '8px 20px', marginBottom: 32,
              backdropFilter: 'blur(10px)',
            }}
          >
            <span style={{ fontSize: 13, color: 'var(--accent-light)', fontWeight: 600, letterSpacing: '0.04em' }}>
              <Zap size={14} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }} />
              WORLD-CLASS VOLUNTEER DISCOVERY
            </span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{ 
              fontSize: 'clamp(48px, 8vw, 84px)', 
              fontWeight: 900, 
              marginBottom: 28, 
              letterSpacing: '-0.05em', 
              lineHeight: 0.95,
              fontFamily: 'Outfit, sans-serif'
            }}
          >
            Unlock Your <span className="gradient-text">Next Opportunity.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            style={{ 
              fontSize: 'clamp(18px, 2vw, 22px)', 
              color: 'var(--text-secondary)', 
              marginBottom: 48, 
              maxWidth: 700, 
              margin: '0 auto 48px', 
              lineHeight: 1.5,
              fontWeight: 400
            }}
          >
            The best place for students to discover meaningful volunteer opportunities, track their community impact, and build a portfolio that matters.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}
          >
            <Link href="/register" className="btn-primary" style={{ padding: '18px 36px', fontSize: 17, borderRadius: 14 }}>
              Get Started for Free <ArrowRight size={20} />
            </Link>
            <Link href="/opportunities" className="btn-secondary" style={{ padding: '18px 36px', fontSize: 17, borderRadius: 14, background: 'rgba(255,255,255,0.02)' }}>
              <Compass size={20} /> Explore Listings
            </Link>
          </motion.div>

          {/* Floating Trust Badge */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            style={{ marginTop: 40, display: 'flex', justifyContent: 'center', gap: 24, fontSize: 12, color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}
          >
             <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><CheckCircle size={14} /> NO PLACEMENTS FEES</span>
             <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><CheckCircle size={14} /> VERIFIED BY SCHOOLS</span>
          </motion.div>
        </section>

        {/* Impact Bento Grid */}
        <section style={{ padding: '40px 24px 100px', maxWidth: 1200, margin: '0 auto' }}>
          <motion.div 
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={container}
            className="bento-grid"
            style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gridAutoRows: 'auto' }}
          >
            {features.map((f, i) => (
              <motion.div 
                key={f.title}
                variants={item}
                className="glass"
                style={{ 
                  padding: '40px', 
                  borderRadius: 28, 
                  display: 'flex', 
                  flexDirection: 'column', 
                  justifyContent: 'space-between',
                  minHeight: 280,
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, background: `${f.color}10`, filter: 'blur(50px)', borderRadius: '50%' }} />
                
                <div>
                  <div style={{ 
                    width: 50, height: 50, borderRadius: 15, background: `${f.color}15`, 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24,
                    border: `1px solid ${f.color}30`
                  }}>
                    <f.icon size={24} color={f.color} />
                  </div>
                  <h3 style={{ fontSize: 24, fontWeight: 800, marginBottom: 14, color: 'var(--text-primary)', fontFamily: 'Outfit' }}>{f.title}</h3>
                  <p style={{ fontSize: 16, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{f.desc}</p>
                </div>
                
                <div style={{ marginTop: 24 }}>
                   <span style={{ fontSize: 13, fontWeight: 700, color: f.color, display: 'flex', alignItems: 'center', gap: 4 }}>
                     Learn more <ExternalLink size={14} />
                   </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Global Statistics (Glass Panel) */}
        <section style={{ padding: '0 24px 120px' }}>
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-strong"
            style={{ 
              maxWidth: 1000, margin: '0 auto', padding: '60px 40px', 
              borderRadius: 32, display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
              gap: 40, textAlign: 'center'
            }}
          >
            {stats.map(({ label, value, icon: Icon }) => (
              <div key={label}>
                <div style={{ fontSize: 44, fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.03em', fontFamily: 'Outfit' }}>{value}</div>
                <div style={{ fontSize: 13, color: 'var(--accent-light)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 4 }}>{label}</div>
              </div>
            ))}
          </motion.div>
        </section>

        {/* CTA Footer */}
        <section style={{ padding: '0 24px 140px', textAlign: 'center' }}>
          <h2 style={{ fontSize: 48, fontWeight: 800, marginBottom: 24, fontFamily: 'Outfit' }}>Ready to start your <span className="gradient-text">Impact Journey?</span></h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 18, marginBottom: 40, maxWidth: 600, margin: '0 auto 40px' }}>
            Join thousands of students who are making a real difference and building global reach through OpenDoor.
          </p>
          <Link href="/register" className="btn-primary" style={{ padding: '20px 48px', fontSize: 18, borderRadius: 16 }}>
            Join OpenDoor for Free
          </Link>
        </section>
      </main>

      <footer style={{ padding: '60px 24px', position: 'relative', zIndex: 1, borderTop: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>© 2026 OpenDoor. All rights reserved.</p>
      </footer>
    </div>
  );
}
