import { useEffect, useRef, useCallback } from 'react';
import * as d3 from 'd3';
import { treeData, PERIODS } from '../data/composers';

const NODE_R = 9;
const NODE_R_BRANCH = 14;
const DX = 180;      // horizontal spacing between sibling nodes
const DY = 110;      // vertical spacing per depth level
const DURATION = 450;

let nodeIdCounter = 0;

function assignIds(node) {
  node._uid = ++nodeIdCounter;
  if (node.children) node.children.forEach(assignIds);
}

function collapse(d) {
  if (d.children) {
    d._children = d.children;
    d.children = null;
  }
}
function expand(d) {
  if (d._children) {
    d.children = d._children;
    d._children = null;
  }
}

export default function MusicTree({ activePeriods, onSelectComposer, onOpenVideo, theme }) {
  const wrapperRef = useRef(null);
  const svgRef = useRef(null);
  const gRef = useRef(null);
  const rootRef = useRef(null);
  const zoomRef = useRef(null);
  const updateRef = useRef(null);

  // ── colour helpers ───────────────────────────────────────────────────────
  const periodColor = useCallback((periodId) => {
    if (!periodId) return theme === 'dark' ? '#555' : '#aaa';
    const p = PERIODS[periodId];
    return theme === 'dark' ? (p?.color || '#888') : (p?.color || '#888');
  }, [theme]);

  const isVisible = useCallback((d) => {
    if (!d.data.period) return true;           // branch nodes always visible
    return activePeriods[d.data.period] !== false;
  }, [activePeriods]);

  // ── main D3 setup — runs once ────────────────────────────────────────────
  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const w = wrapper.clientWidth || 900;
    const h = wrapper.clientHeight || 700;

    // ── SVG & zoom setup ──────────────────────────────────────────────────
    const svg = d3.select(svgRef.current)
      .attr('width', '100%')
      .attr('height', '100%');

    svg.selectAll('*').remove();

    const zoom = d3.zoom()
      .scaleExtent([0.08, 3])
      .on('zoom', (e) => g.attr('transform', e.transform));
    zoomRef.current = zoom;
    svg.call(zoom);

    // Subtle background pattern
    const defs = svg.append('defs');
    const pattern = defs.append('pattern')
      .attr('id', 'grid')
      .attr('width', 60).attr('height', 60)
      .attr('patternUnits', 'userSpaceOnUse');
    pattern.append('path')
      .attr('d', 'M 60 0 L 0 0 0 60')
      .attr('fill', 'none')
      .attr('stroke', theme === 'dark' ? 'rgba(255,255,255,0.025)' : 'rgba(0,0,0,0.04)')
      .attr('stroke-width', 1);
    svg.append('rect').attr('width', '100%').attr('height', '100%').attr('fill', 'url(#grid)');

    const g = svg.append('g');
    gRef.current = g;

    // ── Build hierarchy ───────────────────────────────────────────────────
    const dataCopy = JSON.parse(JSON.stringify(treeData));
    assignIds(dataCopy);
    const root = d3.hierarchy(dataCopy);
    root.x0 = w / 2;
    root.y0 = 0;

    // Collapse nodes beyond depth 1 initially
    root.descendants().forEach(d => {
      if (d.depth >= 2) collapse(d);
    });
    rootRef.current = root;

    // ── Layout ────────────────────────────────────────────────────────────
    const treeLayout = d3.tree().nodeSize([DX, DY]);

    // ── Link path (top → down) ────────────────────────────────────────────
    function diagonal(s, t) {
      const my = (s.y + t.y) / 2;
      return `M${s.x},${s.y} C${s.x},${my} ${t.x},${my} ${t.x},${t.y}`;
    }

    // ── Update function ───────────────────────────────────────────────────
    function update(source) {
      treeLayout(root);

      const allNodes = root.descendants();
      const allLinks = root.links();

      // ── Links ───────────────────────────────────────────────────────────
      const linkSel = g.selectAll('path.link')
        .data(allLinks, d => d.target.data._uid);

      const linkEnter = linkSel.enter().append('path')
        .attr('class', 'link')
        .attr('d', () => {
          const o = { x: source.x0 ?? source.x, y: source.y0 ?? source.y };
          return diagonal(o, o);  // top-down: x=horiz, y=vert
        })
        .attr('fill', 'none')
        .attr('stroke-width', 1.5)
        .attr('opacity', 0);

      linkEnter.merge(linkSel)
        .transition().duration(DURATION)
        .attr('d', d => diagonal(d.source, d.target))
        .attr('opacity', d => {
          if (!d.target.data.period) return 0.35;
          return activePeriods[d.target.data.period] !== false ? 0.45 : 0.08;
        })
        .attr('stroke', d => {
          if (!d.target.data.period) return theme === 'dark' ? '#3a3a6a' : '#c0b8a8';
          return periodColor(d.target.data.period);
        });

      linkSel.exit()
        .transition().duration(DURATION)
        .attr('d', () => {
          const o = { x: source.x, y: source.y };
          return diagonal(o, o);
        })
        .attr('opacity', 0)
        .remove();

      // ── Nodes ───────────────────────────────────────────────────────────
      const nodeSel = g.selectAll('g.node')
        .data(allNodes, d => d.data._uid);

      const nodeEnter = nodeSel.enter().append('g')
        .attr('class', 'node')
        .attr('transform', () => `translate(${source.x0 ?? source.x},${source.y0 ?? source.y})`)
        .attr('opacity', 0)
        .style('cursor', 'pointer')
        .on('click', (event, d) => {
          event.stopPropagation();
          if (d.children) {
            collapse(d);
          } else if (d._children) {
            expand(d);
          }
          if (d.data.period) {
            onSelectComposer(d.data);
          }
          update(d);
        });

      const isBranch = (d) => d.data.type === 'branch' || d.data.type === 'root';

      // Glow filter
      const glowId = `glow-${Math.random().toString(36).slice(2)}`;
      const filter = defs.append('filter').attr('id', glowId).attr('x', '-30%').attr('y', '-30%').attr('width', '160%').attr('height', '160%');
      filter.append('feGaussianBlur').attr('in', 'SourceGraphic').attr('stdDeviation', '3').attr('result', 'blur');
      const merge = filter.append('feMerge');
      merge.append('feMergeNode').attr('in', 'blur');
      merge.append('feMergeNode').attr('in', 'SourceGraphic');

      // Outer ring (collapsed indicator)
      nodeEnter.append('circle')
        .attr('class', 'node-ring')
        .attr('r', d => isBranch(d) ? NODE_R_BRANCH + 5 : NODE_R + 4)
        .attr('fill', 'none')
        .attr('stroke-width', 1.5)
        .attr('stroke-dasharray', '3,3');

      // Main circle
      nodeEnter.append('circle')
        .attr('class', 'node-circle')
        .attr('r', d => isBranch(d) ? NODE_R_BRANCH : NODE_R)
        .attr('filter', `url(#${glowId})`);

      // Expand/collapse indicator
      nodeEnter.append('text')
        .attr('class', 'node-indicator')
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'central')
        .attr('dy', '0.05em')
        .style('font-size', d => isBranch(d) ? '13px' : '10px')
        .style('pointer-events', 'none')
        .style('user-select', 'none');

      // Name label
      nodeEnter.append('text')
        .attr('class', 'node-label')
        .attr('dy', '0.32em')
        .style('pointer-events', 'none')
        .style('user-select', 'none');

      // Dates label
      nodeEnter.append('text')
        .attr('class', 'node-dates')
        .attr('dy', '0.32em')
        .style('pointer-events', 'none')
        .style('user-select', 'none');

      // Video icon
      nodeEnter.append('text')
        .attr('class', 'node-video-icon')
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'central')
        .style('cursor', 'pointer')
        .style('font-size', '11px')
        .on('click', (event, d) => {
          event.stopPropagation();
          if (d.data.videos?.length) onOpenVideo(d.data.videos[0], d.data);
        });

      // ── Merge enter + update ─────────────────────────────────────────────
      const nodeUpdate = nodeEnter.merge(nodeSel);

      nodeUpdate.transition().duration(DURATION)
        .attr('transform', d => `translate(${d.x},${d.y})`)
        .attr('opacity', d => {
          if (!d.data.period) return 1;
          return activePeriods[d.data.period] !== false ? 1 : 0.18;
        });

      // Node circle styles
      nodeUpdate.select('circle.node-circle')
        .transition().duration(DURATION)
        .attr('r', d => isBranch(d) ? NODE_R_BRANCH : NODE_R)
        .attr('fill', d => {
          if (isBranch(d)) return theme === 'dark' ? '#1e1e3a' : '#f0ece0';
          return periodColor(d.data.period);
        })
        .attr('stroke', d => {
          if (isBranch(d)) return theme === 'dark' ? '#7070b0' : '#8888aa';
          return theme === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)';
        })
        .attr('stroke-width', d => isBranch(d) ? 2 : 1.5);

      // Ring visibility
      nodeUpdate.select('circle.node-ring')
        .attr('stroke', d => {
          if (isBranch(d)) return theme === 'dark' ? '#5050a0' : '#aaa0d0';
          return periodColor(d.data.period);
        })
        .attr('opacity', d => (d._children ? 0.6 : 0));

      // Indicator (+/-)
      nodeUpdate.select('text.node-indicator')
        .text(d => {
          if (isBranch(d)) return d.children ? '−' : d._children ? '+' : '♩';
          return d.children ? '−' : d._children ? '+' : '';
        })
        .attr('fill', d => {
          if (isBranch(d)) return theme === 'dark' ? '#a0a0d0' : '#6060a0';
          return theme === 'dark' ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.8)';
        });

      // Label positioning — centered below node (top-down layout)
      nodeUpdate.select('text.node-label')
        .attr('x', 0)
        .attr('y', d => (isBranch(d) ? NODE_R_BRANCH : NODE_R) + 14)
        .attr('dy', '0em')
        .attr('text-anchor', 'middle')
        .text(d => d.data.name || '')
        .attr('fill', theme === 'dark' ? '#e8e0d5' : '#1a1a2e')
        .style('font-size', d => isBranch(d) ? '13px' : '12px')
        .style('font-weight', d => isBranch(d) ? '600' : '400')
        .style('font-family', d => isBranch(d) ? "'Playfair Display', serif" : "'Inter', sans-serif");

      // Dates — below label
      nodeUpdate.select('text.node-dates')
        .attr('x', 0)
        .attr('y', d => (isBranch(d) ? NODE_R_BRANCH : NODE_R) + 26)
        .attr('dy', '0em')
        .attr('text-anchor', 'middle')
        .text(d => {
          if (!d.data.born) return '';
          const died = d.data.died ? d.data.died : '   ';
          return `${d.data.born}–${died}`;
        })
        .attr('fill', theme === 'dark' ? '#8888aa' : '#666680')
        .style('font-size', '10px')
        .style('font-family', "'Inter', sans-serif");

      // Video icon — above node
      nodeUpdate.select('text.node-video-icon')
        .attr('x', 0)
        .attr('y', d => -((isBranch(d) ? NODE_R_BRANCH : NODE_R) + 6))
        .attr('text-anchor', 'middle')
        .text(d => d.data.videos?.length ? '▶' : '')
        .attr('fill', theme === 'dark' ? '#c9a84c' : '#8B4513')
        .attr('opacity', 0.8);

      // ── Exit ─────────────────────────────────────────────────────────────
      nodeSel.exit()
        .transition().duration(DURATION)
        .attr('transform', `translate(${source.x},${source.y})`)
        .attr('opacity', 0)
        .remove();

      // Store positions
      allNodes.forEach(d => { d.x0 = d.x; d.y0 = d.y; });
    }

    updateRef.current = update;
    update(root);

    // Initial zoom — root centered horizontally, near top
    const initScale = 0.7;
    svg.call(zoom.transform,
      d3.zoomIdentity.translate(w / 2, 60).scale(initScale)
    );

    // ── Resize handler ─────────────────────────────────────────────────────
    const ro = new ResizeObserver(() => {
      if (updateRef.current && rootRef.current) updateRef.current(rootRef.current);
    });
    ro.observe(wrapper);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme]);  // Re-init when theme changes

  // ── Re-apply colours when period filters change ──────────────────────────
  useEffect(() => {
    if (!gRef.current) return;
    const g = gRef.current;

    g.selectAll('g.node')
      .transition().duration(250)
      .attr('opacity', d => {
        if (!d.data.period) return 1;
        return activePeriods[d.data.period] !== false ? 1 : 0.18;
      });

    g.selectAll('path.link')
      .transition().duration(250)
      .attr('opacity', d => {
        if (!d.target.data.period) return 0.35;
        return activePeriods[d.target.data.period] !== false ? 0.45 : 0.08;
      });
  }, [activePeriods]);

  // ── Zoom controls ────────────────────────────────────────────────────────
  const handleZoomIn = () => {
    if (svgRef.current && zoomRef.current)
      d3.select(svgRef.current).transition().duration(300).call(zoomRef.current.scaleBy, 1.4);
  };
  const handleZoomOut = () => {
    if (svgRef.current && zoomRef.current)
      d3.select(svgRef.current).transition().duration(300).call(zoomRef.current.scaleBy, 0.7);
  };
  const handleReset = () => {
    if (svgRef.current && zoomRef.current) {
      const w = wrapperRef.current?.clientWidth || 900;
      d3.select(svgRef.current).transition().duration(500)
        .call(zoomRef.current.transform, d3.zoomIdentity.translate(w / 2, 60).scale(0.7));
    }
  };
  const handleExpandAll = () => {
    if (!rootRef.current || !updateRef.current) return;
    rootRef.current.descendants().forEach(d => {
      if (d._children) expand(d);
    });
    updateRef.current(rootRef.current);
  };
  const handleCollapseAll = () => {
    if (!rootRef.current || !updateRef.current) return;
    rootRef.current.descendants().forEach(d => {
      if (d.depth >= 2) collapse(d);
    });
    updateRef.current(rootRef.current);
  };

  return (
    <div ref={wrapperRef} className="tree-wrapper">
      <svg ref={svgRef} className="tree-svg" />
      <div className="tree-controls">
        <button onClick={handleZoomIn} title="Zoom in">＋</button>
        <button onClick={handleZoomOut} title="Zoom out">－</button>
        <button onClick={handleReset} title="Reset view">⌂</button>
        <div className="tree-controls-sep" />
        <button onClick={handleExpandAll} title="Expand all">⊞</button>
        <button onClick={handleCollapseAll} title="Collapse all">⊟</button>
      </div>
      <div className="tree-hint">
        Click a node to expand · Click composer name to see details · ▶ to play video
      </div>
    </div>
  );
}
