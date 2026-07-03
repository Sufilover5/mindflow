import { X, Bookmark } from 'lucide-react';
import './TagBar.css';

export function TagBar({ allTags, presetTags = [], activeTags, onToggleTag, onClearAll }) {
  if (!allTags || allTags.length === 0) return null;

  const isPreset = (tag) => presetTags.includes(tag);

  return (
    <div className="tag-bar">
      <div className="tag-bar-scroll">
        {activeTags.length > 0 && (
          <button className="tag-item tag-clear" onClick={onClearAll}>
            <X size={12} />
            <span>清除筛选</span>
          </button>
        )}
        {allTags.map((tag) => {
          const isActive = activeTags.includes(tag);
          const preset = isPreset(tag);
          return (
            <button
              key={tag}
              className={`tag-item ${isActive ? 'tag-active' : ''} ${preset ? 'tag-preset' : ''}`}
              onClick={() => onToggleTag(tag)}
            >
              {preset && <Bookmark size={10} className="tag-preset-icon" />}
              {tag}
            </button>
          );
        })}
      </div>
    </div>
  );
}
