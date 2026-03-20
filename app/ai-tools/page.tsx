'use client';

import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { useStudent } from '@/lib/contexts/StudentContext';
import { generateResumeBullet, generateCommonAppDescription, generateActivityDescription } from '@/lib/utils/aiGenerator';
import { Sparkles, Copy, Check, Wand2, FileText, Target } from 'lucide-react';

type Tool = 'resume' | 'commonapp' | 'description';

export default function AIToolsPage() {
  const { activities, totalHours } = useStudent();
  const [activeTool, setActiveTool] = useState<Tool>('resume');
  const [selectedId, setSelectedId] = useState(activities[0]?.id || '');
  const [output, setOutput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [category, setCategory] = useState('Medical');

  const selectedActivity = activities.find(a => a.id === selectedId);

  const generate = () => {
    if (!selectedActivity) return;
    setIsGenerating(true);
    setOutput('');
    let result = '';

    if (activeTool === 'resume') {
      result = generateResumeBullet(selectedActivity.role, selectedActivity.orgName, selectedActivity.totalHours, selectedActivity.description);
    } else if (activeTool === 'commonapp') {
      result = generateCommonAppDescription(selectedActivity.role, selectedActivity.orgName, selectedActivity.totalHours, selectedActivity.description);
    } else {
      result = generateActivityDescription(selectedActivity.orgName, selectedActivity.role, selectedActivity.category);
    }

    // Simulate typing
    let i = 0;
    const interval = setInterval(() => {
      i += 3;
      setOutput(result.substring(0, i));
      if (i >= result.length) {
        clearInterval(interval);
        setIsGenerating(false);
      }
    }, 20);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tools = [
    { id: 'resume' as Tool, label: 'Resume Bullet', icon: Wand2, desc: 'Generate a polished resume bullet point', color: '#6366f1' },
    { id: 'commonapp' as Tool, label: 'Common App (150 chars)', icon: FileText, desc: '150-character Common App activity description', color: '#10b981' },
    { id: 'description' as Tool, label: 'Activity Description', icon: Target, desc: 'Rich, contextualized activity description', color: '#f59e0b' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div style={{ display: 'flex', flex: 1 }}>
        <Sidebar />
        <main style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
          <div style={{ maxWidth: 800 }}>
            <div style={{ marginBottom: 32 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)', borderRadius: 20, padding: '5px 14px', marginBottom: 12 }}>
                <Sparkles size={14} color="#818cf8" />
                <span style={{ fontSize: 12, color: '#818cf8', fontWeight: 600 }}>AI-Powered Writing Tools</span>
              </div>
              <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 6 }}>
                Impact Portfolio Builder
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>
                Translate your service experiences into professional summaries and milestone stories. Based on your {activities.length} activities and {totalHours}+ hours.
              </p>
            </div>

            {/* Tool selector */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 28 }}>
              {tools.map(({ id, label, icon: Icon, desc, color }) => (
                <button
                  key={id}
                  onClick={() => { setActiveTool(id); setOutput(''); }}
                  style={{
                    padding: '18px 14px', borderRadius: 14, border: 'none', cursor: 'pointer', textAlign: 'left',
                    background: activeTool === id ? `${color}12` : 'rgba(255,255,255,0.03)',
                    outline: activeTool === id ? `1.5px solid ${color}50` : '1px solid var(--border-subtle)',
                    transition: 'all 0.2s',
                  }}
                >
                  <Icon size={20} color={activeTool === id ? color : 'var(--text-muted)'} style={{ marginBottom: 8 }} />
                  <div style={{ fontSize: 13, fontWeight: 700, color: activeTool === id ? 'var(--text-primary)' : 'var(--text-secondary)', marginBottom: 4 }}>{label}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.4 }}>{desc}</div>
                </button>
              ))}
            </div>

            {/* Activity selector */}
            <div className="card" style={{ padding: '24px', marginBottom: 20 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 10, letterSpacing: '0.06em' }}>
                SELECT ACTIVITY TO GENERATE FROM
              </label>
              {activities.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>No activities yet. Add some first in the Activities tab.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {activities.map(a => (
                    <button
                      key={a.id}
                      onClick={() => setSelectedId(a.id)}
                      style={{
                        padding: '12px 14px', borderRadius: 10, border: 'none', cursor: 'pointer', textAlign: 'left',
                        background: selectedId === a.id ? 'rgba(99,102,241,0.1)' : 'rgba(255,255,255,0.02)',
                        outline: selectedId === a.id ? '1.5px solid var(--accent)' : '1px solid var(--border-subtle)',
                        transition: 'all 0.15s',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      }}
                    >
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{a.role}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{a.orgName} · {a.totalHours}h</div>
                      </div>
                      {selectedId === a.id && <Check size={16} color="var(--accent-light)" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Generate button */}
            <button
              onClick={generate}
              disabled={isGenerating || activities.length === 0}
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: 15, marginBottom: 20, opacity: isGenerating ? 0.7 : 1 }}
            >
              <Sparkles size={18} />
              {isGenerating ? 'Generating...' : 'Generate Content'}
            </button>

            {/* Output */}
            {(output || isGenerating) && (
              <div className="card" style={{ padding: '24px', position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.06em' }}>AI-GENERATED OUTPUT</div>
                  {output && !isGenerating && (
                    <button onClick={copyToClipboard} className="btn-secondary" style={{ padding: '6px 12px', fontSize: 12 }}>
                      {copied ? <><Check size={12} /> Copied!</> : <><Copy size={12} /> Copy</>}
                    </button>
                  )}
                </div>
                <div style={{
                  fontSize: 15, lineHeight: 1.8, color: 'var(--text-primary)',
                  background: 'rgba(99,102,241,0.04)', border: '1px solid rgba(99,102,241,0.15)',
                  borderRadius: 12, padding: '18px 20px', minHeight: 80,
                  fontFamily: activeTool === 'resume' ? 'Georgia, serif' : 'var(--font-inter)',
                }}>
                  {output}{isGenerating && <span className="typing-cursor" />}
                </div>
                {activeTool === 'commonapp' && output && (
                  <div style={{ marginTop: 10, fontSize: 12, color: output.length > 140 ? '#f59e0b' : 'var(--text-muted)' }}>
                    {output.length}/150 characters
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
