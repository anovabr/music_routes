import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import LineageSidebar from './components/LineageSidebar';
import TimelineView from './components/TimelineView';
import LoadingScreen from './components/LoadingScreen';
import ShortcutsModal from './components/ShortcutsModal';
import WorldMap from './components/WorldMap';
import { PERIODS, flatComposers } from './data/composers';

const DEFAULT_PERIODS = Object.keys(PERIODS).reduce(
  (acc, k) => ({ ...acc, [k]: true }),
  {}
);


export default function App() {
  const [loaded, setLoaded]       = useState(false);
  const THEMES = ['dark', 'light'];
  const THEME_LABELS = { dark: 'Dark', light: 'Light' };
  const THEME_TITLES = { dark: 'Classic dark', light: 'Classic light' };
  const [theme, setTheme]         = useState('dark');
  const [selectedComposer, setSelectedComposer] = useState(null);
  const [activeVideo, setActiveVideo]           = useState(null);
  const [activePeriods, setActivePeriods]       = useState(DEFAULT_PERIODS);
  const [searchQuery, setSearchQuery]   = useState('');
  const [searchOpen, setSearchOpen]     = useState(false);
  const [searchHighlight, setSearchHighlight] = useState(0);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [mapOpen, setMapOpen] = useState(false);
  const [mobileTab, setMobileTab] = useState('timeline');
  const [menuOpen, setMenuOpen]   = useState(false);
  const [nationalityFilter, setNationalityFilter] = useState(null);
  const [toast, setToast]         = useState(null); // { msg, id }
  const searchRef = useRef(null);
  const treeControlsRef = useRef(null);
  const toastCounterRef = useRef(0);
  const clefClicksRef = useRef(0);
  const clefTimerRef  = useRef(null);
  const konamiRef     = useRef([]);

  const allComposers = useMemo(() => flatComposers(), []);

  const periodCounts = useMemo(() => {
    const counts = {};
    Object.keys(PERIODS).forEach(p => counts[p] = 0);
    allComposers.forEach(c => { if (counts[c.period] !== undefined) counts[c.period]++; });
    return counts;
  }, [allComposers]);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return allComposers.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.nationality?.toLowerCase().includes(q)
    ).slice(0, 8);
  }, [searchQuery, allComposers]);

  // Toast helper
  const showToast = useCallback((msg) => {
    const id = ++toastCounterRef.current;
    setToast({ msg, id });
    setTimeout(() => setToast(t => t?.id === id ? null : t), 2500);
  }, []);

  // Share button — copy current URL
  const handleShare = useCallback(() => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      showToast('Link copied to clipboard!');
    }).catch(() => {
      showToast('Could not copy — copy the URL from your address bar');
    });
  }, [showToast]);

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
      if (e.key === 'Escape') {
        if (shortcutsOpen)  { setShortcutsOpen(false); return; }
        if (activeVideo)    { setActiveVideo(null); return; }
        if (searchOpen)     { setSearchOpen(false); setSearchQuery(''); return; }
        if (selectedComposer) setSelectedComposer(null);
      }
      if (e.key === '?' && !e.target.closest('input')) {
        e.preventDefault();
        setShortcutsOpen(s => !s);
      }
      if ((e.key === 'k' && (e.ctrlKey || e.metaKey)) || (e.key === '/' && !e.target.closest('input'))) {
        e.preventDefault();
        setSearchOpen(true);
        setTimeout(() => searchRef.current?.focus(), 50);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeVideo, searchOpen, selectedComposer, shortcutsOpen]);

  // Close search on outside click
  useEffect(() => {
    if (!searchOpen) return;
    const handle = (e) => {
      if (!e.target.closest('.search-container')) {
        setSearchOpen(false); setSearchQuery('');
      }
    };
    document.addEventListener('click', handle);
    return () => document.removeEventListener('click', handle);
  }, [searchOpen]);

  // Close hamburger on outside click
  useEffect(() => {
    if (!menuOpen) return;
    const handle = (e) => {
      if (!e.target.closest('.app-header')) setMenuOpen(false);
    };
    document.addEventListener('click', handle);
    return () => document.removeEventListener('click', handle);
  }, [menuOpen]);

  const toggleTheme = useCallback(() => {
    setTheme(t => {
      const next = THEMES[(THEMES.indexOf(t) + 1) % THEMES.length];
      if (next === 'light') showToast('If you really want to see this in light mode, it\'s better to leave. But fine.');
      return next;
    });
  }, [showToast]);

  const togglePeriod = useCallback((id) =>
    setActivePeriods(p => ({ ...p, [id]: !p[id] })), []);

  const toggleAllPeriods = useCallback((on) =>
    setActivePeriods(Object.keys(PERIODS).reduce((a, k) => ({ ...a, [k]: on }), {})), []);

  const handleOpenVideo = useCallback((video, composer) => {
    setActiveVideo({ video, composer });
    setSelectedComposer(composer);
    setMobileTab('lineage');
  }, []);

  const handleSelectComposer = useCallback((c) => {
    setSelectedComposer(c);
    setSearchOpen(false);
    setSearchQuery('');
    setMobileTab('lineage');
    setMenuOpen(false);
  }, []);

  // From tree view: select composer and jump to timeline card on mobile
  const handleSelectComposerFromTree = useCallback((c) => {
    setSelectedComposer(c);
    setMobileTab('timeline');
  }, []);

  const handleRandomComposer = useCallback(() => {
    const random = allComposers[Math.floor(Math.random() * allComposers.length)];
    handleSelectComposer(random);
  }, [allComposers, handleSelectComposer]);

  // Easter egg #1 — treble clef clicked 5× rapidly
  const handleClefClick = useCallback(() => {
    clefClicksRef.current += 1;
    clearTimeout(clefTimerRef.current);
    clefTimerRef.current = setTimeout(() => { clefClicksRef.current = 0; }, 1200);
    if (clefClicksRef.current >= 5) {
      clefClicksRef.current = 0;
      showToast('Maestro unlocked! The gods of music approve.');
    }
  }, [showToast]);

  // Easter egg #2 — Konami code
  const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  useEffect(() => {
    const handleKonami = (e) => {
      konamiRef.current = [...konamiRef.current, e.key].slice(-KONAMI.length);
      if (konamiRef.current.join(',') === KONAMI.join(',')) {
        showToast('↑↑↓↓←→←→ Hidden concerto unlocked!');
        konamiRef.current = [];
      }
    };
    window.addEventListener('keydown', handleKonami);
    return () => window.removeEventListener('keydown', handleKonami);
  }, [showToast]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="app" data-theme={theme}>
      {/* Loading intro */}
      {!loaded && <LoadingScreen onDone={() => setLoaded(true)} />}

      {/* Keyboard shortcuts modal */}
      {shortcutsOpen && <ShortcutsModal onClose={() => setShortcutsOpen(false)} />}
      {mapOpen && (
        <WorldMap
          onClose={() => setMapOpen(false)}
          onSelectComposer={handleSelectComposer}
        />
      )}

      {/* Toast notification */}
      {toast && <div className="toast" key={toast.id}>{toast.msg}</div>}

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <header className={`app-header${menuOpen ? ' menu-open' : ''}`}>
        <div
          className="header-logo"
          onClick={() => window.location.reload()}
          style={{ cursor: 'pointer' }}
          title="Classical Music — click to reload"
        >
          <span className="treble-clef" onClick={e => { e.stopPropagation(); handleClefClick(); }}>𝄞</span>
          <h1>Classical Music</h1>
          <span className="byline">by Luis Anunciação</span>
        </div>

        {/* Mobile-only: expand/collapse tree + theme — shown before hamburger */}
        {selectedComposer && (
          <span className="mobile-tree-controls">
            <button onClick={() => treeControlsRef.current?.expandAll()}>Expand</button>
            <button onClick={() => treeControlsRef.current?.collapseAll()}>Fold</button>
          </span>
        )}
        <button
          className="theme-toggle theme-toggle--mobile"
          onClick={toggleTheme}
          title={`Theme: ${THEME_TITLES[theme]} — tap to switch`}
        >
          {THEME_LABELS[theme]}
        </button>
        <button
          className="hamburger-btn"
          onClick={(e) => { e.stopPropagation(); setMenuOpen(m => !m); }}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        >
          <span className={menuOpen ? 'open' : ''} />
          <span className={menuOpen ? 'open' : ''} />
          <span className={menuOpen ? 'open' : ''} />
        </button>

        {/* Search */}
        <div className="search-container">
          <button
            className="search-toggle"
            onClick={(e) => { e.stopPropagation(); setSearchOpen(!searchOpen); setTimeout(() => searchRef.current?.focus(), 50); }}
            title="Search composers (Ctrl+K)"
          >
            Search
          </button>
          {searchOpen && (
            <div className="search-dropdown">
              <input
                ref={searchRef}
                type="text"
                className="search-input"
                placeholder="Search composers..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setSearchHighlight(0); }}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    setSearchHighlight(h => Math.min(h + 1, searchResults.length - 1));
                  } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    setSearchHighlight(h => Math.max(h - 1, 0));
                  } else if (e.key === 'Enter' && searchResults.length > 0) {
                    handleSelectComposer(searchResults[searchHighlight]);
                  }
                }}
              />
              {searchResults.length > 0 && (
                <div className="search-results">
                  {searchResults.map((c, i) => (
                    <div
                      key={c.id}
                      className={`search-result${i === searchHighlight ? ' highlighted' : ''}`}
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
            className="map-btn"
            onClick={() => setMapOpen(true)}
            title="Birthplace Map"
          >
            Map
          </button>
          {/* Share button */}
          <button
            className="share-btn"
            onClick={handleShare}
            title="Copy link to share"
          >
            Share
          </button>
          {/* Shortcuts hint */}
          <button
            className="shortcuts-btn"
            onClick={() => setShortcutsOpen(true)}
            title="Keyboard shortcuts (?)"
          >
            ?
          </button>
          <a
            href="https://buymeacoffee.com/luisfcab"
            target="_blank"
            rel="noopener noreferrer"
            className="bmc-btn"
            title="Buy me a coffee"
            onDoubleClick={e => { e.preventDefault(); showToast('You\'re a true patron of the arts! Grazie mille!'); }}
          >
            ☕ <span>Buy me a coffee</span>
          </a>
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            title={`Theme: ${THEME_TITLES[theme]} — click to switch`}
          >
            {THEME_LABELS[theme]}
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
            nationalityFilter={nationalityFilter}
            onNationalityFilterChange={setNationalityFilter}
          />
        </div>

        <LineageSidebar
          onRegisterControls={(controls) => { treeControlsRef.current = controls; }}
          composer={selectedComposer}
          onClose={() => setSelectedComposer(null)}
          onOpenVideo={handleOpenVideo}
          onSelectComposer={handleSelectComposer}
          onSelectComposerFromTree={handleSelectComposerFromTree}
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
          <span className="mobile-tab-icon">
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <rect x="2" y="4" width="16" height="2" rx="1" fill="currentColor"/>
              <rect x="2" y="9" width="16" height="2" rx="1" fill="currentColor"/>
              <rect x="2" y="14" width="16" height="2" rx="1" fill="currentColor"/>
            </svg>
          </span>
          <span>Timeline</span>
        </button>
        <button
          className={`mobile-tab ${mobileTab === 'lineage' ? 'active' : ''}`}
          onClick={() => setMobileTab('lineage')}
        >
          <span className="mobile-tab-icon">
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <circle cx="10" cy="3" r="2" fill="currentColor"/>
              <line x1="10" y1="5" x2="10" y2="8" stroke="currentColor" strokeWidth="1.5"/>
              <line x1="10" y1="8" x2="5" y2="11" stroke="currentColor" strokeWidth="1.5"/>
              <line x1="10" y1="8" x2="15" y2="11" stroke="currentColor" strokeWidth="1.5"/>
              <circle cx="5" cy="13" r="2" fill="currentColor"/>
              <circle cx="15" cy="13" r="2" fill="currentColor"/>
              <line x1="5" y1="15" x2="5" y2="18" stroke="currentColor" strokeWidth="1.5"/>
              <line x1="15" y1="15" x2="15" y2="18" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
          </span>
          <span>Lineage</span>
          {selectedComposer && <span className="mobile-tab-badge" />}
        </button>
      </nav>
    </div>
  );
}
