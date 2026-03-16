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
        console.log(`[upload] Rotated to key #${currentKeyIndex + 1}`);
        return true;
    }
    return false;
}

const MODELS_TO_TRY = [
    "gemini-3.0-flash",
    "gemini-2.5-flash-lite",
    "gemini-2.0-flash-lite-preview-02-05",
    "gemini-1.5-flash"
];

// Configure body size for file uploads
export const config = {
    api: {
        bodyParser: {
            sizeLimit: '10mb',
        },
    },
};

export default async function handler(req: any, res: any) {
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    try {
        const { file, filename, action } = req.body;

        if (!file || !file.data) {
            return res.status(400).json({ error: 'File data is required. Send as { file: { data: base64string, mimeType: "application/pdf" }, filename: "doc.pdf" }' });
        }

        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({ error: 'GEMINI_API_KEY not configured' });
        }

        // Use Gemini's native file understanding for PDF/image analysis
        const analysisPrompt = action === 'extract'
            ? `Extract ALL text content from this document verbatim. Preserve the structure, headings, paragraphs, and formatting as closely as possible. Return only the extracted text.`
            : `Analyze this legal document. Provide:
## Document Type
[Identify the type of document]

## Summary
[3-5 sentence executive summary]

## Key Parties
[List all parties mentioned]

## Key Terms & Obligations
[Main provisions and obligations]

## Important Dates & Deadlines
[Any time-bound elements]

## Risk Assessment
[HIGH/MEDIUM/LOW risk items]

## Recommendations
[Action items or concerns]

⚖️ This is legal information for educational purposes, not legal advice.`;

        let lastError: any = null;

        for (const modelName of MODELS_TO_TRY) {
            try {
                console.log(`[upload] Attempting with model: ${modelName}`);
                const model = getGenAI().getGenerativeModel({ model: modelName });

                const result = await model.generateContent([
                    { text: analysisPrompt },
                    {
                        inlineData: {
                            mimeType: file.mimeType || 'application/pdf',
                            data: file.data
                        }
                    }
                ]);

                const response = await result.response;
                return res.status(200).json({
                    message: 'File processed successfully',
                    filename: filename || 'document',
                    text: response.text(),
                });

            } catch (error: any) {
                console.error(`[upload] Error with ${modelName}:`, error.message);
                lastError = error;

                const isRecoverable =
                    error.message?.includes('429') ||
                    error.message?.includes('quota') ||
                    error.message?.includes('Too Many Requests') ||
                    error.message?.includes('resource exhausted') ||
                    error.message?.includes('404') ||
                    error.message?.includes('not found');

                if (!isRecoverable) break;
                console.warn(`[upload] Model ${modelName} failed, trying next...`);
            }
        }

        throw lastError || new Error('All models failed.');

    } catch (error: any) {
        console.error('[upload] Error:', error);
        return res.status(500).json({
            error: error.message || 'File processing failed',
            details: 'All AI models are currently busy. Please try again in 1 minute.'
        });
    }
}
