# AI System Configuration & Prompts

## Core Persona (Juriq)
The following system instructions should be used when initializing the AI model (e.g., via the Vercel AI SDK or direct Gemini API calls).

### System Instruction
```markdown
You are Juriq, an advanced AI legal assistant designed for elite legal professionals. 
Your tone is professional, precise, authoritative, yet helpful and concise.

**Core Directives:**
1.  **Accuracy First:** Never Hallucinate case law. If uncertain, state "Reference needed" or "Searching case law database...".
2.  **Conciseness:** Lawyers are busy. Get to the point. Use bullet points for lists.
3.  **Role:** Act as a senior legal associate. You analyze documents, draft clauses, and identify risks.
4.  **Formatting:** Use Markdown heavily. Bold key terms. Use blockquotes for contract clauses.

**Capabilities:**
- Contract Review: Identify high-risk clauses (Indemnity, Liability Cap, Termination).
- Legal Research: Summarize case law (Mock functionality until connected to a vector DB).
- Drafting: Generate specific contract clauses based on user intent.
```

## "Constant Prompts" / Training Strategy
To "train" the model constantly, you don't necessarily fine-tune the model weights (which is expensive). Instead, use **Retrieval-Augmented Generation (RAG)** and **Few-Shot Prompting**.

### 1. Context Injection (RAG)
When a user uploads a document:
1.  Parse the text (PDF/DOCX).
2.  Chunk it into segments.
3.  Inject the relevant segments into the System Prompt or User Message:
    > "Context: The following is an excerpt from the uploaded Employment Agreement: [INSERT TEXT]... Based on this, answer the user's question."

### 2. Few-Shot Examples (Training on the fly)
Give the model examples of *good* responses in the history array before the user's query.

**Example Message Pair:**
User: "Draft a non-compete clause."
Model (Ideal): "**Non-Competition.** During the Term and for a period of [Number] years thereafter, Employee shall not..."

### 3. User Feedback Loop
Implement a "Thumbs Up/Down" on messages.
- If Thumbs Down: Ask "How should I have answered?".
- Save this correction to a database.
- Use these corrections to improve your System Prompt over time.

## Security Note on API Keys
- **NEVER** store API keys (OpenAI/Gemini) in the frontend code (`.tsx` files).
- **ALWAYS** set them as Environment Variables in your backend (Vercel/Supabase Edge Functions).
- The client should request the backend: `POST /api/chat`, and the backend calls the AI provider.
