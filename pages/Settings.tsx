import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { Sidebar } from '../components/dashboard/Sidebar';
import { useTheme } from '../context/ThemeContext';

const JURISDICTIONS = [
    { id: 'pak', label: 'Pakistan', sublabel: 'Federal & Provincial' },
    { id: 'us', label: 'United States', sublabel: 'State & Federal' },
    { id: 'uk', label: 'United Kingdom', sublabel: 'England & Wales' },
];

const Settings = () => {
    const navigate = useNavigate();
    const { theme, setTheme } = useTheme();
    const [user, setUser] = useState<any>(null);

    // Profile State
    const [fullName, setFullName] = useState('');
    const [organization, setOrganization] = useState('');
    const [role, setRole] = useState('Student');

    // AI Preferences State
    const [outputStyle, setOutputStyle] = useState(50); // 0 = Creative, 100 = Precise
    const [autoCitation, setAutoCitation] = useState(true);

    // Jurisdiction State (multi-select)
    const [selectedJurisdictions, setSelectedJurisdictions] = useState<string[]>(['pak']);

    // Password State
    const [password, setPassword] = useState('');
    const [loadingParams, setLoadingParams] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUser(user);
                setFullName(user.user_metadata?.full_name || '');
                // Load saved preferences from local storage
                const savedPrefs = localStorage.getItem('juriq_preferences');
                if (savedPrefs) {
                    const prefs = JSON.parse(savedPrefs);
                    setOutputStyle(prefs.outputStyle ?? 50);
                    setAutoCitation(prefs.autoCitation ?? true);
                    setSelectedJurisdictions(prefs.jurisdictions ?? ['pak']);
                    setOrganization(prefs.organization ?? '');
                    setRole(prefs.role ?? 'Student');
                }
            }
        };
        getUser();
    }, [navigate]);

    const handleSavePreferences = () => {
        const prefs = {
            outputStyle,
            autoCitation,
            jurisdictions: selectedJurisdictions,
            organization,
            role
        };
        localStorage.setItem('juriq_preferences', JSON.stringify(prefs));
        setMessage({ type: 'success', text: 'Preferences saved successfully!' });
        setTimeout(() => setMessage(null), 3000);
    };

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoadingParams(true);
        setMessage(null);
        try {
            const { error } = await supabase.auth.updateUser({ password });
            if (error) throw error;
            setMessage({ type: 'success', text: 'Password updated successfully.' });
            setPassword('');
        } catch (err: any) {
            setMessage({ type: 'error', text: err.message });
        } finally {
            setLoadingParams(false);
        }
    };

    const toggleJurisdiction = (id: string) => {
        setSelectedJurisdictions(prev =>
            prev.includes(id) ? prev.filter(j => j !== id) : [...prev, id]
        );
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/login');
    };

    const getPrecisionLabel = () => {
        if (outputStyle < 33) return 'Creative Mode';
        if (outputStyle < 66) return 'Balanced Mode';
        return 'High Precision Mode';
    };

    return (
        <div className="flex h-screen overflow-hidden bg-off-white dark:bg-midnight-bg text-slate-900 dark:text-text-bright font-display transition-colors duration-300">
            <Sidebar userEmail={user?.email} userName={user?.user_metadata?.full_name} className="hidden md:flex" />

            <main className="flex-1 flex flex-col relative min-w-0 overflow-y-auto">
                {/* Header */}
                <header className="h-16 flex items-center justify-between px-6 border-b border-slate-200 dark:border-midnight-border bg-white/80 dark:bg-midnight-bg/80 backdrop-blur-md z-10 shrink-0 sticky top-0">
                    <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Settings & Preferences</h1>
                    <button
                        onClick={handleSavePreferences}
                        className="px-5 py-2 rounded-lg bg-primary text-white font-bold text-sm hover:bg-primary-glow transition-colors"
                    >
                        Update Profile
                    </button>
                </header>

                <div className="max-w-4xl w-full mx-auto p-6 md:p-12 space-y-10 pb-20">

                    {/* Success/Error Message */}
                    {message && (
                        <div className={`p-4 rounded-xl text-sm font-medium border ${message.type === 'success' ? 'bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 border-green-200 dark:border-green-500/20' : 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-500/20'}`}>
                            {message.text}
                        </div>
                    )}

                    {/* Account Profile Section */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-white/10 pb-2">
                            <span className="material-symbols-outlined text-primary">person</span>
                            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-200">Account Profile</h2>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Full Name</label>
                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl bg-white dark:bg-midnight-card border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                    placeholder="Your full name"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Email Address</label>
                                <input
                                    type="email"
                                    value={user?.email || ''}
                                    disabled
                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-midnight-bg border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 cursor-not-allowed"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Law Firm / Organization</label>
                                <input
                                    type="text"
                                    value={organization}
                                    onChange={(e) => setOrganization(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl bg-white dark:bg-midnight-card border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                    placeholder="Your organization"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Role</label>
                                <select
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl bg-white dark:bg-midnight-card border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all appearance-none cursor-pointer"
                                >
                                    <option value="Student">Student</option>
                                    <option value="Entrepreneur">Entrepreneur</option>
                                    <option value="Junior Associate">Junior Associate</option>
                                    <option value="Senior Partner">Senior Partner</option>
                                    <option value="In-House Counsel">In-House Counsel</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </div>
                    </section>

                    {/* AI Preferences Section */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-white/10 pb-2">
                            <span className="material-symbols-outlined text-primary">tune</span>
                            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-200">AI Preferences</h2>
                        </div>

                        <div className="bg-white dark:bg-midnight-card border border-slate-200 dark:border-white/5 p-6 rounded-xl space-y-6">
                            {/* Output Style Slider */}
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">Output Style: Creativity vs. Precision</h3>
                                    <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20">
                                        {getPrecisionLabel()}
                                    </span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={outputStyle}
                                    onChange={(e) => setOutputStyle(Number(e.target.value))}
                                    className="w-full h-2 bg-slate-200 dark:bg-midnight-border rounded-lg appearance-none cursor-pointer accent-primary"
                                />
                                <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">
                                    <span>Creative / Drafting</span>
                                    <span>Strictly Legal / Precise</span>
                                </div>
                            </div>

                            {/* Auto-Citation Toggle */}
                            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-white/5">
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">Auto-Citation</h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Automatically find and link relevant case law for every AI response.</p>
                                </div>
                                <button
                                    onClick={() => setAutoCitation(!autoCitation)}
                                    className={`relative w-14 h-8 rounded-full transition-colors duration-300 ${autoCitation ? 'bg-primary' : 'bg-slate-300 dark:bg-midnight-border'}`}
                                >
                                    <span className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300 ${autoCitation ? 'translate-x-6' : 'translate-x-0'}`}></span>
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* Jurisdiction Settings Section */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-white/10 pb-2">
                            <span className="material-symbols-outlined text-primary">gavel</span>
                            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-200">Jurisdiction Settings</h2>
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Select the primary jurisdictions for legal research and citation standards.</p>

                        <div className="grid gap-4 md:grid-cols-3">
                            {JURISDICTIONS.map(j => (
                                <button
                                    key={j.id}
                                    onClick={() => toggleJurisdiction(j.id)}
                                    className={`p-4 rounded-xl border-2 text-left transition-all ${selectedJurisdictions.includes(j.id)
                                        ? 'border-primary bg-primary/5 dark:bg-primary/10'
                                        : 'border-slate-200 dark:border-white/10 bg-white dark:bg-midnight-card hover:border-slate-300 dark:hover:border-white/20'
                                        }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h4 className="font-bold text-slate-900 dark:text-white">{j.label}</h4>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{j.sublabel}</p>
                                        </div>
                                        {selectedJurisdictions.includes(j.id) && (
                                            <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                                                <span className="material-symbols-outlined text-white text-sm">check</span>
                                            </div>
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* Appearance Section */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-white/10 pb-2">
                            <span className="material-symbols-outlined text-primary">palette</span>
                            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-200">Appearance</h2>
                        </div>

                        <div className="bg-white dark:bg-midnight-card border border-slate-200 dark:border-white/5 p-6 rounded-xl flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Interface Theme</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Select your preferred color scheme.</p>
                            </div>
                            <div className="flex bg-slate-100 dark:bg-midnight-bg border border-slate-200 dark:border-midnight-border rounded-lg p-1">
                                <button
                                    onClick={() => setTheme('light')}
                                    className={`px-4 py-1.5 rounded-md text-xs font-bold transition-colors ${theme === 'light' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
                                >
                                    Light
                                </button>
                                <button
                                    onClick={() => setTheme('dark')}
                                    className={`px-4 py-1.5 rounded-md text-xs font-bold transition-colors ${theme === 'dark' ? 'bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
                                >
                                    Dark
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

                        <div className="bg-white dark:bg-midnight-card border border-slate-200 dark:border-white/5 p-6 rounded-xl">
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Change Password</h3>
                            <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-md">
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-midnight-bg border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                    placeholder="New password (min. 6 characters)"
                                    required
                                    minLength={6}
                                />
                                <button
                                    type="submit"
                                    disabled={loadingParams || !password}
                                    className="px-5 py-2.5 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-midnight-bg font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loadingParams ? 'Updating...' : 'Update Password'}
                                </button>
                            </form>
                        </div>
                    </section>

                    {/* Sign Out */}
                    <section className="pt-4">
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
