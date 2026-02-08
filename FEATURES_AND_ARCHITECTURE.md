# Juriq - Features & Architecture Documentation

## 1. Project Overview
**Juriq** is a high-fidelity AI Legal Assistant designed for the Pakistan jurisdiction (with US/UK support). It provides specialized legal analysis for **Students**, **Founders**, and **Lawyers** using Google's Gemini 1.5 Pro models.

## 2. Technical Stack

### Frontend
- **Framework**: React 18 (Vite)
- **Language**: TypeScript
- **Styling**: Tailwind CSS (Dark Mode enabled, Custom `midnight` theme)
- **State Management**: `useState` + `localStorage` (migrating to Supabase)
- **Payment**: Paddle.js (V2 Billing)
- **Analytics**: Vercel Analytics

### Backend
- **Runtime**: Node.js + Express.js
- **Database**: Supabase (PostgreSQL) + RLS Policies
- **Storage**: Supabase Storage (PDFs/Docs)
- **AI Model**: Google Gemini 1.5 Pro / Flash
- **Payment Processing**: Paddle Webhooks

---

## 3. Architecture & Data Flow

### Database Schema (Supabase Postgres)
| Table | Description | Key Fields |
| :--- | :--- | :--- |
| **`profiles`** | User details & subscription tier | `id`, `email`, `role`, `tier` (free/student/founder/pro), `paddle_customer_id` |
| **`chat_sessions`** | Top-level conversation metadata | `id`, `user_id`, `role` (context), `jurisdiction` |
| **`messages`** | Individual chat messages | `id`, `session_id`, `role` (user/model), `content`, `tokens_used` |
| **`documents`** | Uploaded file metadata | `id`, `file_path`, `risk_score`, `analysis_json` |
| **`usage_tracking`** | Daily usage limits enforcement | `user_id`, `date`, `messages_count`, `documents_count` |

### Payment Flow (Paddle)
1.  **Frontend**: User clicks "Upgrade" on `/pricing`.
2.  **Paddle.js**: Opens Checkout Overlay (Products: Free, Student, Founder, Pro).
3.  **Payment Success**: Paddle processes transaction.
4.  **Webhook**: Paddle sends `subscription.created` event to Backend.
5.  **Backend**: Validates signature -> Updates `profiles.tier` & `profiles.subscription_status`.

---

## 4. Backend API Documentation

### A. Authentication
- Managed via Supabase Client on Frontend.
- Backend Middleware: Verify Supabase JWT Token.

### B. Chat & AI Endpoints
| Method | Endpoint | Description | Status |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/chat` | Main RAG chat endpoint. Accepts `history`, `jurisdiction`, `role`. | ✅ Live |
| `POST` | `/api/analyze` | Deep document analysis (Risk Score, Summary). | ✅ Live |

### C. Documents (Unfinished)
| Method | Endpoint | Description | Status |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/upload` | Upload PDF/Docx to Supabase Storage + Parse Text. | 🚧 Setup Required |
| `GET` | `/api/documents` | List user's documents. | 🚧 Pending |

### D. Payments (Paddle)
| Method | Endpoint | Description | Status |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/webhooks/paddle` | Receives subscription events from Paddle. | 🚧 Config Required |

---

## 5. Pricing Tiers

| Tier | Price | Verification | Limits | Model |
| :--- | :--- | :--- | :--- | :--- |
| **Free** | $0 | None | 10 msgs/day, 3 docs/mo | Flash Lite |
| **Student** | $5/mo | .edu / ID | Unlimited msgs, 15 docs/mo | Flash |
| **Founder** | $12/mo | None | Unlimited msgs, 30 docs/mo | Flash |
| **Professional** | $29/mo | None | Unlimited Everything + Priority | **GPT-4o** |

---

## 6. Unfinished Work & Roadmap

### Phase 1: Database Migration (Immediate Priority)
- [ ] **Run SQL Schema**: Execute `backend/schema.sql` in Supabase.
- [ ] **Create Storage Bucket**: Create `documents` bucket (Private).
- [ ] **Backend Env**: Add `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`.

### Phase 2: Paddle Integration
- [ ] **Frontend**: Configure Client Token in `.env.local`.
- [ ] **Backend**: Configure Webhook Secret in `.env`.
- [ ] **Webhook Handler**: Implement logic to parse Paddle events and update User Tier.

### Phase 3: Subscription Enforcement
- [ ] **Middleware**: Create `checkTierLimits` middleware.
    - Check user's Tier in `profiles`.
    - Check count in `usage_tracking` for today.
    - Block request if over limit.
- [ ] **Daily Reset**: Logic to handle date rollover (or just query by `CURRENT_DATE`).

### Phase 4: Model Upgrade
- [ ] **GPT-4o Integration**: Update `geminiService.js` (or create `openaiService.js`) to switch model based on `tier == 'professional'`.

---

## 7. Directory Structure (Planned)
```
/backend
  ├── config/
  │   └── supabase.js        # DB Connection
  ├── middleware/
  │   ├── auth.js            # JWT Validation
  │   └── usage.js           # Tier Enforcement
  ├── routes/
  │   ├── chat.js            # AI Logic
  │   ├── webhooks.js        # Paddle Listener
  │   └── documents.js       # File Ops
  ├── services/
  │   ├── geminiService.js   # Google AI
  │   └── paddleService.js   # Subscription Logic
  └── server.js              # Entry Point
```
