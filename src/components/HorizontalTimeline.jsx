import { useMemo, useState, useRef, useCallback, useEffect } from 'react';
import { flatComposers, PERIODS } from '../data/composers';

const START_YEAR = 1050;
const END_YEAR = 2030;
const YEAR_WIDTH = 8; // pixels per year

export default function HorizontalTimeline({ onSelectComposer, onOpenVideo, onClose }) {
  const composers = useMemo(() => flatComposers(), []);
  const containerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [hoveredComposer, setHoveredComposer] = useState(null);
  const [selectedComposer, setSelectedComposer] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Calculate total width
  const totalWidth = (END_YEAR - START_YEAR) * YEAR_WIDTH;

  // Group composers by period for y-positioning
  const periodOrder = Object.keys(PERIODS);
  
  // Calculate y positions to avoid overlap
  const composerPositions = useMemo(() => {
    const positions = [];
    const occupiedSlots = {}; // year -> [occupied y levels]
    
    // Sort by birth year
    const sorted = [...composers].sort((a, b) => a.born - b.born);
    
    sorted.forEach(c => {
      const x = (c.born - START_YEAR) * YEAR_WIDTH;
      const periodIdx = periodOrder.indexOf(c.period);
      const baseY = 120 + (periodIdx % 3) * 90; // Stagger by period
      
      // Find available y slot
      const yearKey = Math.floor(c.born / 15) * 15; // Group by 15-year spans
      if (!occupiedSlots[yearKey]) occupiedSlots[yearKey] = [];
      
      let y = baseY;
      let attempts = 0;
      while (occupiedSlots[yearKey].some(oy => Math.abs(oy - y) < 70) && attempts < 8) {
        y += 75;
        attempts++;
      }
      occupiedSlots[yearKey].push(y);
      
      positions.push({ ...c, x, y: Math.min(y, 400) });
    });
    
    return positions;
  }, [composers, periodOrder]);

  // Generate year markers
  const yearMarkers = useMemo(() => {
    const markers = [];
    for (let year = Math.ceil(START_YEAR / 50) * 50; year <= END_YEAR; year += 50) {
      markers.push({
        year,
        x: (year - START_YEAR) * YEAR_WIDTH,
        isCentury: year % 100 === 0,
      });
    }
    return markers;
  }, []);

  // Period bands
  const periodBands = useMemo(() => {
    const bands = [];
    const periodRanges = {
      MEDIEVAL: [1050, 1400],
      RENAISSANCE: [1400, 1600],
      BAROQUE: [1600, 1750],
      CLASSICAL: [1750, 1820],
      ROMANTIC: [1820, 1870],
      LATE_ROMANTIC: [1870, 1920],
      IMPRESSIONIST: [1880, 1920],
      MODERN: [1900, 1950],
      AVANT_GARDE: [1945, 1975],
      MINIMALISM: [1960, 1990],
      NEW_SIMPLICITY: [1975, 2000],
      CONTEMPORARY: [1950, 2030],
    };
    
    Object.entries(PERIODS).forEach(([id, period]) => {
      const range = periodRanges[id];
      if (!range) return;
      bands.push({
        id,
        name: period.name,
        color: period.color,
        x: (range[0] - START_YEAR) * YEAR_WIDTH,
        width: (range[1] - range[0]) * YEAR_WIDTH,
      });
    });
    return bands;
  }, []);

  // Scroll to center on load
  useEffect(() => {
    if (containerRef.current) {
      // Start at 1700 (middle of classical era)
      const startPos = (1700 - START_YEAR) * YEAR_WIDTH - window.innerWidth / 2;
      containerRef.current.scrollLeft = startPos;
      setTimeout(() => setIsLoaded(true), 100);
    }
  }, []);

  // Mouse drag handlers
  const handleMouseDown = useCallback((e) => {
    if (e.target.closest('.htl-composer-card')) return;
    setIsDragging(true);
    setStartX(e.pageX - containerRef.current.offsetLeft);
    setScrollLeft(containerRef.current.scrollLeft);
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    containerRef.current.scrollLeft = scrollLeft - walk;
  }, [isDragging, startX, scrollLeft]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Touch handlers
  const handleTouchStart = useCallback((e) => {
    if (e.target.closest('.htl-composer-card')) return;
    setStartX(e.touches[0].pageX - containerRef.current.offsetLeft);
    setScrollLeft(containerRef.current.scrollLeft);
  }, []);

  const handleTouchMove = useCallback((e) => {
    const x = e.touches[0].pageX - containerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    containerRef.current.scrollLeft = scrollLeft - walk;
  }, [startX, scrollLeft]);

  // Handle wheel for horizontal scroll
  const handleWheel = useCallback((e) => {
    if (containerRef.current) {
      e.preventDefault();
      containerRef.current.scrollLeft += e.deltaY;
    }
  }, []);

  const handleComposerClick = useCallback((c) => {
    setSelectedComposer(selectedComposer?.id === c.id ? null : c);
  }, [selectedComposer]);

  const handlePlayVideo = useCallback((video, composer) => {
    onOpenVideo(video, composer);
  }, [onOpenVideo]);

  return (
    <div className={`htl-container ${isLoaded ? 'htl-loaded' : ''}`}>
      {/* Header */}
      <div className="htl-header">
        <button className="htl-back" onClick={onClose}>
          <span className="htl-back-arrow">←</span>
          <span>Back</span>
        </button>
        <h1 className="htl-title">A Journey Through Musical Time</h1>
        <div className="htl-hint">
          <span>Drag to explore</span>
          <span className="htl-hint-arrow">← →</span>
        </div>
      </div>

      {/* Main timeline */}
      <div
        ref={containerRef}
        className={`htl-scroll ${isDragging ? 'htl-dragging' : ''}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onWheel={handleWheel}
      >
        <div className="htl-track" style={{ width: totalWidth }}>
          {/* Period bands */}
          <div className="htl-periods">
            {periodBands.map(band => (
              <div
                key={band.id}
                className="htl-period-band"
                style={{
                  left: band.x,
                  width: band.width,
                  background: `linear-gradient(180deg, ${band.color}22 0%, ${band.color}08 100%)`,
                  borderLeft: `2px solid ${band.color}`,
                }}
              >
                <span className="htl-period-label" style={{ color: band.color }}>
                  {band.name}
                </span>
              </div>
            ))}
          </div>

          {/* Year markers */}
          <div className="htl-years">
            {yearMarkers.map(m => (
              <div
                key={m.year}
                className={`htl-year-marker ${m.isCentury ? 'htl-century' : ''}`}
                style={{ left: m.x }}
              >
                <div className="htl-year-line" />
                <span className="htl-year-label">{m.year}</span>
              </div>
            ))}
          </div>

          {/* Timeline axis */}
          <div className="htl-axis" />

          {/* Composer nodes */}
          <div className="htl-composers">
            {composerPositions.map(c => {
              const period = PERIODS[c.period];
              const isHovered = hoveredComposer?.id === c.id;
              const isSelected = selectedComposer?.id === c.id;
              
              return (
                <div
                  key={c.id}
                  className={`htl-composer-card ${isHovered ? 'htl-hovered' : ''} ${isSelected ? 'htl-selected' : ''}`}
                  style={{
                    left: c.x,
                    top: c.y,
                    '--pc': period?.color || '#888',
                  }}
                  onMouseEnter={() => setHoveredComposer(c)}
                  onMouseLeave={() => setHoveredComposer(null)}
                  onClick={() => handleComposerClick(c)}
                >
                  <div className="htl-composer-dot" />
                  <div className="htl-composer-line" />
                  <div className="htl-composer-content">
                    <span className="htl-composer-name">{c.name}</span>
                    <span className="htl-composer-dates">{c.born}–{c.died || ''}</span>
                  </div>
                  
                  {isSelected && (
                    <div className="htl-composer-expanded">
                      <p className="htl-composer-desc">
                        {c.description?.slice(0, 200)}{c.description?.length > 200 ? '...' : ''}
                      </p>
                      {c.nationality && (
                        <span className="htl-composer-nat">{c.nationality}</span>
                      )}
                      {c.videos?.length > 0 && (
                        <div className="htl-composer-videos">
                          {c.videos.slice(0, 2).map((v, i) => (
                            <button
                              key={i}
                              className="htl-video-btn"
                              onClick={(e) => { e.stopPropagation(); handlePlayVideo(v, c); }}
                            >
                              <span className="htl-play-icon">▶</span>
                              {v.title}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Floating year indicator */}
      <div className="htl-floating-year">
        <span className="htl-floating-label">Scroll through</span>
        <span className="htl-floating-range">1050 — 2026</span>
      </div>
    </div>
  );
}
