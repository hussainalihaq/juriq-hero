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
            <div className={`relative bg-white dark:bg-midnight-card w-full max-w-4xl mx-4 rounded-2xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden transform transition-all duration-300 ${isRendered ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 dark:bg-white/5 text-slate-500 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
                >
                    <span className="material-symbols-outlined text-lg">close</span>
                </button>

                <div className="p-6 md:p-10">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2">
                            Unlock Full Legal Power
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400">
                            Choose the plan that fits your professional needs.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">

                        {/* Free Tier */}
                        <div className="p-6 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/5 opacity-80">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Free Tier</h3>
                            <p className="text-xs text-slate-500 mb-4 uppercase tracking-wider">Lead Generation</p>
                            <div className="text-2xl font-bold text-slate-900 dark:text-white mb-6">PKR 0<span className="text-sm font-normal text-slate-500">/mo</span></div>

                            <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-300 mb-8">
                                <li className="flex items-center gap-2"><span className="text-green-500">✓</span> 10 queries per day</li>
                                <li className="flex items-center gap-2"><span className="text-green-500">✓</span> All Jurisdictions (PK, US, UK)</li>
                                <li className="flex items-center gap-2"><span className="text-green-500">✓</span> 1 Document Upload/day</li>
                                <li className="flex items-center gap-2 opacity-50"><span className="text-slate-400">✗</span> Basic AI Model</li>
                            </ul>

                            <button className="w-full py-2 rounded-lg border border-slate-300 dark:border-white/10 text-slate-500 font-medium text-sm cursor-not-allowed">Current Plan</button>
                        </div>

                        {/* Standard Plan (Was Student - Now Open to All) */}
                        <div className="p-6 rounded-xl border-2 border-primary bg-white dark:bg-midnight-card relative shadow-xl shadow-primary/10">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">Most Popular</div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Standard Plan</h3>
                            <p className="text-xs text-primary mb-4 uppercase tracking-wider">For Students & Everyone</p>
                            <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">PKR 999<span className="text-sm font-normal text-slate-500">/mo</span></div>
                            <p className="text-xs text-slate-400 mb-6">or PKR 9,999/year (Save ~17%)</p>

                            <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-300 mb-8">
                                <li className="flex items-center gap-2"><span className="text-green-500">✓</span> 100 queries per day</li>
                                <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Advanced Case Search</li>
                                <li className="flex items-center gap-2"><span className="text-green-500">✓</span> 20 Document Uploads/mo</li>
                                <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Deep Case Law Analysis</li>
                            </ul>

                            <button className="w-full py-2.5 rounded-lg bg-primary hover:bg-primary-dark text-white font-bold text-sm transition-colors shadow-lg shadow-primary/25">Get Standard</button>
                        </div>

                        {/* Professional Plan */}
                        <div className="p-6 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-midnight-card">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Professional</h3>
                            <p className="text-xs text-purple-500 mb-4 uppercase tracking-wider">Lawyers & Founders</p>
                            <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">PKR 2,999<span className="text-sm font-normal text-slate-500">/mo</span></div>
                            <p className="text-xs text-slate-400 mb-6">or PKR 29,999/year (Save ~17%)</p>

                            <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-300 mb-8">
                                <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Unlimited Queries</li>
                                <li className="flex items-center gap-2"><span className="text-green-500">✓</span> GPT-5 Powered</li>
                                <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Unlimited Documents</li>
                                <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Contract Risk Analysis</li>
                            </ul>

                            <button className="w-full py-2.5 rounded-lg bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-200 text-white dark:text-slate-900 font-bold text-sm transition-colors">Go Professional</button>
                        </div>

                    </div>

                    <div className="mt-8 text-center">
                        <p className="text-xs text-slate-400">
                            Enterprise plans available for firms. <a href="#" className="text-primary hover:underline">Contact Sales</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
