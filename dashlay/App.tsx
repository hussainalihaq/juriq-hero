import React, { useState, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { RightSidebar } from './components/RightSidebar';
import { ChatArea } from './components/ChatArea';
import { InputArea } from './components/InputArea';
import { Message } from './types';
import { generateAIResponse } from './services/geminiService';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = useCallback(async (text: string) => {
    // Add user message
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    // Call Gemini
    const responseText = await generateAIResponse([...messages, userMsg], text);

    setIsTyping(false);
    
    // Add AI Response
    const aiMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: responseText,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, aiMsg]);
  }, [messages]);

  return (
    <div className="flex h-screen overflow-hidden bg-midnight-bg text-text-bright font-display selection:bg-primary/30 selection:text-white">
      
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative min-w-0">
        
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-6 border-b border-midnight-border bg-midnight-bg/80 backdrop-blur-md z-10 shrink-0">
            <div className="flex items-center gap-2">
                <button className="md:hidden text-text-dim hover:text-white transition-colors">
                    <span className="material-symbols-outlined">menu</span>
                </button>
                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/5 text-xs font-medium text-text-dim hover:text-white hover:bg-white/10 transition-all cursor-pointer">
                    <span className="material-symbols-outlined text-sm">add</span>
                    <span>New Chat</span>
                </div>
            </div>
            
            <div className="flex items-center gap-4">
                 <div className="px-3 py-1 bg-gradient-to-r from-primary/20 to-purple-500/20 border border-primary/30 rounded text-[10px] font-bold tracking-wider text-primary-glow uppercase">
                    Beta
                 </div>
                 <button className="w-8 h-8 rounded-full hover:bg-white/5 flex items-center justify-center text-text-dim transition-colors">
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
        <InputArea onSend={handleSend} disabled={isTyping} />

      </main>

      <RightSidebar />
    </div>
  );
};

export default App;