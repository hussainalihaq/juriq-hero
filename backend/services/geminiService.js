const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// --- SYSTEM PROMPTS ---
const BASE_SYSTEM_PROMPT = `
You are Juriq, an elite AI legal assistant designed to help lawyers, students, and entrepreneurs.

CORE RULES:
1. DISCLAIMER: You are an AI, not a lawyer. Never provide binding legal advice. Always advise consulting a qualified attorney for specific actions.
2. TONE: Professional, precise, authoritative yet helpful. Avoid fluff.
3. FORMAT: Use Markdown. Use headers, bullet points, and bold text for key terms.
4. HONESTY: If you don't know the answer or if it varies heavily by jurisdiction (and none is provided), state that clearly.

ROLE-SPECIFIC ADJUSTMENTS:
- If the user seems to be a STUDENT: Explain concepts, cite case law examples, use Socratic method.
- If the user seems to be an ENTREPRENEUR: Focus on risk mitigation, business implications, and actionable steps. Simplify legalese.
- If the user seems to be a LAWYER: Be concise, draft specific clauses, cite statutes.
`;

const MODEL_NAME = "gemini-1.5-flash"; // Or 'gemini-pro'

/**
 * Generates a chat response using Gemini, maintaining basic history.
 * @param {Array} history - Previous messages [{ role: 'user'|'model', parts: string }]
 * @param {string} currentMessage - The new user query
 * @param {string} [role] - Optional user role context (e.g. 'student')
 */
async function generateChatResponse(history, currentMessage, role = 'general') {
    if (!process.env.GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY is not set in backend .env");
    }

    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    // 1. Construct the chat session
    const chat = model.startChat({
        history: formatHistoryForGemini(history),
        generationConfig: {
            maxOutputTokens: 2000,
            temperature: 0.7, // Balances creativity with precision
        },
    });

    // 2. Prepend System Prompt logic (Context Injection)
    // Since startChat history is strictly user/model, we often inject system instructions 
    // into the *first* message or assume the model has been tuned. 
    // For 1.5 Flash/Pro via API, we can just prepend it to the current message context 
    // or rely on the `systemInstruction` param (if supported by specific SDK version) or just inject it.

    // Simple Injection Strategy:
    const specificInstruction = role === 'student' ? 'The user is a Law Student. Teach them.'
        : role === 'entrepreneur' ? 'The user is an Entrepreneur. Focus on business risks.'
            : '';

    const fullMessage = `${BASE_SYSTEM_PROMPT}\n\n[CONTEXT: ${specificInstruction}]\n\nUser Query: ${currentMessage}`;

    // 3. Send Message
    const result = await chat.sendMessage(fullMessage);
    const response = await result.response;
    const text = response.text();

    return { text: text };
}

/**
 * Analyzes text for specific tasks (summary, risks, dates).
 */
async function analyzeText(text, promptType) {
    if (!process.env.GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY is not set in backend .env");
    }

    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    let specificPrompt = "";
    switch (promptType) {
        case 'summarize':
            specificPrompt = "Summarize the following legal text in 3 concise bullet points. Focus on obligations.";
            break;
        case 'risks':
            specificPrompt = "Identify the top 3 potential legal risks or liabilities in this text. Be specific.";
            break;
        case 'dates':
            specificPrompt = "Extract all dates, deadlines, and time-bound obligations from this text. Format as a table.";
            break;
        default:
            specificPrompt = "Analyze this legal text.";
    }

    const prompt = `${BASE_SYSTEM_PROMPT}\n\nTask: ${specificPrompt}\n\nText:\n"${text}"`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return { text: response.text() };
}

/**
 * Format frontend history (React state) to Gemini SDK history.
 * Frontend: { role: 'user' | 'model', text: '...' }
 * Gemini SDK: { role: 'user' | 'model', parts: [{ text: '...' }] }
 */
function formatHistoryForGemini(frontendHistory) {
    if (!Array.isArray(frontendHistory)) return [];

    return frontendHistory.map(msg => ({
        role: msg.role === 'ai' ? 'model' : 'user', // Map 'ai' -> 'model'
        parts: [{ text: msg.text }]
    }));
}

module.exports = { generateChatResponse, analyzeText };
