import { useMemo } from 'react';
import { flatComposers, PERIODS } from '../data/composers';

export default function TimelineView({ activePeriods, selectedComposer, onSelectComposer, onOpenVideo }) {
  const all = useMemo(() => flatComposers(), []);

  const filtered = useMemo(() => {
    return all.filter(c => {
      if (activePeriods[c.period] === false) return false;
      return true;
    });
  }, [all, activePeriods]);

  // Group by period
  const grouped = useMemo(() => {
    const map = {};
    filtered.forEach(c => {
      if (!map[c.period]) map[c.period] = [];
      map[c.period].push(c);
    });
    return map;
  }, [filtered]);

  const periodOrder = Object.keys(PERIODS);

  return (
    <div className="timeline-view">
      <div className="timeline-content">
        {periodOrder.map(pid => {
          const composers = grouped[pid];
          if (!composers?.length) return null;
          const period = PERIODS[pid];
          return (
            <section
              key={pid}
              id={`period-${pid}`}
              className="timeline-section"
              style={{ '--pc': period.color }}
            >
              <div className="timeline-period-header">
                <span className="timeline-period-dot" />
                <h3 className="timeline-period-name">{period.name}</h3>
                <span className="timeline-period-years">{period.years}</span>
                <span className="timeline-period-count">{composers.length}</span>
              </div>
              <div className="timeline-grid">
                {composers.map(c => (
                  <div
                    key={c.id}
                    className={`timeline-card ${selectedComposer?.id === c.id ? 'is-selected' : ''}`}
                    onClick={() => onSelectComposer(c)}
                  >
                    {/* Quick play button */}
                    {c.videos?.length > 0 && (
                      <button
                        className="tcard-quick-play"
                        onClick={e => { e.stopPropagation(); onOpenVideo(c.videos[0], c); }}
                        title={`Play: ${c.videos[0].title}`}
                      >
                        ▶
                      </button>
                    )}
                    <div className="tcard-header">
                      <div className="tcard-dot" style={{ background: period.color }} />
                      <h4 className="tcard-name">{c.name}</h4>
                    </div>
                    <div className="tcard-meta">
                      <span className="tcard-dates">
                        {c.born}–{c.died || ''}
                      </span>
                      {c.nationality && (
                        <span className="tcard-nat">{c.nationality}</span>
                      )}
                    </div>
                    {c.description && (
                      <p className="tcard-desc">
                        {c.description.slice(0, 120)}
                        {c.description.length > 120 ? '…' : ''}
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
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
