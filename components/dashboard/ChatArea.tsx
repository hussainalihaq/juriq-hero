import React, { useEffect, useRef } from 'react';
import { Message } from '../../types/dashboard';
import ReactMarkdown from 'react-markdown';

interface ChatAreaProps {
    messages: Message[];
    isTyping: boolean;
    onSuggestionClick: (text: string) => void;
    onRetry?: () => void;
    userRoleContext?: string;
}

export const ChatArea: React.FC<ChatAreaProps> = ({ messages, isTyping, onSuggestionClick, onRetry, userRoleContext }) => {
    const bottomRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [shouldAutoScroll, setShouldAutoScroll] = React.useState(true);
    const [showScrollButton, setShowScrollButton] = React.useState(false);

    // Track if user is at the bottom to determine if we should auto-scroll
    const handleScroll = () => {
        const container = containerRef.current;
        if (!container) return;

        const { scrollTop, scrollHeight, clientHeight } = container;
        // Strict threshold: Only auto-scroll if user is VERY close to bottom (20px).
        // This allows user to scroll up slightly to read without being dragged down.
        const distanceToBottom = Math.abs(scrollHeight - clientHeight - scrollTop);
        const isAtBottom = distanceToBottom < 20;

        setShouldAutoScroll(isAtBottom);
        // Show scroll button if user is more than 100px from bottom
        setShowScrollButton(distanceToBottom > 100);
    };

    const scrollToBottom = () => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    };

    // Auto-scroll effect
    useEffect(() => {
        if (shouldAutoScroll || messages.length <= 1) {
            // Use 'auto' behavior for instant scrolling during streaming to avoid lag/fighting
            bottomRef.current?.scrollIntoView({ behavior: 'auto', block: 'end' });
        }
    }, [messages, isTyping, shouldAutoScroll]);

    const suggestions = [
        { icon: 'auto_awesome', text: 'Summarize obligations' },
        { icon: 'shield', text: 'Identify risks' },
        { icon: 'balance', text: 'Check conflicts' }
    ];

    return (
        <div
            ref={containerRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto p-4 md:p-12 pb-48 relative"
        >
            {/* Welcome Placeholder if empty - Full Width/Center to preserve logo alignment */}
            {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center select-none pb-20 pt-20">
                    <div className="relative mb-6 group animate-slide-up">
                        <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full animate-pulse-slow opacity-50 dark:opacity-80 scale-150"></div>
                        <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl flex items-center justify-center relative transform transition-transform duration-700 hover:scale-105 p-6 bg-white/50 dark:bg-white/5 backdrop-blur-sm border border-white/20 shadow-2xl">
                            <svg viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-slate-900 dark:text-white drop-shadow-md">
                                <defs>
                                    <mask id="logo-mask-chat">
                                        <rect width="96" height="96" fill="white" />
                                        <path d="M48 16c-17.67 0-32 14.33-32 32 0 17.67 14.33 32 32 32s32-14.33 32-32c0-17.67-14.33-32-32-32zm0 52c-11.05 0-20-8.95-20-20s8.95-20 20-20 20 8.95 20 20-8.95 20-20 20z" fill="black" />
                                        <rect x="42" y="32" width="12" height="32" rx="2" fill="black" />
                                    </mask>
                                </defs>
                                <rect width="96" height="96" fill="currentColor" mask="url(#logo-mask-chat)" />
                            </svg>
                        </div>
                    </div>

                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-3 animate-fade-in tracking-tight">
                        Good evening, {userRoleContext ? 'Counsel' : 'Counsel'}
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-10 text-lg font-light leading-relaxed animate-fade-in delay-100">
                        Ready to analyze your legal documents.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl px-4 animate-fade-in delay-200">
                        {suggestions.map((s, i) => (
                            <button
                                key={i}
                                onClick={() => onSuggestionClick(s.text)}
                                className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-primary/50 hover:shadow-lg dark:hover:bg-white/10 transition-all group duration-300"
                            >
                                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                    <span className="material-symbols-outlined text-xl">{s.icon}</span>
                                </div>
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-primary transition-colors">
                                    {s.text}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Messages Container - Centered to match Input Bar width (Like GPT) */}
            <div className="max-w-3xl mx-auto space-y-8">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}
                    >
                        <div
                            className={`
                                max-w-[85%] rounded-2xl p-5 shadow-sm text-[15px] leading-relaxed relative group
                                ${message.sender === 'user'
                                    ? 'bg-primary text-white rounded-br-none ml-12 shadow-primary/20 bg-gradient-to-br from-primary to-primary-light'
                                    : 'bg-white dark:bg-midnight-card dark:text-gray-100 border border-slate-200 dark:border-midnight-border rounded-bl-none mr-12'
                                }
                            `}
                        >
                            {/* AI Avatar */}
                            {message.sender === 'ai' && (
                                <div className="absolute -left-10 top-0 w-8 h-8 rounded-full bg-slate-900 dark:bg-black/50 overflow-hidden flex items-center justify-center border border-slate-200 dark:border-white/10 shadow-sm">
                                    <svg viewBox="0 0 24 24" className="w-5 h-5 text-white">
                                        <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                                    </svg>
                                </div>
                            )}

                            {/* Message Text */}
                            {message.sender === 'user' ? (
                                <div className="whitespace-pre-wrap font-light">{message.text}</div>
                            ) : (
                                <div className="markdown-body dark:prose-invert prose-sm md:prose-base font-light">
                                    <ReactMarkdown>{message.text}</ReactMarkdown>
                                    {(isTyping && message === messages[messages.length - 1]) && (
                                        <span className="inline-block w-2 h-4 ml-1 bg-slate-400 dark:bg-slate-500 animate-pulse rounded-full align-middle mb-1" />
                                    )}
                                </div>
                            )}

                            {/* Action Chips for Model */}
                            {message.sender === 'ai' && message.actions && (
                                <div className="mt-6 flex flex-wrap gap-2 pt-4 border-t border-slate-100 dark:border-white/5">
                                    {message.actions.map((action, idx) => (
                                        <button key={idx} className="px-3.5 py-2 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 hover:border-primary/40 rounded-lg flex items-center gap-2 cursor-pointer transition-colors text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary-glow">
                                            <span className="material-symbols-outlined text-sm">{action.icon}</span>
                                            <span className="text-xs font-medium">{action.label}</span>
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Retry Button */}
                            {message.sender === 'ai' && message.text.startsWith('⚠️ Error:') && onRetry && (
                                <div className="mt-4 pt-4 border-t border-red-100 dark:border-red-900/30">
                                    <button
                                        onClick={onRetry}
                                        className="flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-lg text-sm font-bold transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-lg">refresh</span>
                                        Retry Request
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {/* Typing Indicator inside centered container */}
                {isTyping && (
                    <div className="flex gap-4 opacity-0 animate-fade-in group w-full justify-start">
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
                {/* Bottom Anchor inside centered container but effective for scroll */}
                <div ref={bottomRef} className="h-px w-full" />
            </div>

            {/* Scroll to Bottom Button */}
            <div className={`fixed bottom-32 right-6 md:right-12 z-30 transition-all duration-300 transform ${showScrollButton ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'}`}>
                <button
                    onClick={scrollToBottom}
                    className="w-10 h-10 rounded-full bg-white dark:bg-midnight-card border border-slate-200 dark:border-midnight-border shadow-lg flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-primary hover:bg-slate-50 dark:hover:bg-white/5 transition-all"
                >
                    <span className="material-symbols-outlined">arrow_downward</span>
                </button>
            </div>

            {/* Spacer for input area overlap protection */}
            <div className="h-0 shrink-0" />
        </div>
    );
};
