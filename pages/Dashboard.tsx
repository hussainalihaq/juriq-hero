import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { Sidebar } from '../components/dashboard/Sidebar';
import { ChatArea } from '../components/dashboard/ChatArea';
import { InputArea } from '../components/dashboard/InputArea';
import { Message } from '../types/dashboard';

// API URL: Use environment variable for external backend, or empty string for same-origin Vercel serverless
const API_URL = import.meta.env.VITE_API_URL || '';

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    // Session management for multi-chat history
    const [currentSessionId, setCurrentSessionId] = useState<string>(() => {
        return localStorage.getItem('juriq_current_session') || Date.now().toString();
    });

    // --- State Management ---
    const [user, setUser] = useState<any>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [isTyping, setIsTyping] = useState(false);

    // Document & History Tracking
    const [uploadedDocuments, setUploadedDocuments] = useState<{ id: string; name: string; size: number; uploadedAt: Date }[]>([]);

    // Attachment Preview (shown in InputArea before sending)
    const [attachedFile, setAttachedFile] = useState<{ name: string; type: string; size: number } | null>(null);

    // Sidebar Visibility State (Desktop)
    const [showLeftSidebar, setShowLeftSidebar] = useState(true);

    // Jurisdiction toggle (quick switch)
    const [jurisdiction, setJurisdiction] = useState('pak');

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // All saved chat sessions for sidebar
    const [allSessions, setAllSessions] = useState<{ id: string; title: string; preview: string; timestamp: Date }[]>([]);

    // Load all sessions on mount
    useEffect(() => {
        const sessions = localStorage.getItem('juriq_all_sessions');
        if (sessions) {
            try {
                const parsed = JSON.parse(sessions).map((s: any) => ({
                    ...s,
                    timestamp: new Date(s.timestamp)
                }));
                setAllSessions(parsed);
            } catch (e) {
                console.error('Failed to load sessions:', e);
            }
        }
    }, []);

    // Derive current session for sidebar (combine with saved sessions)
    const chatSessions = messages.length > 0 ? [{
        id: currentSessionId,
        title: messages[0]?.text.slice(0, 40) + '...' || 'New Chat',
        preview: messages[messages.length - 1]?.text.slice(0, 50) + '...' || '',
        timestamp: messages[0]?.timestamp || new Date()
    }, ...allSessions.filter(s => s.id !== currentSessionId)] : allSessions;

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

    // Load messages from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('juriq_chat_history');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                // Restore timestamp as Date objects
                const restored = parsed.map((m: any) => ({
                    ...m,
                    timestamp: new Date(m.timestamp)
                }));
                setMessages(restored);
            } catch (e) {
                console.error('Failed to load chat history:', e);
            }
        }
    }, []);

    // Save messages to localStorage whenever they change
    useEffect(() => {
        if (messages.length > 0) {
            localStorage.setItem('juriq_chat_history', JSON.stringify(messages));
        }
    }, [messages]);

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Show attachment preview in InputArea (like Claude)
        setAttachedFile({
            name: file.name,
            type: file.type || 'application/octet-stream',
            size: file.size
        });

        // Track the document for sidebar history
        setUploadedDocuments(prev => [{
            id: Date.now().toString(),
            name: file.name,
            size: file.size,
            uploadedAt: new Date()
        }, ...prev]);

        // Reset file input so the same file can be re-uploaded if needed
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleSend = useCallback(async (text: string) => {
        // 1. Add User Message (include attachment mention if present)
        const messageText = attachedFile
            ? `📎 **${attachedFile.name}**\n\n${text}`
            : text;

        const userMsg: Message = {
            id: Date.now().toString(),
            role: 'user',
            text: messageText,
            timestamp: new Date()
        };

        // Clear attachment after sending
        setAttachedFile(null);

        setMessages(prev => [...prev, userMsg]);
        setIsTyping(true);

        try {
            // 2. Call Real Backend API with user's role and jurisdiction
            const userRole = user?.user_metadata?.role || 'general';

            const response = await fetch(`${API_URL}/api/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    history: messages.map(m => ({ role: m.role === 'model' ? 'ai' : 'user', text: m.text })), // Map model -> ai for backend consistency if needed, checking backend expectation
                    message: text,
                    role: userRole, // Use role from user metadata for personalized responses
                    jurisdictions: [jurisdiction] // Pass selected jurisdiction
                })
            });

            if (!response.ok) throw new Error('Failed to fetch response');

            const data = await response.json();

            // 3. Add AI Message
            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'model',
                text: data.text,
                timestamp: new Date(),
                // actions: [ ... ] // Can parse actions from response later if structured
            };

            setMessages(prev => [...prev, aiMsg]);
        } catch (error: any) {
            console.error('Chat Error:', error);
            const errorMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'model',
                text: `⚠️ Error: ${error.message || 'Connection failed. Please check your internet and API key.'}`,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsTyping(false);
        }
    }, [messages, attachedFile, jurisdiction, user]);

    // --- Backend Connection Check (for API calls) ---
    const [backendOnline, setBackendOnline] = useState(true);

    useEffect(() => {
        const checkBackend = async () => {
            try {
                const res = await fetch(`${API_URL}/api/chat`, { method: 'OPTIONS' });
                setBackendOnline(true);
            } catch (e) {
                setBackendOnline(false);
            }
        };
        checkBackend();
    }, []);

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const handleNewChat = () => {
        // Save current session if it has messages
        if (messages.length > 0) {
            const currentSession = {
                id: currentSessionId,
                title: messages[0]?.text.slice(0, 40) + '...',
                preview: messages[messages.length - 1]?.text.slice(0, 50) + '...',
                timestamp: messages[0]?.timestamp || new Date()
            };

            // Save messages for this session
            localStorage.setItem(`juriq_session_${currentSessionId}`, JSON.stringify(messages));

            // Update all sessions list
            const updatedSessions = [currentSession, ...allSessions.filter(s => s.id !== currentSessionId)];
            setAllSessions(updatedSessions);
            localStorage.setItem('juriq_all_sessions', JSON.stringify(updatedSessions));
        }

        // Start new session
        const newSessionId = Date.now().toString();
        setCurrentSessionId(newSessionId);
        localStorage.setItem('juriq_current_session', newSessionId);
        setMessages([]);
        localStorage.removeItem('juriq_chat_history');
    };

    // Load a previous session from history
    const handleSessionClick = (sessionId: string) => {
        // Save current session first if it has messages
        if (messages.length > 0 && sessionId !== currentSessionId) {
            localStorage.setItem(`juriq_session_${currentSessionId}`, JSON.stringify(messages));
        }

        // Load the clicked session
        const savedMessages = localStorage.getItem(`juriq_session_${sessionId}`);
        if (savedMessages) {
            try {
                const parsed = JSON.parse(savedMessages).map((m: any) => ({
                    ...m,
                    timestamp: new Date(m.timestamp)
                }));
                setMessages(parsed);
                setCurrentSessionId(sessionId);
                localStorage.setItem('juriq_current_session', sessionId);
                localStorage.setItem('juriq_chat_history', savedMessages);
            } catch (e) {
                console.error('Failed to load session:', e);
            }
        }
    };

    // Delete a session from history
    const handleDeleteSession = (sessionId: string) => {
        // Remove from allSessions
        const updatedSessions = allSessions.filter(s => s.id !== sessionId);
        setAllSessions(updatedSessions);
        localStorage.setItem('juriq_all_sessions', JSON.stringify(updatedSessions));

        // Remove session data from localStorage
        localStorage.removeItem(`juriq_session_${sessionId}`);

        // If deleting current session, clear messages
        if (sessionId === currentSessionId) {
            setMessages([]);
            localStorage.removeItem('juriq_chat_history');
            const newSessionId = Date.now().toString();
            setCurrentSessionId(newSessionId);
            localStorage.setItem('juriq_current_session', newSessionId);
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
                <div className="px-2 py-1 bg-primary/20 border border-primary/30 rounded text-[9px] font-bold tracking-wider text-primary uppercase">Beta</div>
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
                            chatSessions={chatSessions}
                            uploadedDocuments={uploadedDocuments}
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
                onCollapse={() => setShowLeftSidebar(false)}
                chatSessions={chatSessions}
                uploadedDocuments={uploadedDocuments}
                onClearHistory={() => {
                    setMessages([]);
                    setUploadedDocuments([]);
                }}
                onSessionClick={handleSessionClick}
                onDeleteSession={handleDeleteSession}
            />

            {/* Main Content */}
            <main className="flex-1 flex flex-col relative min-w-0 pt-16 md:pt-0">

                {/* Header (Desktop) */}
                <header className="hidden md:flex h-16 items-center justify-between px-6 border-b border-slate-200 dark:border-midnight-border bg-white/80 dark:bg-midnight-bg/80 backdrop-blur-md z-10 shrink-0 transition-colors duration-300">
                    <div className="flex items-center gap-4">
                        {!showLeftSidebar && (
                            <button
                                onClick={() => setShowLeftSidebar(true)}
                                className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:text-slate-500 dark:hover:text-white transition-colors"
                                title="Open Sidebar"
                            >
                                <span className="material-symbols-outlined">dock_to_right</span>
                            </button>
                        )}

                        <button
                            onClick={handleNewChat}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-xs font-medium text-slate-600 dark:text-text-dim hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 transition-all cursor-pointer select-none"
                        >
                            <span className="material-symbols-outlined text-sm">add</span>
                            <span>New Chat</span>
                        </button>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Jurisdiction Toggle */}
                        <div className="flex items-center bg-slate-100 dark:bg-white/5 rounded-lg p-0.5 border border-slate-200 dark:border-white/10">
                            {['pak', 'us', 'uk'].map((jur) => (
                                <button
                                    key={jur}
                                    onClick={() => setJurisdiction(jur)}
                                    className={`px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all ${jurisdiction === jur
                                        ? 'bg-white dark:bg-primary text-primary dark:text-white shadow-sm'
                                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white'
                                        }`}
                                >
                                    {jur}
                                </button>
                            ))}
                        </div>

                        <div className="px-3 py-1 bg-gradient-to-r from-primary/20 to-purple-500/20 border border-primary/30 rounded text-[10px] font-bold tracking-wider text-primary uppercase shadow-glow">
                            Beta
                        </div>

                        <button
                            onClick={() => navigate('/settings')}
                            className="w-8 h-8 rounded-full hover:bg-slate-100 dark:hover:bg-white/5 flex items-center justify-center text-slate-500 dark:text-text-dim transition-colors"
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
                <InputArea
                    onSend={handleSend}
                    disabled={isTyping}
                    onUploadClick={handleUploadClick}
                    attachedFile={attachedFile}
                    onRemoveAttachment={() => setAttachedFile(null)}
                />

            </main>
        </div>
    );
};

export default Dashboard;
