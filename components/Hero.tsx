import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

interface HeroProps {
  onGetAccess: (email?: string) => void;
}

const Hero: React.FC<HeroProps> = ({ onGetAccess }) => {
  const [emailInput, setEmailInput] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!emailInput.trim()) return;

    setStatus('submitting');

    if (!supabase) {
      alert('Waitlist is currently unavailable. Please try again later.');
      setStatus('idle');
      return;
    }

    try {
      // BETA LIMIT CHECK
      const { count, error: countError } = await supabase
        .from('waitlist')
        .select('*', { count: 'exact', head: true });

      if (countError) throw countError;

      if (count !== null && count >= 30) {
        alert("The Beta is currently full (Limit reached). Please check back later.");
        setStatus('idle');
        return;
      }

      const { error } = await supabase
        .from('waitlist')
        .insert([
          {
            email: emailInput,
            full_name: 'Not Provided',
            role: 'other',
            created_at: new Date().toISOString()
          }
        ]);

      if (error) throw error;

      setStatus('success');
    } catch (error) {
      console.error('Error submitting form:', error);
      alert(`Error: ${(error as any).message || 'Something went wrong. Please try again.'}`);
      setStatus('idle');
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto text-center flex flex-col items-center gap-2 md:gap-8 overflow-hidden px-2 sm:px-4">
      {/* Badge - Hidden on mobile to save space, tighter spacing on desktop */}
      <div className="hidden md:block space-y-4 animate-[fadeIn_0.5s_ease-out]">
        <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/50 dark:bg-slate-800/50 border border-white/80 dark:border-white/10 shadow-sm backdrop-blur-sm transition-colors duration-300">
          <span className="w-1.5 h-1.5 rounded-full bg-primary dark:bg-blue-400 animate-pulse"></span>
          <span className="text-[10px] font-bold text-primary dark:text-blue-100 tracking-[0.2em] uppercase">Waitlist Open</span>
        </div>
      </div>

      {/* Headline - Refreshed Copy */}
      <div className="animate-[fadeIn_0.5s_ease-out]">
        <h1 className="text-slate-900 dark:text-white text-4xl sm:text-5xl font-extrabold leading-tight tracking-tight md:text-7xl drop-shadow-sm transition-colors duration-300 px-4 mb-4 md:mb-6">
          Juriq: The AI Legal Copilot
        </h1>

        <p className="text-slate-600 dark:text-slate-400 text-sm md:text-lg max-w-xl mx-auto font-medium leading-relaxed transition-colors duration-300 px-4 mb-4 md:mb-6">
          Draft, analyze, and research with high-fidelity legal intelligence. Join the waitlist for exclusive early access.
        </p>
      </div>

      {/* Product Mockup Container - AI Copilot Vibe */}
      <div className="w-full max-w-3xl relative group animate-[fadeIn_0.7s_ease-out_0.2s_both] mt-4 md:mt-8">

        {/* Glow Effect - Toned down for sharper look */}
        <div className="absolute -inset-1 md:-inset-4 bg-gradient-to-b from-primary/10 to-transparent dark:from-blue-500/10 dark:to-transparent rounded-2xl md:rounded-3xl blur-xl -z-10 transition-opacity opacity-70 group-hover:opacity-100 duration-1000 transform-gpu"></div>

        {/* Crisp Dashboard/Chat UI Mockup */}
        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl md:rounded-3xl border border-slate-200/50 dark:border-slate-700/50 shadow-2xl shadow-slate-200/50 dark:shadow-none p-1 md:p-1.5 relative overflow-hidden transform transition-all duration-500 hover:border-slate-300 dark:hover:border-slate-600">

          {/* Mac-style Window Controls */}
          <div className="flex items-center gap-1.5 px-3 py-2 md:px-4 md:py-3 border-b border-slate-100 dark:border-slate-800/50">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></div>
          </div>

          <div className="p-4 md:p-6 text-left min-h-[180px] md:min-h-[220px] flex flex-col justify-end bg-slate-50/50 dark:bg-slate-900/50 rounded-b-xl md:rounded-b-2xl">
            {/* Simulated Chat Interface */}
            <div className="flex flex-col gap-4">
              {/* User Message */}
              <div className="flex justify-end animate-[slide-up_0.5s_ease-out]">
                <div className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs md:text-sm px-4 py-3 rounded-2xl rounded-tr-sm max-w-[85%] font-medium border border-slate-200/50 dark:border-slate-700/50 shadow-sm">
                  Draft a response to the motion to dismiss based on NY civil practice rules.
                </div>
              </div>

              {/* AI Assistant Message (Typing) */}
              <div className="flex items-start gap-3 animate-[slide-up_0.5s_ease-out_0.3s_both]">
                <div className="w-8 h-8 rounded-full bg-primary/10 dark:bg-blue-500/20 flex items-center justify-center shrink-0 border border-primary/20 dark:border-blue-500/30">
                  <span className="material-symbols-outlined text-primary dark:text-blue-400 text-sm">robot</span>
                </div>
                <div className="bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs md:text-sm px-4 py-3 rounded-2xl rounded-tl-sm w-full max-w-[90%] font-medium border border-slate-100 dark:border-slate-700 shadow-sm flex items-center gap-1">
                  <span className="overflow-hidden whitespace-nowrap border-r-2 border-primary dark:border-blue-400 pr-1 animate-[typing_3s_steps(40,end),blink_0.75s_step-end_infinite]">
                    Analyzing civil practice laws...
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      <div className="mt-8 md:mt-12 w-full max-w-lg mx-auto transform transition-all duration-500">
        <form onSubmit={handleSubmit} className="relative bg-white dark:bg-slate-800 p-2 pr-2 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-slate-200 dark:border-slate-700 flex items-center group/input transition-all hover:border-slate-300 dark:hover:border-slate-600 focus-within:border-primary dark:focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-primary/10 dark:focus-within:ring-blue-500/20">
          <div className={`pl-4 transition-colors ${status === 'success' ? 'text-green-500' : 'text-slate-400 dark:text-slate-500 group-focus-within/input:text-primary dark:group-focus-within/input:text-white'}`}>
            <span className="material-symbols-outlined text-xl">{status === 'success' ? 'check_circle' : 'mail'}</span>
          </div>
          <input
            className={`w-full border-none bg-transparent focus:ring-0 text-sm font-semibold h-12 outline-none ${status === 'success' ? 'text-green-600 dark:text-green-400 placeholder:text-green-500/50' : 'text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500'}`}
            placeholder={status === 'success' ? "You're on the list!" : "Enter your professional email"}
            type="email"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            disabled={status !== 'idle'}
          />
          <button
            type="submit"
            disabled={status !== 'idle'}
            className={`shrink-0 h-11 px-6 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${status === 'success' ? 'bg-green-500 text-white shadow-lg shadow-green-500/20' : status === 'submitting' ? 'bg-slate-400 text-white cursor-not-allowed' : 'bg-slate-900 border border-slate-800 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 text-white shadow-md active:scale-[0.98]'}`}
          >
            <span className="hidden sm:inline">
              {status === 'success' ? 'Joined!' : status === 'submitting' ? 'Joining...' : 'Request Beta Access'}
            </span>
            <span className="sm:hidden">
              {status === 'success' ? 'Joined!' : status === 'submitting' ? 'Wait...' : 'Request'}
            </span>
            {status === 'idle' && <span className="material-symbols-outlined text-sm font-bold">arrow_forward</span>}
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
      {/* Disclaimer */}
      <div className="mt-8 md:mt-auto pt-2 md:pt-10 w-full max-w-2xl text-center">
        <div className="px-6 py-4 rounded-3xl bg-slate-50/50 dark:bg-slate-800/30 border border-slate-100/50 dark:border-white/5 backdrop-blur-sm transition-colors duration-300">
          <p className="text-[10px] leading-relaxed text-slate-400 dark:text-slate-500 font-medium uppercase tracking-wider">
            juriq is an AI guide and does not provide professional legal advice. <br className="hidden sm:block" />
            <span className="text-slate-500 dark:text-slate-400 font-bold">Use at your own risk.</span>
          </p>
        </div>
      </div>
    </div >
  );
};

export default Hero;