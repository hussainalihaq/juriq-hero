import React, { useState } from 'react';

interface InputAreaProps {
  onSend: (text: string) => void;
  disabled: boolean;
}

export const InputArea: React.FC<InputAreaProps> = ({ onSend, disabled }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() && !disabled) {
      onSend(text);
      setText('');
    }
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 z-20 flex flex-col items-center bg-gradient-to-t from-midnight-bg via-midnight-bg/90 to-transparent">
      
      <div className="w-full max-w-3xl relative">
        <div className="glass-input rounded-xl p-1.5 flex items-center gap-2 shadow-glass transition-all duration-300 focus-within:bg-white/5 focus-within:border-white/20 group">
          
          {/* Add Button */}
          <button className="p-3 text-slate-500 hover:text-white hover:bg-white/10 transition-all rounded-lg" title="Add Document">
            <span className="material-symbols-outlined text-2xl">add_circle</span>
          </button>

          {/* Input */}
          <form onSubmit={handleSubmit} className="flex-1 flex py-2">
              <input
              className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder-slate-500 text-lg px-2 font-light"
              placeholder="Ask anything about your documents..."
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              disabled={disabled}
              />
          </form>

          {/* Send Button */}
          <button 
            onClick={handleSubmit}
            disabled={!text.trim() || disabled}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all active:scale-95 font-medium text-sm
                ${text.trim() && !disabled ? 'bg-white text-midnight-bg hover:bg-slate-200' : 'bg-white/5 text-slate-500 cursor-not-allowed'}
            `}>
            <span>Run Analysis</span>
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </div>
      </div>

      <p className="mt-4 text-[10px] text-slate-600 font-medium uppercase tracking-widest">
        Limited Spots Available • Juriq Beta
      </p>
    </div>
  );
};