import { useMemo } from 'react';
import { PERIODS, getAncestors, getChildren } from '../data/composers';

export default function ComposerPanel({ composer, onClose, onOpenVideo, onSelectComposer }) {
  if (!composer) return null;

  const period = PERIODS[composer.period];
  const lifespan = composer.died
    ? `${composer.born}–${composer.died}`
    : `${composer.born}–`;
  const age = composer.died
    ? composer.died - composer.born
    : new Date().getFullYear() - composer.born;

  const ancestors = useMemo(() => getAncestors(composer.id), [composer.id]);
  const children = useMemo(() => getChildren(composer.id), [composer.id]);

  return (
    <aside className="composer-panel">
      <button className="panel-close" onClick={onClose} aria-label="Close">✕</button>

      {/* Period badge */}
      <div className="panel-period-badge" style={{ '--pc': period?.color }}>
        {period?.name}
      </div>

      {/* Name */}
      <h2 className="panel-name">{composer.name}</h2>
      <div className="panel-meta">
        <span className="panel-life">{lifespan}</span>
        <span className="panel-age">({age} years)</span>
        {composer.nationality && (
          <span className="panel-nationality">{composer.nationality}</span>
        )}
      </div>

      {/* Description */}
      {composer.description && (
        <p className="panel-description">{composer.description}</p>
      )}

      {/* Lineage - Teachers (Ancestors) */}
      {ancestors.length > 0 && (
        <div className="panel-lineage">
          <h3 className="panel-lineage-title">
            <span className="lineage-icon">👨‍🏫</span> Teachers / Influences
          </h3>
          <div className="panel-lineage-list">
            {ancestors.map(a => (
              <button
                key={a.id}
                className="panel-lineage-item"
                style={{ '--lc': PERIODS[a.period]?.color }}
                onClick={() => onSelectComposer?.(a)}
              >
                <span className="lineage-dot" />
                <span className="lineage-name">{a.name}</span>
                <span className="lineage-dates">{a.born}–{a.died || ''}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Lineage - Students (Children) */}
      {children.length > 0 && (
        <div className="panel-lineage">
          <h3 className="panel-lineage-title">
            <span className="lineage-icon">🎓</span> Students / Influenced
          </h3>
          <div className="panel-lineage-list">
            {children.map(c => (
              <button
                key={c.id}
                className="panel-lineage-item"
                style={{ '--lc': PERIODS[c.period]?.color }}
                onClick={() => onSelectComposer?.(c)}
              >
                <span className="lineage-dot" />
                <span className="lineage-name">{c.name}</span>
                <span className="lineage-dates">{c.born}–{c.died || ''}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Videos */}
      {composer.videos?.length > 0 && (
        <div className="panel-videos">
          <h3 className="panel-videos-title">
            <span className="gold">♪</span> Selected Works
          </h3>
          <div className="panel-video-list">
            {composer.videos.map((v, i) => (
              <button
                key={i}
                className="panel-video-item"
                onClick={() => onOpenVideo(v, composer)}
              >
                <span className="video-play-btn">▶</span>
                <span className="video-info">
                  <span className="video-title">{v.title}</span>
                  {v.performer && (
                    <span className="video-performer">{v.performer}</span>
                  )}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}
