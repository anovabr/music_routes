import { useEffect, useRef, useCallback } from 'react';
import * as d3 from 'd3';
import { treeData, PERIODS } from '../data/composers';

const NW = 170;   // box width
const NH = 52;    // box height
const DX = 200;   // horizontal spacing (center-to-center)
const DY = 120;   // kept for d3.tree nodeSize only (y is overridden by birth year)
const DURATION = 400;

const PX_PER_YEAR  = 6;    // screen pixels per year of birth
const YEAR_ORIGIN  = 1540; // world-y = 0 corresponds to this year
const MIN_GAP      = NH + 20; // minimum px between parent bottom and child top

let nodeIdCounter = 0;
function assignIds(node) {
  node._uid = ++nodeIdCounter;
  if (node.children) node.children.forEach(assignIds);
}
function collapse(d) {
  if (d.children) { d._children = d.children; d.children = null; }
}
function expand(d) {
  if (d._children) { d.children = d._children; d._children = null; }
}

export default function MusicTree({ activePeriods, onSelectComposer, onOpenVideo, theme }) {
  const wrapperRef = useRef(null);
  const svgRef    = useRef(null);
  const gRef      = useRef(null);
  const rootRef   = useRef(null);
  const zoomRef   = useRef(null);
  const updateRef = useRef(null);

  const periodColor = useCallback((periodId) => {
    if (!periodId) return theme === 'dark' ? '#3a3a6a' : '#c0b8d8';
    return PERIODS[periodId]?.color || '#888';
  }, [theme]);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const w = wrapper.clientWidth || 900;
    const h = wrapper.clientHeight || 700;

    const svg = d3.select(svgRef.current).attr('width', '100%').attr('height', '100%');
    svg.selectAll('*').remove();

    const zoom = d3.zoom()
      .scaleExtent([0.05, 3])
      .on('zoom', (e) => g.attr('transform', e.transform));
    zoomRef.current = zoom;
    svg.call(zoom);

    // Grid background
    const defs = svg.append('defs');
    const pat = defs.append('pattern').attr('id', 'grid').attr('width', 60).attr('height', 60).attr('patternUnits', 'userSpaceOnUse');
    pat.append('path').attr('d', 'M 60 0 L 0 0 0 60').attr('fill', 'none')
      .attr('stroke', theme === 'dark' ? 'rgba(255,255,255,0.025)' : 'rgba(0,0,0,0.04)')
      .attr('stroke-width', 1);
    svg.append('rect').attr('width', '100%').attr('height', '100%').attr('fill', 'url(#grid)');

    const g = svg.append('g');
    gRef.current = g;

    // ── Year ruler (drawn first so it sits below all nodes) ─────────────────
    const isDark = theme === 'dark';
    const rulerG = g.append('g').attr('class', 'time-ruler');
    for (let yr = 1550; yr <= 2060; yr += 50) {
      const ry = (yr - YEAR_ORIGIN) * PX_PER_YEAR;
      rulerG.append('line')
        .attr('x1', -4000).attr('x2', 6000)
        .attr('y1', ry).attr('y2', ry)
        .attr('stroke', isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)')
        .attr('stroke-width', 1);
      rulerG.append('text')
        .attr('x', -760).attr('y', ry)
        .attr('dominant-baseline', 'middle')
        .attr('fill', isDark ? 'rgba(180,170,210,0.42)' : 'rgba(80,70,110,0.4)')
        .style('font-size', '13px').style('font-weight', '500')
        .style('pointer-events', 'none').style('user-select', 'none')
        .style('font-family', "'Inter', sans-serif")
        .text(yr);
    }

    const dataCopy = JSON.parse(JSON.stringify(treeData));
    assignIds(dataCopy);
    const root = d3.hierarchy(dataCopy);
    root.x0 = w / 2;
    root.y0 = 0;

    // Collapse beyond depth 1 initially
    root.descendants().forEach(d => { if (d.depth >= 2) collapse(d); });
    rootRef.current = root;

    const treeLayout = d3.tree().nodeSize([DX, DY]);

    // Link: from bottom-center of parent box to top-center of child box
    function link(s, t) {
      const sy = s.y + NH / 2;
      const ty = t.y - NH / 2;
      const my = (sy + ty) / 2;
      return `M${s.x},${sy} C${s.x},${my} ${t.x},${my} ${t.x},${ty}`;
    }

    function update(source) {
      treeLayout(root);

      // ── Override Y with birth-year axis ──────────────────────────────────
      // d3.tree() gave us good X positions (horizontal branching).
      // We replace Y so the vertical axis = real time.
      root.eachBefore(d => {
        if (d.depth === 0) { d.y = -200; return; }           // root hidden above view
        if (!d.data.born) {                                    // branch nodes w/o date
          d.y = d.parent ? d.parent.y + MIN_GAP : 0;
          return;
        }
        const timeY = (d.data.born - YEAR_ORIGIN) * PX_PER_YEAR;
        // Guarantee child is always below its parent (teacher born before student)
        d.y = d.parent ? Math.max(timeY, d.parent.y + MIN_GAP) : timeY;
      });

      const allNodes = root.descendants();
      const allLinks = root.links();

      // ── Links ──────────────────────────────────────────────────────────────
      const linkSel = g.selectAll('path.link').data(allLinks, d => d.target.data._uid);

      const srcPt = { x: source.x0 ?? source.x, y: source.y0 ?? source.y };

      linkSel.enter().append('path').attr('class', 'link')
        .attr('d', () => link(srcPt, srcPt))
        .attr('fill', 'none').attr('stroke-width', 1.5).attr('opacity', 0)
        .merge(linkSel)
        .transition().duration(DURATION)
        .attr('d', d => link(d.source, d.target))
        .attr('stroke', d => periodColor(d.target.data.period))
        .attr('opacity', d => {
          if (!d.source.data.period && d.source.depth === 0) return 0; // hide root links
          if (!d.target.data.period) return 0.3;
          return activePeriods[d.target.data.period] !== false ? 0.55 : 0.08;
        });

      linkSel.exit().transition().duration(DURATION)
        .attr('d', () => link({ x: source.x, y: source.y }, { x: source.x, y: source.y }))
        .attr('opacity', 0).remove();

      // ── Nodes ──────────────────────────────────────────────────────────────
      const nodeSel = g.selectAll('g.node').data(allNodes, d => d.data._uid);

      const nodeEnter = nodeSel.enter().append('g').attr('class', 'node')
        .attr('transform', () => `translate(${srcPt.x},${srcPt.y})`)
        .attr('opacity', 0)
        .style('cursor', 'pointer')
        .on('click', (event, d) => {
          event.stopPropagation();
          if (d.depth === 0) return;
          if (d.data.period) onSelectComposer(d.data);
        });

      // Box
      nodeEnter.append('rect').attr('class', 'node-box')
        .attr('width', NW).attr('height', NH)
        .attr('x', -NW / 2).attr('y', -NH / 2)
        .attr('rx', 7).attr('ry', 7);

      // Left accent bar
      nodeEnter.append('rect').attr('class', 'node-accent')
        .attr('width', 4).attr('height', NH - 4)
        .attr('x', -NW / 2 + 0).attr('y', -NH / 2 + 2)
        .attr('rx', 2);

      // Name
      nodeEnter.append('text').attr('class', 'node-name')
        .attr('x', -NW / 2 + 14).attr('y', -7)
        .attr('dominant-baseline', 'middle')
        .style('pointer-events', 'none').style('user-select', 'none');

      // Dates
      nodeEnter.append('text').attr('class', 'node-dates')
        .attr('x', -NW / 2 + 14).attr('y', 11)
        .attr('dominant-baseline', 'middle')
        .style('pointer-events', 'none').style('user-select', 'none');

      // Toggle strip — clickable zone at bottom of box for fold/unfold
      nodeEnter.append('rect').attr('class', 'node-toggle')
        .attr('width', NW - 4).attr('height', 13)
        .attr('x', -NW / 2 + 2).attr('y', NH / 2 - 14)
        .attr('rx', 3).attr('ry', 3)
        .attr('fill', 'transparent')
        .on('click', (event, d) => {
          event.stopPropagation();
          if (d.children) collapse(d);
          else if (d._children) expand(d);
          update(d);
        });

      // Expand indicator — inside the toggle strip
      nodeEnter.append('text').attr('class', 'node-expand')
        .attr('x', 0).attr('y', NH / 2 - 7)
        .attr('text-anchor', 'middle').attr('dominant-baseline', 'middle')
        .style('pointer-events', 'none').style('user-select', 'none');

      // ── Merge ──────────────────────────────────────────────────────────────
      const nodeUpdate = nodeEnter.merge(nodeSel);

      nodeUpdate.transition().duration(DURATION)
        .attr('transform', d => `translate(${d.x},${d.y})`)
        .attr('opacity', d => {
          if (d.depth === 0) return 0; // hide root node entirely
          if (!d.data.period) return 1;
          return activePeriods[d.data.period] !== false ? 1 : 0.15;
        });

      const dark = theme === 'dark';

      nodeUpdate.select('rect.node-box')
        .transition().duration(DURATION)
        .attr('fill', d => {
          const c = periodColor(d.data.period);
          return dark
            ? `color-mix(in srgb, ${c} 14%, #12121f)`
            : `color-mix(in srgb, ${c} 12%, #faf6ef)`;
        })
        .attr('stroke', d => periodColor(d.data.period))
        .attr('stroke-width', 1.5)
        .attr('stroke-opacity', d => activePeriods[d.data.period] !== false ? 0.7 : 0.2);

      nodeUpdate.select('rect.node-accent')
        .attr('fill', d => periodColor(d.data.period))
        .attr('opacity', 0.85);

      nodeUpdate.select('text.node-name')
        .text(d => d.data.name || '')
        .attr('fill', dark ? '#e8e0d5' : '#1a1520')
        .style('font-size', '13px')
        .style('font-weight', '600')
        .style('font-family', "'Inter', sans-serif");

      nodeUpdate.select('text.node-dates')
        .text(d => {
          if (!d.data.born) return d.data.nationality || '';
          const died = d.data.died ?? '    ';
          return `${d.data.born}–${died}`;
        })
        .attr('fill', dark ? '#8888aa' : '#6060a0')
        .style('font-size', '11px')
        .style('font-family', "'Inter', sans-serif");

      nodeUpdate.select('rect.node-toggle')
        .attr('fill', d => {
          const hasFold = d._children || (d.children && d.children.length > 0);
          if (!hasFold) return 'transparent';
          return dark ? 'rgba(80,80,180,0.2)' : 'rgba(80,80,180,0.12)';
        })
        .attr('stroke', d => {
          const hasFold = d._children || (d.children && d.children.length > 0);
          return hasFold ? periodColor(d.data.period) : 'none';
        })
        .attr('stroke-width', 0.5)
        .attr('stroke-opacity', 0.3)
        .style('pointer-events', d =>
          (d._children || (d.children && d.children.length > 0)) ? 'all' : 'none')
        .style('cursor', 'pointer');

      nodeUpdate.select('text.node-expand')
        .text(d => d._children ? '▾' : (d.children && d.children.length > 0 ? '▴' : ''))
        .attr('fill', dark ? '#8080c0' : '#7070b0')
        .style('font-size', '10px');

      nodeSel.exit().transition().duration(DURATION)
        .attr('transform', `translate(${source.x},${source.y})`)
        .attr('opacity', 0).remove();

      allNodes.forEach(d => { d.x0 = d.x; d.y0 = d.y; });
    }

    updateRef.current = update;
    update(root);

    // Initial zoom: centre horizontally, Baroque era near top (~1550-1780 visible)
    svg.call(zoom.transform, d3.zoomIdentity.translate(w / 2, 60).scale(0.48));

    const ro = new ResizeObserver(() => {
      if (updateRef.current && rootRef.current) updateRef.current(rootRef.current);
    });
    ro.observe(wrapper);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme]);

  // Recolour on filter change
  useEffect(() => {
    if (!gRef.current) return;
    const g = gRef.current;
    g.selectAll('g.node').transition().duration(250)
      .attr('opacity', d => {
        if (d.depth === 0) return 0;
        if (!d.data.period) return 1;
        return activePeriods[d.data.period] !== false ? 1 : 0.15;
      });
    g.selectAll('path.link').transition().duration(250)
      .attr('opacity', d => {
        if (!d.source.data.period && d.source.depth === 0) return 0;
        if (!d.target.data.period) return 0.3;
        return activePeriods[d.target.data.period] !== false ? 0.55 : 0.08;
      });
  }, [activePeriods]);

  const handleZoomIn  = () => d3.select(svgRef.current).transition().duration(300).call(zoomRef.current.scaleBy, 1.4);
  const handleZoomOut = () => d3.select(svgRef.current).transition().duration(300).call(zoomRef.current.scaleBy, 0.7);
  const handleReset   = () => {
    const w = wrapperRef.current?.clientWidth || 900;
    d3.select(svgRef.current).transition().duration(500)
      .call(zoomRef.current.transform, d3.zoomIdentity.translate(w / 2, 60).scale(0.48));
  };
  const handleExpandAll = () => {
    rootRef.current?.descendants().forEach(d => { if (d._children) expand(d); });
    updateRef.current?.(rootRef.current);
  };
  const handleCollapseAll = () => {
    rootRef.current?.descendants().forEach(d => { if (d.depth >= 2) collapse(d); });
    updateRef.current?.(rootRef.current);
  };

  return (
    <div ref={wrapperRef} className="tree-wrapper">
      <svg ref={svgRef} className="tree-svg" />
      <div className="tree-controls">
        <button onClick={handleZoomIn}  title="Zoom in">＋</button>
        <button onClick={handleZoomOut} title="Zoom out">－</button>
        <button onClick={handleReset}   title="Reset view">⌂</button>
        <div className="tree-controls-sep" />
        <button onClick={handleExpandAll}   title="Expand all">⊞</button>
        <button onClick={handleCollapseAll} title="Collapse all">⊟</button>
      </div>
      <div className="tree-hint">
        Vertical axis = birth year · Click box to open · ▾ to expand
      </div>
    </div>
  );
}
