import React, { useState } from 'react';

interface HeroProps {
  onGetAccess: (email?: string) => void;
}

const Hero: React.FC<HeroProps> = ({ onGetAccess }) => {
  const [emailInput, setEmailInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGetAccess(emailInput);
  };

  return (
    <div className="w-full max-w-4xl mx-auto text-center flex flex-col items-center gap-2 md:gap-8">
      {/* Badge - Hidden on mobile to save space, tighter spacing on desktop */}
      <div className="hidden md:block space-y-4 animate-[fadeIn_0.5s_ease-out]">
        <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/50 dark:bg-slate-800/50 border border-white/80 dark:border-white/10 shadow-sm backdrop-blur-sm transition-colors duration-300">
          <span className="w-1.5 h-1.5 rounded-full bg-primary dark:bg-blue-400 animate-pulse"></span>
          <span className="text-[10px] font-bold text-primary dark:text-blue-100 tracking-[0.2em] uppercase">Waitlist Open</span>
        </div>
      </div>

      {/* Headline - Reduced size and spacing */}
      <div className="animate-[fadeIn_0.5s_ease-out]">
        <h1 className="text-slate-900 dark:text-white text-3xl sm:text-6xl font-extrabold leading-tight tracking-tighter md:text-8xl drop-shadow-sm transition-colors duration-300 px-4 mb-2 md:mb-4">
          Understand your legal world, <span className="italic font-serif font-bold text-primary dark:text-blue-200">instantly.</span>
        </h1>

        <p className="text-slate-500 dark:text-slate-400 text-xs md:text-lg max-w-lg mx-auto font-medium leading-relaxed transition-colors duration-300 px-4 mb-3 md:mb-2">
          The high-fidelity intelligence platform for elite legal professional analysis.
        </p>
      </div>

      {/* Product Mockup Container */}
      {/* Significantly reduced margins and height for mobile */}
      <div className="w-full max-w-2xl relative group animate-[fadeIn_0.7s_ease-out_0.2s_both] mt-0 md:mt-2">
        {/* Glow Effect */}
        <div className="absolute -inset-10 bg-gradient-to-b from-white/20 to-transparent dark:from-blue-500/10 dark:to-transparent rounded-[4rem] blur-3xl -z-10 transition-opacity opacity-70 group-hover:opacity-100 duration-1000"></div>

        {/* Mobile: Taller crop, smaller scale. Desktop: Normal */}
        <div className="glass-morphism rounded-2xl md:rounded-[2.5rem] p-1.5 md:p-3 relative overflow-hidden transform transition-transform duration-500 hover:scale-[1.01]">
          {/* Blurred Interface - simplified/smaller for mobile */}
          <div className="filter blur-md opacity-40 select-none pointer-events-none grayscale-[0.3] dark:grayscale-0 dark:opacity-20 scale-[0.85] md:scale-100 origin-top -mb-6 md:mb-0">
            <div className="flex flex-col gap-1 md:gap-2">
              <div className="flex items-center gap-2 md:gap-3 p-1 md:p-2">
                <div className="flex-1">
                  <div className="w-full h-10 md:h-12 border-none bg-transparent text-sm md:text-lg font-medium py-3 text-primary dark:text-white flex items-center">
                    Paste a clause or ask a legal question...
                  </div>
                </div>
                <div className="bg-primary dark:bg-white text-white dark:text-primary w-10 h-10 md:w-14 md:h-14 rounded-2xl md:rounded-3xl flex items-center justify-center shadow-2xl shadow-primary/40 dark:shadow-white/10">
                  <span className="material-symbols-outlined text-xl md:text-3xl font-light">arrow_forward</span>
                </div>
              </div>
              <div className="flex items-center gap-2 px-2 pb-2">
                <div className="flex items-center gap-2 px-3 py-2 md:px-5 md:py-2.5 rounded-xl md:rounded-2xl bg-white/40 dark:bg-slate-700/40 border border-white/60 dark:border-white/10 text-[10px] md:text-[11px] font-bold text-primary dark:text-white">
                  <span className="material-symbols-outlined text-base md:text-lg">upload_file</span>
                  Upload Contract
                </div>
                <div className="flex items-center gap-2 px-3 py-2 md:px-5 md:py-2.5 rounded-xl md:rounded-2xl bg-white/40 dark:bg-slate-700/40 border border-white/60 dark:border-white/10 text-[10px] md:text-[11px] font-bold text-primary dark:text-white">
                  <span className="material-symbols-outlined text-base md:text-lg">verified_user</span>
                  Risk Audit
                </div>
              </div>
            </div>
          </div>

          {/* Coming Soon Overlay */}
          <div className="absolute inset-0 z-20 flex items-center justify-center">
            <div className="bg-navy-deep/90 dark:bg-black/80 backdrop-blur-sm text-white px-4 py-2 md:px-6 md:py-2.5 rounded-full text-[9px] md:text-[10px] font-black tracking-[0.2em] uppercase shadow-[0_0_30px_rgba(2,6,23,0.25)] border border-white/10 flex items-center gap-2 animate-pulse-slow">
              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></span>
              Coming Soon
            </div>
          </div>
        </div>

        {/* Action Input */}
        <div className="mt-4 md:mt-6 w-full max-w-lg mx-auto transform transition-all duration-500">
          <form onSubmit={handleSubmit} className="relative bg-white dark:bg-slate-800 p-2 pr-2 rounded-2xl shadow-xl shadow-slate-200/60 dark:shadow-none border border-slate-100 dark:border-slate-700 flex items-center group/input transition-all hover:shadow-2xl hover:shadow-primary/5 focus-within:shadow-2xl focus-within:shadow-primary/10 focus-within:border-primary/20 dark:focus-within:border-blue-400/50">
            <div className="pl-4 text-slate-400 dark:text-slate-500 group-focus-within/input:text-primary dark:group-focus-within/input:text-white transition-colors">
              <span className="material-symbols-outlined text-xl">mail</span>
            </div>
            <input
              className="w-full border-none bg-transparent focus:ring-0 text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm font-medium h-12 outline-none"
              placeholder="Enter your work email..."
              type="email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
            />
            <button
              type="submit"
              className="shrink-0 bg-primary dark:bg-white hover:bg-navy-deep dark:hover:bg-slate-200 text-white dark:text-primary h-11 px-6 rounded-xl text-xs font-bold transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40 dark:shadow-white/5 flex items-center gap-2 whitespace-nowrap active:scale-[0.98]"
            >
              <span className="hidden sm:inline">Get Early Access</span>
              <span className="sm:hidden">Join</span>
              <span className="material-symbols-outlined text-sm font-bold">arrow_forward</span>
            </button>
          </form>

          <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest opacity-80 transition-colors">
            <span className="w-2 h-2 rounded-full bg-green-500/80 animate-pulse"></span>
            Limited Spots Available
          </div>
        </div>



        {/* Features/Trust Badges */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-8 opacity-40 dark:opacity-30">
          <span className="text-[9px] font-black uppercase tracking-[0.25em] flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">lock</span>
            256-bit AES
          </span>
          <span className="text-[9px] font-black uppercase tracking-[0.25em] flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">security</span>
            SOC2 Type II
          </span>
          <span className="text-[9px] font-black uppercase tracking-[0.25em] flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">cloud</span>
            Private Cloud
          </span>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="mt-8 md:mt-auto pt-2 md:pt-10 w-full max-w-2xl text-center">
        <div className="px-6 py-4 rounded-3xl bg-slate-50/50 dark:bg-slate-800/30 border border-slate-100/50 dark:border-white/5 backdrop-blur-sm transition-colors duration-300">
          <p className="text-[10px] leading-relaxed text-slate-400 dark:text-slate-500 font-medium uppercase tracking-wider">
            juriq is an AI guide and does not provide professional legal advice. <br className="hidden sm:block" />
            <span className="text-slate-500 dark:text-slate-400 font-bold">Use at your own risk.</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Hero;