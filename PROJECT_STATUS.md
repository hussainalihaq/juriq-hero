# Juriq - AI Legal Assistant (Beta Status)

**Last Updated:** February 6, 2026

## 🚀 Current Status: Closed Beta / Early Access
We are currently in a **closed beta** phase. The public site focuses on driving users to the waitlist.

- **Public Login is Hidden:** The "Log In" button handles have been commented out in `components/Header.tsx` to prevent general public access.
- **Waitlist Logic:** The Home page (`pages/Home.tsx`) captures emails via Supabase into the `waitlist` table.
- **Login Access:** Team members and testers can still access the login page directly at `/login`.

## 📂 Key Directories & Files

### Frontend (`/src`)
- **`App.tsx`**: Main entry point. Defines routes (`/`, `/login`, `/dashboard`, etc.) and includes `<Analytics />`.
- **`pages/Home.tsx`**: Landing page with Hero section and Modal for waitlist signup.
- **`pages/Dashboard.tsx`**: The main application interface.
    - Currently uses **mock data** for documents and chat history.
    - Ready for API integration (see comments in code).
    - Features: File upload (UI only), Chat interface, Document interaction placeholder.
- **`lib/supabaseClient.ts`**: Supabase configuration. Uses env vars.

### Backend / Auth
- **Supabase**: Handles Authentication and Database (`waitlist` table).
- **Environment Variables**:
    - `VITE_SUPABASE_URL`: Project URL.
    - `VITE_SUPABASE_ANON_KEY`: Public API key.
    - **Important:** Ensure you have `.env.local` set up locally. Do not commit this file.

## 🛠 Recent Changes
1.  **Dashboard Refactor**:
    - Converted to React State.
    - Added "Upload New" file button (Client-side logic).
    - Added "Delete History" and "Clear Chat" features.
    - Collapsible Document View.
2.  **Home Page**:
    - Removed public Login link.
    - Prioritized "Get Access" flow.
3.  **Analytics**:
    - Integrated `@vercel/analytics` for tracking page views.

## 🏃‍♂️ How to Run locally
1.  **Install dependencies**:
    ```bash
    npm install
    ```
2.  **Start development server**:
    ```bash
    npm run dev
    ```
3.  **Build for production**:
    ```bash
    npm run build
    ```

## 🔜 Next Steps
- [ ] Connect `Dashboard.tsx` to real Backend APIs (Chat & Document Processing).
- [ ] Enable robust document upload to Supabase Storage.
- [ ] Implement actual RAG/AI response logic.
- [ ] Re-enable public login when Beta is ready for wider release.
