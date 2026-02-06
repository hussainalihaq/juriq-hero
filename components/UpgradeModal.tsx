import React, { useEffect, useState } from 'react';

interface UpgradeModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({ isOpen, onClose }) => {
    // Simplified: Render immediately if open, just handle opacity for transition
    const [isRendered, setIsRendered] = useState(false);

    useEffect(() => {
        if (isOpen) setIsRendered(true);
        else {
            const timer = setTimeout(() => setIsRendered(false), 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!isRendered && !isOpen) return null;

    return (
        <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className={`relative w-full max-w-md bg-white dark:bg-midnight-card border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-300 ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}>

                {/* Header Image/Gradient */}
                <div className="h-32 bg-gradient-to-br from-primary via-purple-600 to-indigo-800 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
                    <span className="material-symbols-outlined text-6xl text-white/90 drop-shadow-md">school</span>
                </div>

                <div className="p-8">
                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Student Plan</h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">You have reached your 5 free messages limit.</p>
                    </div>

                    <div className="bg-slate-50 dark:bg-white/5 rounded-xl p-6 mb-6 border border-slate-100 dark:border-white/5 relative">
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                            Best Value
                        </div>
                        <div className="text-center">
                            <span className="text-3xl font-bold text-slate-900 dark:text-white">PKR 1000</span>
                            <span className="text-slate-400 text-sm">/month</span>
                        </div>
                        <ul className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                            <li className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-green-500 text-base">check</span>
                                Unlimited AI Chats
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-green-500 text-base">check</span>
                                Full Document Analysis
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-green-500 text-base">check</span>
                                Access to "Simple Mode"
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-green-500 text-base">check</span>
                                Citation & Case Law Links
                            </li>
                        </ul>
                    </div>

                    <button
                        className="w-full py-3.5 bg-primary hover:bg-primary-glow text-white font-bold rounded-xl shadow-lg shadow-primary/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                        onClick={() => {
                            // In real app, redirect to payment gateway
                            alert('Payment integration coming soon!');
                        }}
                    >
                        <span>Upgrade Now</span>
                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </button>

                    <button
                        onClick={onClose}
                        className="w-full mt-4 text-xs font-bold text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 uppercase tracking-widest transition-colors"
                    >
                        Maybe Later
                    </button>
                </div>
            </div>
        </div>
    );
};
