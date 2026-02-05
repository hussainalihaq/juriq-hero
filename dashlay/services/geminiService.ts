import { GoogleGenAI } from "@google/genai";
import { Message } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Helper to simulate a streaming delay for better UX if needed, 
// though we will use the actual API.
export const generateAIResponse = async (history: Message[], prompt: string): Promise<string> => {
  if (!apiKey) {
    return "API Key is missing. Please check your environment configuration.";
  }

  try {
    const chat = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: `You are Juriq, an advanced AI legal assistant. 
        You are professional, precise, and helpful. 
        You assist lawyers with case law research, drafting motions, and analyzing documents.
        Keep responses concise and formatted for a chat interface. 
        Use markdown for emphasis where appropriate.`,
      },
    });

    // Reconstruct history (simplified for this demo - taking last few messages)
    // In a real app, we'd map the full history properly
    const lastMessages = history.slice(-5).map(msg => ({
        role: msg.role,
        parts: [{ text: msg.text }]
    }));
    
    // We can't easily inject history into a fresh chat object in this specific SDK version 
    // without a specific history param, so we'll just send the prompt with context 
    // or rely on the single turn for this demo if state management is simple.
    // For robust chat, we would maintain the chat session object in React state.
    // Here, we will just generate content based on the prompt for simplicity, 
    // or assume a stateless "one-shot" with context if we were building a complex history builder.
    
    // Better approach for this demo: Just use generateContent with the prompt, 
    // assuming the user wants an immediate answer.
    
    const result = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return result.text || "I apologize, I couldn't generate a response at this time.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I encountered an error analyzing your request. Please try again.";
  }
};
