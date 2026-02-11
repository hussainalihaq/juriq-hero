import React from 'react';
import { Link } from 'react-router-dom';

interface HeaderProps {
  onGetAccess: () => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const Header: React.FC<HeaderProps> = ({ onGetAccess, darkMode, toggleDarkMode }) => {
  return (
    <nav className="sticky top-0 z-40 w-full bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border-b border-white/20 dark:border-white/5 transition-colors duration-300">
      <div className="flex items-center justify-between px-4 md:px-6 h-14 md:h-20 max-w-7xl mx-auto">
        <div className="flex items-center gap-2 md:gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="w-10 h-10 md:w-16 md:h-16 text-primary dark:text-white transition-colors duration-300">
            <svg viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              <defs>
                <mask id="logo-mask-header">
                  <rect width="24" height="24" fill="white" />
                  <circle cx="18.5" cy="18.5" r="5.25" fill="black" />
                </mask>
              </defs>
              <g transform="translate(18, 18) scale(2.5)">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.5" fill="none" mask="url(#logo-mask-header)" />
                <path d="M18.5 15.75 A2.75 2.75 0 1 1 18.5 21.25 A2.75 2.75 0 1 1 18.5 15.75 M18.5 17 A1.5 1.5 0 1 0 18.5 20 A1.5 1.5 0 1 0 18.5 17" fill="currentColor" fillRule="evenodd" />
              </g>
            </svg>
          </div>
          <div className="flex items-baseline gap-1.5">
            <h2 className="logo-text text-xl md:text-2xl">juriq</h2>
            <span className="px-1.5 py-0.5 rounded bg-primary dark:bg-white text-[8px] font-black text-white dark:text-primary tracking-widest uppercase transition-colors duration-300">Beta</span>
          </div>
        </div>
        <div className="flex items-center gap-4">

          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full text-primary dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle dark mode"
          >
            <span className="material-symbols-outlined text-xl">
              {darkMode ? 'light_mode' : 'dark_mode'}
            </span>
          </button>


          {/* <Link to="/login" className="text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-white transition-colors">
            Log In
          </Link> */}


          <button
            onClick={onGetAccess}
            className="bg-primary dark:bg-white text-white dark:text-primary px-5 py-2.5 rounded-full text-xs font-bold hover:bg-navy-deep dark:hover:bg-slate-200 transition-all shadow-xl shadow-primary/20 hover:shadow-primary/40 active:scale-95"
          >
            Get Access
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Header;