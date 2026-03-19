import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import LineageSidebar from './components/LineageSidebar';
import TimelineView from './components/TimelineView';
import LoadingScreen from './components/LoadingScreen';
import ShortcutsModal from './components/ShortcutsModal';
import { PERIODS, flatComposers } from './data/composers';

const DEFAULT_PERIODS = Object.keys(PERIODS).reduce(
  (acc, k) => ({ ...acc, [k]: true }),
  {}
);

// Deterministic "composer of the day" based on UTC date
function getComposerOfDay(composers) {
  if (!composers.length) return null;
  const d = new Date();
  const seed = d.getUTCFullYear() * 10000 + (d.getUTCMonth() + 1) * 100 + d.getUTCDate();
  return composers[seed % composers.length];
}

export default function App() {
  const [loaded, setLoaded]       = useState(false);
  const [theme, setTheme]         = useState('dark');
  const [selectedComposer, setSelectedComposer] = useState(null);
  const [activeVideo, setActiveVideo]           = useState(null);
  const [activePeriods, setActivePeriods]       = useState(DEFAULT_PERIODS);
  const [searchQuery, setSearchQuery]   = useState('');
  const [searchOpen, setSearchOpen]     = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [mobileTab, setMobileTab] = useState('timeline');
  const [menuOpen, setMenuOpen]   = useState(false);
  const [toast, setToast]         = useState(null); // { msg, id }
  const searchRef = useRef(null);
  const clefClicksRef = useRef(0);
  const clefTimerRef  = useRef(null);
  const konamiRef     = useRef([]);

  const allComposers = useMemo(() => flatComposers(), []);
  const composerOfDay = useMemo(() => getComposerOfDay(allComposers), [allComposers]);

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
    const id = Date.now();
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

  const togglePeriod = useCallback((id) =>
    setActivePeriods(p => ({ ...p, [id]: !p[id] })), []);

  const toggleAllPeriods = useCallback((on) =>
    setActivePeriods(Object.keys(PERIODS).reduce((a, k) => ({ ...a, [k]: on }), {})), []);

  const handleOpenVideo = useCallback((video, composer) =>
    setActiveVideo({ video, composer }), []);

  const handleSelectComposer = useCallback((c) => {
    setSelectedComposer(c);
    setSearchOpen(false);
    setSearchQuery('');
    setMobileTab('lineage');
    setMenuOpen(false);
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
      showToast('🎹 Maestro unlocked! The gods of music approve.');
    }
  }, [showToast]);

  // Easter egg #2 — Konami code
  const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  useEffect(() => {
    const handleKonami = (e) => {
      konamiRef.current = [...konamiRef.current, e.key].slice(-KONAMI.length);
      if (konamiRef.current.join(',') === KONAMI.join(',')) {
        showToast('🎼 ↑↑↓↓←→←→ Hidden concerto unlocked! 🎵');
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

        {/* Hamburger button — mobile only */}
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
          {/* Composer of the Day */}
          {composerOfDay && (
            <button
              className="cotd-btn"
              onClick={() => handleSelectComposer(composerOfDay)}
              title={`Today's featured composer: ${composerOfDay.name}`}
            >
              ✨ {composerOfDay.name}
            </button>
          )}
          <button
            className="random-btn"
            onClick={handleRandomComposer}
            title="Discover a random composer"
          >
            🎲
          </button>
          {/* Share button */}
          <button
            className="share-btn"
            onClick={handleShare}
            title="Copy link to share"
          >
            🔗
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
            onDoubleClick={e => { e.preventDefault(); showToast('☕ You\'re a true patron of the arts! Grazie mille! 🎶'); }}
          >
            ☕ <span>Buy me a coffee</span>
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
