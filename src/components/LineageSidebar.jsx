import { useMemo } from 'react';
import { PERIODS, getAncestors, getChildren } from '../data/composers';

export default function LineageSidebar({ composer, onClose, onSelectComposer, onOpenVideo }) {
  if (!composer) return null;

  const ancestors = useMemo(() => getAncestors(composer.id), [composer.id]);
  const children = useMemo(() => getChildren(composer.id), [composer.id]);

  const ComposerNode = ({ c, isSelected = false, position = 'middle' }) => {
    const period = PERIODS[c.period];
    return (
      <div
        className={`lineage-node ${isSelected ? 'selected' : ''} ${position}`}
        style={{ '--pc': period?.color }}
        onClick={() => !isSelected && onSelectComposer?.(c)}
      >
        <div className="lineage-node-accent" />
        <div className="lineage-node-content">
          <span className="lineage-node-name">{c.name}</span>
          <span className="lineage-node-dates">{c.born}–{c.died || ''}</span>
          {isSelected && c.nationality && (
            <span className="lineage-node-nat">{c.nationality}</span>
          )}
        </div>
        {isSelected && c.videos?.length > 0 && (
          <button
            className="lineage-node-play"
            onClick={(e) => { e.stopPropagation(); onOpenVideo(c.videos[0], c); }}
            title="Play"
          >
            ▶
          </button>
        )}
      </div>
    );
  };

  return (
    <aside className="lineage-sidebar">
      <div className="lineage-header">
        <h3 className="lineage-title">Lineage Tree</h3>
        <button className="lineage-close" onClick={onClose} aria-label="Close">✕</button>
      </div>

      <div className="lineage-tree">
        {/* Ancestors (teachers) - top to bottom */}
        {ancestors.length > 0 && (
          <div className="lineage-section ancestors">
            <div className="lineage-label">Teachers / Influences</div>
            {ancestors.map((a, i) => (
              <div key={a.id} className="lineage-item">
                <ComposerNode c={a} position="ancestor" />
                <div className="lineage-connector down" />
              </div>
            ))}
          </div>
        )}

        {/* Selected composer - center */}
        <div className="lineage-section current">
          <ComposerNode c={composer} isSelected position="current" />
        </div>

        {/* Children (students) - top to bottom */}
        {children.length > 0 && (
          <div className="lineage-section children">
            <div className="lineage-connector-branch">
              {children.map((_, i) => (
                <div key={i} className="branch-line" />
              ))}
            </div>
            <div className="lineage-label">Students / Influenced</div>
            <div className="lineage-children-grid">
              {children.map((c) => (
                <div key={c.id} className="lineage-item child">
                  <div className="lineage-connector up" />
                  <ComposerNode c={c} position="child" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Description at bottom */}
      {composer.description && (
        <div className="lineage-description">
          <p>{composer.description}</p>
        </div>
      )}
    </aside>
  );
}
