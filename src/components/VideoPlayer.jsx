import { useEffect, useRef, useState } from 'react';

let ytApiState = 'idle'; // 'idle' | 'loading' | 'ready'
const ytReadyCallbacks = [];

function loadYTApi(cb) {
  if (ytApiState === 'ready') { cb(); return; }
  ytReadyCallbacks.push(cb);
  if (ytApiState === 'idle') {
    ytApiState = 'loading';
    window.onYouTubeIframeAPIReady = () => {
      ytApiState = 'ready';
      ytReadyCallbacks.forEach(fn => fn());
      ytReadyCallbacks.length = 0;
    };
    const script = document.createElement('script');
    script.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(script);
  }
}

export default function VideoPlayer({ youtubeId, title, composer }) {
  const playerDivRef = useRef(null);
  const playerRef = useRef(null);
  const [unavailable, setUnavailable] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setUnavailable(false);
    setLoading(true);

    // Fallback: if still loading after 8 s, treat as unavailable
    const timeout = setTimeout(() => {
      if (!cancelled) setUnavailable(true);
    }, 8000);

    loadYTApi(() => {
      if (cancelled || !playerDivRef.current) return;
      playerRef.current = new window.YT.Player(playerDivRef.current, {
        videoId: youtubeId,
        playerVars: { autoplay: 1, rel: 0 },
        events: {
          onStateChange: (e) => {
            // PLAYING = 1, BUFFERING = 3 — video is actually running
            if (!cancelled && [1, 3].includes(e.data)) {
              clearTimeout(timeout);
              setLoading(false);
            }
          },
          onError: (e) => {
            // 100: video not found/removed, 101/150: embedding disabled by owner
            if (!cancelled && [100, 101, 150].includes(e.data)) {
              clearTimeout(timeout);
              try { playerRef.current?.destroy(); } catch {}
              setUnavailable(true);
            }
          },
        },
      });
    });

    return () => {
      cancelled = true;
      clearTimeout(timeout);
      try { playerRef.current?.destroy(); } catch {}
      playerRef.current = null;
    };
  }, [youtubeId]);

  const query = encodeURIComponent(`${composer?.name ?? ''} ${title}`);
  const spotifyUrl = `https://open.spotify.com/search/${query}`;
  const youtubeUrl = `https://www.youtube.com/results?search_query=${query}`;
  const appleMusicUrl = `https://music.apple.com/search?term=${query}`;

  if (unavailable) {
    return (
      <div className="video-unavailable">
        <div className="video-unavailable-icon">🎵</div>
        <p className="video-unavailable-title">{title}</p>
        <p className="video-unavailable-msg">Video unavailable — listen on:</p>
        <div className="video-unavailable-links">
          <a href={spotifyUrl} target="_blank" rel="noopener noreferrer" className="video-unavailable-link video-unavailable-link--spotify">
            Spotify
          </a>
          <a href={appleMusicUrl} target="_blank" rel="noopener noreferrer" className="video-unavailable-link video-unavailable-link--apple">
            Apple Music
          </a>
          <a href={youtubeUrl} target="_blank" rel="noopener noreferrer" className="video-unavailable-link video-unavailable-link--yt">
            YouTube
          </a>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div ref={playerDivRef} style={{ width: '100%', height: '100%' }} />
      {loading && (
        <div style={{
          position: 'absolute', inset: 0,
          background: '#000',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#888', fontSize: '13px', letterSpacing: '0.05em',
        }}>
          Loading…
        </div>
      )}
    </div>
  );
}
