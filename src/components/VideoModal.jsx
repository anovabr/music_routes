import { useEffect } from 'react';

export default function VideoModal({ video, composer, onClose }) {
  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  if (!video) return null;

  const embedUrl = `https://www.youtube.com/embed/${video.youtubeId}?autoplay=1&rel=0&modestbranding=1`;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            {composer && (
              <span className="modal-composer">{composer.name}</span>
            )}
            <h3 className="modal-title">{video.title}</h3>
            {video.performer && (
              <span className="modal-performer">performed by {video.performer}</span>
            )}
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <div className="modal-video-wrapper">
          <iframe
            src={embedUrl}
            title={video.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        <div className="modal-footer">
          <span className="modal-note">
            ♪ Music opens in YouTube if embedding is restricted
          </span>
          <a
            href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="modal-yt-link"
          >
            Open in YouTube ↗
          </a>
        </div>
      </div>
    </div>
  );
}
