import { useMemo } from 'react';
import { GUIDED_PATHS } from '../data/paths';
import { flatComposers } from '../data/composers';

export default function GuidedPathsModal({ onClose, onSelectComposer }) {
  const allComposers = useMemo(() => flatComposers(), []);

  const handleStartPath = (path) => {
    const first = path.composerIds
      .map(id => allComposers.find(c => c.id === id))
      .find(Boolean);
    if (first) {
      onSelectComposer(first);
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="guided-paths-modal" onClick={e => e.stopPropagation()}>
        <div className="guided-paths-header">
          <h2 className="guided-paths-title">Start Here</h2>
          <p className="guided-paths-subtitle">Choose a curated journey through classical music</p>
          <button className="guided-paths-close" onClick={onClose}>✕</button>
        </div>
        <div className="guided-paths-grid">
          {GUIDED_PATHS.map(path => {
            const composers = path.composerIds
              .map(id => allComposers.find(c => c.id === id))
              .filter(Boolean);
            return (
              <button
                key={path.id}
                className="guided-path-card"
                onClick={() => handleStartPath(path)}
              >
                <span className="guided-path-name">{path.name}</span>
                <span className="guided-path-desc">{path.description}</span>
                <span className="guided-path-composers">
                  {composers.slice(0, 4).map(c => c.name.split(' ').pop()).join(' · ')}
                  {composers.length > 4 ? ` +${composers.length - 4}` : ''}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
