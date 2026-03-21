import { useState, useMemo, useCallback, useEffect, useRef, memo } from 'react';
import { PERIODS, buildLineageTree, countDescendants, getWikipediaName } from '../data/composers';

function expandPath(node, targetId, ids) {
  if (!node) return false;
  if (node.id === targetId) { ids.add(node.id); return true; }
  if (node.children) {
    for (const child of node.children) {
      if (expandPath(child, targetId, ids)) { ids.add(node.id); return true; }
    }
  }
  return false;
}

const TreeNode = memo(function TreeNode({ node, selectedId, ancestorIds, expandedIds, onToggle, onSelect, onOpenVideo, depth = 0 }) {
  if (!node || !node.period) return null;

  const period = PERIODS[node.period];
  const isSelected = node.id === selectedId;
  const isAncestor = ancestorIds.has(node.id) && !isSelected;
  const isSibling = !!node.isSibling;
  const isExpanded = expandedIds.has(node.id);
  const children = node.children?.filter(c => c.period) || [];
  const hasChildren = children.length > 0;

  const handleBoxClick = () => {
    onSelect(node);
    if (hasChildren && !isSibling) onToggle(node.id);
  };

  return (
    <div className={`tree-node-wrapper ${depth === 0 ? 'root' : ''} ${isSibling ? 'is-sibling' : ''}`} style={{ '--depth': depth }}>
      <div
        className={`tree-node ${isSelected ? 'selected is-selected' : ''} ${isAncestor ? 'is-ancestor' : ''} ${hasChildren ? 'expandable' : ''}`}
        style={{ '--pc': period?.color }}
      >
        <div className="tree-node-body" onClick={handleBoxClick}>
          <div className="tree-node-accent" />
          <span className="tree-node-name">{node.name}</span>
          <span className="tree-node-dates">{node.born}–{node.died || ''}</span>
          {isSelected && node.videos?.length > 0 && (
            <button
              className="tree-node-play"
              onClick={(e) => { e.stopPropagation(); onOpenVideo(node.videos[0], node); }}
              title="Play"
            >
              ▶
            </button>
          )}
        </div>
      </div>

      {hasChildren && isExpanded && (
        <div className="tree-children-container">
          <div className="tree-connector-vertical" style={{ '--pc': period?.color }} />
          {children.length > 1 && (
            <div className="tree-connector-horizontal" style={{ '--pc': period?.color }} />
          )}
          <div className={`tree-children ${children.length > 1 ? 'siblings' : ''}`}>
            {children.map((child) => (
              <div key={child.id} className="tree-child-wrapper">
                {children.length > 1 && (
                  <div className={`tree-connector-down${child.isSibling ? ' is-sibling' : ''}`} style={{ '--pc': PERIODS[child.period]?.color }} />
                )}
                <TreeNode
                  node={child}
                  selectedId={selectedId}
                  ancestorIds={ancestorIds}
                  expandedIds={expandedIds}
                  onToggle={onToggle}
                  onSelect={onSelect}
                  onOpenVideo={onOpenVideo}
                  depth={depth + 1}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});

// ── Wikipedia quick-peek hook ──────────────────────────────────────────────────
const wikiCache = {};

function useWikipedia(composer) {
  const [wiki, setWiki] = useState(null);
  const [wikiLoading, setWikiLoading] = useState(false);
  const [wikiError, setWikiError] = useState(false);

  useEffect(() => {
    if (!composer) { setWiki(null); setWikiError(false); return; }

    // Cache hit
    if (wikiCache[composer.id] !== undefined) {
      setWiki(wikiCache[composer.id]);
      setWikiLoading(false);
      setWikiError(false);
      return;
    }

    setWiki(null);
    setWikiError(false);
    setWikiLoading(true);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const name = getWikipediaName(composer);

    fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(name)}`, { signal: controller.signal })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        clearTimeout(timeout);
        if (data?.extract) {
          let text = data.extract;
          if (text.length > 240) {
            const cut = text.lastIndexOf('.', 240);
            text = cut > 60 ? text.slice(0, cut + 1) : text.slice(0, 240) + '…';
          }
          const result = { text, url: data.content_urls?.desktop?.page };
          wikiCache[composer.id] = result;
          setWiki(result);
        } else {
          wikiCache[composer.id] = null;
          setWiki(null);
        }
      })
      .catch(err => {
        clearTimeout(timeout);
        if (err.name !== 'AbortError') setWikiError(true);
      })
      .finally(() => setWikiLoading(false));

    return () => { clearTimeout(timeout); controller.abort(); };
  }, [composer?.id]);

  return { wiki, wikiLoading, wikiError };
}

// ── Build ordered path (root → selected) for lineage play ─────────────────────
function buildLineagePath(lineageTree, targetId) {
  const path = [];
  function walk(node) {
    if (!node?.period) return false;
    if (node.id === targetId) { path.push(node); return true; }
    if (node.children) {
      for (const child of node.children) {
        if (walk(child)) { path.unshift(node); return true; }
      }
    }
    return false;
  }
  walk(lineageTree);
  return path.filter(c => c.videos?.length > 0);
}

export default function LineageSidebar({ composer, onClose, onSelectComposer, onOpenVideo, activeVideo, onCloseVideo }) {
  const [width, setWidth] = useState(500);
  const [bottomHeight, setBottomHeight] = useState(240);
  const isResizing = useRef(false);
  const isResizingBottom = useRef(false);
  const resizeBottomStartY = useRef(0);
  const resizeBottomStartH = useRef(0);
  const sidebarRef = useRef(null);

  const [zoom, setZoomState] = useState(1);
  const zoomRef = useRef(1);
  const setZoom = useCallback((v) => {
    const next = typeof v === 'function' ? v(zoomRef.current) : v;
    const clamped = Math.max(0.12, Math.min(3, next));
    zoomRef.current = clamped;
    setZoomState(clamped);
    return clamped;
  }, []);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const treeContainerRef = useRef(null);
  const isPanning = useRef(false);
  const panStart = useRef({ x: 0, y: 0 });
  const panOrigin = useRef({ x: 0, y: 0 });
  const lastPinchDist = useRef(null);
  const lastPinchMid = useRef({ x: 0, y: 0 });

  // Lineage play state
  const [lineagePlaying, setLineagePlaying] = useState(false);
  const [lineageIndex, setLineageIndex] = useState(0);

  // Video bar fold state
  const [videoFolded, setVideoFolded] = useState(false);

  // Info panel fold state — collapsed by default on mobile
  const isMobile = () => window.innerWidth <= 1024;
  const [infoFolded, setInfoFolded] = useState(() => isMobile());

  const lineageTree = useMemo(() => composer ? buildLineageTree(composer.id) : null, [composer?.id]);

  const lineagePath = useMemo(
    () => lineageTree && composer ? buildLineagePath(lineageTree, composer.id) : [],
    [lineageTree, composer?.id]
  );

  const ancestorIds = useMemo(() => {
    if (!lineageTree || !composer) return new Set();
    const ids = new Set();
    function findPath(node) {
      if (!node || !node.period) return false;
      if (node.id === composer.id) { ids.add(node.id); return true; }
      if (node.children) {
        for (const child of node.children) {
          if (findPath(child)) { ids.add(node.id); return true; }
        }
      }
      return false;
    }
    findPath(lineageTree);
    return ids;
  }, [lineageTree, composer?.id]);

  const [expandedIds, setExpandedIds] = useState(() => {
    if (!composer) return new Set();
    const ids = new Set();
    if (lineageTree) expandPath(lineageTree, composer.id, ids);
    return ids;
  });

  useEffect(() => {
    if (!composer) { setExpandedIds(new Set()); setPan({ x: 0, y: 0 }); return; }
    const ids = new Set();
    if (lineageTree) expandPath(lineageTree, composer.id, ids);
    setExpandedIds(ids);
    setPan({ x: 0, y: 0 });
    setLineagePlaying(false);
    setLineageIndex(0);
  }, [composer?.id, lineageTree]);

  // After the tree renders, center the selected node so parents sit above and children below
  useEffect(() => {
    if (!composer?.id) return;
    const timer = setTimeout(() => {
      const container = treeContainerRef.current;
      if (!container) return;
      const selectedEl = container.querySelector('.tree-node.is-selected');
      if (!selectedEl) return;
      const containerRect = container.getBoundingClientRect();
      const nodeRect = selectedEl.getBoundingClientRect();
      const dx = containerRect.left + containerRect.width  / 2 - (nodeRect.left + nodeRect.width  / 2);
      const dy = containerRect.top  + containerRect.height * 0.35 - (nodeRect.top  + nodeRect.height / 2);
      setPan(p => ({ x: p.x + dx, y: p.y + dy }));
    }, 60);
    return () => clearTimeout(timer);
  }, [composer?.id]);

  // Reset fold whenever a new video opens
  useEffect(() => { setVideoFolded(false); }, [activeVideo?.video?.youtubeId]);

  // Reset info fold whenever the selected composer changes
  useEffect(() => { setInfoFolded(isMobile()); }, [composer?.id]);

  const { wiki, wikiLoading, wikiError } = useWikipedia(composer);

  const influenceCount = useMemo(
    () => composer ? countDescendants(composer.id) : 0,
    [composer?.id]
  );

  // Lineage play handlers
  const handlePlayLineage = useCallback(() => {
    if (!lineagePath.length) return;
    setLineagePlaying(true);
    setLineageIndex(0);
    onOpenVideo(lineagePath[0].videos[0], lineagePath[0]);
  }, [lineagePath, onOpenVideo]);

  const handleLineageNext = useCallback(() => {
    const next = lineageIndex + 1;
    if (next < lineagePath.length) {
      setLineageIndex(next);
      onOpenVideo(lineagePath[next].videos[0], lineagePath[next]);
    } else {
      setLineagePlaying(false);
    }
  }, [lineageIndex, lineagePath, onOpenVideo]);

  const handleLineageStop = useCallback(() => {
    setLineagePlaying(false);
    onCloseVideo();
  }, [onCloseVideo]);

  const handleMouseDown = useCallback((e) => {
    isResizing.current = true;
    document.body.style.cursor = 'ew-resize';
    document.body.style.userSelect = 'none';
    e.preventDefault();
  }, []);

  const handleBottomResizeMouseDown = useCallback((e) => {
    isResizingBottom.current = true;
    resizeBottomStartY.current = e.clientY;
    resizeBottomStartH.current = bottomHeight;
    document.body.style.cursor = 'ns-resize';
    document.body.style.userSelect = 'none';
    e.preventDefault();
    e.stopPropagation();
  }, [bottomHeight]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isResizing.current) {
        setWidth(Math.max(200, window.innerWidth - e.clientX));
      }
      if (isResizingBottom.current) {
        const dy = resizeBottomStartY.current - e.clientY;
        setBottomHeight(Math.max(120, Math.min(600, resizeBottomStartH.current + dy)));
      }
    };
    const handleMouseUp = () => {
      isResizing.current = false;
      isResizingBottom.current = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const handleToggle = useCallback((id) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }, []);

  const handleExpandAll = useCallback(() => {
    const ids = new Set();
    function walk(node) {
      if (node?.period) ids.add(node.id);
      node?.children?.forEach(walk);
    }
    walk(lineageTree);
    setExpandedIds(ids);
  }, [lineageTree]);

  const handleCollapseAll = useCallback(() => {
    if (!composer) return;
    const ids = new Set();
    if (lineageTree) expandPath(lineageTree, composer.id, ids);
    setExpandedIds(ids);
  }, [composer?.id, lineageTree]);

  const handleZoomIn    = useCallback(() => setZoom(z => z + 0.15), [setZoom]);
  const handleZoomOut   = useCallback(() => setZoom(z => z - 0.15), [setZoom]);
  const handleZoomReset = useCallback(() => { setZoom(1); setPan({ x: 0, y: 0 }); }, [setZoom]);

  const handleFitAll = useCallback(() => {
    const container = treeContainerRef.current;
    if (!container) return;
    const inner = container.querySelector('.lineage-tree-inner');
    if (!inner) return;
    const saved = inner.style.transform;
    inner.style.transform = 'none';
    const iRect = inner.getBoundingClientRect();
    const cRect = container.getBoundingClientRect();
    inner.style.transform = saved;
    if (!iRect.width || !iRect.height) return;
    const newZoom = setZoom(Math.min((cRect.width - 32) / iRect.width, (cRect.height - 32) / iRect.height));
    setPan({
      x: (cRect.width  - iRect.width  * newZoom) / 2,
      y: (cRect.height - iRect.height * newZoom) / 2,
    });
  }, [setZoom]);

  const handleWheelRef = useRef(null);
  handleWheelRef.current = (e) => {
    e.preventDefault();
    const container = treeContainerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const delta = e.deltaY > 0 ? -0.12 : 0.12;
    const oldZoom = zoomRef.current;
    const newZoom = setZoom(oldZoom + delta);
    const scale = newZoom / oldZoom;
    setPan(p => ({ x: mouseX - scale * (mouseX - p.x), y: mouseY - scale * (mouseY - p.y) }));
  };

  useEffect(() => {
    const container = treeContainerRef.current;
    if (!container) return;
    const onWheel = (e) => handleWheelRef.current(e);
    container.addEventListener('wheel', onWheel, { passive: false });
    return () => container.removeEventListener('wheel', onWheel);
  }, []);

  const handlePanStart = useCallback((e) => {
    if (e.button !== 0) return;
    if (e.target.closest('.tree-node-body') || e.target.closest('.tree-node-play')) return;
    isPanning.current = true;
    panStart.current = { x: e.clientX, y: e.clientY };
    panOrigin.current = { ...pan };
    e.currentTarget.style.cursor = 'grabbing';
    e.preventDefault();
  }, [pan]);

  const handlePanMove = useCallback((e) => {
    if (!isPanning.current) return;
    setPan({ x: panOrigin.current.x + (e.clientX - panStart.current.x), y: panOrigin.current.y + (e.clientY - panStart.current.y) });
  }, []);

  const handlePanEnd = useCallback(() => {
    if (isPanning.current) {
      isPanning.current = false;
      if (treeContainerRef.current) treeContainerRef.current.style.cursor = 'grab';
    }
  }, []);

  const handleTouchStart = useCallback((e) => {
    if (e.touches.length === 2) {
      isPanning.current = false;
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      lastPinchDist.current = Math.hypot(dx, dy);
      lastPinchMid.current = {
        x: (e.touches[0].clientX + e.touches[1].clientX) / 2,
        y: (e.touches[0].clientY + e.touches[1].clientY) / 2,
      };
      return;
    }
    if (e.touches.length !== 1) return;
    const t = e.touches[0];
    isPanning.current = true;
    panStart.current = { x: t.clientX, y: t.clientY };
    panOrigin.current = { ...pan };
  }, [pan]);

  const handleTouchMove = useCallback((e) => {
    if (e.touches.length === 2 && lastPinchDist.current !== null) {
      e.preventDefault();
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const newDist = Math.hypot(dx, dy);
      const container = treeContainerRef.current;
      const rect = container?.getBoundingClientRect();
      const midX = (e.touches[0].clientX + e.touches[1].clientX) / 2 - (rect?.left ?? 0);
      const midY = (e.touches[0].clientY + e.touches[1].clientY) / 2 - (rect?.top ?? 0);
      const oldZoom = zoomRef.current;
      const newZoom = setZoom(oldZoom * (newDist / lastPinchDist.current));
      const scale = newZoom / oldZoom;
      setPan(p => ({ x: midX - scale * (midX - p.x), y: midY - scale * (midY - p.y) }));
      lastPinchDist.current = newDist;
      return;
    }
    if (!isPanning.current || e.touches.length !== 1) return;
    const t = e.touches[0];
    setPan({ x: panOrigin.current.x + (t.clientX - panStart.current.x), y: panOrigin.current.y + (t.clientY - panStart.current.y) });
  }, [setZoom]);

  const handleTouchEnd = useCallback((e) => {
    if (e.touches.length < 2) lastPinchDist.current = null;
    if (e.touches.length === 0) isPanning.current = false;
  }, []);

  const spotifyUrl = composer
    ? `https://open.spotify.com/search/${encodeURIComponent(composer.name)}`
    : null;

  const videoSearchQuery = activeVideo
    ? `${activeVideo.composer?.name ?? ''} ${activeVideo.video?.title ?? ''}`.trim()
    : '';
  const encodedVideoQuery = encodeURIComponent(videoSearchQuery);
  const videoSpotifyUrl  = `https://open.spotify.com/search/${encodedVideoQuery}`;
  const videoAppleUrl    = `https://music.apple.com/search?term=${encodedVideoQuery}`;

  return (
    <aside className={`lineage-sidebar${activeVideo ? ' has-active-video' : ''}`} ref={sidebarRef} style={{ width, flex: 'none' }}>
      <div className="lineage-resize-handle" onMouseDown={handleMouseDown} />

      <div className="lineage-header">
        <div className="lineage-header-left">
          <h3 className="lineage-title">Lineage Tree</h3>
          {composer && influenceCount > 0 && (
            <span className="influence-badge" title={`${influenceCount} musical descendants`}>
              {influenceCount} influenced
            </span>
          )}
        </div>
        {composer && (
          <div className="lineage-controls">
            <button onClick={handleZoomOut} title="Zoom out">−</button>
            <span className="zoom-level" onClick={handleZoomReset} title="Reset view">{Math.round(zoom * 100)}%</span>
            <button onClick={handleZoomIn} title="Zoom in">+</button>
            <button onClick={handleFitAll} title="Fit entire tree in view">⤢</button>
            <button onClick={handleExpandAll} title="Expand all">⊞</button>
            <button onClick={handleCollapseAll} title="Collapse">⊟</button>
            <button className="lineage-close" onClick={onClose} aria-label="Close">✕</button>
          </div>
        )}
      </div>

      {/* Lineage play progress bar */}
      {lineagePlaying && (
        <div className="lineage-play-bar">
          <span className="lineage-play-info">
            Playing lineage: <strong>{lineagePath[lineageIndex]?.name}</strong>
            <span className="lineage-play-step"> ({lineageIndex + 1}/{lineagePath.length})</span>
          </span>
          <div className="lineage-play-actions">
            {lineageIndex + 1 < lineagePath.length && (
              <button onClick={handleLineageNext}>Next ›</button>
            )}
            <button onClick={handleLineageStop}>Stop</button>
          </div>
        </div>
      )}

      {lineageTree ? (
        <div
          className="lineage-tree"
          ref={treeContainerRef}
          onMouseDown={handlePanStart}
          onMouseMove={handlePanMove}
          onMouseUp={handlePanEnd}
          onMouseLeave={handlePanEnd}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{ touchAction: 'none' }}
        >
          <div
            className="lineage-tree-inner"
            style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, transformOrigin: 'top center' }}
          >
            <TreeNode
              node={lineageTree}
              selectedId={composer?.id}
              ancestorIds={ancestorIds}
              expandedIds={expandedIds}
              onToggle={handleToggle}
              onSelect={(node) => { onSelectComposer(node); onCloseVideo(); }}
              onOpenVideo={onOpenVideo}
            />
          </div>
        </div>
      ) : (
        <div className="lineage-empty">
          <span className="lineage-empty-icon">🎼</span>
          <p>Select a composer to see their lineage</p>
        </div>
      )}

      {/* Bottom panel — video, description, Wikipedia, streaming */}
      {composer && (
        <div
          className={`lineage-bottom ${activeVideo ? 'has-video' : ''}`}
          style={activeVideo ? { height: bottomHeight } : undefined}
        >
          <div className="lineage-bottom-resize-handle" onMouseDown={handleBottomResizeMouseDown} />
          {activeVideo ? (
            <div className="lineage-video-section">
              <div className="lineage-video-header">
                <span className="lineage-video-playing">▶ {activeVideo.video.title}</span>
                <button
                  className="lineage-video-close-btn"
                  onClick={onCloseVideo}
                  title="Close player"
                >✕</button>
              </div>
              <div className="lineage-video-body">
                <div className="lineage-video-pane-left">
                  <iframe
                    src={`https://www.youtube.com/embed?listType=search&list=${encodedVideoQuery}&autoplay=1&rel=0`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={activeVideo.video.title}
                    style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
                  />
                </div>
                <div className="lineage-video-pane-right">
                  <span className="streaming-panel-label">Listen on</span>
                  <a
                    className="streaming-panel-btn streaming-panel-spotify"
                    href={videoSpotifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span>🎵</span> Spotify
                  </a>
                  <a
                    className="streaming-panel-btn streaming-panel-apple"
                    href={videoAppleUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span>🎧</span> Apple Music
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div className={`lineage-info-section${infoFolded ? ' folded' : ''}`}>
              <div
                className="lineage-info-header"
                onClick={() => setInfoFolded(f => !f)}
                role="button"
                aria-expanded={!infoFolded}
                title={infoFolded ? 'Expand info' : 'Collapse info'}
              >
                <span className="lineage-info-title">{composer.name}</span>
                <span className="info-chevron">{infoFolded ? '▲' : '▼'}</span>
              </div>
              {!infoFolded && (
                <div className="lineage-info-panel">
                  {/* Description */}
                  {composer.description && (
                    <p className="lineage-description-text">{composer.description}</p>
                  )}

                  {/* Wikipedia snippet */}
                  {wikiLoading && <p className="wiki-loading">Loading Wikipedia…</p>}
                  {wikiError && <p className="wiki-error">Wikipedia unavailable</p>}
                  {wiki && (
                    <div className="wiki-snippet">
                      <span className="wiki-label">Wikipedia</span>
                      <p className="wiki-text">{wiki.text}</p>
                      {wiki.url && (
                        <a className="wiki-link" href={wiki.url} target="_blank" rel="noopener noreferrer">
                          Read full article →
                        </a>
                      )}
                    </div>
                  )}

                  {/* Streaming links */}
                  <div className="streaming-links">
                    <a
                      className="streaming-link streaming-spotify"
                      href={spotifyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={`Listen to ${composer.name} on Spotify`}
                    >
                      <span>🎵</span> Spotify
                    </a>
                    <a
                      className="streaming-link streaming-yt"
                      href={`https://www.youtube.com/results?search_query=${encodeURIComponent(composer.name + ' classical music')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={`Search ${composer.name} on YouTube`}
                    >
                      <span>▶</span> YouTube
                    </a>
                    <a
                      className="streaming-link streaming-apple"
                      href={`https://music.apple.com/search?term=${encodeURIComponent(composer.name)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={`Listen to ${composer.name} on Apple Music`}
                    >
                      <span>🎧</span> Apple Music
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </aside>
  );
}
