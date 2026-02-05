require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { generateChatResponse, analyzeText } = require('./services/geminiService');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// File Upload Config (Memory Storage for processing)
const upload = multer({ storage: multer.memoryStorage() });

// --- Routes ---

// 1. Health Check
app.get('/', (req, res) => {
    res.json({ status: 'ok', message: 'Juriq Backend API is running' });
});

// 2. Chat Endpoint
// Accepts: { history: Message[], message: string, role?: string }
app.post('/api/chat', async (req, res) => {
    try {
        const { history, message, role } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        const response = await generateChatResponse(history, message, role);
        res.json(response);
    } catch (error) {
        console.error('Chat API Error:', error);
        res.status(500).json({ error: 'Failed to generate response', details: error.message });
    }
});

// 3. Analyze Endpoint (e.g. for "Identify Risks")
// Accepts: { text: string, promptType: 'risks' | 'summary' | 'dates' }
app.post('/api/analyze', async (req, res) => {
    try {
        const { text, promptType } = req.body;

        if (!text) {
            return res.status(400).json({ error: 'Text to analyze is required' });
        }

        const result = await analyzeText(text, promptType);
        res.json(result);
    } catch (error) {
        console.error('Analyze API Error:', error);
        res.status(500).json({ error: 'Failed to analyze text', details: error.message });
    }
});

// 4. Upload Endpoint (RAG Preparation)
// Accepts: Multipart form data (file)
app.post('/api/upload', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // TODO: Processing logic (Parse PDF -> Chunk -> Store in Supabase)
        // For now, prompt the frontend that we received it.

        console.log(`Received file: ${req.file.originalname} (${req.file.mimetype})`);

        res.json({
            message: 'File uploaded successfully',
            filename: req.file.originalname,
            size: req.file.size
        });
    } catch (error) {
        console.error('Upload API Error:', error);
        res.status(500).json({ error: 'File upload failed', details: error.message });
    }
});

// Start Server
app.listen(port, () => {
    console.log(`\n🚀 Juriq Backend running at http://localhost:${port}`);
    console.log(`   - Gemini API Key: ${process.env.GEMINI_API_KEY ? 'Set' : 'MISSING'}`);
    console.log(`   - Supabase URL: ${process.env.SUPABASE_URL ? 'Set' : 'MISSING'}\n`);
});
