import { useState, useCallback, useMemo } from 'react';
import MusicTree from './components/MusicTree';
import FilterPanel from './components/FilterPanel';
import ComposerPanel from './components/ComposerPanel';
import VideoModal from './components/VideoModal';
import TimelineView from './components/TimelineView';
import { PERIODS } from './data/composers';

const DEFAULT_PERIODS = Object.keys(PERIODS).reduce(
  (acc, k) => ({ ...acc, [k]: true }),
  {}
);

export default function App() {
  const [theme, setTheme] = useState('dark');
  const [view, setView] = useState('tree');
  const [selectedComposer, setSelectedComposer] = useState(null);
  const [activeVideo, setActiveVideo] = useState(null);   // { video, composer }
  const [activePeriods, setActivePeriods] = useState(DEFAULT_PERIODS);

  const togglePeriod = useCallback((id) =>
    setActivePeriods(p => ({ ...p, [id]: !p[id] })), []);

  const toggleAllPeriods = useCallback((on) =>
    setActivePeriods(Object.keys(PERIODS).reduce((a, k) => ({ ...a, [k]: on }), {})), []);

  const handleOpenVideo = useCallback((video, composer) =>
    setActiveVideo({ video, composer }), []);

  const handleSelectComposer = useCallback((c) => setSelectedComposer(c), []);

  // Memoize to avoid passing new reference on every render
  const treeKey = useMemo(() => theme, [theme]);

  return (
    <div className="app" data-theme={theme}>

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <header className="app-header">
        <div className="header-logo">
          <span className="treble-clef">𝄞</span>
          <h1>Classical Music Neurotree</h1>
        </div>

        <div className="header-controls">
          <div className="view-toggle">
            <button
              className={view === 'tree' ? 'active' : ''}
              onClick={() => setView('tree')}
            >
              🌳 Tree
            </button>
            <button
              className={view === 'timeline' ? 'active' : ''}
              onClick={() => setView('timeline')}
            >
              📅 Timeline
            </button>
          </div>

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
          {view === 'tree' ? (
            <MusicTree
              key={treeKey}
              theme={theme}
              activePeriods={activePeriods}
              onSelectComposer={handleSelectComposer}
              onOpenVideo={handleOpenVideo}
            />
          ) : (
            <TimelineView
              activePeriods={activePeriods}
              onSelectComposer={handleSelectComposer}
              onOpenVideo={handleOpenVideo}
            />
          )}
        </div>

        {selectedComposer && (
          <ComposerPanel
            composer={selectedComposer}
            onClose={() => setSelectedComposer(null)}
            onOpenVideo={handleOpenVideo}
          />
        )}
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
