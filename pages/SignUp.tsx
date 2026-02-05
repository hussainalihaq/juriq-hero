import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Link, useNavigate } from 'react-router-dom';

const SignUp = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [fullName, setFullName] = useState('');
    const [role, setRole] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Initial basic client-side validation
        if (!supabase) {
            setError('Authentication service unavailable. Check console/env keys.');
            setLoading(false);
            return;
        }

        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                        role: role, // Store role in user metadata
                    },
                },
            });

            if (error) throw error;

            // If successful, maybe redirect to login or show check email message
            // For now, let's assume auto-login or redirect to dashboard (Home)
            alert("Sign up successful! Please check your email to confirm your account.");
            navigate('/dashboard');

        } catch (err: any) {
            console.error("Sign up error:", err);
            setError(err.message || "Failed to sign up");
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
        <div className="bg-off-white dark:bg-navy-deep font-sans text-slate-900 dark:text-slate-100 min-h-screen flex items-stretch overflow-x-hidden transition-colors duration-300">
            <div className="hidden lg:flex flex-col relative w-1/2 bg-grand-courtroom bg-cover bg-center text-white justify-between overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-navy-deep via-navy-deep/20 to-transparent opacity-90"></div>
                <div className="relative z-10 p-12 xl:p-16">
                    <div className="flex items-center gap-3 opacity-90">
                        <Link to="/" className="flex items-center gap-3">
                            <div className="w-12 h-12 text-white transition-colors duration-300">
                                <svg viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                                    <defs>
                                        <mask id="logo-mask-auth-signup">
                                            <rect width="24" height="24" fill="white" />
                                            <circle cx="18.5" cy="18.5" r="5.25" fill="black" />
                                        </mask>
                                    </defs>
                                    <g transform="translate(18, 18) scale(2.5)">
                                        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.5" fill="none" mask="url(#logo-mask-auth-signup)" />
                                        <path d="M18.5 15.75 A2.75 2.75 0 1 1 18.5 21.25 A2.75 2.75 0 1 1 18.5 15.75 M18.5 17 A1.5 1.5 0 1 0 18.5 20 A1.5 1.5 0 1 0 18.5 17" fill="currentColor" fillRule="evenodd" />
                                    </g>
                                </svg>
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
                        Your AI guide to <br />legal clarity.
                    </h1>
                    <div className="h-1 w-20 bg-white/30 rounded-full mb-6"></div>
                    <p className="text-slate-200 text-lg max-w-md leading-relaxed font-light">
                        Experience the next generation of legal intelligence. Designed for precision, built for authority.
                    </p>
                </div>
                <div className="relative z-10 px-12 xl:px-16 pb-12 flex justify-between items-end text-[11px] font-bold tracking-widest uppercase opacity-60">
                    <span>© 2024 Juriq Inc.</span>
                </div>
            </div>
            <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 sm:p-8 relative geometric-bg">
                {/* Background SVGs preserved */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                    {/* SVG 1 */}
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
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)] border border-slate-100 dark:border-slate-800 p-8 sm:p-12 relative overflow-hidden backdrop-blur-sm transition-colors duration-300">
                        <div className="text-center mb-8">
                            <h3 className="text-lg font-medium text-slate-900 dark:text-white">Create your account</h3>
                            <p className="text-slate-500 text-sm mt-1">Start your 14-day free trial.</p>
                        </div>

                        {error && (
                            <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                                {error}
                            </div>
                        )}

                        <button onClick={handleGoogleLogin} className="btn-google mb-6 group w-full flex items-center justify-center gap-3 px-4 py-3.5 rounded-lg bg-white border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-50 transition-all">
                            <img alt="Google" className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB40YCW4aO3HpVc7Ph-8TI5RkQhCc81992pHsjRuZcNC1FJFNWSCw-Nuv0b-5GeQ-inqysuvAEx21SBa7242e6FKm59hsXb0mufhwlBM8vsF_q9pMTUJJLzFoPfcaOszfVQZ7E2ayeuG_MWTCq_PnciiRT8L1r1B4jWv19TbiZcUZNcwfvTGX-mXoLa0hItbF9h-4H3qc5s0hXulX4cnOhFg0KgtbvV6e6DRVKF-SvkowBsR1YNl4DJMMnD1DEfsg0LDq1O1QhhyNI" />
                            <span>Sign up with Google</span>
                        </button>

                        <div className="relative flex items-center gap-4 mb-6">
                            <div className="h-px bg-slate-200 dark:bg-slate-700 flex-1"></div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-white dark:bg-slate-900 px-2 transition-colors duration-300">Or with email</span>
                            <div className="h-px bg-slate-200 dark:bg-slate-700 flex-1"></div>
                        </div>

                        <form onSubmit={handleSignUp} className="space-y-5">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider ml-1" htmlFor="name">Full Name</label>
                                <input
                                    autoComplete="name"
                                    className="input-field"
                                    id="name"
                                    placeholder="e.g. Sarah Jennings"
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider ml-1" htmlFor="email">Email Address</label>
                                <input
                                    autoComplete="email"
                                    className="input-field"
                                    id="email"
                                    placeholder="name@firm.com"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider ml-1" htmlFor="password">Password</label>

                                <div className="relative group">
                                    <input
                                        className="input-field pr-10"
                                        id="password"
                                        placeholder="Create a password"
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        minLength={6}
                                    />
                                    <button
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors duration-200"
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        <span className="material-symbols-outlined text-[20px]">
                                            {showPassword ? 'visibility' : 'visibility_off'}
                                        </span>
                                    </button>
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider ml-1" htmlFor="role">Professional Role</label>
                                <div className="relative">
                                    <select
                                        id="role"
                                        value={role}
                                        onChange={(e) => setRole(e.target.value)}
                                        required
                                        className="input-field appearance-none cursor-pointer pr-10"
                                    >
                                        <option value="" disabled>Select your role</option>
                                        <option value="lawyer">Lawyer</option>
                                        <option value="student">Student</option>
                                        <option value="corporate">Corporate Counsel</option>
                                        <option value="paralegal">Paralegal</option>
                                        <option value="entrepreneur">Entrepreneur</option>
                                        <option value="other">Other</option>
                                    </select>
                                    <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-slate-400">
                                        <span className="material-symbols-outlined text-lg">expand_more</span>
                                    </div>
                                </div>
                            </div>
                            <div className="pt-4">
                                <button className="btn-primary w-full flex items-center justify-center px-4 py-4 rounded-lg bg-navy-deep text-white font-bold text-sm tracking-wide hover:bg-primary shadow-lg" type="submit" disabled={loading}>
                                    {loading ? 'Account Creating...' : 'Sign Up'}
                                </button>
                            </div>
                        </form>
                        <div className="mt-8 text-center border-t border-slate-50 dark:border-slate-800 pt-6">
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                Already have an account?
                                <Link to="/login" className="text-primary dark:text-blue-400 font-bold hover:text-navy-deep dark:hover:text-blue-300 hover:underline decoration-2 underline-offset-2 transition-all ml-1">Log In</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
