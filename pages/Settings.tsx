import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { Sidebar } from '../components/dashboard/Sidebar';

const Settings = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState<any>(null);
    const [theme, setTheme] = useState<'dark' | 'light'>('dark');

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                // navigate('/login');
            }
            setUser(user);
        };
        getUser();
    }, [navigate]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/login');
    };

    return (
        <div className="flex h-screen overflow-hidden bg-midnight-bg text-text-bright font-display selection:bg-primary/30 selection:text-white">
            <Sidebar userEmail={user?.email} userName={user?.user_metadata?.full_name} />

            <main className="flex-1 flex flex-col relative min-w-0 overflow-y-auto">
                {/* Header */}
                <header className="h-16 flex items-center justify-between px-6 border-b border-midnight-border bg-midnight-bg/80 backdrop-blur-md z-10 shrink-0 sticky top-0">
                    <h1 className="text-xl font-bold text-white tracking-tight">Settings</h1>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
                    >
                        Back to Dashboard
                    </button>
                </header>

                <div className="max-w-4xl w-full mx-auto p-6 md:p-12 space-y-8">

                    {/* Account Section */}
                    <section className="space-y-4">
                        <h2 className="text-lg font-bold text-slate-200 border-b border-white/10 pb-2">Account</h2>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="glass-panel p-6 rounded-xl">
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Email</label>
                                <p className="text-white font-medium">{user?.email}</p>
                            </div>
                            <div className="glass-panel p-6 rounded-xl">
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Full Name</label>
                                <p className="text-white font-medium">{user?.user_metadata?.full_name || 'Not set'}</p>
                            </div>
                            <div className="glass-panel p-6 rounded-xl">
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">User ID</label>
                                <p className="text-slate-400 font-mono text-xs">{user?.id}</p>
                            </div>
                        </div>
                    </section>

                    {/* Appearance Section */}
                    <section className="space-y-4">
                        <h2 className="text-lg font-bold text-slate-200 border-b border-white/10 pb-2">Appearance</h2>
                        <div className="glass-panel p-6 rounded-xl flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-bold text-white">Theme</h3>
                                <p className="text-xs text-slate-400 mt-1">Choose your preferred interface style.</p>
                            </div>
                            <div className="flex bg-midnight-bg border border-midnight-border rounded-lg p-1">
                                <button
                                    onClick={() => setTheme('dark')}
                                    className={`px-4 py-1.5 rounded-md text-xs font-bold transition-colors ${theme === 'dark' ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-white'}`}
                                >
                                    Dark
                                </button>
                                <button
                                    onClick={() => alert("Light theme coming very soon!")}
                                    className={`px-4 py-1.5 rounded-md text-xs font-bold transition-colors ${theme === 'light' ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-white'}`}
                                >
                                    Light
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* Danger Zone */}
                    <section className="space-y-4 pt-8">
                        <button
                            onClick={handleLogout}
                            className="w-full py-3 rounded-xl border border-red-500/20 text-red-400 hover:bg-red-500/10 hover:border-red-500/40 transition-all text-sm font-bold"
                        >
                            Log Out
                        </button>
                    </section>
                </div>
            </main>
        </div>
    );
};

export default Settings;
