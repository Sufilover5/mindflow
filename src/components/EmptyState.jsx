import { Sparkles } from 'lucide-react';
import './EmptyState.css';

export function EmptyState({ onWrite }) {
  return (
    <div className="empty-state">
      <div className="empty-icon">
        <Sparkles size={48} strokeWidth={1.5} />
      </div>
      <h2 className="empty-title">还没有记录任何念头</h2>
      <p className="empty-desc">
        每一个转瞬即逝的念头，都可能是灵感的种子。
        <br />
        开始记录你的第一道意识之光。
      </p>
      <button className="empty-btn" onClick={onWrite}>
        ✦ 记录第一个念头
      </button>
    </div>
  );
}
