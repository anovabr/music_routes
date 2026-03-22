import { useEffect, useState } from 'react';

const SHOW_MS = 180;
const EXIT_MS = 320;

export default function LoadingScreen({ onDone }) {
  const [phase, setPhase] = useState('in');

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('out'), SHOW_MS);
    const t2 = setTimeout(() => { setPhase('done'); onDone(); }, SHOW_MS + EXIT_MS);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onDone]);

  if (phase === 'done') return null;

  return (
    <div className={`ls-root${phase === 'out' ? ' ls-exit' : ''}`} aria-hidden="true">
      <span className="ls-clef">𝄞</span>
      <h1 className="ls-wordmark">Classical Music</h1>
    </div>
  );
}
