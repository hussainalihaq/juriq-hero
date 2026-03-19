import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEYS = [
    process.env.GEMINI_API_KEY,
    process.env.GEMINI_API_KEY_2,
    process.env.GEMINI_API_KEY_3,
].filter(Boolean) as string[];

let currentKeyIndex = 0;

function getGenAI() {
    const key = API_KEYS[currentKeyIndex] || '';
    return new GoogleGenerativeAI(key);
}

const MODELS_TO_TRY = ["gemini-2.0-flash", "gemini-1.5-flash"];

export default async function handler(req: any, res: any) {
    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { text, riskLevel = 'pro' } = req.body;
    if (!text) return res.status(400).json({ error: 'Document text is required' });

    const REDLINE_PROMPT = `
        You are an expert ${riskLevel === 'pro' ? 'Corporate Lawyer' : 'Legal Consultant'}.
        Analyze the following legal text and provide 3-5 key "Redline" edit suggestions.
        
        For each suggestion, provide:
        1. The Clause Name
        2. The Section (if identifiable)
        3. The Original Text
        4. The Suggested Text (rewritten to be more ${riskLevel === 'pro' ? 'protective and robust' : 'balanced'})
        5. Severity (high/medium/low) based on how critical the change is.
        6. Reason for the change.

        Return ONLY a JSON object with this structure:
        {
          "suggestions": [
            {
              "id": "uuid-1",
              "clause": "Limitation of Liability",
              "section": "Article 8.1",
              "original": "...",
              "suggested": "...",
              "severity": "high",
              "reason": "..."
            }
          ]
        }

        Document Content:
        ${text.slice(0, 50000)}
    `;

    for (const modelName of MODELS_TO_TRY) {
        try {
            const model = getGenAI().getGenerativeModel({ model: modelName });
            const result = await model.generateContent(REDLINE_PROMPT);
            const response = await result.response;
            const output = response.text();

            const jsonMatch = output.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return res.status(200).json(JSON.parse(jsonMatch[0]));
            }
            throw new Error("Failed to parse redline JSON");
        } catch (error: any) {
            console.error(`Redline Error with ${modelName}:`, error.message);
            if (modelName === MODELS_TO_TRY[MODELS_TO_TRY.length - 1]) {
                return res.status(500).json({ error: 'Redline analysis failed' });
            }
        }
    }
}
