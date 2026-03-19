import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { PERIODS, buildLineageTree } from '../data/composers';
import VideoPlayer from './VideoPlayer';

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

function TreeNode({ node, selectedId, ancestorIds, expandedIds, onToggle, onSelect, onOpenVideo, depth = 0 }) {
  if (!node || !node.period) return null;

  const period = PERIODS[node.period];
  const isSelected = node.id === selectedId;
  const isAncestor = ancestorIds.has(node.id) && !isSelected;
  const isExpanded = expandedIds.has(node.id);
  const children = node.children?.filter(c => c.period) || [];
  const hasChildren = children.length > 0;

  const handleBoxClick = () => {
    onSelect(node);
    if (hasChildren) {
      onToggle(node.id);
    }
  };

  return (
    <div className={`tree-node-wrapper ${depth === 0 ? 'root' : ''}`} style={{ '--depth': depth }}>
      <div
        className={`tree-node ${isSelected ? 'selected is-selected' : ''} ${isAncestor ? 'is-ancestor' : ''} ${hasChildren ? 'expandable' : ''}`}
        style={{ '--pc': period?.color }}
      >
        {/* Node content - clickable to select AND toggle */}
        <div className="tree-node-body" onClick={handleBoxClick}>
          <div className="tree-node-accent" />
          <span className="tree-node-name">{node.name}</span>
          <span className="tree-node-dates">{node.born}–{node.died || ''}</span>
          {/* Play button for selected */}
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

      {/* Children - displayed horizontally as siblings */}
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
                  <div className="tree-connector-down" style={{ '--pc': PERIODS[child.period]?.color }} />
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
}

export default function LineageSidebar({ composer, onClose, onSelectComposer, onOpenVideo, activeVideo, onCloseVideo }) {
  // Resize state
  const [width, setWidth] = useState(500);
  const isResizing = useRef(false);
  const sidebarRef = useRef(null);
  
  // Zoom and Pan state
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const treeContainerRef = useRef(null);
  const isPanning = useRef(false);
  const panStart = useRef({ x: 0, y: 0 });
  const panOrigin = useRef({ x: 0, y: 0 });

  // Build the lineage tree with selected composer (if any)
  const lineageTree = useMemo(() => composer ? buildLineageTree(composer.id) : null, [composer?.id]);

  // Calculate ancestor IDs (path from root to selected)
  const ancestorIds = useMemo(() => {
    if (!lineageTree || !composer) return new Set();
    const ids = new Set();
    function findPath(node) {
      if (!node || !node.period) return false;
      if (node.id === composer.id) {
        ids.add(node.id);
        return true;
      }
      if (node.children) {
        for (const child of node.children) {
          if (findPath(child)) {
            ids.add(node.id);
            return true;
          }
        }
      }
      return false;
    }
    findPath(lineageTree);
    return ids;
  }, [lineageTree, composer?.id]);

  // Track expanded nodes - initially expand all ancestors and selected
  const [expandedIds, setExpandedIds] = useState(() => {
    if (!composer) return new Set();
    const ids = new Set();
    if (lineageTree) expandPath(lineageTree, composer.id, ids);
    return ids;
  });

  // When composer changes, update expanded to show path and reset pan
  useEffect(() => {
    if (!composer) {
      setExpandedIds(new Set());
      setPan({ x: 0, y: 0 });
      return;
    }
    const ids = new Set();
    if (lineageTree) expandPath(lineageTree, composer.id, ids);
    setExpandedIds(ids);
    setPan({ x: 0, y: 0 });
  }, [composer?.id, lineageTree]);

  // Resize handlers
  const handleMouseDown = useCallback((e) => {
    isResizing.current = true;
    document.body.style.cursor = 'ew-resize';
    document.body.style.userSelect = 'none';
    e.preventDefault();
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizing.current) return;
      const newWidth = window.innerWidth - e.clientX;
      setWidth(Math.max(300, Math.min(900, newWidth)));
    };

    const handleMouseUp = () => {
      isResizing.current = false;
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
      if (next.has(id)) next.delete(id);
      else next.add(id);
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

  // Zoom handlers
  const handleZoomIn = useCallback(() => setZoom(z => Math.min(2, z + 0.1)), []);
  const handleZoomOut = useCallback(() => setZoom(z => Math.max(0.4, z - 0.1)), []);
  const handleZoomReset = useCallback(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, []);

  // Mouse wheel zoom
  const handleWheel = useCallback((e) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      setZoom(z => Math.max(0.4, Math.min(2, z + delta)));
    }
  }, []);

  // Pan handlers
  const handlePanStart = useCallback((e) => {
    // Only pan with left mouse button and not on a node
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
    
    const dx = e.clientX - panStart.current.x;
    const dy = e.clientY - panStart.current.y;
    
    setPan({
      x: panOrigin.current.x + dx,
      y: panOrigin.current.y + dy
    });
  }, []);

  const handlePanEnd = useCallback((e) => {
    if (isPanning.current) {
      isPanning.current = false;
      if (treeContainerRef.current) {
        treeContainerRef.current.style.cursor = 'grab';
      }
    }
  }, []);

  return (
    <aside className="lineage-sidebar" ref={sidebarRef} style={{ width }}>
      {/* Resize handle */}
      <div className="lineage-resize-handle" onMouseDown={handleMouseDown} />
      
      <div className="lineage-header">
        <h3 className="lineage-title">Lineage Tree</h3>
        {composer && (
          <div className="lineage-controls">
            <button onClick={handleZoomOut} title="Zoom out">−</button>
            <span className="zoom-level" onClick={handleZoomReset} title="Reset view (zoom & pan)">{Math.round(zoom * 100)}%</span>
            <button onClick={handleZoomIn} title="Zoom in">+</button>
            <button onClick={handleExpandAll} title="Expand all">⊞</button>
            <button onClick={handleCollapseAll} title="Collapse">⊟</button>
            <button className="lineage-close" onClick={onClose} aria-label="Close">✕</button>
          </div>
        )}
      </div>

      {lineageTree ? (
        <div 
          className="lineage-tree" 
          ref={treeContainerRef} 
          onWheel={handleWheel}
          onMouseDown={handlePanStart}
          onMouseMove={handlePanMove}
          onMouseUp={handlePanEnd}
          onMouseLeave={handlePanEnd}
        >
          <div 
            className="lineage-tree-inner" 
            style={{ 
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, 
              transformOrigin: 'top center' 
            }}
          >
            <TreeNode
              node={lineageTree}
              selectedId={composer?.id}
              ancestorIds={ancestorIds}
              expandedIds={expandedIds}
              onToggle={handleToggle}
              onSelect={onSelectComposer}
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

      {/* Description and Video at bottom */}
      {composer && (
        <div className={`lineage-bottom ${activeVideo ? 'has-video' : ''}`}>
          {activeVideo ? (
            <div className="lineage-video-section">
              <div className="lineage-video-header">
                <span className="lineage-video-playing">▶ {activeVideo.video.title}</span>
                <button className="lineage-video-close" onClick={onCloseVideo} title="Close video">✕</button>
              </div>
              <div className="lineage-video-container">
                <VideoPlayer
                  youtubeId={activeVideo.video.youtubeId}
                  title={activeVideo.video.title}
                  composer={activeVideo.composer}
                />
              </div>
            </div>
          ) : composer.description ? (
            <div className="lineage-description">
              <p>{composer.description}</p>
            </div>
          ) : null}
        </div>
      )}
    </aside>
  );
}
