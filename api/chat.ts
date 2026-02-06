import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const MODEL_NAME = "gemini-2.5-flash";

// ==========================================
// BASE SYSTEM PROMPT
// ==========================================
const BASE_SYSTEM_PROMPT = `You are Juriq, a specialized AI legal intelligence assistant.

CORE IDENTITY:
- You provide legal information and education, NOT legal advice
- You analyze, explain, and teach legal concepts with precision
- You maintain the highest professional and ethical standards
- You are thorough, accurate, and intellectually honest

STRICT BOUNDARIES:
✅ ALLOWED:
   • Explaining legal concepts, doctrines, and principles
   • Analyzing case law and precedents
   • Interpreting statutes and legislation
   • Educational legal research assistance
   • Jurisdictional comparisons and analysis
   • Legal writing structure and reasoning guidance

❌ PROHIBITED:
   • Personal legal advice for specific situations
   • Predicting outcomes of pending cases
   • Non-legal questions (politely decline and redirect)
   • Encouraging self-representation in complex matters
   • Providing information to facilitate illegal activities

MANDATORY DISCLAIMER:
End every substantive legal response with:
"⚖️ This is legal information for educational purposes, not legal advice for your specific situation. For personalized legal guidance, consult a qualified lawyer in your jurisdiction."

RESPONSE QUALITY STANDARDS:
- Cite sources when referencing cases or statutes
- Acknowledge ambiguities and areas of legal debate
- Distinguish between settled law and evolving areas
- Note jurisdictional variations when relevant
- Use proper legal terminology while remaining accessible
- Format responses with headers, bullets, and Markdown for readability`;

// ==========================================
// JURISDICTION-SPECIFIC CONTEXTS
// ==========================================
const JURISDICTION_CONTEXTS: Record<string, string> = {
    pak: `
JURISDICTION: PAKISTAN LAW
- Common law system (inherited from British colonial law)
- Constitution of Pakistan 1973 is the supreme law
- Dual legal framework: Common law + Islamic law (Shariah)
- Court Hierarchy: Supreme Court → High Courts → District Courts
- Key Legislation: PPC 1860, CPC 1908, CrPC 1898, Contract Act 1872
- Citation: PLD [Year] SC [Page] or [Year] SCMR [Page]`,

    us: `
JURISDICTION: UNITED STATES LAW
- Federal system: Federal law + 50 state legal systems
- U.S. Constitution is supreme law (Supremacy Clause)
- Court Hierarchy: SCOTUS → Courts of Appeals → District Courts
- Key Principles: Separation of powers, Federalism, Bill of Rights
- ALWAYS specify if discussing federal or state law
- Citation: [Case Name], [Volume] U.S. [Page] ([Year])`,

    uk: `
JURISDICTION: UNITED KINGDOM LAW
- Common law system, Parliamentary sovereignty
- Separate systems: England & Wales, Scotland, Northern Ireland
- Court Hierarchy: UK Supreme Court → Court of Appeal → High Court
- Key Principles: Precedent (stare decisis), Statutory interpretation
- Citation: [Year] UKSC [Number] or [Year] EWCA Civ [Number]`
};

// ==========================================
// USER ROLE CONTEXTS
// ==========================================
const USER_ROLE_CONTEXTS: Record<string, string> = {
    student: `AUDIENCE: LAW STUDENT - Use proper legal terminology, explain the "why" behind principles, structure for exam format, include case examples and exam tips.`,
    entrepreneur: `AUDIENCE: ENTREPRENEUR - Focus on practical business implications, translate legal concepts to risks/opportunities, provide actionable next steps, minimize jargon.`,
    lawyer: `AUDIENCE: LEGAL PROFESSIONAL - Use full legal terminology, cite cases and statutes, discuss procedural considerations, address conflicting precedents.`,
    corporate: `AUDIENCE: CORPORATE COUNSEL - Balance legal precision with business pragmatism, frame issues in terms of corporate risk and liability.`,
    paralegal: `AUDIENCE: PARALEGAL - Focus on procedural requirements, documentation, research methods, court rules.`,
    general: `AUDIENCE: GENERAL PUBLIC - Avoid legal jargon, use everyday language, break down concepts simply, be encouraging and demystifying.`
};

// ==========================================
// PROMPT GENERATOR
// ==========================================
function generateSystemPrompt(jurisdiction: string, userRole: string): string {
    const jurisdictionContext = JURISDICTION_CONTEXTS[jurisdiction] || '';
    const roleContext = USER_ROLE_CONTEXTS[userRole] || USER_ROLE_CONTEXTS.general;

    return `${BASE_SYSTEM_PROMPT}

${jurisdictionContext}

${roleContext}

Jurisdiction: ${jurisdiction?.toUpperCase() || 'Not specified'}
User Role: ${userRole || 'General'}`;
}

// ==========================================
// FORMAT HISTORY
// ==========================================
function formatHistoryForGemini(frontendHistory: any[]) {
    if (!Array.isArray(frontendHistory)) return [];
    return frontendHistory.map(msg => ({
        role: msg.role === 'ai' ? 'model' : 'user',
        parts: [{ text: msg.text }]
    }));
}

// ==========================================
// VERCEL SERVERLESS HANDLER
// ==========================================
// Configure Vercel/Next.js body size limit
export const config = {
    api: {
        bodyParser: {
            sizeLimit: '10mb', // Increase limit to 10MB to accommodate files
        },
    },
};

export default async function handler(req: any, res: any) {
    // ... rest of handler

    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { history, message, role, jurisdictions, outputStyle, file } = req.body;

        if (!message && !file) {
            return res.status(400).json({ error: 'Message or file is required' });
        }

        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({ error: 'GEMINI_API_KEY not configured' });
        }

        const model = genAI.getGenerativeModel({ model: MODEL_NAME });

        // Temperature based on output style
        const temperature = 0.9 - ((outputStyle || 50) / 100) * 0.6;
        const primaryJurisdiction = jurisdictions?.[0] || 'pak';
        const systemPrompt = generateSystemPrompt(primaryJurisdiction, role || 'general');

        const chat = model.startChat({
            history: formatHistoryForGemini(history || []),
            generationConfig: {
                maxOutputTokens: 4000,
                temperature: temperature,
            },
        });

        // Construct message parts
        const messageParts: any[] = [];

        let finalSystemPrompt = systemPrompt;

        // If a file is attached, force the model to focus on it
        if (file && file.data) {
            finalSystemPrompt += `\n\n[SYSTEM INSTRUCTION: A document has been attached to this message. You MUST read, analyze, and reference the content of this document to answer the user's query. Do not say you cannot read it. It is provided in the input context.]`;
        }

        const fullMessageText = `${finalSystemPrompt}\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nUSER QUERY:\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n${message || ''}`;

        messageParts.push({ text: fullMessageText });

        // Add File if present
        if (file && file.data) {
            messageParts.push({
                inlineData: {
                    mimeType: file.mimeType || 'application/pdf',
                    data: file.data
                }
            });
        }

        const result = await chat.sendMessage(messageParts);
        const response = await result.response;
        const text = response.text();

        return res.status(200).json({ text });
    } catch (error: any) {
        console.error('Chat API Error:', error);
        return res.status(500).json({ error: error.message || 'Internal server error' });
    }
}
