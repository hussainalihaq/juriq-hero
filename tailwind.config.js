/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./App.tsx",
        "./index.tsx"
    ],
    theme: {
        extend: {
            colors: {
                "midnight-bg": "#0f172a",      // Lighter dark (Slate 900) instead of #02040a
                "midnight-card": "#1e293b",    // Lighter card (Slate 800) instead of #0b101b
                "midnight-border": "#334155",  // Slate 700
                "midnight-hover": "#161e31",
                "text-bright": "#f8fafc",      // Primary text
                "text-dim": "#94a3b8",         // Secondary text
                "primary": "#4f46e5",          // Indigo accent (Dashlay)
                "primary-glow": "#818cf8",
                "navy-deep": "#020617", // Old primary/slate 950
                "silver": "#94a3b8",
                "off-white": "#f8fafc",
                "slate-border": "#e2e8f0",
            },
            fontFamily: {
                "sans": ["Inter", "Plus Jakarta Sans", "Roboto", "sans-serif"],
                "display": ["Plus Jakarta Sans", "Inter", "sans-serif"],
                "serif": ["Lora", "Merriweather", "serif"]
            },
            boxShadow: {
                'glow': '0 0 40px -10px rgba(79, 70, 229, 0.3)',
                'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
            },
            animation: {
                'slide-up': 'slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                'fade-in': 'fadeIn 1s ease-out forwards',
                'pulse-slow': 'pulseGlow 4s ease-in-out infinite',
            },
            keyframes: {
                slideUp: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                pulseGlow: {
                    '0%, 100%': { boxShadow: '0 0 20px -5px rgba(99, 102, 241, 0.1)' },
                    '50%': { boxShadow: '0 0 40px -5px rgba(99, 102, 241, 0.3)' },
                },
                typing: {
                    from: { width: '0' },
                    to: { width: '100%' }
                },
                blink: {
                    '50%': { borderColor: 'transparent' }
                }
            },
            backgroundImage: {
                'grand-courtroom': 'linear-gradient(to bottom, rgba(15, 23, 42, 0.4), rgba(2, 6, 23, 0.9)), url("https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2301&auto=format&fit=crop")', // Modern sleek office/architecture
            },
        },
    },
    plugins: [],
    darkMode: 'class',
}
