# Juriq — Project Hierarchy & Configuration Reference

## 1. Environment Variables & API Keys

### Frontend (`/.env.local`)

| Variable | Purpose | Status |
|---|---|---|
| `GEMINI_API_KEY` | Google Gemini (used via `vite.config.ts` define) | Placeholder |
| `VITE_SUPABASE_URL` | Supabase project connection string | Set |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous/public key (frontend auth) | Set |
| `VITE_POLAR_ENV` | Polar payment environment (`production`) | Set |
| `VITE_POLAR_PRO_MONTHLY_ID` | Polar Pro Monthly product ID | Set |
| `VITE_POLAR_PRO_YEARLY_ID` | Polar Pro Yearly product ID | Set |

### Backend (`/backend/.env`)

| Variable | Purpose | Status |
|---|---|---|
| `PORT` | Express server port | `5001` |
| `GEMINI_API_KEY` | Google Gemini API key (AI responses) | Set (quota exhausted) |
| `GROQ_API_KEY` | Groq API key (alternative LLM, unused) | Set |
| `PADDLE_WEBHOOK_SECRET_KEY` | Paddle payment webhook verification | **Missing** |
| `SUPABASE_URL` | Supabase project URL (server-side) | **Missing** |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-side) | **Missing** |

---

## 2. Backend API Endpoints (`/backend/server.js`)

| Method | Route | Purpose | Body Params |
|---|---|---|---|
| GET | `/` | Health check | — |
| POST | `/api/chat` | AI chat response | `history`, `message`, `role`, `jurisdictions`, `outputStyle`, `file` |
| POST | `/api/analyze` | Text analysis (risks, summary, dates) | `text`, `promptType` |
| POST | `/api/upload` | File upload (PDF/DOCX) | Multipart `file` |

---

## 3. AI Model Configuration (`/backend/services/geminiService.js`)

- **Model**: `gemini-2.0-flash`
- **SDK**: `@google/generative-ai`
- **Max Output Tokens**: 4000
- **Temperature**: Dynamic (0.3–0.9 based on `outputStyle` param)

---

## 4. System Prompts Hierarchy

```
geminiService.js
├── BASE_SYSTEM_PROMPT (always included)
│   ├── Core Identity — "You are Juriq, a specialized AI legal intelligence assistant"
│   ├── Strict Boundaries — Allowed vs Prohibited topics
│   ├── Mandatory Disclaimer — Legal information, not advice
│   └── Response Quality Standards — Citations, formatting, accuracy
│
├── JURISDICTION_CONTEXTS (one selected per request)
│   ├── pak — Pakistan Law
│   │   ├── Legal System: Common law + Islamic law (Shariah)
│   │   ├── Court Hierarchy: Supreme Court → High Courts → District Courts
│   │   ├── Key Legislation: Constitution 1973, PPC 1860, CPC 1908, CrPC 1898
│   │   └── Citation Format: PLD [Year] SC [Page]
│   │
│   ├── us — United States Law
│   │   ├── Legal System: Federal + 50 state systems
│   │   ├── Court Hierarchy: SCOTUS → Circuit Courts → District Courts
│   │   ├── Key Principles: Separation of powers, Bill of Rights, Due Process
│   │   └── Citation Format: [Case Name], [Volume] U.S. [Page] ([Year])
│   │
│   └── uk — United Kingdom Law
│       ├── Legal System: Common law, Parliamentary sovereignty
│       ├── Court Hierarchy: UK Supreme Court → Court of Appeal → High Court
│       ├── Key Principles: Stare decisis, statutory interpretation rules
│       └── Citation Format: [Year] UKSC [Number]
│
├── USER_ROLE_CONTEXTS (one selected per request)
│   ├── student — Simple English, teaching tone, study tips
│   ├── entrepreneur — Practical business advice, action-oriented
│   ├── lawyer — Full legal terminology, comprehensive analysis
│   ├── corporate — Corporate counsel focus, risk-aware
│   ├── paralegal — Procedural, checklists, filing requirements
│   └── general — Plain language, everyday examples, empowering
│
└── DOCUMENT_ANALYSIS_PROMPTS (used for /api/analyze and document uploads)
    ├── case — Full case analysis (citation, facts, holdings, ratio decidendi)
    ├── contract — Contract review (risk analysis, missing protections, recommendations)
    ├── statute — Statutory analysis (purpose, scope, provisions, enforcement)
    └── general — Generic document analysis (summary, rights, risk assessment)
```

---

## 5. Prompt Assembly Flow

```
User sends message
    ↓
generateChatResponse(history, message, role, jurisdictions, outputStyle)
    ↓
generateSystemPrompt(jurisdiction, userRole, userTier)
    ↓
┌─────────────────────────────────────────────┐
│  BASE_SYSTEM_PROMPT                         │
│  + JURISDICTION_CONTEXTS[jurisdiction]       │
│  + USER_ROLE_CONTEXTS[role]                  │
│  + Active Context (jurisdiction, role, tier) │
└─────────────────────────────────────────────┘
    ↓
Full prompt = systemPrompt + "\n\nUSER QUERY:\n\n" + message
    ↓
model.startChat({ history, generationConfig })
    ↓
chat.sendMessage(fullPrompt) → { text }
```

---

## 6. Frontend → Backend Data Flow

```
Dashboard.tsx
├── API_URL = import.meta.env.VITE_API_URL || ''  (empty = same-origin)
├── handleSend()
│   ├── Checks daily message limit (10/day free tier)
│   ├── POST /api/chat
│   │   body: { history, message, role, jurisdictions, file }
│   └── Displays response or error in ChatArea
│
├── Vite Dev Server (localhost:3000)
│   └── proxy: /api/* → http://localhost:5001
│
└── Production (juriq.app)
    └── Backend deployed separately (Vercel/Railway/etc.)
```

---

## 7. Frontend Rate Limiting

| Resource | Free Tier Limit | Reset |
|---|---|---|
| Messages per day | 10 | Midnight PKT (UTC+5) |
| Document uploads per day | 1 | Midnight PKT (UTC+5) |

Storage keys per user: `juriq_usage_msg_{uid}`, `juriq_usage_doc_{uid}`, `juriq_usage_date_{uid}`

---

## 8. Key File Locations

```
finaljuriq/
├── .env.local                          # Frontend env vars
├── vite.config.ts                      # Vite config + /api proxy
├── backend/
│   ├── .env                            # Backend env vars (API keys)
│   ├── server.js                       # Express server + routes
│   └── services/
│       └── geminiService.js            # Gemini AI logic + all prompts
├── lib/
│   ├── supabaseClient.ts               # Supabase client init
│   └── paddleService.ts                # Paddle/Polar payment service
├── pages/
│   ├── Dashboard.tsx                   # Main chat dashboard
│   ├── Home.tsx                        # Landing page
│   ├── Settings.tsx                    # User settings
│   └── PricingAndTerms.tsx             # Pricing page
└── components/
    ├── dashboard/
    │   ├── ChatArea.tsx                # Chat messages + empty state
    │   ├── InputArea.tsx               # Message input + file attach
    │   └── Sidebar.tsx                 # Navigation sidebar
    ├── Hero.tsx                        # Landing page hero
    └── UpgradeModal.tsx                # Paywall/upgrade modal
```
