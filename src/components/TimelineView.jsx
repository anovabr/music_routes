import { useMemo, useState, useCallback, useEffect, useRef } from 'react';
import { flatComposers, PERIODS, countDescendants } from '../data/composers';

export default function TimelineView({ activePeriods, selectedComposer, onSelectComposer, onOpenVideo, yearFilter, onYearFilterChange, nationalityFilter, onNationalityFilterChange }) {
  const all = useMemo(() => flatComposers(), []);
  const [collapsedPeriods, setCollapsedPeriods] = useState({});

  const togglePeriodCollapse = useCallback((pid) => {
    setCollapsedPeriods(prev => ({ ...prev, [pid]: !prev[pid] }));
  }, []);

  const filtered = useMemo(() => {
    return all.filter(c =>
      activePeriods[c.period] !== false &&
      (yearFilter === null || c.born <= yearFilter) &&
      (nationalityFilter === null || c.nationality === nationalityFilter)
    );
  }, [all, activePeriods, yearFilter, nationalityFilter]);

  const grouped = useMemo(() => {
    const map = {};
    filtered.forEach(c => {
      if (!map[c.period]) map[c.period] = [];
      map[c.period].push(c);
    });
    return map;
  }, [filtered]);

  const periodOrder = Object.keys(PERIODS);
  const visiblePeriods = periodOrder.filter(pid => grouped[pid]?.length);
  const allCollapsed = visiblePeriods.length > 0 && visiblePeriods.every(pid => !!collapsedPeriods[pid]);

  const toggleAll = useCallback(() => {
    const next = !allCollapsed;
    setCollapsedPeriods(visiblePeriods.reduce((acc, pid) => ({ ...acc, [pid]: next }), {}));
  }, [allCollapsed, visiblePeriods]);

  const contentRef = useRef(null);
  const selectedCardRef = useRef(null);

  useEffect(() => {
    const container = contentRef.current;
    if (!container) return;
    const ratioMap = new Map();
    let currentPid = null;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        const pid = e.target.dataset.period;
        if (pid) ratioMap.set(pid, e.intersectionRatio);
      });
      let bestPid = null, bestRatio = -1;
      ratioMap.forEach((r, p) => { if (r > bestRatio) { bestRatio = r; bestPid = p; } });
      if (bestPid && bestPid !== currentPid) {
        currentPid = bestPid;
        document.documentElement.style.setProperty('--period-glow', PERIODS[bestPid].color);
      }
    }, { root: container, threshold: [0, 0.1, 0.25, 0.5, 0.75, 1] });
    container.querySelectorAll('[data-period]').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [visiblePeriods]);

  // When selectedComposer changes, uncollapse its period and scroll its card into view
  useEffect(() => {
    if (!selectedComposer) return;
    setCollapsedPeriods(prev => ({ ...prev, [selectedComposer.period]: false }));
    // Scroll after a brief tick so the period can expand first
    setTimeout(() => {
      selectedCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 80);
  }, [selectedComposer?.id]);

  return (
    <div className="timeline-view">
      {nationalityFilter && (
        <div className="nationality-filter-bar">
          Showing: <strong>{nationalityFilter}</strong> composers
          <button onClick={() => onNationalityFilterChange(null)}>Clear</button>
        </div>
      )}
      <div className="timeline-toolbar">
        <button className="timeline-toggle-all" onClick={toggleAll}>
          {allCollapsed ? '▶ Expand all' : '▼ Fold all'}
        </button>
        <div className="year-scrubber">
          <span className="year-scrubber-label">
            {yearFilter === null ? 'All eras' : yearFilter}
          </span>
          <input
            className="year-scrubber-input"
            type="range"
            min={500}
            max={2024}
            step={5}
            value={yearFilter ?? 2024}
            onChange={e => {
              const v = +e.target.value;
              onYearFilterChange(v >= 2024 ? null : v);
            }}
          />
          {yearFilter !== null && (
            <button className="year-scrubber-reset" onClick={() => onYearFilterChange(null)} title="Reset">✕</button>
          )}
        </div>
      </div>
      <div className="timeline-content" ref={contentRef}>
        {periodOrder.map(pid => {
          const composers = grouped[pid];
          if (!composers?.length) return null;
          const period = PERIODS[pid];
          const isCollapsed = !!collapsedPeriods[pid];
          return (
            <section
              key={pid}
              id={`period-${pid}`}
              data-period={pid}
              className="timeline-section"
              style={{ '--pc': period.color }}
            >
              <div
                className="timeline-period-header"
                onClick={() => togglePeriodCollapse(pid)}
                role="button"
                aria-expanded={!isCollapsed}
                title={isCollapsed ? `Expand ${period.name}` : `Collapse ${period.name}`}
              >
                <span className="timeline-period-dot" />
                <h3 className="timeline-period-name">{period.name}</h3>
                <span className="timeline-period-years">{period.years}</span>
                <span className="timeline-period-count">{composers.length}</span>
                <span className="timeline-period-chevron">{isCollapsed ? '▶' : '▼'}</span>
              </div>
              {!isCollapsed && <div className="timeline-grid">
                {composers.map(c => {
                  const isSelected = selectedComposer?.id === c.id;
                  const isTeacher  = selectedComposer && c.id === selectedComposer.parentId;
                  const isStudent  = selectedComposer && selectedComposer.childrenIds?.includes(c.id);
                  const isDimmed   = selectedComposer && !isSelected && !isTeacher && !isStudent;

                  const cardClass = [
                    'timeline-card',
                    isSelected ? 'is-selected'    : '',
                    isTeacher  ? 'tcard--teacher' : '',
                    isStudent  ? 'tcard--student' : '',
                    isDimmed   ? 'tcard--dim'     : '',
                  ].filter(Boolean).join(' ');

                  const descendants = countDescendants(c.id);
                  const spotifyUrl = `https://open.spotify.com/search/${encodeURIComponent(c.name)}`;

                  return (
                    <div
                      key={c.id}
                      ref={isSelected ? selectedCardRef : null}
                      className={cardClass}
                      onClick={() => onSelectComposer(isSelected ? null : c)}
                    >
                      <div className="tcard-header">
                        <div className="tcard-dot" style={{ background: period.color }} />
                        <h4 className="tcard-name">{c.name}</h4>
                        {descendants > 0 && (
                          <span className="tcard-influence" title={`${descendants} musical descendants`}>
                            {descendants}
                          </span>
                        )}
                      </div>

                      <div className="tcard-meta">
                        <span className="tcard-dates">{c.born}–{c.died || ''}</span>
                        {c.nationality && <span className="tcard-nat">{c.nationality}</span>}
                      </div>

                      {c.description && (
                        <p className="tcard-desc">
                          {c.description.slice(0, 120)}{c.description.length > 120 ? '…' : ''}
                        </p>
                      )}

                      {c.videos?.length > 0 && (
                        <div className="tcard-videos">
                          {c.videos.slice(0, 3).map((v, i) => (
                            <button
                              key={i}
                              className="tcard-video-btn"
                              onClick={e => { e.stopPropagation(); onOpenVideo(v, c); }}
                              title={v.title}
                            >
                              <span className="tcard-play">▶</span>
                              <span className="tcard-vtitle">{v.title}</span>
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Streaming links */}
                      <div className="tcard-streaming" onClick={e => e.stopPropagation()}>
                        <a
                          href={spotifyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="tcard-stream-link"
                          title={`${c.name} on Spotify`}
                        >
                          S
                        </a>
                        <a
                          href={`https://music.apple.com/search?term=${encodeURIComponent(c.name)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="tcard-stream-link"
                          title={`${c.name} on Apple Music`}
                        >
                          A
                        </a>
                        <a
                          href={`https://www.youtube.com/results?search_query=${encodeURIComponent(c.name + ' classical')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="tcard-stream-link"
                          title={`${c.name} on YouTube`}
                        >
                          ▶
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>}
            </section>
          );
        })}
      </div>
    </div>
  );
}
