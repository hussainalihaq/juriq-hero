import React from 'react';

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-[280px] flex flex-col bg-midnight-card border-r border-midnight-border shrink-0 hidden md:flex text-text-dim">
      {/* Brand */}
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 bg-white text-black rounded-lg flex items-center justify-center">
                 <span className="material-symbols-outlined text-xl">radio_button_checked</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white">juriq</h1>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-8 overflow-y-auto sidebar-scroll">
        
        {/* Recent Conversations */}
        <div>
          <h3 className="text-[10px] font-bold text-slate-600 uppercase tracking-widest px-2 mb-3">Recent Conversations</h3>
          <div className="px-2 py-3 text-sm text-slate-600 italic border border-dashed border-white/5 rounded-lg text-center">
            No history yet.
          </div>
        </div>

        {/* Uploaded Documents */}
        <div>
          <h3 className="text-[10px] font-bold text-slate-600 uppercase tracking-widest px-2 mb-3">Uploaded Documents</h3>
          <button className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg border border-white/10 text-slate-400 hover:text-white hover:border-primary/50 hover:bg-white/5 transition-all text-sm group">
            <span className="material-symbols-outlined text-lg text-slate-500 group-hover:text-primary transition-colors">upload_file</span>
            <span>Upload New</span>
          </button>
        </div>

      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-midnight-border">
        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer transition-colors group">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-primary/20">
                2
            </div>
            <div className="flex-1 overflow-hidden">
                <p className="text-sm font-bold text-white group-hover:text-primary-glow transition-colors truncate">28100026</p>
                <p className="text-xs text-slate-500 truncate">Free Plan</p>
            </div>
        </div>
      </div>
    </aside>
  );
};