import React, { useEffect, useState } from 'react';

const WaterDrop = ({ active, onImpact }) => {
  const [phase, setPhase] = useState('idle');

  useEffect(() => {
    if (!active) return;
    setPhase('falling');
  }, [active]);

  const handleAnimationEnd = (e) => {
    if (e.animationName !== 'dropFall' || phase !== 'falling') return;
    setPhase('splash');
    onImpact?.();
    setTimeout(() => setPhase('done'), 700);
  };

  if (phase === 'idle' || phase === 'done') return null;

  return (
    <div className="water-drop-scene" aria-hidden="true">
      <div
        className={`water-drop ${phase === 'falling' ? 'water-drop--falling' : ''}`}
        onAnimationEnd={handleAnimationEnd}
      />
      {phase === 'splash' && (
        <>
          <div className="water-splash water-splash--1" />
          <div className="water-splash water-splash--2" />
          <div className="water-splash-ring" />
        </>
      )}
    </div>
  );
};

export default WaterDrop;
