import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (!supabase) {
            setError('Authentication service unavailable.');
            setLoading(false);
            return;
        }

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            // Redirect to dashboard (for now just Home page)
            navigate('/');

        } catch (err: any) {
            console.error("Login error:", err);
            setError(err.message || "Failed to login");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        if (!supabase) return;
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
            });
            if (error) throw error;
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className="bg-off-white font-sans text-slate-900 min-h-screen flex items-stretch overflow-x-hidden">
            <div className="hidden lg:flex flex-col relative w-1/2 bg-grand-courtroom bg-cover bg-center text-white justify-between overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-navy-deep via-navy-deep/20 to-transparent opacity-90"></div>
                <div className="relative z-10 p-12 xl:p-16">
                    <div className="flex items-center gap-3 opacity-90">
                        <Link to="/" className="flex items-center gap-3">
                            <div className="relative w-8 h-8 flex items-center justify-center">
                                <div className="absolute inset-0 border-[2px] border-white/80 rounded-lg rotate-12"></div>
                                <div className="w-2 h-2 bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.6)]"></div>
                            </div>
                            <span className="font-display font-bold tracking-tighter lowercase text-xl text-white">juriq</span>
                        </Link>
                    </div>
                </div>
                <div className="relative z-10 p-12 xl:p-16 mb-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[11px] font-bold uppercase tracking-widest mb-6 text-white/90">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
                        Professional Suite
                    </div>
                    <h1 className="text-5xl xl:text-6xl font-serif font-bold leading-[1.1] mb-6 tracking-tight drop-shadow-lg">
                        Welcome back.
                    </h1>
                    <div className="h-1 w-20 bg-white/30 rounded-full mb-6"></div>
                    <p className="text-slate-200 text-lg max-w-md leading-relaxed font-light">
                        Continue your legal journey with the power of Juriq.
                    </p>
                </div>
                <div className="relative z-10 px-12 xl:px-16 pb-12 flex justify-between items-end text-[11px] font-bold tracking-widest uppercase opacity-60">
                    <span>© 2024 Juriq Inc.</span>
                </div>
            </div>
            <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 sm:p-8 relative geometric-bg">
                {/* SVG 1 */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                    <svg className="absolute top-10 right-10 text-slate-200 w-96 h-96 opacity-60" fill="none" stroke="currentColor" strokeWidth="0.5" viewBox="0 0 200 200">
                        <circle className="opacity-50" cx="100" cy="100" r="80" strokeDasharray="4 4"></circle>
                        <circle className="text-slate-300 opacity-30" cx="100" cy="100" r="50"></circle>
                        <circle cx="100" cy="20" fill="currentColor" r="1.5"></circle>
                    </svg>
                </div>

                <div className="lg:hidden w-full flex justify-center mb-8 relative z-10">
                    <Link to="/" className="flex items-center gap-3">
                        <h2 className="logo-text text-2xl">juriq</h2>
                    </Link>
                </div>

                <div className="w-full max-w-[480px] z-10 relative">
                    <div className="bg-white rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)] border border-slate-100 p-8 sm:p-12 relative overflow-hidden backdrop-blur-sm">
                        <div className="text-center mb-8">
                            <h3 className="text-lg font-medium text-slate-900">Log in to your account</h3>
                            <p className="text-slate-500 text-sm mt-1">Access your professional suite.</p>
                        </div>

                        {error && (
                            <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                                {error}
                            </div>
                        )}

                        <button onClick={handleGoogleLogin} className="btn-google mb-6 group w-full flex items-center justify-center gap-3 px-4 py-3.5 rounded-lg bg-white border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-50 transition-all">
                            <img alt="Google" className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB40YCW4aO3HpVc7Ph-8TI5RkQhCc81992pHsjRuZcNC1FJFNWSCw-Nuv0b-5GeQ-inqysuvAEx21SBa7242e6FKm59hsXb0mufhwlBM8vsF_q9pMTUJJLzFoPfcaOszfVQZ7E2ayeuG_MWTCq_PnciiRT8L1r1B4jWv19TbiZcUZNcwfvTGX-mXoLa0hItbF9h-4H3qc5s0hXulX4cnOhFg0KgtbvV6e6DRVKF-SvkowBsR1YNl4DJMMnD1DEfsg0LDq1O1QhhyNI" />
                            <span>Log in with Google</span>
                        </button>

                        <div className="relative flex items-center gap-4 mb-6">
                            <div className="h-px bg-slate-200 flex-1"></div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-white px-2">Or with email</span>
                            <div className="h-px bg-slate-200 flex-1"></div>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-5">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider ml-1" htmlFor="email">Email Address</label>
                                <input
                                    autoComplete="email"
                                    className="input-field w-full px-4 py-3.5 rounded-lg bg-slate-50 border border-slate-200"
                                    id="email"
                                    placeholder="name@firm.com"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider ml-1" htmlFor="password">Password</label>
                                <div className="relative group">
                                    <input
                                        className="input-field w-full px-4 py-3.5 rounded-lg bg-slate-50 border border-slate-200 pr-10"
                                        id="password"
                                        placeholder="Enter your password"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                    <button className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors duration-200" type="button">
                                        <span className="material-symbols-outlined text-[20px]">visibility_off</span>
                                    </button>
                                </div>
                            </div>
                            <div className="pt-4">
                                <button className="btn-primary w-full flex items-center justify-center px-4 py-4 rounded-lg bg-navy-deep text-white font-bold text-sm tracking-wide hover:bg-primary shadow-lg" type="submit" disabled={loading}>
                                    {loading ? 'Logging in...' : 'Log In'}
                                </button>
                            </div>
                        </form>
                        <div className="mt-8 text-center border-t border-slate-50 pt-6">
                            <p className="text-sm text-slate-500">
                                Don't have an account?
                                <Link to="/signup" className="text-primary font-bold hover:text-navy-deep hover:underline decoration-2 underline-offset-2 transition-all ml-1">Sign Up</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
