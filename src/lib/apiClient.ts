const API_BASE = import.meta.env.VITE_API_URL || '';

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

export interface DocumentMetadata {
    parties: string[];
    effectiveDate: string;
    expirationDate: string;
    governingLaw: string;
    type: string;
    riskSummary: {
        high: number;
        medium: number;
        low: number;
    };
}

/** Extract metadata from document text */
export async function extractMetadata(text: string): Promise<DocumentMetadata> {
    const res = await fetch(`${API_BASE}/api/metadata`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Metadata extraction failed' }));
        throw new Error(err.error || `HTTP ${res.status}`);
    }
    return res.json();
}

export interface RedlineSuggestion {
    id: string;
    clause: string;
    section: string;
    original: string;
    suggested: string;
    severity: 'high' | 'medium' | 'low';
    reason: string;
}

/** Get redline/edit suggestions for document text */
export async function getRedlines(text: string, riskLevel = 'pro'): Promise<RedlineSuggestion[]> {
    const res = await fetch(`${API_BASE}/api/redline`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, riskLevel }),
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Redline analysis failed' }));
        throw new Error(err.error || `HTTP ${res.status}`);
    }
    const data = await res.json();
    return data.suggestions || [];
}
