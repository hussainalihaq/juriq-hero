import React from 'react';
import { Deadline, Activity } from '../../types/dashboard';

interface RightSidebarProps {
    className?: string;
    onCollapse?: () => void;
}

export const RightSidebar: React.FC<RightSidebarProps> = ({ className, onCollapse }) => {
    // Mock Data - To be replaced or managed via props/state later
    const deadlines: Deadline[] = [
        // {
        //   id: '1',
        //   title: 'Submit Opposing Brief',
        //   date: 'Oct 24',
        //   day: '24',
        //   month: 'OCT',
        //   urgent: true
        // },
    ];

    const activities: Activity[] = [
        // {
        //   id: '1',
        //   title: 'App Initialized',
        //   description: 'Welcome to Juriq Beta.',
        //   time: 'JUST NOW',
        //   type: 'create'
        // }
    ];

    const getIconColor = (type: Activity['type']) => {
        switch (type) {
            case 'draft': return 'bg-primary shadow-[0_0_10px_rgba(99,102,241,0.5)]';
            case 'analysis': return 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]';
            case 'create': return 'bg-slate-500';
            default: return 'bg-slate-500';
        }
    };

    return (
        <aside className={`w-80 border-l border-slate-200 dark:border-midnight-border bg-white dark:bg-midnight-card shrink-0 flex-col h-full transition-all duration-300 ${className || 'hidden xl:flex'}`}>
            {/* Deadlines Section */}
            <div className="p-6 border-b border-slate-200 dark:border-midnight-border">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xs font-bold text-slate-900 dark:text-text-bright flex items-center gap-2 uppercase tracking-wider">
                        <span className="material-symbols-outlined text-primary text-base">event</span>
                        Deadlines
                    </h3>
                    {onCollapse && (
                        <button
                            onClick={onCollapse}
                            className="text-slate-400 hover:text-slate-700 dark:text-slate-500 dark:hover:text-white transition-colors"
                            title="Collapse Sidebar"
                        >
                            <span className="material-symbols-outlined text-xl">dock_to_right</span>
                        </button>
                    )}
                </div>
                <div className="space-y-3">
                    {deadlines.length === 0 ? (
                        <p className="text-xs text-slate-600 italic">No upcoming deadlines.</p>
                    ) : (
                        deadlines.map(d => (
                            <div key={d.id} className={`p-3 rounded-xl flex items-center gap-3 border transition-colors cursor-pointer group ${d.urgent ? 'bg-red-500/10 border-red-500/20' : 'bg-midnight-bg border-midnight-border hover:border-primary/40'}`}>
                                <div className={`flex flex-col items-center justify-center w-12 h-12 rounded-lg shrink-0 ${d.urgent ? 'bg-red-500 text-white' : 'bg-white/5 text-slate-400 group-hover:text-white transition-colors'}`}>
                                    <span className="text-[10px] font-bold uppercase leading-none opacity-70">{d.month}</span>
                                    <span className="text-lg font-black leading-none">{d.day}</span>
                                </div>
                                <div className="overflow-hidden">
                                    <p className={`text-xs font-bold truncate ${d.urgent ? 'text-red-400' : 'text-slate-200'}`}>{d.title}</p>
                                    <p className={`text-[10px] ${d.urgent ? 'text-red-400/70' : 'text-slate-500'}`}>
                                        {d.urgent ? 'Due in 2 hours' : d.time || d.date}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Activity Section */}
            <div className="p-6 flex-1 overflow-y-auto">
                <h3 className="text-xs font-bold text-slate-900 dark:text-text-bright mb-4 flex items-center gap-2 uppercase tracking-wider">
                    <span className="material-symbols-outlined text-lg text-primary">history</span>
                    Activity
                </h3>
                <div className="relative pl-6 space-y-7">
                    <div className="absolute left-[7px] top-2 bottom-2 w-px bg-midnight-border"></div>

                    {activities.length === 0 ? (
                        <div className="relative">
                            <div className={`absolute -left-[23px] top-1 w-3 h-3 rounded-full ring-4 ring-white dark:ring-midnight-card bg-slate-400 dark:bg-slate-500`}></div>
                            <p className="text-xs font-bold text-slate-700 dark:text-slate-200">System Ready</p>
                            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">Juriq is ready for your first case.</p>
                            <p className="text-[10px] text-slate-400 dark:text-slate-600 mt-1.5 font-mono">NOW</p>
                        </div>
                    ) : (
                        activities.map(activity => (
                            <div key={activity.id} className={`relative ${activity.time === 'YESTERDAY' ? 'opacity-50' : ''}`}>
                                <div className={`absolute -left-[23px] top-1 w-3 h-3 rounded-full ring-4 ring-midnight-card ${getIconColor(activity.type)}`}></div>
                                <p className="text-xs font-bold text-slate-200">{activity.title}</p>
                                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{activity.description}</p>
                                <p className="text-[10px] text-slate-600 mt-1.5 font-mono">{activity.time}</p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </aside>
    );
};
