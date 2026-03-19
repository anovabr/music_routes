import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { PERIODS, buildLineageTree, getComposerNode } from '../data/composers';

function TreeNode({ node, selectedId, expandedIds, onToggle, onSelect, onOpenVideo, depth = 0, isLast = true }) {
  if (!node || !node.period) return null;

  const period = PERIODS[node.period];
  const isSelected = node.id === selectedId;
  const isExpanded = expandedIds.has(node.id);
  const children = node.children?.filter(c => c.period) || [];
  const hasChildren = children.length > 0;

  return (
    <div className={`tree-node-wrapper ${depth === 0 ? 'root' : ''}`} style={{ '--depth': depth }}>
      <div
        className={`tree-node ${isSelected ? 'selected' : ''}`}
        style={{ '--pc': period?.color }}
      >
        {/* Expand/collapse toggle */}
        <button
          className={`tree-toggle ${hasChildren ? 'has-children' : ''}`}
          onClick={(e) => { e.stopPropagation(); hasChildren && onToggle(node.id); }}
          disabled={!hasChildren}
        >
          {hasChildren ? (isExpanded ? '▾' : '▸') : '•'}
        </button>

        {/* Node content - clickable to select */}
        <div className="tree-node-body" onClick={() => onSelect(node)}>
          <div className="tree-node-accent" />
          <div className="tree-node-info">
            <span className="tree-node-name">{node.name}</span>
            <span className="tree-node-dates">{node.born}–{node.died || ''}</span>
          </div>
        </div>

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

      {/* Children - displayed horizontally as siblings */}
      {hasChildren && isExpanded && (
        <div className="tree-children-container">
          <div className="tree-connector-vertical" style={{ '--pc': period?.color }} />
          {children.length > 1 && (
            <div className="tree-connector-horizontal" style={{ '--pc': period?.color }} />
          )}
          <div className={`tree-children ${children.length > 1 ? 'siblings' : ''}`}>
            {children.map((child, idx) => (
              <div key={child.id} className="tree-child-wrapper">
                {children.length > 1 && (
                  <div className="tree-connector-down" style={{ '--pc': PERIODS[child.period]?.color }} />
                )}
                <TreeNode
                  node={child}
                  selectedId={selectedId}
                  expandedIds={expandedIds}
                  onToggle={onToggle}
                  onSelect={onSelect}
                  onOpenVideo={onOpenVideo}
                  depth={depth + 1}
                  isLast={idx === children.length - 1}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function LineageSidebar({ composer, onClose, onSelectComposer, onOpenVideo }) {
  if (!composer) return null;

  // Resize state
  const [width, setWidth] = useState(500);
  const isResizing = useRef(false);
  const sidebarRef = useRef(null);

  // Build the lineage tree with selected composer
  const lineageTree = useMemo(() => buildLineageTree(composer.id), [composer.id]);

  // Track expanded nodes - initially expand all ancestors and selected
  const [expandedIds, setExpandedIds] = useState(() => {
    const ids = new Set();
    // Expand all nodes in the path to selected
    function expandPath(node) {
      if (!node) return false;
      if (node.id === composer.id) {
        ids.add(node.id);
        return true;
      }
      if (node.children) {
        for (const child of node.children) {
          if (expandPath(child)) {
            ids.add(node.id);
            return true;
          }
        }
      }
      return false;
    }
    if (lineageTree) expandPath(lineageTree);
    return ids;
  });

  // When composer changes, update expanded to show path
  useEffect(() => {
    const ids = new Set();
    function expandPath(node) {
      if (!node) return false;
      if (node.id === composer.id) {
        ids.add(node.id);
        return true;
      }
      if (node.children) {
        for (const child of node.children) {
          if (expandPath(child)) {
            ids.add(node.id);
            return true;
          }
        }
      }
      return false;
    }
    if (lineageTree) expandPath(lineageTree);
    setExpandedIds(ids);
  }, [composer.id, lineageTree]);

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
    // Keep only path to selected expanded
    const ids = new Set();
    function expandPath(node) {
      if (!node) return false;
      if (node.id === composer.id) {
        ids.add(node.id);
        return true;
      }
      if (node.children) {
        for (const child of node.children) {
          if (expandPath(child)) {
            ids.add(node.id);
            return true;
          }
        }
      }
      return false;
    }
    if (lineageTree) expandPath(lineageTree);
    setExpandedIds(ids);
  }, [composer.id, lineageTree]);

  if (!lineageTree) return null;

  return (
    <aside className="lineage-sidebar" ref={sidebarRef} style={{ width }}>
      {/* Resize handle */}
      <div className="lineage-resize-handle" onMouseDown={handleMouseDown} />
      
      <div className="lineage-header">
        <h3 className="lineage-title">Lineage Tree</h3>
        <div className="lineage-controls">
          <button onClick={handleExpandAll} title="Expand all">⊞</button>
          <button onClick={handleCollapseAll} title="Collapse">⊟</button>
          <button className="lineage-close" onClick={onClose} aria-label="Close">✕</button>
        </div>
      </div>

      <div className="lineage-tree">
        <TreeNode
          node={lineageTree}
          selectedId={composer.id}
          expandedIds={expandedIds}
          onToggle={handleToggle}
          onSelect={onSelectComposer}
          onOpenVideo={onOpenVideo}
        />
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
