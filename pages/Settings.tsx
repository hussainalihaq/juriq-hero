import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { Sidebar } from '../components/dashboard/Sidebar';

import { useTheme } from '../context/ThemeContext';

const Settings = () => {
    const navigate = useNavigate();
    const { theme, setTheme } = useTheme();
    const [user, setUser] = useState<any>(null);
    const [password, setPassword] = useState('');
    const [loadingParams, setLoadingParams] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

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

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoadingParams(true);
        setMessage(null);

        try {
            const { error } = await supabase.auth.updateUser({
                password: password
            });

            if (error) throw error;

            setMessage({ type: 'success', text: 'Password updated successfully.' });
            setPassword('');
        } catch (err: any) {
            setMessage({ type: 'error', text: err.message });
        } finally {
            setLoadingParams(false);
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/login');
    };

    return (
        <div className="flex h-screen overflow-hidden bg-off-white dark:bg-midnight-bg text-slate-900 dark:text-text-bright font-display selection:bg-primary/30 selection:text-white transition-colors duration-300">
            <Sidebar userEmail={user?.email} userName={user?.user_metadata?.full_name} className="hidden md:flex" />

            <main className="flex-1 flex flex-col relative min-w-0 overflow-y-auto">
                {/* Header */}
                <header className="h-16 flex items-center justify-between px-6 border-b border-slate-200 dark:border-midnight-border bg-white/80 dark:bg-midnight-bg/80 backdrop-blur-md z-10 shrink-0 sticky top-0">
                    <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Settings</h1>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="text-sm font-medium text-slate-500 hover:text-primary dark:text-slate-400 dark:hover:text-white transition-colors"
                    >
                        Back to Dashboard
                    </button>
                </header>

                <div className="max-w-4xl w-full mx-auto p-6 md:p-12 space-y-10 pb-20">

                    {/* Account Section */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-white/10 pb-2">
                            <span className="material-symbols-outlined text-primary">person</span>
                            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-200">Profile & Account</h2>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="glass-panel text-slate-900 dark:text-white bg-white dark:bg-midnight-card border border-slate-200 dark:border-white/5 p-6 rounded-xl shadow-sm">
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Email</label>
                                <p className="font-medium">{user?.email}</p>
                            </div>
                            <div className="glass-panel text-slate-900 dark:text-white bg-white dark:bg-midnight-card border border-slate-200 dark:border-white/5 p-6 rounded-xl shadow-sm">
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Full Name</label>
                                <p className="font-medium">{user?.user_metadata?.full_name || 'Not set'}</p>
                            </div>
                            <div className="glass-panel text-slate-900 dark:text-white bg-white dark:bg-midnight-card border border-slate-200 dark:border-white/5 p-6 rounded-xl shadow-sm md:col-span-2">
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">User ID</label>
                                <p className="text-slate-500 dark:text-slate-400 font-mono text-xs">{user?.id}</p>
                            </div>
                        </div>
                    </section>

                    {/* Appearance Section */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-white/10 pb-2">
                            <span className="material-symbols-outlined text-primary">palette</span>
                            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-200">Appearance</h2>
                        </div>

                        <div className="glass-panel bg-white dark:bg-midnight-card border border-slate-200 dark:border-white/5 p-6 rounded-xl flex items-center justify-between shadow-sm">
                            <div>
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Interface Theme</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Select your preferred color scheme.</p>
                            </div>
                            <div className="flex bg-slate-100 dark:bg-midnight-bg border border-slate-200 dark:border-midnight-border rounded-lg p-1">
                                <button
                                    onClick={() => setTheme('dark')}
                                    className={`px-4 py-1.5 rounded-md text-xs font-bold transition-colors ${theme === 'dark' ? 'bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
                                >
                                    Dark
                                </button>
                                <button
                                    onClick={() => setTheme('light')}
                                    className={`px-4 py-1.5 rounded-md text-xs font-bold transition-colors ${theme === 'light' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
                                >
                                    Light
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* Security Section */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-white/10 pb-2">
                            <span className="material-symbols-outlined text-primary">lock</span>
                            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-200">Security</h2>
                        </div>

                        <div className="glass-panel bg-white dark:bg-midnight-card border border-slate-200 dark:border-white/5 p-6 rounded-xl shadow-sm">
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Change Password</h3>

                            {message && (
                                <div className={`mb-4 p-3 rounded-lg text-sm border ${message.type === 'success' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                                    {message.text}
                                </div>
                            )}

                            <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-md">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">New Password</label>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="input-field w-full px-4 py-2.5 rounded-lg bg-slate-50 dark:bg-midnight-bg border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                        placeholder="Min. 6 characters"
                                        required
                                        minLength={6}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={loadingParams || !password}
                                    className="px-5 py-2 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-midnight-bg font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loadingParams ? 'Updating...' : 'Update Password'}
                                </button>
                            </form>
                        </div>
                    </section>

                    {/* Danger Zone */}
                    <section className="space-y-4 pt-4">
                        <button
                            onClick={handleLogout}
                            className="w-full py-4 rounded-xl border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/5 hover:bg-red-100 dark:hover:bg-red-500/10 transition-all text-sm font-bold flex items-center justify-center gap-2"
                        >
                            <span className="material-symbols-outlined">logout</span>
                            Sign Out
                        </button>
                    </section>
                </div>
            </main>
        </div>
    );
};

export default Settings;
