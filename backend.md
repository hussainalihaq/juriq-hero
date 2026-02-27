# Juriq Backend Documentation

This document outlines the architecture, configuration, and capabilities of the Juriq Node.js backend.

## 1. Overview
The Juriq backend is a lightweight Node.js/Express application designed to handle AI chat generation, document processing (RAG preparation), and future payment webhook integrations. It serves as the bridge between the frontend React application and the Google Gemini AI APIs.

**Tech Stack:**
- **Runtime:** Node.js
- **Framework:** Express.js
- **AI SDK:** `@google/generative-ai` (Gemini API)
- **File Uploads:** `multer` (memory storage)
- **CORS:** Enabled for frontend integration

## 2. API Key Rotation System
To handle the Gemini API's strict daily free-tier limits, the backend implements a resilient multi-key rotation system.

- **Environment Variables:**
  - `GEMINI_API_KEY` (Primary)
  - `GEMINI_API_KEY_2` (Backup 1)
  - `GEMINI_API_KEY_3` (Backup 2)
  - `GROQ_API_KEY` (Alternative provider backup - currently unused but stored for future integration)

- **How it works:** 
  The `getGenAI()` function initializes the Gemini client. Upon encountering a `429 Too Many Requests` status code (indicating quota exhaustion), the `rotateKey()` logic automatically cycles to the next available API key in the array. This happens silently during the `generateChatResponse`, `analyzeDocument`, and `analyzeText` calls.
- **Exponential Backoff:** If ALL keys are exhausted, the system waits with exponential backoff (3s, 6s, 12s) before making its max attempts.

## 3. Endpoints

### `GET /`
Health check endpoint.
**Response:** `{"status": "ok", "message": "Juriq Backend API is running"}`

### `POST /api/chat`
Handles real-time conversational AI. Implements system prompts based on jurisdiction and role.
**Request Body:**
```json
{
  "history": [ {"role": "user", "text": "Hi"} ],
  "message": "Summarize this contract",
  "role": "general", 
  "jurisdictions": ["pak"],
  "outputStyle": 50
}
```
**Response:** `{"text": "AI generated response in markdown..."}`

### `POST /api/analyze`
Legacy/Utility endpoint for specific structured analysis prompts (e.g. risk extraction, date extraction).
**Request Body:**
```json
{
  "text": "Contract text...",
  "promptType": "risks" // or "summarize", "dates"
}
```

### `POST /api/upload`
Handles file ingestion for document context. Currently stores files in memory via `multer`.
**Input:** `multipart/form-data` with a `file` field.
**Response:** `{"message": "File uploaded successfully", "filename": "doc.pdf", "size": 1024}`
*(Note: Text extraction/chunking logic is slated for Phase 2).*

## 4. Models and Prompts
- **Default Model:** `gemini-2.0-flash`
- **System Prompting:** Highly specialized logic located in `services/geminiService.js`. Adapts identity and framing based on the `userRole` (Lawyer, Student, General) and `jurisdiction`. 

## 5. Security and Environment (.env)
The `.env` file should be placed in `backend/.env`. It is git-ignored.
```env
PORT=5001
GEMINI_API_KEY=your_key_1
GEMINI_API_KEY_2=your_key_2
GEMINI_API_KEY_3=your_key_3
GROQ_API_KEY=your_groq_key
PADDLE_WEBHOOK_SECRET_KEY=
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
```

## 6. How to Run Locally
```bash
cd backend
npm install
node server.js
```
The server will start on `http://localhost:5001`.
