import { PERIODS } from '../data/composers';

export default function ComposerPanel({ composer, onClose, onOpenVideo }) {
  if (!composer) return null;

  const period = PERIODS[composer.period];
  const lifespan = composer.died
    ? `${composer.born}–${composer.died}`
    : `${composer.born}–`;
  const age = composer.died
    ? composer.died - composer.born
    : new Date().getFullYear() - composer.born;

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
