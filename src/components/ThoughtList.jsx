import { ThoughtCard } from './ThoughtCard';
import { useState } from 'react';
import { ConfirmDialog } from './ConfirmDialog';
import './ThoughtList.css';

export function ThoughtList({ groupedThoughts, onDelete, onTogglePin }) {
  const [deleteId, setDeleteId] = useState(null);

  const handleConfirmDelete = () => {
    if (deleteId) {
      onDelete(deleteId);
      setDeleteId(null);
    }
  };

  if (!groupedThoughts || groupedThoughts.length === 0) return null;

  return (
    <>
      <div className="thought-list">
        {groupedThoughts.map((group) => (
          <div key={group.dateKey} className={`date-group ${group.isPinnedGroup ? 'date-group-pinned' : ''}`}>
            <div className="date-header">
              <span className={`date-line ${group.isPinnedGroup ? 'date-line-pinned' : ''}`} />
              <h2 className={`date-title ${group.isPinnedGroup ? 'date-title-pinned' : ''}`}>
                {group.dateDisplay}
              </h2>
              <span className={`date-line ${group.isPinnedGroup ? 'date-line-pinned' : ''}`} />
            </div>
            <div className="date-cards">
              {group.thoughts.map((thought, index) => (
                <div key={thought.id} style={{ '--index': index }}>
                  <ThoughtCard
                    thought={thought}
                    isPinned={thought.pinned}
                    onDelete={(id) => setDeleteId(id)}
                    onTogglePin={onTogglePin}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <ConfirmDialog
        open={!!deleteId}
        title="删除这个念头？"
        message="删除后无法恢复，确定要继续吗？"
        confirmLabel="删除"
        danger
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteId(null)}
      />
    </>
  );
}
