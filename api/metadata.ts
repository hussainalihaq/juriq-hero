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

const MODELS_TO_TRY = [
    "gemini-2.0-flash",
    "gemini-1.5-flash"
];

export default async function handler(req: any, res: any) {
    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'Document text is required' });

    const METADATA_PROMPT = `
        Analyze the following legal document and extract key metadata in JSON format.
        
        Required fields:
        {
          "parties": ["list of full names of parties involved"],
          "effectiveDate": "YYYY-MM-DD or 'Not specified'",
          "expirationDate": "YYYY-MM-DD or 'Not specified'",
          "governingLaw": "Jurisdiction/State mentioned",
          "type": "Contract type (NDA, MSA, Lease, etc.)",
          "riskSummary": {
            "high": number_of_high_risks,
            "medium": number_of_med_risks,
            "low": number_of_low_risks
          }
        }

        Only return the JSON object. Do not include any other text.
        
        Document Content:
        ${text.slice(0, 50000)}
    `;

    for (const modelName of MODELS_TO_TRY) {
        try {
            const model = getGenAI().getGenerativeModel({ model: modelName });
            const result = await model.generateContent(METADATA_PROMPT);
            const response = await result.response;
            const output = response.text();

            // Extract JSON from markdown if necessary
            const jsonMatch = output.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return res.status(200).json(JSON.parse(jsonMatch[0]));
            }
            throw new Error("Failed to parse metadata JSON");
        } catch (error: any) {
            console.error(`Metadata Error with ${modelName}:`, error.message);
            if (modelName === MODELS_TO_TRY[MODELS_TO_TRY.length - 1]) {
                return res.status(500).json({ error: 'Metadata extraction failed' });
            }
        }
    }
}
