import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useThoughts } from '../hooks/useThoughts';
import { TagBar } from '../components/TagBar';
import { ThoughtList } from '../components/ThoughtList';
import { EmptyState } from '../components/EmptyState';
import './HomePage.css';

export function HomePage() {
  const { groupedByDate, allTags, presetTags, deleteThought, togglePin, getFilteredGrouped } = useThoughts();
  const [activeTags, setActiveTags] = useState([]);
  const navigate = useNavigate();

  const displayGroups = useMemo(
    () => getFilteredGrouped(activeTags),
    [getFilteredGrouped, activeTags]
  );

  const toggleTag = (tag) => {
    setActiveTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const clearTags = () => setActiveTags([]);

  const handleWrite = () => navigate('/write');

  const isEmpty = groupedByDate.length === 0;

  return (
    <div className="home-page container">
      {!isEmpty && (
        <>
          <TagBar
            allTags={allTags}
            presetTags={presetTags}
            activeTags={activeTags}
            onToggleTag={toggleTag}
            onClearAll={clearTags}
          />
          <ThoughtList
            groupedThoughts={displayGroups}
            onDelete={deleteThought}
            onTogglePin={togglePin}
          />
        </>
      )}

      {isEmpty && <EmptyState onWrite={handleWrite} />}

      {!isEmpty && (
        <button className="fab-write" onClick={handleWrite} title="记录新念头">
          <span className="fab-icon">✦</span>
        </button>
      )}
    </div>
  );
}
