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

  useEffect(() => {
    let cancelled = false;
    setUnavailable(false);

    loadYTApi(() => {
      if (cancelled || !playerDivRef.current) return;
      playerRef.current = new window.YT.Player(playerDivRef.current, {
        videoId: youtubeId,
        playerVars: { autoplay: 1, rel: 0 },
        events: {
          onError: (e) => {
            // 100: video not found/removed, 101/150: embedding disabled by owner
            if (!cancelled && [100, 101, 150].includes(e.data)) {
              try { playerRef.current?.destroy(); } catch {}
              setUnavailable(true);
            }
          },
        },
      });
    });

    return () => {
      cancelled = true;
      try { playerRef.current?.destroy(); } catch {}
      playerRef.current = null;
    };
  }, [youtubeId]);

  const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(`${composer?.name ?? ''} ${title}`)}`;

  if (unavailable) {
    return (
      <div className="video-unavailable">
        <div className="video-unavailable-icon">▶</div>
        <p className="video-unavailable-title">{title}</p>
        <p className="video-unavailable-msg">This video is unavailable for embedding.</p>
        <a
          href={searchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="video-unavailable-link"
        >
          Search on YouTube →
        </a>
      </div>
    );
  }

  return <div ref={playerDivRef} style={{ width: '100%', height: '100%' }} />;
}
