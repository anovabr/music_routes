import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import LineageSidebar from './components/LineageSidebar';
import TimelineView from './components/TimelineView';
import { PERIODS, flatComposers } from './data/composers';

const DEFAULT_PERIODS = Object.keys(PERIODS).reduce(
  (acc, k) => ({ ...acc, [k]: true }),
  {}
);

export default function App() {
  const [theme, setTheme] = useState('dark');
  const [selectedComposer, setSelectedComposer] = useState(null);
  const [activeVideo, setActiveVideo] = useState(null);
  const [activePeriods, setActivePeriods] = useState(DEFAULT_PERIODS);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef(null);

  // Get all composers for search and counts
  const allComposers = useMemo(() => flatComposers(), []);

  // Composer counts per period
  const periodCounts = useMemo(() => {
    const counts = {};
    Object.keys(PERIODS).forEach(p => counts[p] = 0);
    allComposers.forEach(c => { if (counts[c.period] !== undefined) counts[c.period]++; });
    return counts;
  }, [allComposers]);

  // Search results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return allComposers.filter(c => 
      c.name.toLowerCase().includes(q) ||
      c.nationality?.toLowerCase().includes(q)
    ).slice(0, 8);
  }, [searchQuery, allComposers]);

  // URL sync - read on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const composerId = params.get('composer');
    if (composerId) {
      const composer = allComposers.find(c => c.id === composerId);
      if (composer) setSelectedComposer(composer);
    }
  }, [allComposers]);

  // URL sync - write on change
  useEffect(() => {
    const url = new URL(window.location.href);
    if (selectedComposer) {
      url.searchParams.set('composer', selectedComposer.id);
    } else {
      url.searchParams.delete('composer');
    }
    window.history.replaceState({}, '', url);
  }, [selectedComposer]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Escape closes modals/search
      if (e.key === 'Escape') {
        if (activeVideo) setActiveVideo(null);
        else if (searchOpen) { setSearchOpen(false); setSearchQuery(''); }
        else if (selectedComposer) setSelectedComposer(null);
      }
      // Ctrl+K or / opens search
      if ((e.key === 'k' && (e.ctrlKey || e.metaKey)) || (e.key === '/' && !e.target.closest('input'))) {
        e.preventDefault();
        setSearchOpen(true);
        setTimeout(() => searchRef.current?.focus(), 50);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeVideo, searchOpen, selectedComposer]);

  // Close search when clicking outside
  useEffect(() => {
    if (!searchOpen) return;
    const handleClick = (e) => {
      if (!e.target.closest('.search-container')) {
        setSearchOpen(false);
        setSearchQuery('');
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [searchOpen]);

  const togglePeriod = useCallback((id) =>
    setActivePeriods(p => ({ ...p, [id]: !p[id] })), []);

  const toggleAllPeriods = useCallback((on) =>
    setActivePeriods(Object.keys(PERIODS).reduce((a, k) => ({ ...a, [k]: on }), {})), []);

  const handleOpenVideo = useCallback((video, composer) =>
    setActiveVideo({ video, composer }), []);

  const [mobileTab, setMobileTab] = useState('timeline');

  const handleSelectComposer = useCallback((c) => {
    setSelectedComposer(c);
    setSearchOpen(false);
    setSearchQuery('');
    setMobileTab('lineage');
  }, []);

  // Random composer
  const handleRandomComposer = useCallback(() => {
    const random = allComposers[Math.floor(Math.random() * allComposers.length)];
    handleSelectComposer(random);
  }, [allComposers, handleSelectComposer]);

  return (
    <div className="app" data-theme={theme}>

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <header className="app-header">
        <div className="header-logo">
          <span className="treble-clef">𝄞</span>
          <h1>Classical Music Neurotree</h1>
          <span className="byline">by Luis Anunciação</span>
        </div>

        {/* Search */}
        <div className="search-container">
          <button 
            className="search-toggle" 
            onClick={(e) => { e.stopPropagation(); setSearchOpen(!searchOpen); setTimeout(() => searchRef.current?.focus(), 50); }}
            title="Search composers (Ctrl+K)"
          >
            🔍
          </button>
          {searchOpen && (
            <div className="search-dropdown">
              <input
                ref={searchRef}
                type="text"
                className="search-input"
                placeholder="Search composers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchResults.length > 0) {
                    handleSelectComposer(searchResults[0]);
                  }
                }}
              />
              {searchResults.length > 0 && (
                <div className="search-results">
                  {searchResults.map(c => (
                    <div 
                      key={c.id} 
                      className="search-result"
                      style={{ '--pc': PERIODS[c.period]?.color }}
                      onClick={() => handleSelectComposer(c)}
                    >
                      <span className="search-result-dot" />
                      <span className="search-result-name">{c.name}</span>
                      <span className="search-result-years">{c.born}–{c.died || ''}</span>
                    </div>
                  ))}
                </div>
              )}
              {searchQuery && searchResults.length === 0 && (
                <div className="search-empty">No composers found</div>
              )}
            </div>
          )}
        </div>

        {/* Period Links */}
        <nav className="header-periods">
          {Object.values(PERIODS).map(p => (
            <a
              key={p.id}
              href={`#period-${p.id}`}
              className="period-btn"
              style={{ '--pc': p.color }}
              title={`${p.name} (${p.years})`}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(`period-${p.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
            >
              <span className="period-dot" />
              <span className="period-name">{p.name}</span>
              <span className="period-count">{periodCounts[p.id]}</span>
            </a>
          ))}
        </nav>

        <div className="header-controls">
          <button
            className="random-btn"
            onClick={handleRandomComposer}
            title="Discover a random composer"
          >
            🎲
          </button>
          <a
            href="https://buymeacoffee.com/luisfcab"
            target="_blank"
            rel="noopener noreferrer"
            className="bmc-btn"
            title="Buy me a coffee"
          >
            ☕ Buy me a coffee
          </a>
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
      <main className="app-main" data-mobile-tab={mobileTab}>
        <div className="app-content">
          <TimelineView
            activePeriods={activePeriods}
            selectedComposer={selectedComposer}
            onSelectComposer={handleSelectComposer}
            onOpenVideo={handleOpenVideo}
          />
        </div>

        <LineageSidebar
          composer={selectedComposer}
          onClose={() => setSelectedComposer(null)}
          onOpenVideo={handleOpenVideo}
          onSelectComposer={handleSelectComposer}
          activeVideo={activeVideo}
          onCloseVideo={() => setActiveVideo(null)}
        />
      </main>

      {/* ── Mobile Tab Bar ───────────────────────────────────────────────── */}
      <nav className="mobile-tab-bar">
        <button
          className={`mobile-tab ${mobileTab === 'timeline' ? 'active' : ''}`}
          onClick={() => setMobileTab('timeline')}
        >
          <span className="mobile-tab-icon">🎼</span>
          <span>Timeline</span>
        </button>
        <button
          className={`mobile-tab ${mobileTab === 'lineage' ? 'active' : ''}`}
          onClick={() => setMobileTab('lineage')}
        >
          <span className="mobile-tab-icon">🌳</span>
          <span>Lineage</span>
          {selectedComposer && <span className="mobile-tab-badge" />}
        </button>
      </nav>
    </div>
  );
}
