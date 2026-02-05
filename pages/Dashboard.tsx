import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { Sidebar } from '../components/dashboard/Sidebar';
import { RightSidebar } from '../components/dashboard/RightSidebar';
import { ChatArea } from '../components/dashboard/ChatArea';
import { InputArea } from '../components/dashboard/InputArea';
import { Message } from '../types/dashboard';

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);

    // --- State Management ---
    const [user, setUser] = useState<any>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [isTyping, setIsTyping] = useState(false);

    // Sidebar Visibility State (Desktop)
    const [showLeftSidebar, setShowLeftSidebar] = useState(true);
    const [showRightSidebar, setShowRightSidebar] = useState(true);

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                // If we want to force login, uncomment below. For now, allow view or redirect.
                // navigate('/login'); 
            }
            setUser(user);
        };
        getUser();
    }, [navigate]);

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Mock upload logic
        const userMsg: Message = {
            id: Date.now().toString(),
            role: 'user',
            text: `Uploaded: ${file.name}`,
            timestamp: new Date()
        };
        setMessages(prev => [...prev, userMsg]);

        setIsTyping(true);
        setTimeout(() => {
            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'model',
                text: `I've received **${file.name}**. I'm analyzing it for key clauses and risks now.`,
                timestamp: new Date(),
                actions: [
                    { label: 'Summarize', icon: 'segment', actionId: 'summarize' },
                    { label: 'Extract Dates', icon: 'calendar_month', actionId: 'dates' }
                ]
            };
            setMessages(prev => [...prev, aiMsg]);
            setIsTyping(false);
        }, 1500);
    };

    const handleSend = useCallback(async (text: string) => {
        // 1. Add User Message
        const userMsg: Message = {
            id: Date.now().toString(),
            role: 'user',
            text,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        setIsTyping(true);

        // 2. Simulate AI Response (Placeholder for real API)
        try {
            await new Promise(resolve => setTimeout(resolve, 2000));

            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'model',
                text: "I've analyzed your query. As Juriq (Beta), I can help you identify risks or draft clauses. However, for this specific request, I would need more context or the document text uploaded.",
                timestamp: new Date(),
                actions: [
                    { label: 'Upload Contract', icon: 'upload_file', actionId: 'upload' },
                    { label: 'Try Mock Analysis', icon: 'science', actionId: 'mock' }
                ]
            };

            setMessages(prev => [...prev, aiMsg]);
        } catch (error) {
            console.error(error);
        } finally {
            setIsTyping(false);
        }
    }, []);

    const handleNewChat = () => {
        if (messages.length > 0 && window.confirm("Start a new chat? Current history will be cleared.")) {
            setMessages([]);
        }
    };

    return (
        <div className="flex h-screen overflow-hidden bg-off-white dark:bg-midnight-bg text-slate-900 dark:text-text-bright font-display selection:bg-primary/30 selection:text-white transition-colors duration-300">
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileUpload}
                accept=".pdf,.docx,.txt"
            />

            {/* Mobile Header */}
            <div className={`md:hidden fixed top-0 w-full bg-midnight-bg/90 backdrop-blur-md z-50 h-16 flex items-center justify-between px-6 border-b border-midnight-border transition-all ${isMobileMenuOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                <div className="flex items-center gap-2">
                    <button onClick={() => setIsMobileMenuOpen(true)} className="text-slate-400 hover:text-white">
                        <span className="material-symbols-outlined">menu</span>
                    </button>
                    <span className="font-bold text-lg tracking-tight ml-2">juriq</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary-glow text-xs font-bold">
                    {user?.email?.charAt(0) || 'U'}
                </div>
            </div>

            {/* Mobile Sidebar Overlay */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm md:hidden" onClick={() => setIsMobileMenuOpen(false)}>
                    <div className="w-[280px] h-full bg-midnight-card border-r border-midnight-border relative" onClick={e => e.stopPropagation()}>
                        <button
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="absolute top-4 right-4 text-slate-500 hover:text-white"
                        >
                            <span className="material-symbols-outlined">close</span>
                        </button>
                        <Sidebar
                            userEmail={user?.email}
                            userName={user?.user_metadata?.full_name}
                            onUploadClick={handleUploadClick}
                        />
                    </div>
                </div>
            )}

            {/* Desktop Left Sidebar */}
            <Sidebar
                className={`${showLeftSidebar ? 'hidden md:flex' : 'hidden'} `}
                userEmail={user?.email}
                userName={user?.user_metadata?.full_name}
                onUploadClick={handleUploadClick}
            />

            {/* Main Content */}
            <main className="flex-1 flex flex-col relative min-w-0 pt-16 md:pt-0">

                {/* Header (Desktop) */}
                <header className="hidden md:flex h-16 items-center justify-between px-6 border-b border-midnight-border bg-midnight-bg/80 backdrop-blur-md z-10 shrink-0">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setShowLeftSidebar(!showLeftSidebar)}
                            className={`text-slate-500 hover:text-white transition-colors ${!showLeftSidebar && 'bg-white/5 p-1 rounded'}`}
                            title="Toggle Sidebar"
                        >
                            <span className="material-symbols-outlined">
                                {showLeftSidebar ? 'dock_to_left' : 'dock_to_right'}
                            </span>
                        </button>

                        <button
                            onClick={handleNewChat}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/5 text-xs font-medium text-text-dim hover:text-white hover:bg-white/10 transition-all cursor-pointer select-none"
                        >
                            <span className="material-symbols-outlined text-sm">add</span>
                            <span>New Chat</span>
                        </button>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="px-3 py-1 bg-gradient-to-r from-primary/20 to-purple-500/20 border border-primary/30 rounded text-[10px] font-bold tracking-wider text-primary-glow uppercase shadow-glow">
                            Beta Access
                        </div>

                        <button
                            onClick={() => setShowRightSidebar(!showRightSidebar)}
                            className={`text-slate-500 hover:text-white transition-colors xl:block hidden`}
                            title="Toggle Activity Panel"
                        >
                            <span className="material-symbols-outlined">
                                {showRightSidebar ? 'dock_to_right' : 'dock_to_left'}
                            </span>
                        </button>

                        <button
                            onClick={() => navigate('/settings')}
                            className="w-8 h-8 rounded-full hover:bg-white/5 flex items-center justify-center text-text-dim transition-colors"
                        >
                            <span className="material-symbols-outlined text-lg">settings</span>
                        </button>
                    </div>
                </header>

                {/* Chat */}
                <ChatArea
                    messages={messages}
                    isTyping={isTyping}
                    onSuggestionClick={(text) => handleSend(text)}
                />

                {/* Floating Input */}
                <InputArea onSend={handleSend} disabled={isTyping} onUploadClick={handleUploadClick} />

            </main>

            {/* Desktop Right Sidebar */}
            <RightSidebar className={`${showRightSidebar ? 'hidden xl:flex' : 'hidden'}`} />
        </div>
    );
};

export default Dashboard;
