# Juriq - Features & Architecture Documentation

## 1. Project Overview
**Juriq** is a high-fidelity AI Legal Assistant designed for the Pakistan jurisdiction (with US/UK support). It provides specialized legal analysis for Students, Founders, and Lawyers using Google's Gemini 1.5 Pro models.

## 2. Technical Stack

### Frontend
- **Framework**: React 18 (Vite)
- **Language**: TypeScript
- **Styling**: Tailwind CSS (Dark Mode enabled, Custom `midnight` theme)
- **Typography**: `Lora` (Serif for headings) + `Inter` (Sans-serif for UI)
- **Icons**: Material Symbols Outlined
- **State Management**: React `useState`, `useRef`, `localStorage` (Persistence)
- **Routing**: React Router DOM

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **AI Model**: Google Gemini 1.5 Pro / Flash (via `@google/generative-ai`)
- **File Handling**: `multer` (for PDF/Docx processing)
- **PDF Parsing**: `pdf-parse`

---

## 3. Key Features

### 🧠 AI & Context Engine
- **Role-Based Personas**:
  - **Lawyer**: Professional, citation-heavy, statutory references.
  - **Student**: Educational, explains concepts, breaks down logic.
  - **Founder**: Practical, risk-focused, business-centric advice.
- **Jurisdiction Toggle**: Defaults to **Pakistan**, supports switching to US/UK.
- **Streaming Responses**: Real-time text generation for a responsive feel.

### 💬 Advanced Chat Interface
- **Smart Scrolling**:
  - Uses `useLayoutEffect` to lock scroll to bottom during streaming.
  - "Stickiness" auto-disengages if user scrolls up to read history.
  - **Floating Scroll Button**: Appears when scrolled up to instantly return to latest.
  - **Layout Spacing**: optimized `pb-64` padding + `h-40` physical spacer ensures text never hides behind the input bar.
- **Message Actions**:
  - **Copy**: One-click copy to clipboard.
  - **Retry**: Regenerate response on error or dissatisfaction.
- **Visuals**:
  - Clean, transparent AI text (no boxy borders).
  - User messages in Primary Blue bubbles.
  - Markdown rendering (Bold, Lists, Headers).

### 📂 Document Analysis (RAG-Lite)
- **File Support**: PDF, DOCX, TXT.
- **Upload Logic**:
  - Files are processed in-memory (or temp storage) and converted to text.
  - Content is attached to the prompt context for Gemini to analyze.
- **Limits**:
  - Document usage counts only increment on **Send** (not upload).
  - Daily limit enforcement (e.g., 20 docs/day).

### ⚙️ Dashboard & Settings
- **Session Management**:
  - Auto-saves chat history to `localStorage`.
  - Sidebar for switching between past conversations.
  - "New Chat" resets context but keeps history.
- **Usage Tracking**:
  - Visual progress bars for Daily Messages and Document Limits.
  - Tier-based logic (Free vs Pro).
- **Authentication**:
  - **Supabase Auth**: Email/Password login.
  - **Guest Mode**: Limited access capabilities.

---

## 4. Backend Architecture Details

### Directory Structure
```
/backend
  ├── server.js           # Main Entry Point (Express App)
  ├── geminiService.js    # AI Logic (Prompt Engineering + Google SDK)
  └── juriq-prompts.js    # System Instructions & Persona Definitions
```

### API Endpoints
1.  **POST `/api/chat`**
    *   **Body**: `{ message, history, role, jurisdiction, file }`
    *   **Logic**:
        *   Constructs a "system prompt" based on Role + Jurisdiction.
        *   Incorporates File context if present.
        *   Calls Gemini API (Stream).
        *   Streams chunks back to frontend.

2.  **POST `/api/analyze`** (Beta)
    *   **Logic**: Dedicated endpoint for deep document analysis / summarization.

### Security & Limits
*   **CORS**: Configured to allow frontend origin.
*   **Rate Limiting**: Backend tracks simple usage (can be expanded to Redis).
*   **Env Variables**: API Keys stored in `.env` (Google AI, Supabase).

---

## 5. Deployment

*   **Frontend**: Deployed on **Vercel** (Single Page App).
*   **Backend**: Can be deployed on **Render**, **Railway**, or as Serverless Functions on Vercel (`/api` directory).
*   **Build Command**: `npm run build` (Production optimized).

## 6. Future Roadmap (Planned)
*   **Supabase Database**: Move history from LocalStorage to Postgres.
*   **Vector Search (RAG)**: For searching across thousands of legal cases.
*   **Payment Gateway**: Stripe integration for Pro Plan upgrades.
