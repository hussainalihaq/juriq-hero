import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';

const UpdatePassword = () => {
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Verify user is authenticated (via the reset link token)
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (!session) {
                navigate('/login');
            }
        });
    }, [navigate]);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error } = await supabase.auth.updateUser({
                password: password
            });

            if (error) throw error;

            navigate('/dashboard');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-off-white dark:bg-navy-deep font-sans text-slate-900 dark:text-slate-100 min-h-screen flex items-center justify-center p-6 transition-colors duration-300">
            <div className="w-full max-w-[480px] z-10 relative">
                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)] border border-slate-100 dark:border-slate-800 p-8 sm:p-12 relative overflow-hidden backdrop-blur-sm transition-colors duration-300">
                    <div className="text-center mb-8">
                        <h3 className="text-lg font-medium text-slate-900 dark:text-white">Set New Password</h3>
                        <p className="text-slate-500 text-sm mt-1">Enter your new secure password.</p>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleUpdate} className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider ml-1" htmlFor="password">New Password</label>
                            <input
                                className="input-field w-full px-4 py-3.5 rounded-lg bg-slate-50 border border-slate-200"
                                id="password"
                                placeholder="Enter new password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div className="pt-4">
                            <button className="btn-primary w-full flex items-center justify-center px-4 py-4 rounded-lg bg-primary text-white font-bold text-sm tracking-wide hover:bg-primary-glow shadow-lg transition-colors" type="submit" disabled={loading}>
                                {loading ? 'Updating...' : 'Update Password'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UpdatePassword;
