import React from 'react';

const BackgroundElements: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
      {/* Silk Waves */}
      <div className="silk-wave silk-gradient top-[-10%] opacity-30 dark:opacity-5 animate-[pulse_8s_ease-in-out_infinite]"></div>
      <div className="silk-wave silk-gradient bottom-[-20%] opacity-20 dark:opacity-5" style={{ transform: 'skewY(15deg)' }}></div>

      {/* Glass Orbs */}
      <div className="glass-orb w-64 h-64 top-[10%] -right-20 animate-[bounce_10s_infinite_ease-in-out] opacity-40 dark:opacity-100"></div>
      <div className="glass-orb w-48 h-48 bottom-[20%] -left-10 opacity-30 dark:opacity-60 animate-[bounce_12s_infinite_ease-in-out_reverse]"></div>

      {/* Ambient Blurs */}
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-indigo-100/40 dark:bg-white/5 rounded-full blur-[120px] transition-colors duration-500"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-slate-200/60 dark:bg-blue-900/10 rounded-full blur-[100px] transition-colors duration-500"></div>
    </div>
  );
};

export default BackgroundElements;