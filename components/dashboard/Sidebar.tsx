import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface ChatSession {
    id: string;
    title: string;
    preview: string;
    timestamp: Date;
}

interface UploadedDocument {
    id: string;
    name: string;
    size: number;
    uploadedAt: Date;
}

interface SidebarProps {
    userEmail?: string;
    userName?: string;
    onUploadClick?: () => void;
    onCollapse?: () => void;
    className?: string;
    uploadedDocuments?: UploadedDocument[];
    chatSessions?: ChatSession[];
    onClearHistory?: () => void;
    onSessionClick?: (sessionId: string) => void;
    onDeleteSession?: (sessionId: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
    userEmail,
    userName,
    onUploadClick,
    onCollapse,
    className,
    uploadedDocuments = [],
    chatSessions = [],
    onClearHistory,
    onSessionClick,
    onDeleteSession
}) => {
    const navigate = useNavigate();

    // Get recent sessions (max 5)
    const recentChats = chatSessions.slice(0, 5);
    const recentDocs = uploadedDocuments.slice(0, 5);

    const formatTime = (date: Date) => {
        const now = new Date();
        const diff = now.getTime() - new Date(date).getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 1) return 'Just now';
        if (mins < 60) return `${mins}m ago`;
        const hours = Math.floor(mins / 60);
        if (hours < 24) return `${hours}h ago`;
        return new Date(date).toLocaleDateString();
    };

    return (
        <aside className={`w-[280px] flex flex-col bg-white dark:bg-midnight-card border-r border-slate-200 dark:border-midnight-border shrink-0 text-slate-500 dark:text-text-dim h-full transition-all duration-300 ${className || 'hidden md:flex'}`}>
            {/* Brand */}
            <div className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 text-slate-900 dark:text-white flex items-center justify-center transition-colors">
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
                    <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white transition-colors">juriq</h1>
                </div>

                {onCollapse && (
                    <button
                        onClick={onCollapse}
                        className="text-slate-400 hover:text-slate-700 dark:text-slate-500 dark:hover:text-white transition-colors"
                        title="Collapse Sidebar"
                    >
                        <span className="material-symbols-outlined text-xl">dock_to_left</span>
                    </button>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 space-y-6 overflow-y-auto sidebar-scroll">

                {/* Recent Conversations */}
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-[10px] font-bold text-slate-600 uppercase tracking-widest px-2">Recent Conversations</h3>
                        {recentChats.length > 0 && onClearHistory && (
                            <button
                                onClick={onClearHistory}
                                className="text-[10px] text-slate-400 hover:text-red-500 transition-colors"
                            >
                                Clear
                            </button>
                        )}
                    </div>
                    {recentChats.length === 0 ? (
                        <div className="px-2 py-3 text-sm text-slate-400 dark:text-slate-600 italic border border-dashed border-slate-200 dark:border-white/5 rounded-lg text-center transition-colors">
                            No history yet.
                        </div>
                    ) : (
                        <div className="space-y-1">
                            {recentChats.map(chat => (
                                <div
                                    key={chat.id}
                                    onClick={() => onSessionClick?.(chat.id)}
                                    className="px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer transition-colors group relative"
                                >
                                    <p className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate group-hover:text-primary transition-colors pr-6">
                                        {chat.title}
                                    </p>
                                    <p className="text-xs text-slate-400 truncate pr-6">{chat.preview}</p>
                                    <p className="text-[10px] text-slate-400 dark:text-slate-600 mt-1">{formatTime(chat.timestamp)}</p>

                                    {/* Delete button */}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onDeleteSession?.(chat.id);
                                        }}
                                        className="absolute top-2 right-2 w-5 h-5 flex items-center justify-center rounded text-slate-400 hover:text-red-500 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all"
                                        title="Delete chat"
                                    >
                                        <span className="material-symbols-outlined text-xs">close</span>
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Uploaded Documents */}
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-[10px] font-bold text-slate-600 uppercase tracking-widest px-2">Documents</h3>
                        {recentDocs.length > 0 && (
                            <span className="text-[10px] text-primary font-bold">{recentDocs.length}</span>
                        )}
                    </div>

                    {recentDocs.length > 0 && (
                        <div className="space-y-1 mb-3">
                            {recentDocs.map(doc => (
                                <div
                                    key={doc.id}
                                    className="px-3 py-2 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 group"
                                >
                                    <div className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-sm text-primary">description</span>
                                        <p className="text-xs font-medium text-slate-700 dark:text-slate-200 truncate flex-1">
                                            {doc.name}
                                        </p>
                                    </div>
                                    <p className="text-[10px] text-slate-400 mt-1">
                                        {(doc.size / 1024).toFixed(1)} KB • {formatTime(doc.uploadedAt)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}

                    <button
                        onClick={onUploadClick}
                        className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-white hover:border-primary/50 hover:bg-slate-50 dark:hover:bg-white/5 transition-all text-sm group"
                    >
                        <span className="material-symbols-outlined text-lg text-slate-400 dark:text-slate-500 group-hover:text-primary transition-colors">upload_file</span>
                        <span>Upload New</span>
                    </button>
                </div>

            </nav>

            {/* User Profile */}
            <div className="p-4 border-t border-slate-200 dark:border-midnight-border">
                <div
                    onClick={() => navigate('/settings')}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer transition-colors group"
                >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-primary/20 uppercase">
                        {userName ? userName.charAt(0) : (userEmail?.charAt(0) || 'U')}
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-bold text-slate-700 dark:text-white group-hover:text-primary transition-colors truncate" title={userEmail}>
                            {userName || userEmail?.split('@')[0] || 'User'}
                        </p>
                        <p className="text-xs text-slate-500 truncate">Free Plan</p>
                    </div>
                    <button className="text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-white transition-opacity opacity-0 group-hover:opacity-100">
                        <span className="material-symbols-outlined text-lg">settings</span>
                    </button>
                </div>
            </div>
        </aside>
    );
};
