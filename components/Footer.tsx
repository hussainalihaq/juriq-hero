import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="py-12 px-6 border-t border-slate-100 dark:border-white/5 bg-white/30 dark:bg-slate-900/30 backdrop-blur-sm transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex flex-col items-center gap-8">
        <div className="flex items-center gap-2 opacity-80 grayscale hover:grayscale-0 transition-all cursor-default">
           <div className="w-12 h-12 text-primary dark:text-white transition-colors duration-300">
            <svg viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              <defs>
                <mask id="logo-mask-footer">
                   <rect width="24" height="24" fill="white" />
                   <circle cx="18.5" cy="18.5" r="5.25" fill="black" />
                </mask>
              </defs>
              <g transform="translate(18, 18) scale(2.5)">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.5" fill="none" mask="url(#logo-mask-footer)" />
                <path d="M18.5 15.75 A2.75 2.75 0 1 1 18.5 21.25 A2.75 2.75 0 1 1 18.5 15.75 M18.5 17 A1.5 1.5 0 1 0 18.5 20 A1.5 1.5 0 1 0 18.5 17" fill="currentColor" fillRule="evenodd"/>
              </g>
            </svg>
          </div>
          <h2 className="logo-text text-xl">juriq</h2>
        </div>
        <div className="flex gap-10 text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest transition-colors duration-300">
          <a href="#" className="hover:text-primary dark:hover:text-white transition-colors hover:underline underline-offset-4">Privacy</a>
          <a href="#" className="hover:text-primary dark:hover:text-white transition-colors hover:underline underline-offset-4">Security</a>
          <a href="#" className="hover:text-primary dark:hover:text-white transition-colors hover:underline underline-offset-4">Terms</a>
        </div>
        <p className="text-slate-400 dark:text-slate-600 text-[9px] font-bold tracking-widest text-center transition-colors duration-300">
          © {new Date().getFullYear()} JURIQ. PREMIER AI-NATIVE LEGAL SYSTEMS.
        </p>
      </div>
    </footer>
  );
};

export default Footer;