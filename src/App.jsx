import { useState, useCallback, useMemo } from 'react';
import FilterPanel from './components/FilterPanel';
import VideoModal from './components/VideoModal';
import TimelineView from './components/TimelineView';
import { PERIODS, getAncestors, getComposerNode } from './data/composers';

const DEFAULT_PERIODS = Object.keys(PERIODS).reduce(
  (acc, k) => ({ ...acc, [k]: true }),
  {}
);

// Lineage breadcrumb component for header
function LineageBreadcrumb({ composer, onSelect, onClear }) {
  const ancestors = getAncestors(composer.id);
  const node = getComposerNode(composer.id);
  const childCount = node?.children?.filter(c => c.period)?.length || 0;

  return (
    <div className="lineage-breadcrumb">
      {ancestors.map((ancestor, idx) => (
        <span key={ancestor.id} className="breadcrumb-item">
          <button
            className="breadcrumb-link"
            onClick={() => onSelect(ancestor)}
            style={{ '--pc': PERIODS[ancestor.period]?.color }}
          >
            {ancestor.name}
          </button>
          <span className="breadcrumb-sep">→</span>
        </span>
      ))}
      <span
        className="breadcrumb-current"
        style={{ '--pc': PERIODS[composer.period]?.color }}
      >
        {composer.name}
        {childCount > 0 && <span className="breadcrumb-children">({childCount})</span>}
      </span>
      <button className="breadcrumb-clear" onClick={onClear} title="Clear selection">×</button>
    </div>
  );
}

export default function App() {
  const [theme, setTheme] = useState('dark');
  const [selectedComposer, setSelectedComposer] = useState(null);
  const [activeVideo, setActiveVideo] = useState(null);
  const [activePeriods, setActivePeriods] = useState(DEFAULT_PERIODS);

  const togglePeriod = useCallback((id) =>
    setActivePeriods(p => ({ ...p, [id]: !p[id] })), []);

  const toggleAllPeriods = useCallback((on) =>
    setActivePeriods(Object.keys(PERIODS).reduce((a, k) => ({ ...a, [k]: on }), {})), []);

  const handleOpenVideo = useCallback((video, composer) =>
    setActiveVideo({ video, composer }), []);

  const handleSelectComposer = useCallback((c) => setSelectedComposer(c), []);

  return (
    <div className="app" data-theme={theme}>

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <header className="app-header">
        <div className="header-logo">
          <span className="treble-clef">𝄞</span>
          <h1>Classical Music Neurotree</h1>
        </div>
        {/* Lineage Breadcrumb */}
        {selectedComposer && (
          <LineageBreadcrumb
            composer={selectedComposer}
            onSelect={handleSelectComposer}
            onClear={() => setSelectedComposer(null)}
          />
        )}
        <div className="header-controls">
          <button
            className="theme-toggle"
            onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
            title={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
          >
            {theme === 'dark' ? '☀' : '🌙'}
          </button>
        </div>
      </header>

      {/* ── Body ────────────────────────────────────────────────────────── */}
      <main className="app-main">
        <FilterPanel
          activePeriods={activePeriods}
          onToggle={togglePeriod}
          onToggleAll={toggleAllPeriods}
        />

        <div className="app-content">
          <TimelineView
            activePeriods={activePeriods}
            onSelectComposer={handleSelectComposer}
            onOpenVideo={handleOpenVideo}
          />
        </div>
      </main>

      {/* ── Video Modal ─────────────────────────────────────────────────── */}
      {activeVideo && (
        <VideoModal
          video={activeVideo.video}
          composer={activeVideo.composer}
          onClose={() => setActiveVideo(null)}
        />
      )}
    </div>
  );
}
