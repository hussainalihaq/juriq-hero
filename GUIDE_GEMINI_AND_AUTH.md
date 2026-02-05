# Gemini Integration & Supabase Auth Guide

## 1. Supabase Auth: Disable Email Verification

If you want users to just "Sign Up and Go" without clicking an email link, follow these steps in your Supabase Dashboard:

1.  Go to your project in **Supabase**.
2.  Navigate to **Authentication** > **Providers**.
3.  Click on **Email**.
4.  **Disable** "Confirm email".
5.  Save changes.
    *   *Result:* Users are automatically logged in immediately after signing up.

---

## 2. Gemini Integration & "Training" (Free Tier)

You cannot "fine-tune" the Gemini 1.5 Flash model directly on the free tier in a persistent way that creates a new custom model file easily. Instead, we use **RAG (Retrieval-Augmented Generation)** and **System Prompting**.

### Concept
Block "training" implies feeding it thousands of docs to learn forever.
**RAG** implies:
1.  User uploads a PDF.
2.  You save the text of that PDF in a database (Supabase Vector Store).
3.  When user asks a question, you search the database for relevant text chunks.
4.  You send those chunks + the user's question to Gemini.
5.  Gemini answers based on that context.

**This effectively "trains" it on your docs instantly without cost.**

### Implementation Steps (Backend)

You need a simple backend (Node.js/Express or Python/FastAPI) because you cannot store your Gemini API Key safely in the frontend React code.

#### A. Required Routes

Create a server (e.g., `server.js`) with these endpoints:

1.  **POST `/api/analyze`**
    *   **Input:** `{ text: "contract text...", prompt: "Find risks" }`
    *   **Action:** Calls Gemini API with the text.
    *   **Response:** JSON with analysis.

2.  **POST `/api/chat`**
    *   **Input:** `{ history: [...], message: "Is this valid?" }`
    *   **Action:** Calls Gemini API with chat history.
    *   **Response:** AI reply.

3.  **POST `/api/upload` (for RAG)**
    *   **Input:** File (PDF/Docx)
    *   **Action:** 
        1. Parse text from PDF.
        2. Split text into chunks (e.g., 500 characters).
        3. Create embeddings (vectors) using Gemini Embedding API.
        4. Store vectors in Supabase (`embeddings` table).
    *   **Response:** "Document processed."

#### B. The "Training" (System Prompt)

In your API call to Gemini, you always include a **System Instruction**. This defines your AI's persona.

**Example System Prompt:**
```text
You are Juriq, an elite AI legal assistant. 
Tone: Professional, precise, authoritative but helpful.
Role: Analyze contracts for risks, clauses, and obligations.
Rules:
- Never give binding legal advice. Always add a disclaimer.
- Structure answers with Markdown (headers, bullet points).
- If context is provided, rely ONLY on that context.
```

### Free Tier Limits
*   **Gemini 1.5 Flash:** Free of charge (within rate limits).
*   **Rate Limits:** 15 RPM (Requests Per Minute). Adequate for dev/testing.
*   **Data Privacy:** Free tier data *can* be used by Google to improve models. For strict legal privacy, you eventually strictly need the **Paid Tier**.

---

## 3. Next Steps for Integration

1.  **Set up a Backend Repo:** Create a folder `juriq-backend`.
2.  **Install Dependencies:** `npm install express cors dotenv @google/generative-ai`.
3.  **Get API Key:** Get your key from [Google AI Studio](https://aistudio.google.com/).
4.  **Connect Frontend:** Update `Dashboard.tsx` to call your new API endpoints (`fetch('http://localhost:3000/api/chat', ...)` instead of the mock timeout).

This architecture gives you a powerful, "trained" feel using standard RAG patterns on the free tier.
