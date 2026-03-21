import { useEffect, useState } from 'react';

const TITLE    = 'Classical Music';
const SUBTITLE = 'by Luis Anunciação';
const EXIT_MS  = 233;

const VARIANTS = [
  { name: 'staff',  introMs: 1800 }, // classic staff lines + treble clef, letters stagger up
  { name: 'bloom',  introMs: 1600 }, // HUGE clef blooms from centre, no staff, gold
  { name: 'violin', introMs: 2400 }, // bow-stroke first, then 4 violin strings, warm amber
  { name: 'wave',   introMs: 2000 }, // letters bounce in as a visible ripple wave, gradient title
  { name: 'piano',  introMs: 2000 }, // mini piano keyboard drops in, ivory tones
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

  // Wave variant: sine-offset Y per character (makes the wave shape visible on entry)
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

        {/* ── STAFF: classic 5-line staff with treble clef ── */}
        {v === 'staff' && (
          <div className="ls-staff">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="ls-staff-line" style={{ '--i': i }} />
            ))}
            <span className="ls-clef">𝄞</span>
          </div>
        )}

        {/* ── BLOOM: giant clef as sole hero element ── */}
        {v === 'bloom' && (
          <div className="ls-bloom-clef" aria-label="treble clef">𝄞</div>
        )}

        {/* ── VIOLIN: bow stroke first, then 4 strings + bridge ── */}
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

        {/* ── WAVE: staff + clef (title carries the wave motion) ── */}
        {v === 'wave' && (
          <div className="ls-staff">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="ls-staff-line" style={{ '--i': i }} />
            ))}
            <span className="ls-clef">𝄞</span>
          </div>
        )}

        {/* ── PIANO: mini keyboard with white + black keys ── */}
        {v === 'piano' && (
          <div className="ls-keyboard" aria-label="piano keyboard">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="ls-white-key" style={{ '--i': i }} />
            ))}
            {/* black key left positions as % of keyboard width */}
            {[13, 26, 52, 65, 78].map((left, i) => (
              <div key={i} className="ls-black-key" style={{ left: `${left}%`, '--bi': i }} />
            ))}
          </div>
        )}

        {/* Title */}
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

        {/* Subtitle */}
        <p className="ls-subtitle" aria-label={SUBTITLE}>
          {SUBTITLE.split('').map((ch, i) => (
            <span key={i} className="ls-char-sub" style={{ '--i': i }}>
              {ch}
            </span>
          ))}
        </p>

        {/* Decorative rule (not used by violin — it has ls-bow above) */}
        {v !== 'violin' && <div className="ls-rule" />}

      </div>
    </div>
  );
}
