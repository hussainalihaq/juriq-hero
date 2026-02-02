import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

// --- Types for API Integration ---
interface Message {
    id: string;
    role: 'user' | 'ai';
    content: string;
    timestamp: Date;
    isError?: boolean;
}

interface Document {
    id: string;
    name: string;
    type: 'pdf' | 'docx';
    snippet?: string; // Short preview text
}

interface Conversation {
    id: string;
    title: string;
    lastActive: Date;
}

const Dashboard = () => {
    const navigate = useNavigate();

    // --- State Management ---
    const [user, setUser] = useState<any>(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Mock Data
    const [documents, setDocuments] = useState<Document[]>([]);
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [activeDocId, setActiveDocId] = useState<string | null>(null);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Auto-scroll to bottom of chat
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };
        getUser();
    }, []);

    // --- Actions ---

    const handleLogout = async () => {
        if (supabase) {
            await supabase.auth.signOut();
        }
        navigate('/login');
    };

    const handleSendMessage = async (text: string = inputValue) => {
        if (!text.trim()) return;

        // 1. Add User Message
        const tempId = Date.now().toString();
        const userMsg: Message = {
            id: tempId,
            role: 'user',
            content: text,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        setInputValue('');
        setIsLoading(true);

        // TODO: Replace with real API Call
        try {
            // Simulator API delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            const aiResponse: Message = {
                id: (Date.now() + 1).toString(),
                role: 'ai',
                content: "I've analyzed your request. This is a placeholder for the real AI response. Once the API is integrated, I will provide legal insights based on the document text.",
                timestamp: new Date()
            };
            setMessages(prev => [...prev, aiResponse]);

            // Add to conversation history if it's the first message
            if (messages.length === 0) {
                const newConv: Conversation = {
                    id: tempId,
                    title: text.length > 30 ? text.substring(0, 30) + '...' : text,
                    lastActive: new Date()
                };
                setConversations(prev => [newConv, ...prev]);
            }

        } catch (error) {
            console.error("API Error", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleChipClick = (prompt: string) => {
        setInputValue(prompt);
    };

    const handleAddDocumentClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // In a real app, upload to Supabase Storage here
        // For now, client-side preview
        const newDoc: Document = {
            id: Date.now().toString(),
            name: file.name,
            type: file.name.endsWith('.docx') ? 'docx' : 'pdf'
        };
        setDocuments(prev => [...prev, newDoc]);
        setActiveDocId(newDoc.id);

        // Reset input
        e.target.value = '';
    };

    const handleDeleteConversation = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (window.confirm("Are you sure you want to delete this conversation?")) {
            setConversations(prev => prev.filter(c => c.id !== id));
        }
    };

    const handleClearChat = () => {
        if (messages.length > 0 && window.confirm("Clear current chat history?")) {
            setMessages([]);
        }
    };

    return (
        <div className="bg-off-white font-sans text-slate-900 h-screen overflow-hidden flex selection:bg-indigo-100">
            {/* Hidden File Input */}
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".pdf,.docx,.txt"
                onChange={handleFileUpload}
            />

            {/* Sidebar */}
            <aside className={`w-72 bg-navy-deep h-full flex flex-col border-r border-white/5 shrink-0 transition-all duration-300 ${isMobileMenuOpen ? 'fixed z-40' : 'hidden md:flex'}`}>
                <div className="h-16 flex items-center px-6 border-b border-white/5">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                        <div className="relative w-7 h-7 flex items-center justify-center">
                            <div className="absolute inset-0 border-[2px] border-white rounded-lg rotate-12 opacity-90"></div>
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                        <h2 className="logo-text text-xl text-white font-display font-bold tracking-tighter lowercase">juriq</h2>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto py-6 px-3 scrollbar-hide">
                    <div className="mb-8">
                        <div className="flex items-center justify-between px-3 mb-3">
                            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Recent Conversations</h3>
                            {conversations.length > 0 && (
                                <button className="text-[10px] text-slate-500 hover:text-red-400" onClick={() => setConversations([])}>Clear All</button>
                            )}
                        </div>
                        <div className="space-y-1">
                            {conversations.length === 0 ? (
                                <p className="px-3 text-xs text-slate-600 italic">No history yet.</p>
                            ) : (
                                conversations.map(conv => (
                                    <div key={conv.id} className="nav-item group flex items-center justify-between px-3 py-2.5 rounded-lg text-slate-400 text-sm hover:text-white hover:bg-white/5 transition-colors cursor-pointer select-none">
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <span className="material-symbols-outlined text-[18px] shrink-0">chat_bubble</span>
                                            <span className="truncate">{conv.title}</span>
                                        </div>
                                        <button
                                            onClick={(e) => handleDeleteConversation(e, conv.id)}
                                            className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 transition-opacity"
                                            title="Delete"
                                        >
                                            <span className="material-symbols-outlined text-[16px]">delete</span>
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    <div>
                        <h3 className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Uploaded Documents</h3>
                        <div className="space-y-1">
                            {documents.map(doc => (
                                <div
                                    key={doc.id}
                                    className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors cursor-pointer select-none ${activeDocId === doc.id ? 'text-white bg-white/10' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                                    onClick={() => setActiveDocId(doc.id)}
                                >
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <span className="material-symbols-outlined text-[18px] shrink-0">description</span>
                                        <span className="truncate">{doc.name}</span>
                                    </div>
                                </div>
                            ))}
                            <div className="mt-3 px-3">
                                <button
                                    onClick={handleAddDocumentClick}
                                    className="w-full py-2 border border-dashed border-slate-600 rounded-lg text-slate-500 text-xs hover:border-slate-400 hover:text-slate-300 transition-colors flex items-center justify-center gap-2"
                                >
                                    <span className="material-symbols-outlined text-[16px]">add</span>
                                    Upload New
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-4 border-t border-white/5">
                    <div className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors group">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold uppercase">
                                {user?.email?.charAt(0) || 'U'}
                            </div>
                            <div className="flex flex-col overflow-hidden">
                                <span className="text-sm font-medium text-white truncate max-w-[120px]" title={user?.email}>
                                    {user?.email ? user.email.split('@')[0] : 'User'}
                                </span>
                                <span className="text-xs text-slate-500">Free Plan</span>
                            </div>
                        </div>
                        <button onClick={handleLogout} className="text-slate-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity" title="Log out">
                            <span className="material-symbols-outlined text-[20px]">logout</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Mobile Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 md:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 w-full bg-navy-deep z-50 h-14 flex items-center justify-between px-4 border-b border-white/5">
                <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-white cursor-pointer" onClick={() => setIsMobileMenuOpen(true)}>menu</span>
                    <div className="flex items-center gap-2 ml-2" onClick={() => navigate('/')}>
                        <div className="relative w-5 h-5 flex items-center justify-center">
                            <div className="absolute inset-0 border-[1.5px] border-white rounded md rotate-12 opacity-90"></div>
                            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                        </div>
                        <h2 className="logo-text text-lg text-white font-display font-bold tracking-tighter lowercase">juriq</h2>
                    </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">
                    {user?.email?.charAt(0).toUpperCase() || 'J'}
                </div>
            </div>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-full relative md:static pt-14 md:pt-0">
                {/* PDF/Document View Placeholder - Conditionally Rendered */}
                {activeDocId && (
                    <div className="h-[35%] md:h-[40%] bg-slate-100 border-b border-slate-200 p-4 md:p-6 overflow-hidden relative">
                        <div className="absolute top-4 right-4 z-10 flex gap-2">
                            {/* Tools for Document View */}
                            <div className="bg-white rounded-md shadow-sm border border-slate-200 flex overflow-hidden">
                                <button className="p-1.5 text-slate-500 hover:text-primary hover:bg-slate-50 border-r border-slate-100" title="Zoom In">
                                    <span className="material-symbols-outlined text-[18px]">add</span>
                                </button>
                                <button className="p-1.5 text-slate-500 hover:text-primary hover:bg-slate-50 border-r border-slate-100" title="Zoom Out">
                                    <span className="material-symbols-outlined text-[18px]">remove</span>
                                </button>
                                <button
                                    className="p-1.5 text-slate-500 hover:text-red-500 hover:bg-slate-50"
                                    title="Close Document"
                                    onClick={() => setActiveDocId(null)}
                                >
                                    <span className="material-symbols-outlined text-[18px]">close</span>
                                </button>
                            </div>
                        </div>

                        <div className="h-full max-w-4xl mx-auto bg-white shadow-sm rounded-lg p-8 md:p-12 overflow-y-auto text-slate-700 relative">
                            {/* Placeholder Content for Document */}
                            <div className="text-center mt-20 opacity-50">
                                <span className="material-symbols-outlined text-6xl mb-4 text-slate-300">description</span>
                                <p className="font-medium">Viewing Document {activeDocId}</p>
                                <p className="text-sm text-slate-500 mt-2">API Integration Point: Render PDF/Text here</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* "Add Document" Button in header when Doc View is closed */}
                {!activeDocId && (
                    <div className="absolute top-4 right-4 z-20 md:static md:flex md:justify-end md:p-4 md:absolute md:top-0 md:right-0 md:w-full md:pointer-events-none">
                        <button
                            onClick={handleAddDocumentClick}
                            className="bg-white pointer-events-auto border border-slate-200 text-slate-600 px-4 py-2 rounded-lg shadow-sm hover:shadow-md hover:border-primary hover:text-primary transition-all flex items-center gap-2 text-sm font-medium"
                        >
                            <span className="material-symbols-outlined text-[18px]">add_circle</span>
                            Add Document
                        </button>
                    </div>
                )}

                {/* Chat Interface */}
                <div className={`flex-1 flex flex-col relative bg-off-white overflow-hidden ${!activeDocId ? 'h-full' : ''}`}>
                    {messages.length > 0 && (
                        <div className="absolute top-2 right-4 z-10 md:static md:flex md:justify-end md:px-8 md:pt-4">
                            <button
                                onClick={handleClearChat}
                                className="text-xs text-slate-400 hover:text-red-500 flex items-center gap-1 bg-white/50 px-2 py-1 rounded backdrop-blur-sm transition-colors"
                            >
                                <span className="material-symbols-outlined text-[14px]">delete</span>
                                Clear Chat
                            </button>
                        </div>
                    )}

                    <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 scrollbar-hide pt-16 md:pt-4">
                        <div className="max-w-3xl mx-auto pb-32">
                            {messages.length === 0 ? (
                                <div className="text-center mt-10 p-6">
                                    <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                                        <span className="material-symbols-outlined text-2xl">auto_awesome</span>
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-800 mb-2">How can I help with your legal documents?</h3>
                                    <p className="text-slate-500 text-sm max-w-md mx-auto">Upload a contract, NDA, or agreement to get started. I can summarize, find risks, or answer specific questions.</p>
                                </div>
                            ) : (
                                messages.map((msg) => (
                                    <div key={msg.id} className={`flex gap-4 mb-6 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        {msg.role === 'ai' && (
                                            <div className="w-8 h-8 rounded-lg bg-primary flex-shrink-0 flex items-center justify-center mt-1 shadow-md text-white">
                                                <div className="w-4 h-4 border border-white rounded rotate-12 opacity-90"></div>
                                            </div>
                                        )}

                                        <div className={`px-5 py-3.5 rounded-2xl max-w-[85%] md:max-w-[70%] shadow-sm leading-relaxed text-sm md:text-base ${msg.role === 'user'
                                                ? 'bg-white text-slate-800 rounded-tr-sm border border-slate-100'
                                                : 'bg-primary text-white rounded-tl-sm'
                                            }`}>
                                            {msg.content}
                                        </div>

                                        {msg.role === 'user' && (
                                            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex-shrink-0 flex items-center justify-center text-xs font-bold mt-1">
                                                {user?.email?.charAt(0).toUpperCase() || 'U'}
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}

                            {isLoading && (
                                <div className="flex gap-4 mb-6 justify-start animate-pulse">
                                    <div className="w-8 h-8 rounded-lg bg-primary flex-shrink-0 flex items-center justify-center mt-1 opacity-50"></div>
                                    <div className="bg-slate-200 h-12 w-32 rounded-2xl rounded-tl-sm"></div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                    </div>

                    {/* Input Area */}
                    <div className="absolute bottom-0 w-full bg-gradient-to-t from-off-white via-off-white to-transparent pb-6 pt-10 px-4">
                        <div className="max-w-3xl mx-auto flex flex-col gap-3">
                            {messages.length === 0 && (
                                <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1">
                                    {[
                                        { icon: '✨', text: 'Summarize obligations', prompt: 'Summarize the key obligations in this document.' },
                                        { icon: '🛡️', text: 'Identify risks', prompt: 'Identify high-risk clauses in this contract.' },
                                        { icon: '⚖️', text: 'Check conflicts', prompt: 'Check for conflicting terms.' },
                                    ].map((chip, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => handleChipClick(chip.prompt)}
                                            className="px-4 py-2 rounded-full bg-white border border-slate-200 text-xs font-semibold text-slate-600 shadow-sm hover:border-primary hover:text-primary transition-all cursor-pointer whitespace-nowrap active:scale-95"
                                        >
                                            <span className="text-indigo-500 mr-1">{chip.icon}</span> {chip.text}
                                        </button>
                                    ))}
                                </div>
                            )}

                            <div className="relative flex items-center gap-2 bg-white rounded-2xl shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)] border border-slate-200 p-2 pr-2 transition-all focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/50">
                                <button
                                    className="w-10 h-10 flex items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors tooltip-trigger"
                                    title="Upload context"
                                    onClick={handleAddDocumentClick}
                                >
                                    <span className="material-symbols-outlined">add</span>
                                </button>

                                <input
                                    className="flex-1 bg-transparent border-none focus:ring-0 text-slate-700 placeholder:text-slate-400 text-sm md:text-base focus:outline-none"
                                    placeholder="Ask juriq anything about your documents..."
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    disabled={isLoading}
                                />

                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => handleSendMessage()}
                                        disabled={!inputValue.trim() || isLoading}
                                        className={`w-10 h-10 flex items-center justify-center rounded-full shadow-md transition-all ${inputValue.trim() && !isLoading
                                                ? 'bg-primary text-white hover:bg-navy-deep hover:scale-105 active:scale-95'
                                                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                            }`}
                                    >
                                        <span className="material-symbols-outlined text-[20px]">{isLoading ? 'stop' : 'arrow_upward'}</span>
                                    </button>
                                </div>
                            </div>
                            <div className="text-center">
                                <p className="text-[10px] text-slate-400 font-medium">juriq can make mistakes. Verify important legal info.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
