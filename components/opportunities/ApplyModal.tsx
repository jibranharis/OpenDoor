'use client';

import { useState } from 'react';
import { useStudent } from '@/lib/contexts/StudentContext';
import { useAuth } from '@/lib/contexts/AuthContext';
import { opportunities } from '@/lib/data/opportunities';
import { X, Send } from 'lucide-react';

interface Props {
  opportunity: { id: string; title: string; organization: string };
  onClose: () => void;
}

export default function ApplyModal({ opportunity, onClose }: Props) {
  const { addApplication } = useStudent();
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addApplication({
      id: Date.now().toString(),
      opportunityId: opportunity.id,
      opportunityTitle: opportunity.title,
      organization: opportunity.organization,
      appliedDate: new Date().toISOString().split('T')[0],
      status: 'Applied',
      message,
    });
    setSubmitted(true);
    setTimeout(() => { onClose(); }, 2000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="glass-strong"
        style={{ borderRadius: 20, padding: 36, maxWidth: 480, width: '100%', position: 'relative' }}
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
          <X size={20} />
        </button>

        {submitted ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
            <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>Application Sent!</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
              Your application to <strong>{opportunity.organization}</strong> has been submitted. Track it in Applications.
            </p>
          </div>
        ) : (
          <>
            <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 4 }}>Apply to Opportunity</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 24 }}>
              {opportunity.title} · {opportunity.organization}
            </p>

            {/* Profile preview */}
            {user && (
              <div style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid var(--border)', borderRadius: 12, padding: '14px 16px', marginBottom: 20 }}>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4, fontWeight: 600 }}>APPLYING AS</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{user.name}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{user.email}</div>
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>
                  Why are you interested? (Optional)
                </label>
                <textarea
                  className="input"
                  style={{ minHeight: 110, resize: 'vertical' }}
                  placeholder="I am interested in this opportunity because..."
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                />
              </div>
              <button type="submit" className="btn-primary" style={{ justifyContent: 'center', padding: '13px', fontSize: 15 }}>
                <Send size={16} /> Submit Application
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
