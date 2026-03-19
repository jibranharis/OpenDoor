'use client';

import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { useStudent, type Activity } from '@/lib/contexts/StudentContext';
import { Plus, Pencil, Trash2, Clock, X, Check } from 'lucide-react';

const categoryOptions = ['Medical', 'Education', 'STEM', 'Nonprofit', 'Business', 'Arts', 'Environment', 'Community', 'Athletics', 'Other'];

const categoryColors: Record<string, string> = {
  Medical: '#ef4444', Nonprofit: '#10b981', Education: '#3b82f6',
  Business: '#f59e0b', STEM: '#8b5cf6', Arts: '#ec4899',
  Environment: '#22c55e', Community: '#06b6d4', Athletics: '#f97316', Other: '#6b7280',
};

const emptyForm = (): Omit<Activity, 'id'> => ({
  orgName: '', role: '', description: '', category: 'Medical',
  hoursPerWeek: 2, totalHours: 20, startDate: '', endDate: '', isOngoing: true,
});

export default function ActivitiesPage() {
  const { activities, addActivity, editActivity, deleteActivity, totalHours } = useStudent();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm());

  const handleSave = () => {
    if (editingId) {
      editActivity(editingId, form);
    } else {
      addActivity(form);
    }
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm());
  };

  const handleEdit = (a: Activity) => {
    setForm({ orgName: a.orgName, role: a.role, description: a.description, category: a.category, hoursPerWeek: a.hoursPerWeek, totalHours: a.totalHours, startDate: a.startDate, endDate: a.endDate, isOngoing: a.isOngoing });
    setEditingId(a.id);
    setShowForm(true);
  };

  const f = (key: keyof typeof form, val: string | number | boolean) =>
    setForm(prev => ({ ...prev, [key]: val }));

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div style={{ display: 'flex', flex: 1 }}>
        <Sidebar />
        <main style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
            <div>
              <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 4 }}>My Activities</h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
                {activities.length} activities · <span style={{ color: 'var(--accent-light)', fontWeight: 700 }}>{totalHours} total hours</span>
              </p>
            </div>
            <button onClick={() => { setShowForm(true); setEditingId(null); setForm(emptyForm()); }} className="btn-primary" style={{ padding: '10px 18px' }}>
              <Plus size={16} /> Add Activity
            </button>
          </div>

          {/* Activity form modal */}
          {showForm && (
            <div className="modal-overlay" onClick={() => setShowForm(false)}>
              <div className="glass-strong" style={{ borderRadius: 20, padding: 36, maxWidth: 520, width: '100%', position: 'relative' }} onClick={e => e.stopPropagation()}>
                <button onClick={() => setShowForm(false)} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                  <X size={20} />
                </button>
                <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 24 }}>{editingId ? 'Edit Activity' : 'Add New Activity'}</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div>
                      <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 5, fontWeight: 600 }}>ORGANIZATION</label>
                      <input className="input" value={form.orgName} onChange={e => f('orgName', e.target.value)} placeholder="Org name" />
                    </div>
                    <div>
                      <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 5, fontWeight: 600 }}>YOUR ROLE</label>
                      <input className="input" value={form.role} onChange={e => f('role', e.target.value)} placeholder="Volunteer, Captain..." />
                    </div>
                  </div>
                  <div>
                    <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 5, fontWeight: 600 }}>DESCRIPTION</label>
                    <textarea className="input" value={form.description} onChange={e => f('description', e.target.value)} placeholder="Describe what you did..." style={{ minHeight: 80 }} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                    <div>
                      <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 5, fontWeight: 600 }}>CATEGORY</label>
                      <select className="input" value={form.category} onChange={e => f('category', e.target.value)}>
                        {categoryOptions.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 5, fontWeight: 600 }}>HRS/WEEK</label>
                      <input className="input" type="number" min={1} value={form.hoursPerWeek} onChange={e => f('hoursPerWeek', Number(e.target.value))} />
                    </div>
                    <div>
                      <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 5, fontWeight: 600 }}>TOTAL HOURS</label>
                      <input className="input" type="number" min={1} value={form.totalHours} onChange={e => f('totalHours', Number(e.target.value))} />
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div>
                      <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 5, fontWeight: 600 }}>START DATE</label>
                      <input className="input" type="date" value={form.startDate} onChange={e => f('startDate', e.target.value)} />
                    </div>
                    <div>
                      <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 5, fontWeight: 600 }}>END DATE</label>
                      <input className="input" type="date" value={form.endDate} onChange={e => f('endDate', e.target.value)} disabled={form.isOngoing} />
                    </div>
                  </div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: 'var(--text-secondary)' }}>
                    <input type="checkbox" checked={form.isOngoing} onChange={e => f('isOngoing', e.target.checked)} />
                    Currently ongoing
                  </label>
                  <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                    <button onClick={() => setShowForm(false)} className="btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>Cancel</button>
                    <button onClick={handleSave} className="btn-primary" style={{ flex: 2, justifyContent: 'center' }}>
                      <Check size={15} /> Save Activity
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Activities list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {activities.length === 0 && (
              <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--text-muted)' }}>
                <Clock size={48} style={{ margin: '0 auto 14px', opacity: 0.2 }} />
                <p style={{ fontSize: 16, marginBottom: 16 }}>No activities yet. Add your first one!</p>
                <button onClick={() => setShowForm(true)} className="btn-primary" style={{ padding: '10px 20px' }}>
                  <Plus size={15} /> Add Activity
                </button>
              </div>
            )}
            {activities.map(a => {
              const color = categoryColors[a.category] || '#6366f1';
              return (
                <div key={a.id} className="card" style={{ padding: '20px', display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: `${color}18`, border: `1px solid ${color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ fontSize: 20 }}>
                      {a.category === 'Medical' ? '🏥' : a.category === 'Education' ? '📚' : a.category === 'STEM' ? '🔬' :
                        a.category === 'Nonprofit' ? '❤️' : a.category === 'Business' ? '💼' : a.category === 'Arts' ? '🎨' :
                          a.category === 'Environment' ? '🌍' : a.category === 'Community' ? '🤝' : '⭐'}
                    </span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10, marginBottom: 6 }}>
                      <div>
                        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 2 }}>{a.role}</h3>
                        <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{a.orgName}</p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: 18, fontWeight: 900, color, letterSpacing: '-0.02em' }}>{a.totalHours}h</div>
                          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{a.hoursPerWeek}h/wk</div>
                        </div>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button onClick={() => handleEdit(a)} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: '6px', cursor: 'pointer', color: 'var(--text-muted)' }}>
                            <Pencil size={14} />
                          </button>
                          <button onClick={() => deleteActivity(a.id)} style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, padding: '6px', cursor: 'pointer', color: '#ef4444' }}>
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                    <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 10 }}>{a.description}</p>
                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                      <span className="tag" style={{ background: `${color}12`, color, border: `1px solid ${color}25` }}>{a.category}</span>
                      <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                        {a.startDate} — {a.isOngoing ? 'Present' : a.endDate || '—'}
                      </span>
                      {a.isOngoing && (
                        <span className="badge" style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981', border: '1px solid rgba(16,185,129,0.2)' }}>
                          ● Ongoing
                        </span>
                      )}
                    </div>
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
