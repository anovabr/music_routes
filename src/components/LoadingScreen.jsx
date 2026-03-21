import { useEffect, useState } from 'react';

const TITLE    = 'Classical Music';
const SUBTITLE = 'by Luis Anunciação';
const STAFF_LINES = 5;
const EXIT_MS     = 233;

// Each variant: name (maps to CSS data-variant), duration in ms
const VARIANTS = [
  { name: 'staff',  introMs: 1600 }, // staff lines draw left→right, letters stagger up
  { name: 'bloom',  introMs: 1400 }, // whole block blooms from centre, gold palette
  { name: 'violin', introMs: 2000 }, // bow-stroke rule first, warm amber/rosewood
  { name: 'wave',   introMs: 1600 }, // letters rise in a staggered bounce wave
  { name: 'piano',  introMs: 1800 }, // letters drop from above like pressing keys, ivory tones
];

export default function LoadingScreen({ onDone }) {
  const [variant] = useState(() => VARIANTS[Math.floor(Math.random() * VARIANTS.length)]);
  const [phase,   setPhase] = useState('in'); // 'in' | 'out' | 'done'

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('out'), variant.introMs);
    const t2 = setTimeout(() => { setPhase('done'); onDone(); }, variant.introMs + EXIT_MS);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onDone, variant.introMs]);

  if (phase === 'done') return null;

  // For the wave variant, give each character a sine-based starting Y offset
  const waveOffset = (i) =>
    variant.name === 'wave' ? Math.round(Math.sin(i * 0.72) * 9) : 0;

  return (
    <div
      className={`ls-root ${phase === 'out' ? 'ls-exit' : ''}`}
      data-variant={variant.name}
      aria-hidden="true"
    >
      <div className="ls-curtain ls-curtain-l" />
      <div className="ls-curtain ls-curtain-r" />

      <div className="ls-content">
        <div className="ls-staff">
          {Array.from({ length: STAFF_LINES }).map((_, i) => (
            <div key={i} className="ls-staff-line" style={{ '--i': i }} />
          ))}
          <span className="ls-clef" aria-label="treble clef">𝄞</span>
        </div>

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

        <div className="ls-rule" />
      </div>
    </div>
  );
}
