import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

const Dashboard = () => {
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = async () => {
        if (supabase) {
            await supabase.auth.signOut();
        }
        navigate('/login');
    };

    return (
        <div className="bg-off-white font-sans text-slate-900 h-screen overflow-hidden flex selection:bg-indigo-100">
            {/* Sidebar */}
            <aside className="w-72 bg-navy-deep h-full flex flex-col border-r border-white/5 hidden md:flex shrink-0 transition-all duration-300">
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
                        <h3 className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Recent Conversations</h3>
                        <div className="space-y-1">
                            <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white bg-white/10 font-medium cursor-pointer select-none">
                                <span className="material-symbols-outlined text-[18px]">chat_bubble</span>
                                MSA Review - TechCorp
                            </div>
                            <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 text-sm hover:text-white hover:bg-white/5 transition-colors cursor-pointer select-none">
                                <span className="material-symbols-outlined text-[18px]">chat_bubble</span>
                                IP Indemnity Clause Check
                            </div>
                            <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 text-sm hover:text-white hover:bg-white/5 transition-colors cursor-pointer select-none">
                                <span className="material-symbols-outlined text-[18px]">chat_bubble</span>
                                NDA Analysis - Project X
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Uploaded Documents</h3>
                        <div className="space-y-1">
                            <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 text-sm hover:text-white hover:bg-white/5 transition-colors cursor-pointer select-none">
                                <span className="material-symbols-outlined text-[18px]">description</span>
                                Service_Agreement_v4.pdf
                            </div>
                            <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 text-sm hover:text-white hover:bg-white/5 transition-colors cursor-pointer select-none">
                                <span className="material-symbols-outlined text-[18px]">description</span>
                                Vendor_DPA_2024.pdf
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-4 border-t border-white/5">
                    <div className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors group">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">JD</div>
                            <div className="flex flex-col">
                                <span className="text-sm font-medium text-white">Jane Doe</span>
                                <span className="text-xs text-slate-500">Premium Plan</span>
                            </div>
                        </div>
                        <button onClick={handleLogout} className="text-slate-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity" title="Log out">
                            <span className="material-symbols-outlined text-[20px]">logout</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 w-full bg-navy-deep z-50 h-14 flex items-center justify-between px-4 border-b border-white/5">
                <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-white cursor-pointer" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>menu</span>
                    <div className="flex items-center gap-2 ml-2" onClick={() => navigate('/')}>
                        <div className="relative w-5 h-5 flex items-center justify-center">
                            <div className="absolute inset-0 border-[1.5px] border-white rounded md rotate-12 opacity-90"></div>
                            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                        </div>
                        <h2 className="logo-text text-lg text-white font-display font-bold tracking-tighter lowercase">juriq</h2>
                    </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">JD</div>
            </div>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-full relative md:static pt-14 md:pt-0">
                {/* PDF/Document View */}
                <div className="h-[35%] md:h-[40%] bg-slate-100 border-b border-slate-200 p-4 md:p-6 overflow-hidden relative">
                    <div className="absolute top-4 right-4 z-10 flex gap-2">
                        <button className="bg-white p-1.5 rounded-md shadow-sm border border-slate-200 text-slate-500 hover:text-primary transition-colors">
                            <span className="material-symbols-outlined text-[18px]">open_in_full</span>
                        </button>
                        <button className="bg-white p-1.5 rounded-md shadow-sm border border-slate-200 text-slate-500 hover:text-primary transition-colors">
                            <span className="material-symbols-outlined text-[18px]">close</span>
                        </button>
                    </div>

                    <div className="h-full max-w-4xl mx-auto bg-white shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)] rounded-lg p-8 md:p-12 overflow-y-auto text-[10px] md:text-xs text-slate-700 font-serif leading-relaxed relative">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-orange-400 to-transparent opacity-50"></div>
                        <h1 className="text-lg md:text-xl font-bold text-slate-900 mb-6 font-sans">MASTER SERVICES AGREEMENT</h1>
                        <p className="mb-4 text-justify">
                            This Master Services Agreement ("Agreement") is made and entered into as of [Date], by and between [Client Name] ("Client") and [Provider Name] ("Provider").
                        </p>
                        <p className="mb-4 text-justify">
                            <strong>1. SERVICES.</strong> Provider agrees to perform the services described in the Statement of Work attached hereto as Exhibit A ("Services").
                        </p>
                        <div className="mb-4 p-1 -mx-1 rounded bg-red-500/15 border-l-2 border-red-500 relative group">
                            <div className="absolute -right-2 -top-2 bg-red-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">HIGH RISK</div>
                            <p className="text-justify text-slate-800">
                                <strong>2. INDEMNIFICATION.</strong> Client agrees to indemnify, defend, and hold harmless Provider from any and all claims, damages, liabilities, costs, and expenses (including reasonable attorneys' fees) arising out of or related to Client's use of the Services, <span className="bg-red-100 text-red-800 font-bold px-0.5">regardless of Provider's negligence or misconduct.</span>
                            </p>
                        </div>
                        <p className="mb-4 text-justify">
                            <strong>3. TERM AND TERMINATION.</strong> This Agreement shall commence on the Effective Date and continue for a period of five (5) years. Client may not terminate for convenience during the first 36 months.
                        </p>
                        <p className="text-justify text-slate-400 blur-[1px]">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                        </p>
                    </div>
                </div>

                {/* Chat Interface */}
                <div className="flex-1 flex flex-col relative bg-off-white overflow-hidden">
                    <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 scrollbar-hide">
                        <div className="max-w-3xl mx-auto space-y-8 pb-32">
                            <div className="flex justify-center">
                                <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full uppercase tracking-wide">Today, 10:23 AM</span>
                            </div>

                            {/* User Message */}
                            <div className="flex justify-end">
                                <div className="bg-slate-200 text-slate-800 px-5 py-3.5 rounded-2xl rounded-tr-sm max-w-[85%] md:max-w-[70%] shadow-sm">
                                    <p className="text-sm md:text-base leading-relaxed">Can you review the indemnification clause in section 2? It looks incredibly one-sided. Does this expose us to liability even if they are at fault?</p>
                                </div>
                            </div>

                            {/* AI Response */}
                            <div className="flex items-start gap-4">
                                <div className="w-8 h-8 rounded-lg bg-primary flex-shrink-0 flex items-center justify-center mt-1 shadow-md text-white">
                                    <div className="w-4 h-4 border border-white rounded rotate-12 opacity-90"></div>
                                </div>
                                <div className="flex-1 space-y-3">
                                    <div className="bg-primary text-white px-6 py-5 rounded-2xl rounded-tl-sm shadow-md max-w-[95%]">
                                        <p className="text-sm md:text-base leading-relaxed mb-4">
                                            Yes, you are absolutely correct to be concerned.
                                        </p>
                                        <p className="text-sm md:text-base leading-relaxed mb-4">
                                            The clause in Section 2 is an <strong>unlimited indemnity</strong> in favor of the Provider. Specifically, the phrase <span className="text-red-300 font-mono text-xs bg-white/10 px-1 py-0.5 rounded">"regardless of Provider's negligence or misconduct"</span> is highly unusual and presents a <span className="text-red-400 font-bold">Critical Risk</span>.
                                        </p>
                                        <div className="bg-white/5 border border-white/10 rounded-lg p-3 text-xs md:text-sm text-slate-300">
                                            <div className="flex items-center gap-2 text-red-400 font-bold mb-1 uppercase text-[10px] tracking-wider">
                                                <span className="material-symbols-outlined text-sm">warning</span> Risk Identified
                                            </div>
                                            It requires you to pay for their mistakes, even gross negligence. Most jurisdictions might find this unenforceable for gross negligence, but it creates significant contractual exposure.
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-2 pl-2">
                                        <button className="text-xs text-primary font-semibold hover:underline flex items-center gap-1">
                                            <span className="material-symbols-outlined text-[14px]">edit_document</span> Draft a counter-proposal
                                        </button>
                                        <button className="text-xs text-primary font-semibold hover:underline flex items-center gap-1">
                                            <span className="material-symbols-outlined text-[14px]">gavel</span> Case law examples
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Input Area */}
                    <div className="absolute bottom-0 w-full bg-gradient-to-t from-off-white via-off-white to-transparent pb-6 pt-10 px-4">
                        <div className="max-w-3xl mx-auto flex flex-col gap-3">
                            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1">
                                <button className="px-4 py-2 rounded-full bg-white border border-slate-200 text-xs font-semibold text-slate-600 shadow-sm hover:border-primary hover:text-primary transition-all cursor-pointer whitespace-nowrap active:scale-95">
                                    <span className="text-indigo-500 mr-1">✨</span> Summarize obligations
                                </button>
                                <button className="px-4 py-2 rounded-full bg-white border border-slate-200 text-xs font-semibold text-slate-600 shadow-sm hover:border-primary hover:text-primary transition-all cursor-pointer whitespace-nowrap active:scale-95">
                                    <span className="text-red-500 mr-1">🛡️</span> Identify risks
                                </button>
                                <button className="px-4 py-2 rounded-full bg-white border border-slate-200 text-xs font-semibold text-slate-600 shadow-sm hover:border-primary hover:text-primary transition-all cursor-pointer whitespace-nowrap active:scale-95">
                                    <span className="text-orange-500 mr-1">⚖️</span> Check conflicts
                                </button>
                            </div>
                            <div className="relative flex items-center gap-2 bg-white rounded-full shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)] border border-slate-200 p-2 pr-2 transition-all focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/50">
                                <button className="w-10 h-10 flex items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
                                    <span className="material-symbols-outlined">add</span>
                                </button>
                                <input className="flex-1 bg-transparent border-none focus:ring-0 text-slate-700 placeholder:text-slate-400 text-sm md:text-base focus:outline-none" placeholder="Ask juriq anything about your documents..." type="text" />
                                <div className="flex items-center gap-1">
                                    <button className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:text-primary transition-colors">
                                        <span className="material-symbols-outlined text-[20px]">mic</span>
                                    </button>
                                    <button className="w-10 h-10 flex items-center justify-center rounded-full bg-primary text-white shadow-md hover:bg-navy-deep hover:scale-105 active:scale-95 transition-all">
                                        <span className="material-symbols-outlined text-[20px]">arrow_upward</span>
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
