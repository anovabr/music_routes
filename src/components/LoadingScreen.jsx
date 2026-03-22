import { useEffect, useState } from 'react';

const TITLE    = 'Classical Music';
const SUBTITLE = 'by Luis Anunciação';
const EXIT_MS  = 233;

const VARIANTS = [
  { name: 'staff',  introMs: 1800 },
  { name: 'bloom',  introMs: 1600 },
  { name: 'violin', introMs: 2400 },
  { name: 'wave',   introMs: 2000 },
  { name: 'piano',  introMs: 2000 },
];

export default function LoadingScreen({ onDone }) {
  const [variant] = useState(() => VARIANTS[Math.floor(Math.random() * VARIANTS.length)]);
  const [phase,   setPhase] = useState('in');

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('out'), variant.introMs);
    const t2 = setTimeout(() => { setPhase('done'); onDone(); }, variant.introMs + EXIT_MS);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onDone, variant.introMs]);

  if (phase === 'done') return null;

  const v = variant.name;

  const waveOffset = (i) =>
    v === 'wave' ? Math.round(Math.sin(i * 0.72) * 14) : 0;

  return (
    <div
      className={`ls-root ${phase === 'out' ? 'ls-exit' : ''}`}
      data-variant={v}
      aria-hidden="true"
    >
      <div className="ls-curtain ls-curtain-l" />
      <div className="ls-curtain ls-curtain-r" />

      <div className="ls-content">

        {v === 'staff' && (
          <div className="ls-staff">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="ls-staff-line" style={{ '--i': i }} />
            ))}
            <span className="ls-clef">𝄞</span>
          </div>
        )}

        {v === 'bloom' && (
          <div className="ls-bloom-clef" aria-label="treble clef">𝄞</div>
        )}

        {v === 'violin' && (
          <>
            <div className="ls-bow" />
            <div className="ls-strings">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="ls-string" style={{ '--i': i }} />
              ))}
              <div className="ls-bridge" />
            </div>
          </>
        )}

        {v === 'wave' && (
          <div className="ls-staff">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="ls-staff-line" style={{ '--i': i }} />
            ))}
            <span className="ls-clef">𝄞</span>
          </div>
        )}

        {v === 'piano' && (
          <div className="ls-keyboard" aria-label="piano keyboard">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="ls-white-key" style={{ '--i': i }} />
            ))}
            {[13, 26, 52, 65, 78].map((left, i) => (
              <div key={i} className="ls-black-key" style={{ left: `${left}%`, '--bi': i }} />
            ))}
          </div>
        )}

        <h1 className="ls-title" aria-label={TITLE}>
          {TITLE.split('').map((ch, i) => (
            <span
              key={i}
              className="ls-char"
              style={{ '--i': i, '--wy': `${waveOffset(i)}px` }}
            >
              {ch === ' ' ? '\u00A0' : ch}
            </span>
          ))}
        </h1>

        <p className="ls-subtitle" aria-label={SUBTITLE}>
          {SUBTITLE.split('').map((ch, i) => (
            <span key={i} className="ls-char-sub" style={{ '--i': i }}>
              {ch}
            </span>
          ))}
        </p>

        {v !== 'violin' && <div className="ls-rule" />}

      </div>
    </div>
  );
}
