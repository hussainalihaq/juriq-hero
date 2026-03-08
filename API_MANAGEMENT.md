# Multi-Provider API Management & Architecture

This document dictates the structure for managing multiple AI providers within the Juriq Legal AI Backend to ensure 100% uptime, zero vendor lock-in, and efficient cost management.

## 🔄 1. Provider-Agnostic LLM Client

Instead of importing `geminiService.js` directly into our Express routes, we will introduce a facade (e.g., `LLMService.ts`) that implements a generic interface for all models.

```typescript
interface ILegalAIRequest {
  messages: Array<{ role: 'system' | 'user' | 'assistant', content: string }>;
  temperature?: number;
  maxTokens?: number;
  jsonMode?: boolean;
}

interface ILegalAIResponse {
  content: string;
  tokensUsed: { prompt: number, completion: number };
  providerUsed: string;
}

class LLMService {
  async generate(req: ILegalAIRequest): Promise<ILegalAIResponse> {
    // 1. Check health & rate limits
    // 2. Select highest priority available provider
    // 3. Select correct API key from rotation pool
    // 4. Execute request
    // 5. Handle fallback on failure
    // 6. Log metrics and token usage
  }
}
```

## 🚥 2. Priority-Based Failover System

The core feature of `LLMService` will be an automatic fallback loop. If the primary provider times out, hits a rate limit (429), or throws an unexpected 500 block, the system auto-shifts.

**Failover Cascade for Case Analysis:**
1. **Primary**: Gemini 2.5 Pro (Highest quality reasoning, High cost)
2. **Secondary**: Claude 3.5 Sonnet (Alternative reasoning engine)
3. **Tertiary**: Groq Llama 3.3 70B (Fast, cheaper, capable for most tasks)
4. **Fallback**: OpenRouter / Mistral Large (If all specific provider APIs are unreachable)

## 🔑 3. API Key Rotation

To avoid 429 constraints, especially on Free Tier endpoints, we will map multiple keys to a single provider. The rotation mechanism will use a simple pointer or a round-robin strategy per provider.

```typescript
// Example Implementation Logic
const groqKeys = [process.env.GROQ_API_KEY_1, process.env.GROQ_API_KEY_2];
let currentGroqKeyIndex = 0;

function getNextGroqKey() {
  const key = groqKeys[currentGroqKeyIndex];
  currentGroqKeyIndex = (currentGroqKeyIndex + 1) % groqKeys.length;
  return key;
}
```

## ⏱️ 4. Token Bucket Rate Limiting (Provider Side)

To ensure we never exceed external API limits globally, we generate an internal Rate Limiter that mirrors the Provider's limits. We will implement the Token Bucket algorithm.

**Why?**
- Gemini limits you to 15 Requests Per Minute (Free). If our frontend hits 20 requests/minute, the internal limiter will pause the last 5 requests or route them to Groq instead of throwing a hard error.

*Note: Initially built using an in-memory `Map()`, with code structured to easily accept Redis for standard scale-out.*

## 💵 5. Cost & Metric Tracking

Every request to an AI provider will be wrapped in a timing tracker and token counter. 
We will log out a structured JSON block:
```json
{
  "event": "llm_completion",
  "requestId": "req-12345",
  "provider": "gemini",
  "model": "gemini-1.5-pro",
  "durationMs": 3450,
  "tokens": { "input": 1400, "output": 500 },
  "estimatedCostUsd": 0.003
}
```

## 🛡️ 6. API Infrastructure Scaling (Zod & Server.ts)

### Express to TypeScript
`server.js` becomes `server.ts`. This immediately reduces runtime null errors. 
Routes will look like this:
```typescript
app.post('/api/chat', validateRequest(ChatSchema), async (req: Request, res: Response) => { ... })
```

### Zod Validation Middleware
We will construct strict schemas for every REST endpoint.
```typescript
const ChatSchema = z.object({
  query: z.string().min(10).max(5000),
  contextFiles: z.array(z.string()).optional(),
  jurisdiction: z.enum(['US', 'UK', 'Pakistan']).default('Pakistan')
});
```

### Health Check System
We will add `GET /api/health/providers` which returns a live status of all third-party AI APIs. This will be monitored externally (e.g., UptimeRobot) to alert administrators if Gemini or Groq APIs face widespread outages. 
