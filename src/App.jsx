import { useState, useCallback } from 'react';
import LineageSidebar from './components/LineageSidebar';
import VideoModal from './components/VideoModal';
import TimelineView from './components/TimelineView';
import { PERIODS } from './data/composers';

const DEFAULT_PERIODS = Object.keys(PERIODS).reduce(
  (acc, k) => ({ ...acc, [k]: true }),
  {}
);

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
          <a
            href="https://buymeacoffee.com/luisfcab"
            target="_blank"
            rel="noopener noreferrer"
            className="bmc-btn"
            title="Buy me a coffee"
          >
            ☕ Buy me a coffee
          </a>
        </div>
        {/* Period Filters */}
        <div className="header-periods">
          {Object.values(PERIODS).map(p => (
            <button
              key={p.id}
              className={`period-btn ${activePeriods[p.id] ? 'active' : ''}`}
              onClick={() => togglePeriod(p.id)}
              style={{ '--pc': p.color }}
              title={`${p.name} (${p.years})`}
            >
              <span className="period-dot" />
              <span className="period-name">{p.name}</span>
            </button>
          ))}
        </div>
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
        <div className="app-content">
          <TimelineView
            activePeriods={activePeriods}
            onSelectComposer={handleSelectComposer}
            onOpenVideo={handleOpenVideo}
          />
        </div>

        <LineageSidebar
          composer={selectedComposer}
          onClose={() => setSelectedComposer(null)}
          onOpenVideo={handleOpenVideo}
          onSelectComposer={handleSelectComposer}
        />
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
