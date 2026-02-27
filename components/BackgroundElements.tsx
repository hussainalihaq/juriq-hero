import React from 'react';

const BackgroundElements: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
      {/* Grid Background Pattern */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-5 dark:opacity-10"></div>

      {/* Silk Waves - Toned Down */}
      <div className="silk-wave silk-gradient top-[-10%] opacity-10 dark:opacity-5 animate-[pulse_8s_ease-in-out_infinite] transform-gpu"></div>
      <div className="silk-wave silk-gradient bottom-[-20%] opacity-5 dark:opacity-[0.02] transform-gpu" style={{ transform: 'skewY(15deg)' }}></div>

      {/* Glass Orbs - Smaller, subtler */}
      <div className="glass-orb w-48 h-48 top-[10%] -right-10 animate-[bounce_10s_infinite_ease-in-out] opacity-20 dark:opacity-40 transform-gpu"></div>
      <div className="glass-orb w-32 h-32 bottom-[20%] -left-10 opacity-10 dark:opacity-20 animate-[bounce_12s_infinite_ease-in-out_reverse] transform-gpu"></div>

      {/* Ambient Blurs - Sharper */}
      <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-primary/20 dark:bg-blue-500/5 rounded-full blur-3xl transform-gpu transition-colors duration-500"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-slate-200/40 dark:bg-indigo-900/10 rounded-full blur-3xl transform-gpu transition-colors duration-500"></div>
    </div>
  );
};

export default BackgroundElements;