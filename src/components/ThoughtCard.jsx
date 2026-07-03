import { Link } from 'react-router-dom';
import { Trash2, Image as ImageIcon, Pin } from 'lucide-react';
import { formatTime } from '../utils/dateUtils';
import './ThoughtCard.css';

export function ThoughtCard({ thought, onDelete, onTogglePin, isPinned }) {
  const hasImages = thought.images && thought.images.length > 0;

  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete(thought.id);
  };

  const handlePin = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onTogglePin) onTogglePin(thought.id);
  };

  // 随机分配灵感色（置顶固定用金色）
  const sparkColors = ['spark-purple', 'spark-cyan', 'spark-green', 'spark-rose', 'spark-amber'];
  const sparkColor = isPinned ? 'spark-pinned' : sparkColors[thought.id.charCodeAt(0) % sparkColors.length];

  return (
    <Link to={`/write/${thought.id}`} className={`thought-card ${sparkColor} ${isPinned ? 'card-pinned' : ''}`}>
      <div className="card-glow-line" />
      <div className="card-body">
        {isPinned && (
          <div className="card-pin-badge">
            <Pin size={12} className="pin-icon-filled" />
            <span>HIGHLIGHT</span>
          </div>
        )}
        <p className="card-content">{thought.content}</p>

        {hasImages && (
          <div className="card-images">
            {thought.images.slice(0, 3).map((img) => (
              <div key={img.id} className="card-image-wrap">
                <img src={img.data} alt={img.name} loading="lazy" />
              </div>
            ))}
            {thought.images.length > 3 && (
              <div className="card-image-more">
                <ImageIcon size={16} />
                <span>+{thought.images.length - 3}</span>
              </div>
            )}
          </div>
        )}

        <div className="card-footer">
          <div className="card-tags">
            {thought.tags?.map((tag) => (
              <span key={tag} className="card-tag">{tag}</span>
            ))}
          </div>
          <span className="card-time">{formatTime(thought.createdAt)}</span>
        </div>
      </div>

      <div className="card-actions">
        {onTogglePin && (
          <button
            className={`card-action-btn ${isPinned ? 'card-action-pinned' : ''}`}
            onClick={handlePin}
            title={isPinned ? '取消置顶' : '置顶'}
          >
            <Pin size={13} />
          </button>
        )}
        <button className="card-action-btn card-action-delete" onClick={handleDelete} title="删除">
          <Trash2 size={13} />
        </button>
      </div>
    </Link>
  );
}
