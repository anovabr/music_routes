import { useEffect, useState } from 'react';

const TITLE = 'Classical Music';
const SUBTITLE = 'Neurotree';
const STAFF_LINES = 5;
const INTRO_MS = 2200;   // how long the intro shows
const EXIT_MS  = 700;    // curtain exit duration

export default function LoadingScreen({ onDone }) {
  const [phase, setPhase] = useState('in'); // 'in' | 'out' | 'done'

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('out'), INTRO_MS);
    const t2 = setTimeout(() => { setPhase('done'); onDone(); }, INTRO_MS + EXIT_MS);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onDone]);

  if (phase === 'done') return null;

  return (
    <div className={`ls-root ${phase === 'out' ? 'ls-exit' : ''}`} aria-hidden="true">
      {/* Left curtain panel */}
      <div className="ls-curtain ls-curtain-l" />
      {/* Right curtain panel */}
      <div className="ls-curtain ls-curtain-r" />

      {/* Centred content (fades out before curtains split) */}
      <div className="ls-content">
        {/* Musical staff */}
        <div className="ls-staff">
          {Array.from({ length: STAFF_LINES }).map((_, i) => (
            <div key={i} className="ls-staff-line" style={{ '--i': i }} />
          ))}
          <span className="ls-clef" aria-label="treble clef">𝄞</span>
        </div>

        {/* Title — letter-by-letter stagger */}
        <h1 className="ls-title" aria-label={TITLE}>
          {TITLE.split('').map((ch, i) => (
            <span key={i} className="ls-char" style={{ '--i': i }}>
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

        {/* Thin decorative rule that draws across */}
        <div className="ls-rule" />
      </div>
    </div>
  );
}
