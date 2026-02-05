import React from 'react';
import { useNavigate } from 'react-router-dom';

interface SidebarProps {
    userEmail?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ userEmail }) => {
    const navigate = useNavigate();

    return (
        <aside className="w-[280px] flex flex-col bg-midnight-card border-r border-midnight-border shrink-0 hidden md:flex text-text-dim h-full">
            {/* Brand */}
            <div className="p-6 cursor-pointer" onClick={() => navigate('/')}>
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-8 h-8 text-white flex items-center justify-center">
                        <svg viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                            <defs>
                                <mask id="logo-mask-sidebar">
                                    <rect width="24" height="24" fill="white" />
                                    <circle cx="18.5" cy="18.5" r="5.25" fill="black" />
                                </mask>
                            </defs>
                            <g transform="translate(18, 18) scale(2.5)">
                                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.5" fill="none" mask="url(#logo-mask-sidebar)" />
                                <path d="M18.5 15.75 A2.75 2.75 0 1 1 18.5 21.25 A2.75 2.75 0 1 1 18.5 15.75 M18.5 17 A1.5 1.5 0 1 0 18.5 20 A1.5 1.5 0 1 0 18.5 17" fill="currentColor" fillRule="evenodd" />
                            </g>
                        </svg>
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
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-primary/20 uppercase">
                        {userEmail?.charAt(0) || 'U'}
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-bold text-white group-hover:text-primary-glow transition-colors truncate" title={userEmail}>
                            {userEmail?.split('@')[0] || 'User'}
                        </p>
                        <p className="text-xs text-slate-500 truncate">Free Plan</p>
                    </div>
                </div>
            </div>
        </aside>
    );
};
