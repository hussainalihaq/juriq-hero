import { GoogleGenerativeAI } from '@google/generative-ai';

// Multi-key rotation
const API_KEYS = [
    process.env.GEMINI_API_KEY,
    process.env.GEMINI_API_KEY_2,
    process.env.GEMINI_API_KEY_3,
].filter(Boolean) as string[];

let currentKeyIndex = 0;

function getGenAI() {
    return new GoogleGenerativeAI(API_KEYS[currentKeyIndex] || '');
}

function rotateKey(): boolean {
    if (API_KEYS.length > 1) {
        currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length;
        console.log(`[analyze] Rotated to key #${currentKeyIndex + 1}`);
        return true;
    }
    return false;
}

const BASE_SYSTEM_PROMPT = `You are Juriq, a specialized AI legal intelligence assistant.
You provide legal information and education, NOT legal advice.
You analyze, explain, and teach legal concepts with precision.
Format responses with headers, bullets, and Markdown for readability.
End every substantive response with:
"⚖️ This is legal information for educational purposes, not legal advice for your specific situation. For personalized legal guidance, consult a qualified lawyer in your jurisdiction."`;

const ANALYSIS_PROMPTS: Record<string, string> = {
    summarize: 'Summarize the following legal text in 3 concise bullet points. Focus on obligations, key terms, and critical deadlines.',
    risks: 'Identify the top 5 potential legal risks or liabilities in this text. For each risk, rate severity (HIGH/MEDIUM/LOW) and explain the practical impact. Format as a structured list.',
    dates: 'Extract ALL dates, deadlines, and time-bound obligations from this text. Format as a markdown table with columns: Date | Obligation | Consequence of Missing.',
    clauses: 'Break down this legal text clause by clause. For each clause: state what it means in plain English, who it benefits, and any red flags.',
    compare: 'Compare the key terms in this text against standard market practices. Highlight any unusual or non-standard provisions.',
};

const MODELS_TO_TRY = [
    "gemini-3.0-flash",
    "gemini-2.5-flash-lite",
    "gemini-2.0-flash-lite-preview-02-05",
    "gemini-1.5-flash"
];

export default async function handler(req: any, res: any) {
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    try {
        const { text, promptType } = req.body;

        if (!text) {
            return res.status(400).json({ error: 'Text to analyze is required' });
        }

        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({ error: 'GEMINI_API_KEY not configured' });
        }

        const specificPrompt = ANALYSIS_PROMPTS[promptType] || 'Analyze this legal text thoroughly. Identify key provisions, obligations, risks, and important dates.';

        const fullPrompt = `${BASE_SYSTEM_PROMPT}\n\nTask: ${specificPrompt}\n\nText:\n"${text}"`;

        let lastError: any = null;

        for (const modelName of MODELS_TO_TRY) {
            try {
                console.log(`[analyze] Attempting with model: ${modelName}`);
                const model = getGenAI().getGenerativeModel({ model: modelName });

                const result = await model.generateContent(fullPrompt);
                const response = await result.response;
                return res.status(200).json({ text: response.text() });

            } catch (error: any) {
                console.error(`[analyze] Error with ${modelName}:`, error.message);
                lastError = error;

                const isRecoverable =
                    error.message?.includes('429') ||
                    error.message?.includes('quota') ||
                    error.message?.includes('Too Many Requests') ||
                    error.message?.includes('resource exhausted') ||
                    error.message?.includes('404') ||
                    error.message?.includes('not found');

                if (!isRecoverable) break;
                console.warn(`[analyze] Model ${modelName} failed, trying next...`);
            }
        }

        throw lastError || new Error('All models failed.');

    } catch (error: any) {
        // Groq fallback
        if (process.env.GROQ_API_KEY) {
            try {
                console.log('[analyze] Falling back to Groq...');
                const specificPrompt = ANALYSIS_PROMPTS[req.body.promptType] || 'Analyze this legal text.';

                const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        model: 'llama3-8b-8192',
                        messages: [
                            { role: 'system', content: BASE_SYSTEM_PROMPT },
                            { role: 'user', content: `${specificPrompt}\n\nText:\n"${req.body.text}"` }
                        ],
                        temperature: 0.5,
                        max_tokens: 4000
                    })
                });

                if (!response.ok) throw new Error(`Groq: ${response.statusText}`);
                const data = await response.json();
                return res.status(200).json({ text: data.choices[0]?.message?.content || '' });

            } catch (groqError: any) {
                console.error('[analyze] Groq fallback failed:', groqError);
            }
        }

        console.error('[analyze] All providers failed:', error);
        return res.status(500).json({
            error: error.message || 'Internal Server Error',
            details: 'All AI models are currently busy. Please try again in 1 minute.'
        });
    }
}
