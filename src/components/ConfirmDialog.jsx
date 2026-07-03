import { X } from 'lucide-react';
import { useEffect, useRef } from 'react';
import './ConfirmDialog.css';

export function ConfirmDialog({ open, title, message, onConfirm, onCancel, confirmLabel = '确认', danger = false }) {
  const overlayRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handleEsc = (e) => { if (e.key === 'Escape') onCancel(); };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div className="dialog-overlay" ref={overlayRef} onClick={(e) => { if (e.target === overlayRef.current) onCancel(); }}>
      <div className="dialog">
        <button className="dialog-close" onClick={onCancel}><X size={18} /></button>
        <h3 className="dialog-title">{title}</h3>
        {message && <p className="dialog-message">{message}</p>}
        <div className="dialog-actions">
          <button className="dialog-btn dialog-btn-cancel" onClick={onCancel}>取消</button>
          <button
            className={`dialog-btn dialog-btn-confirm ${danger ? 'dialog-btn-danger' : ''}`}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
