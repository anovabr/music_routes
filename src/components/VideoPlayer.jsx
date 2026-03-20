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

// Accepts either:
//   videos={[{youtubeId, title, performer}, ...]} startIndex={n}
// or legacy:
//   youtubeId="..." title="..."
export default function VideoPlayer({ videos, startIndex = 0, youtubeId, title, composer, onVideoChange }) {
  // Normalise to an array
  const videoList = videos ?? (youtubeId ? [{ youtubeId, title }] : []);

  const [idx, setIdx] = useState(startIndex);
  const [unavailable, setUnavailable] = useState(false);

  const playerDivRef = useRef(null);
  const playerRef    = useRef(null);

  // Reset when the source changes
  useEffect(() => {
    setIdx(startIndex);
    setUnavailable(false);
  }, [videoList, startIndex]); // eslint-disable-line react-hooks/exhaustive-deps

  const current = videoList[idx];

  // Notify parent when the playing video changes
  useEffect(() => {
    if (onVideoChange && current) onVideoChange(current);
  }, [current]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!current) return;
    let cancelled = false;

    loadYTApi(() => {
      if (cancelled || !playerDivRef.current) return;
      playerRef.current = new window.YT.Player(playerDivRef.current, {
        videoId: current.youtubeId,
        playerVars: { autoplay: 1, rel: 0 },
        events: {
          onError: (e) => {
            // 100: removed/private  101/150: embedding disabled
            if (cancelled) return;
            if ([100, 101, 150].includes(e.data)) {
              try { playerRef.current?.destroy(); } catch {}
              playerRef.current = null;
              // Try next video, fall back to "unavailable" only when exhausted
              setIdx(prev => {
                const next = prev + 1;
                if (next < videoList.length) return next;
                setUnavailable(true);
                return prev;
              });
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
  }, [current?.youtubeId]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!current || unavailable) {
    const searchTitle = current?.title ?? title ?? '';
    const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(`${composer?.name ?? ''} ${searchTitle}`)}`;
    return (
      <div className="video-unavailable">
        <div className="video-unavailable-icon">▶</div>
        <p className="video-unavailable-title">{searchTitle}</p>
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
