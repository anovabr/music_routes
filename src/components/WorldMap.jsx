import { useMemo, useState } from 'react';
import { flatComposers, PERIODS } from '../data/composers';

// Rough [lng, lat] for each nationality label used in composers.js
const NATIONALITY_COORDS = {
  'German':          [10.4, 51.2],
  'Austrian':        [14.5, 47.5],
  'Italian':         [12.5, 42.5],
  'French':          [2.3, 46.6],
  'English':         [-1.5, 52.4],
  'British':         [-1.5, 52.4],
  'Russian':         [37.6, 55.8],
  'Polish':          [19.1, 52.2],
  'Czech':           [15.5, 49.8],
  'Hungarian':       [19.0, 47.2],
  'Norwegian':       [10.7, 59.9],
  'Finnish':         [25.7, 61.9],
  'Swedish':         [18.1, 59.3],
  'Danish':          [10.2, 55.7],
  'Spanish':         [-3.7, 40.4],
  'Belgian':         [4.4, 50.8],
  'Dutch':           [5.3, 52.1],
  'Swiss':           [8.2, 46.8],
  'Romanian':        [25.0, 45.9],
  'American':        [-98.5, 39.5],
  'Brazilian':       [-51.9, -14.2],
  'Argentine':       [-63.6, -38.4],
  'Greek':           [21.8, 39.1],
  'Georgian':        [43.4, 42.3],
  'Estonian':        [24.7, 58.6],
  'Lithuanian':      [23.9, 55.2],
  'Latvian':         [24.6, 56.9],
  'Japanese':        [138.3, 36.2],
  'Chinese':         [104.2, 35.9],
  'Franco-Flemish':  [3.2, 50.7],
  'Flemish':         [3.2, 50.7],
};

// Mercator projection: lng/lat → x/y on a 1000×500 canvas
function project(lng, lat) {
  const x = (lng + 180) / 360;
  const latRad = lat * Math.PI / 180;
  const y = (1 - Math.log(Math.tan(latRad / 2 + Math.PI / 4)) / Math.PI) / 2;
  return { x: x * 1000, y: y * 500 };
}

export default function WorldMap({ onClose, onSelectComposer }) {
  const allComposers = useMemo(() => flatComposers(), []);
  const [hovered, setHovered] = useState(null);

  const dots = useMemo(() => {
    const map = new Map();
    allComposers.forEach(c => {
      const coords = NATIONALITY_COORDS[c.nationality];
      if (!coords) return;
      const key = c.nationality;
      if (!map.has(key)) map.set(key, { coords, composers: [], nationality: c.nationality });
      map.get(key).composers.push(c);
    });
    return [...map.values()];
  }, [allComposers]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="world-map-modal" onClick={e => e.stopPropagation()}>
        <div className="world-map-header">
          <h2 className="world-map-title">Birthplace Map</h2>
          <p className="world-map-subtitle">Where classical composers were born</p>
          <button className="guided-paths-close" onClick={onClose}>✕</button>
        </div>

        <div className="world-map-container">
          <svg viewBox="0 0 1000 500" className="world-map-svg" preserveAspectRatio="xMidYMid meet">
            {/* Simple continent outlines */}
            <rect width="1000" height="500" fill="var(--bg3)" rx="8" />

            {/* Dots per nationality cluster */}
            {dots.map(({ coords, composers, nationality }) => {
              const { x, y } = project(coords[0], coords[1]);
              const r = Math.min(3 + composers.length * 1.2, 14);
              const period = composers[0]?.period;
              const color = PERIODS[period]?.color ?? '#888';
              const isHovered = hovered === nationality;

              return (
                <g key={nationality}>
                  <circle
                    cx={x} cy={y} r={r + 4}
                    fill={color} opacity={isHovered ? 0.2 : 0}
                    style={{ transition: 'opacity 0.15s' }}
                  />
                  <circle
                    cx={x} cy={y} r={r}
                    fill={color}
                    opacity={isHovered ? 1 : 0.75}
                    stroke="var(--bg)" strokeWidth={1.5}
                    style={{ cursor: 'pointer', transition: 'opacity 0.15s, r 0.15s' }}
                    onMouseEnter={() => setHovered(nationality)}
                    onMouseLeave={() => setHovered(null)}
                    onClick={() => {
                      const c = composers[0];
                      if (c) { onSelectComposer(c); onClose(); }
                    }}
                  />
                  {(isHovered || composers.length >= 5) && (
                    <text
                      x={x} y={y - r - 4}
                      textAnchor="middle"
                      fontSize={isHovered ? 11 : 9}
                      fill="var(--text)"
                      style={{ pointerEvents: 'none', fontWeight: 600 }}
                    >
                      {nationality} ({composers.length})
                    </text>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Legend */}
          <div className="world-map-legend">
            {Object.values(PERIODS).map(p => (
              <div key={p.id} className="world-map-legend-item">
                <span className="world-map-legend-dot" style={{ background: p.color }} />
                <span>{p.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
