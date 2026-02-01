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
                "primary": "#0f172a", // Slate 900
                "navy-deep": "#020617", // Slate 950
                "silver": "#94a3b8",
                "off-white": "#f8fafc",
                "slate-border": "#e2e8f0",
            },
            fontFamily: {
                "sans": ["Plus Jakarta Sans", "Inter", "sans-serif"],
                "display": ["Plus Jakarta Sans", "sans-serif"],
                "serif": ["Playfair Display", "serif"]
            },
            backgroundImage: {
                'grand-courtroom': 'linear-gradient(to bottom, rgba(15, 23, 42, 0.3), rgba(2, 6, 23, 0.85)), url("https://images.unsplash.com/photo-1564951434112-64d74cc2a2d7?q=80&w=2712&auto=format&fit=crop")',
            }
        },
    },
    plugins: [],
    darkMode: 'class',
}
