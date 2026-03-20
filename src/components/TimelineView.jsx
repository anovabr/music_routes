import { useMemo, useState } from 'react';
import { flatComposers, PERIODS, countDescendants } from '../data/composers';

export default function TimelineView({ activePeriods, selectedComposer, onSelectComposer, onOpenVideo }) {
  const all = useMemo(() => flatComposers(), []);
  const [collapsed, setCollapsed] = useState({});
  const togglePeriod = (pid) => setCollapsed(p => ({ ...p, [pid]: !p[pid] }));

  const filtered = useMemo(() => {
    return all.filter(c => activePeriods[c.period] !== false);
  }, [all, activePeriods]);

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
              <div
                className="timeline-period-header"
                onClick={() => togglePeriod(pid)}
                style={{ cursor: 'pointer', userSelect: 'none' }}
              >
                <span className="timeline-period-dot" />
                <h3 className="timeline-period-name">{period.name}</h3>
                <span className="timeline-period-years">{period.years}</span>
                <span className="timeline-period-count">{composers.length}</span>
                <span className="timeline-period-chevron">{collapsed[pid] ? '▶' : '▼'}</span>
              </div>
              {!collapsed[pid] && <div className="timeline-grid">
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
                          🎵
                        </a>
                        <a
                          href={`https://music.apple.com/search?term=${encodeURIComponent(c.name)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="tcard-stream-link"
                          title={`${c.name} on Apple Music`}
                        >
                          🎧
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
