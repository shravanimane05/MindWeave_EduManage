
import { GoogleGenAI } from "@google/genai";

export class GeminiService {
  async sendMessage(prompt: string) {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { 
          systemInstruction: "You are an AI Academic Advisor for PCCOE students. Help them with studies, motivation, and queries concisely." 
        }
      });
      return response.text;
    } catch (e) { 
      return "I am currently upgrading my knowledge. Please try again later!"; 
    }
  }
}

export const geminiService = new GeminiService();
