import { useState } from 'react';
import { PERIODS } from '../data/composers';

export default function FilterPanel({ activePeriods, onToggle, onToggleAll }) {
  const [collapsed, setCollapsed] = useState(false);
  const allOn = Object.values(activePeriods).every(Boolean);

  return (
    <aside className={`filter-panel${collapsed ? ' collapsed' : ''}`}>

      <button
        className="filter-collapse-btn"
        onClick={() => setCollapsed(c => !c)}
        title={collapsed ? 'Expand filters' : 'Collapse filters'}
      >
        {collapsed ? '›' : '‹'}
      </button>

      {!collapsed && (
        <div className="filter-body">
          <div className="filter-title">
            <span className="filter-title-icon">𝄞</span>
            Periods
          </div>

          <div className="filter-all-row">
            <button
              className={`filter-all-btn ${allOn ? 'active' : ''}`}
              onClick={() => onToggleAll(!allOn)}
            >
              {allOn ? 'Hide all' : 'Show all'}
            </button>
          </div>

          <div className="filter-list">
            {Object.values(PERIODS).map(p => (
              <button
                key={p.id}
                className={`filter-item ${activePeriods[p.id] ? 'active' : 'inactive'}`}
                onClick={() => onToggle(p.id)}
                style={{ '--period-color': p.color }}
              >
                <span className="filter-dot" />
                <span className="filter-name">{p.name}</span>
                <span className="filter-years">{p.years}</span>
              </button>
            ))}
          </div>

          <div className="filter-legend">
            <div className="legend-row">
              <span className="legend-icon">●</span> Composer / Performer
            </div>
            <div className="legend-row">
              <span className="legend-icon branch-icon">◆</span> Tradition branch
            </div>
            <div className="legend-row">
              <span className="legend-icon">⊞</span> Has hidden children
            </div>
            <div className="legend-row">
              <span className="legend-icon gold">▶</span> Has video
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
