import React from 'react';
import { CheckCircle2, Sparkles, Mail, BookOpen, Send } from 'lucide-react';

export default function Toast({ toasts }) {
  const getIcon = (type) => {
    switch (type) {
      case 'Mail': return <Mail size={16} color="var(--cyan)" />;
      case 'BookOpen': return <BookOpen size={16} color="#c084fc" />;
      case 'Send': return <Send size={16} color="#34d399" />;
      default: return <Sparkles size={16} color="var(--cyan)" />;
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        pointerEvents: 'none'
      }}
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="glass-card"
          style={{
            background: 'rgba(19, 25, 39, 0.95)',
            border: '1px solid var(--border-accent)',
            borderRadius: 'var(--radius-md)',
            padding: '0.85rem 1.25rem',
            color: 'var(--text-main)',
            fontSize: '0.9rem',
            boxShadow: 'var(--shadow-lg)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            animation: 'slideInToast 0.3s ease forwards',
            pointerEvents: 'auto'
          }}
        >
          {getIcon(toast.icon)}
          <span>{toast.message}</span>
        </div>
      ))}
    </div>
  );
}
