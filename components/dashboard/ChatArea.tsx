import React, { useEffect, useRef } from 'react';
import { Message } from '../../types/dashboard';
import ReactMarkdown from 'react-markdown';

interface ChatAreaProps {
    messages: Message[];
    isTyping: boolean;
    onSuggestionClick: (text: string) => void;
}

export const ChatArea: React.FC<ChatAreaProps> = ({ messages, isTyping, onSuggestionClick }) => {
    const bottomRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom with slight delay for DOM render
    useEffect(() => {
        const scrollToBottom = () => {
            if (bottomRef.current) {
                bottomRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
            }
        };
        // Longer delay to ensure DOM is fully updated
        const timer = setTimeout(scrollToBottom, 150);
        // Also scroll immediately for faster response
        scrollToBottom();
        return () => clearTimeout(timer);
    }, [messages, isTyping]);

    const suggestions = [
        { icon: 'auto_awesome', text: 'Summarize obligations' },
        { icon: 'shield', text: 'Identify risks' },
        { icon: 'balance', text: 'Check conflicts' }
    ];

    return (
        <div className="flex-1 overflow-y-auto p-4 md:p-12 space-y-8 pb-80 scroll-smooth">
            {/* Welcome Placeholder if empty */}
            {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center select-none pb-20">
                    {/* Interactive Icon Animation */}
                    {/* Interactive Icon Animation */}
                    <div className="relative mb-8 group animate-slide-up">
                        <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full animate-pulse-slow opacity-50 dark:opacity-100"></div>
                        <div className="w-20 h-20 rounded-2xl flex items-center justify-center relative transform transition-transform duration-700 hover:scale-105 hover:rotate-3 p-4">
                            <svg viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-primary dark:text-white drop-shadow-lg">
                                <defs>
                                    <mask id="logo-mask-chat">
                                        <rect width="24" height="24" fill="white" />
                                        <circle cx="18.5" cy="18.5" r="5.25" fill="black" />
                                    </mask>
                                </defs>
                                <g transform="translate(18, 18) scale(2.5)">
                                    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.5" fill="none" mask="url(#logo-mask-chat)" />
                                    <path d="M18.5 15.75 A2.75 2.75 0 1 1 18.5 21.25 A2.75 2.75 0 1 1 18.5 15.75 M18.5 17 A1.5 1.5 0 1 0 18.5 20 A1.5 1.5 0 1 0 18.5 17" fill="currentColor" fillRule="evenodd" />
                                </g>
                            </svg>
                        </div>
                    </div>

                    <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
                        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight leading-tight transition-colors">
                            Understand your <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600 dark:from-white dark:to-slate-400 italic">legal world.</span>
                        </h2>
                        <p className="text-slate-400 max-w-lg mx-auto leading-relaxed text-sm md:text-base">
                            The high-fidelity intelligence platform for elite legal professional analysis.
                        </p>
                    </div>

                    <div className="mt-12 flex flex-wrap justify-center gap-3 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                        {suggestions.map((s) => (
                            <button
                                key={s.text}
                                onClick={() => onSuggestionClick(s.text)}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-slate-200 text-slate-600 dark:bg-white/5 dark:border-white/10 dark:text-slate-300 shadow-sm hover:border-primary/40 hover:text-primary dark:hover:text-white transition-all active:scale-95 group"
                            >
                                <span className="material-symbols-outlined text-lg text-primary/70 group-hover:text-primary transition-colors">{s.icon}</span>
                                {s.text}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {messages.map((msg) => (
                <div
                    key={msg.id}
                    className={`flex gap-4 max-w-4xl mx-auto animate-fade-in ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                    {/* Avatar */}
                    {msg.role === 'model' ? (
                        <div className="w-8 h-8 rounded-lg shrink-0 flex items-center justify-center shadow-lg border bg-midnight-card border-white/10 text-white p-1.5">
                            <svg viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                                <defs>
                                    <mask id={`logo-mask-chat-${msg.id}`}>
                                        <rect width="24" height="24" fill="white" />
                                        <circle cx="18.5" cy="18.5" r="5.25" fill="black" />
                                    </mask>
                                </defs>
                                <g transform="translate(18, 18) scale(2.5)">
                                    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.5" fill="none" mask={`url(#logo-mask-chat-${msg.id})`} />
                                    <path d="M18.5 15.75 A2.75 2.75 0 1 1 18.5 21.25 A2.75 2.75 0 1 1 18.5 15.75 M18.5 17 A1.5 1.5 0 1 0 18.5 20 A1.5 1.5 0 1 0 18.5 17" fill="currentColor" fillRule="evenodd" />
                                </g>
                            </svg>
                        </div>
                    ) : (
                        <div className="w-8 h-8 rounded-lg shrink-0 flex items-center justify-center shadow-lg text-xs border bg-primary/20 border-primary/20 text-primary-glow">
                            <span className="material-symbols-outlined text-sm">person</span>
                        </div>
                    )}

                    {/* Message Content */}
                    <div className={`flex flex-col gap-1 max-w-[85%] ${msg.role === 'user' ? 'items-end' : ''}`}>
                        <div className="flex items-center gap-2 mb-1 px-1">
                            <span className="text-xs font-bold text-slate-400 dark:text-slate-500">{msg.role === 'model' ? 'Juriq' : 'You'}</span>
                            <span className="text-[10px] text-slate-400 dark:text-slate-600 opacity-60">{msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>

                        <div className={`
                py-4 px-5 md:py-5 md:px-6 rounded-2xl leading-loose text-base shadow-sm backdrop-blur-sm border transition-all duration-300
                ${msg.role === 'model'
                                ? 'bg-white dark:bg-midnight-card/80 border-slate-100 dark:border-white/5 text-slate-800 dark:text-slate-200'
                                : 'bg-primary text-white border-primary shadow-glow'}
            `}>
                            <div className={`prose prose-base max-w-none ${msg.role === 'model' ? 'prose-slate dark:prose-invert' : 'prose-invert'} prose-p:my-3 prose-headings:mb-3 prose-headings:mt-6 first:prose-headings:mt-0 prose-li:my-1`}>
                                <ReactMarkdown>{msg.text}</ReactMarkdown>
                            </div>

                            {/* Action Chips for Model */}
                            {msg.role === 'model' && msg.actions && (
                                <div className="mt-6 flex flex-wrap gap-2 pt-4 border-t border-slate-100 dark:border-white/5">
                                    {msg.actions.map((action, idx) => (
                                        <button key={idx} className="px-3.5 py-2 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 hover:border-primary/40 rounded-lg flex items-center gap-2 cursor-pointer transition-colors text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary-glow">
                                            <span className="material-symbols-outlined text-sm">{action.icon}</span>
                                            <span className="text-xs font-medium">{action.label}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ))}

            {/* Typing Indicator */}
            {/* Typing Indicator */}
            {isTyping && (
                <div className="flex gap-4 max-w-4xl mx-auto opacity-0 animate-fade-in group w-full">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 dark:bg-midnight-card border border-primary/20 dark:border-white/10 shrink-0 flex items-center justify-center text-primary dark:text-white shadow-sm mt-1">
                        <span className="material-symbols-outlined text-sm">auto_awesome</span>
                    </div>
                    <div className="py-4 px-6 bg-white dark:bg-midnight-card/80 border border-slate-100 dark:border-white/5 rounded-2xl rounded-tl-none shadow-sm backdrop-blur-sm transition-all duration-300">
                        <div className="flex gap-1.5 py-1">
                            <div className="w-2 h-2 bg-primary/60 dark:bg-primary rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-primary/60 dark:bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                            <div className="w-2 h-2 bg-primary/60 dark:bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                        </div>
                    </div>
                </div>
            )}

            {/* Spacer to ensure scroll past the input area */}
            <div className="h-[200px] shrink-0" />
            <div ref={bottomRef} />
        </div>
    );
};
