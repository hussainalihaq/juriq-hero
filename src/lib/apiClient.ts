const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001';

export interface ChatMessage {
    role: 'user' | 'ai';
    text: string;
}

export interface ChatResponse {
    text: string;
}

export interface AnalyzeResponse {
    text: string;
}

export interface UploadResponse {
    message: string;
    filename: string;
    size: number;
    extractedText?: string;
}

/** Send a chat message with history */
export async function chatSend(
    history: ChatMessage[],
    message: string,
    role = 'general',
    jurisdictions: string[] = [],
    outputStyle = 50
): Promise<ChatResponse> {
    const res = await fetch(`${API_BASE}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ history, message, role, jurisdictions, outputStyle }),
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Request failed' }));
        throw new Error(err.error || `HTTP ${res.status}`);
    }
    return res.json();
}

/** Analyze text (summarize, risks, dates) */
export async function analyzeText(
    text: string,
    promptType: 'summarize' | 'risks' | 'dates'
): Promise<AnalyzeResponse> {
    const res = await fetch(`${API_BASE}/api/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, promptType }),
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Request failed' }));
        throw new Error(err.error || `HTTP ${res.status}`);
    }
    return res.json();
}

/** Upload a file */
export async function uploadFile(file: File): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${API_BASE}/api/upload`, {
        method: 'POST',
        body: formData,
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Upload failed' }));
        throw new Error(err.error || `HTTP ${res.status}`);
    }
    return res.json();
}
