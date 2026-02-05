# Juriq - Setup & API Guide

**Welcome to the Juriq codebase!** This guide will help you get the app running with full functionality.

## 🔑 Environment Variables
You need to create a `.env.local` file in the root directory to connect your services.

**Copy this template:**
```bash
# Supabase (Required for Auth & Database)
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# AI Integration (Optional for local testing if implementing backend)
# Note: For security, we recommend calling AI APIs from a backend (Edge Functions), not directly from the client.
# However, if testing locally:
VITE_GEMINI_API_KEY=your_gemini_key_here
```

## 🛠 Getting API Keys

### 1. Supabase
1.  Go to [supabase.com](https://supabase.com) and create a new project.
2.  In your project dashboard, go to **Settings > API**.
3.  Copy the `Project URL` and `anon public` key.
4.  Paste them into your `.env.local`.

### 2. Gemini / OpenAI (AI Features)
Currently, the app uses a **mock AI response** for demonstration. To make it real:
1.  **Client-Side (Not Recommended for Production):** You can add an input field in `pages/Settings.tsx` to let users input their own key, or store it in `.env.local` for personal use.
2.  **Server-Side (Recommended):** Set up a Vercel Edge Function or Supabase Function that uses your secret key securely.

## 🚀 Running the App
1.  `npm install`
2.  `npm run dev`
3.  Open `http://localhost:5173`

## 📄 Trial Version Features
Since you mentioned offering "trial versions":
- **Auth:** Supabase Auth is strictly implemented. Users must sign up to access the dashboard.
- **Data:** Chats are currently local state. To persist them, you'll need to create a `chats` table in Supabase and hook up the `useEffect` in `Dashboard.tsx` to fetch/save rows.
- **Settings:** Users can see their account details in the new `/settings` page.
