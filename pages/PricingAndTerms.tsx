
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { openPaddleCheckout } from '../lib/paddleService';
import { supabase } from '../lib/supabaseClient';
import Modal from '../components/Modal';

const SUBSCRIPTION_PLANS = [
    {
        id: 'free',
        name: 'Free Tier',
        price: '0',
        period: 'month',
        description: 'Perfect for exploring Juriq\'s core capabilities',
        features: [
            '10 messages per day',
            '3 document analyses per month',
            'Pakistan jurisdiction only',
            'Basic chat (Student/Founder/Lawyer)',
            'Chat history (7 days)',
            'Uses Groq Gemini 2.5 Flash Lite'
        ],
        cta: 'Get Started',
        highlight: false
    },
    {
        id: 'student',
        name: 'Student Tier 🎓',
        price: '5',
        yearlyPrice: '50',
        period: 'month',
        description: 'Verified students save big on powerful tools',
        features: [
            'Unlimited messages',
            '15 documents per month',
            'All jurisdictions (Pak, US, UK)',
            'Unlimited chat history',
            'Student persona optimized',
            'Basic PDF export',
            'Uses Groq Gemini 2.5 Flash'
        ],
        cta: 'Subscribe Now',
        highlight: false,
        verification: 'Requires .edu email or ID'
    },
    {
        id: 'founder',
        name: 'Founder Tier 💼',
        price: '12',
        yearlyPrice: '120',
        period: 'month',
        description: 'Business-first legal AI for entrepreneurs',
        features: [
            'Unlimited messages',
            '30 documents per month',
            'All jurisdictions (Pak, US, UK)',
            'Founder persona optimized',
            'PDF exports (chat + reports)',
            'Priority processing',
            'Unlimited chat history',
            'Email support (48hr response)'
        ],
        cta: 'Start Scaling',
        highlight: true,
        badge: 'Most Popular'
    },
    {
        id: 'professional',
        name: 'Professional Tier ⚖️',
        price: '29',
        yearlyPrice: '290',
        period: 'month',
        description: 'Elite power with GPT-4o for legal pros',
        features: [
            'Unlimited messages',
            'Unlimited documents',
            'All jurisdictions (Pak, US, UK)',
            'Premium AI: GPT-4o',
            'All personas optimized',
            'Advanced PDF exports',
            'Priority processing (3x faster)',
            'Priority email support (24hr)',
            'Remove Juriq branding'
        ],
        cta: 'Go Professional',
        highlight: false
    }
];

const PricingAndTerms = () => {
    const navigate = useNavigate();
    const { theme } = useTheme();
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
    const [loading, setLoading] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSubscribe = async (planId: string) => {
        if (planId === 'free') {
            setIsModalOpen(true);
            return;
        }

        setLoading(planId);

        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                // Determine user intent but show Waitlist Modal instead of Signup
                // localStorage.setItem('juriq_upgrade_intent', JSON.stringify({ planId, billingCycle }));
                // navigate('/signup');
                setIsModalOpen(true);
                return;
            }

            // Open Paddle Checkout with explicit mapping for Student/Founder/Pro
            // Note: Currently Paddle Service defaults to "PRO", we might need to extend it for multiple tiers if Paddle is configured for them.
            // For now, mapping all paid to the configured Pro/Founder/Student IDs if available, or alerting.

            // To be robust, we should update openPaddleCheckout to accept a Plan ID, but checking paddleService.ts, it uses PRO_MONTHLY/PRO_YEARLY constants.
            // I will assume for this step we will direct them to the checkout function, but logic in paddleService might need update for multiple tiers later.
            // For now, I'll pass the ID as 'pro' for professional, but we need to handle others.

            // Given current paddleService only has PRO, I will add TODO comments.
            // Actually, I'll assume we update paddleService to handle product IDs dynamically or just call openPaddleCheckout which currently maps to Pro.

            // Temporary fix: Call openPaddleCheckout and let user know specific tier linking is pending backend config if not Pro.
            if (planId === 'professional') {
                await openPaddleCheckout(user.email!, user.id, billingCycle);
            } else {
                // Fallback or placeholder for other plans until IDs are in .env
                alert(`Checkout for ${planId} plan coming soon! configuring IDs...`);

                // If we had IDs: 
                // await openPaddleCheckout(user.email!, user.id, billingCycle, planId);
            }

        } catch (error) {
            console.error('Subscription error:', error);
            alert('Failed to start checkout. Please try again.');
        } finally {
            setLoading(null);
        }
    };

    return (
        <div className="min-h-screen bg-off-white dark:bg-midnight-bg text-slate-900 dark:text-text-bright font-display transition-colors duration-300">
            {/* Header */}
            <header className="fixed top-0 w-full z-50 bg-white/80 dark:bg-midnight-bg/80 backdrop-blur-md border-b border-slate-200 dark:border-white/10">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white font-bold text-lg">
                            J
                        </div>
                        <span className="font-bold text-xl tracking-tight">Juriq</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate('/login')} className="text-sm font-bold text-slate-600 hover:text-primary dark:text-slate-300 dark:hover:text-white transition-colors">
                            Log In
                        </button>
                        <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-bold hover:bg-primary-glow transition-all">
                            Get Access
                        </button>
                    </div>
                </div>
            </header>

            <main className="pt-32 pb-20 px-6">
                <div className="max-w-7xl mx-auto">

                    {/* Hero Section */}
                    <div className="text-center mb-16 space-y-4">
                        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 dark:from-white dark:via-slate-200 dark:to-slate-400 animate-gradient-x">
                            Simple, Transparent Pricing
                        </h1>
                        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                            Choose the plan that fits your legal needs. From students to professionals, we have you covered.
                        </p>

                        {/* Billing Toggle */}
                        <div className="flex items-center justify-center gap-4 mt-8">
                            <span className={`text-sm font-bold ${billingCycle === 'monthly' ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>Monthly</span>
                            <button
                                onClick={() => setBillingCycle(prev => prev === 'monthly' ? 'yearly' : 'monthly')}
                                className="relative w-14 h-8 rounded-full bg-slate-200 dark:bg-white/10 transition-colors"
                            >
                                <div className={`absolute top-1 left-1 w-6 h-6 rounded-full bg-white shadow-md transition-transform duration-300 ${billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-0'}`} />
                            </button>
                            <div className="flex items-center gap-2">
                                <span className={`text-sm font-bold ${billingCycle === 'yearly' ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>Yearly</span>
                                <span className="px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 text-xs font-bold">
                                    Save ~17%
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Pricing Cards */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
                        {SUBSCRIPTION_PLANS.map((plan) => (
                            <div
                                key={plan.id}
                                className={`relative p-6 rounded-2xl border-2 flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${plan.highlight
                                    ? 'border-primary bg-white dark:bg-midnight-card shadow-lg ring-4 ring-primary/10'
                                    : 'border-slate-200 dark:border-white/10 bg-white dark:bg-midnight-card hover:border-slate-300 dark:hover:border-white/20'
                                    }`}
                            >
                                {plan.badge && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary text-white text-xs font-bold shadow-lg">
                                        {plan.badge}
                                    </div>
                                )}

                                <div className="mb-6">
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{plan.name}</h3>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-3xl font-bold text-slate-900 dark:text-white">
                                            ${billingCycle === 'yearly' && plan.yearlyPrice ? plan.yearlyPrice : plan.price}
                                        </span>
                                        {plan.price !== '0' && (
                                            <span className="text-sm text-slate-500">/{billingCycle === 'yearly' ? 'year' : 'month'}</span>
                                        )}
                                    </div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 min-h-[40px]">{plan.description}</p>
                                </div>

                                <div className="flex-1 space-y-3 mb-8">
                                    {plan.features.map((feature, i) => (
                                        <div key={i} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                                            <span className="material-symbols-outlined text-green-500 text-base shrink-0">check_circle</span>
                                            <span className="leading-snug">{feature}</span>
                                        </div>
                                    ))}
                                    {plan.verification && (
                                        <div className="flex items-start gap-2 text-sm text-amber-600 dark:text-amber-400 mt-2 pt-2 border-t border-slate-100 dark:border-white/5">
                                            <span className="material-symbols-outlined text-base shrink-0">verified_user</span>
                                            <span className="leading-snug font-medium">{plan.verification}</span>
                                        </div>
                                    )}
                                </div>

                                <button
                                    onClick={() => handleSubscribe(plan.id)}
                                    disabled={loading === plan.id}
                                    className={`w-full py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${plan.highlight
                                        ? 'bg-primary text-white hover:bg-primary-glow shadow-md hover:shadow-lg'
                                        : 'bg-slate-100 dark:bg-white/5 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-white/10'
                                        }`}
                                >
                                    {loading === plan.id ? 'Processing...' : plan.cta}
                                    {plan.highlight && <span className="material-symbols-outlined text-lg">rocket_launch</span>}
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Terms & Conditions Section */}
                    <div className="max-w-4xl mx-auto prose prose-slate dark:prose-invert">
                        <div className="bg-slate-50 dark:bg-white/5 p-8 rounded-2xl border border-slate-200 dark:border-white/10">
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">gavel</span>
                                Terms & Conditions
                            </h2>

                            <div className="space-y-6 text-sm text-slate-600 dark:text-slate-400">
                                <section>
                                    <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">1. Acceptance of Terms</h3>
                                    <p>By accessing and using Juriq, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you may not use our services.</p>
                                </section>

                                <section>
                                    <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">2. Description of Service</h3>
                                    <p>Juriq is an AI-powered legal assistant providing information for educational and preliminary research purposes. <strong>Juriq is NOT a law firm and does not provide legal advice.</strong> Always consult a qualified attorney for specific legal matters.</p>
                                </section>

                                <section>
                                    <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">3. Subscription & Payments</h3>
                                    <ul className="list-disc pl-5 space-y-1">
                                        <li>Subscriptions are billed in advance on a monthly or yearly basis.</li>
                                        <li>You may cancel your subscription at any time; access remains active until the end of the billing period.</li>
                                        <li>Refunds are handled on a case-by-case basis within 7 days of purchase.</li>
                                        <li>Student tier Verification is required. False verification may result in account termination.</li>
                                    </ul>
                                </section>

                                <section>
                                    <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">4. User Responsibilities</h3>
                                    <p>You are responsible for maintaining the confidentiality of your account credentials. You agree not to use the service for any illegal or unauthorized purpose.</p>
                                </section>

                                <section>
                                    <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">5. Disclaimer of Warranties</h3>
                                    <p>The service is provided "as is" without warranties of any kind. Juriq does not guarantee the accuracy, completeness, or reliability of any legal information provided by the AI.</p>
                                </section>

                                <section>
                                    <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">6. Limitation of Liability</h3>
                                    <p>Juriq shall not be liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use the service.</p>
                                </section>

                                <div className="pt-6 mt-6 border-t border-slate-200 dark:border-white/10 text-xs text-center opacity-60">
                                    Last Updated: February 2026. Contact support@juriq.app for questions.
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </main>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
};

export default PricingAndTerms;
