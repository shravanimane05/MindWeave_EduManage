
import { GoogleGenAI } from "@google/genai";

const API_KEY = "AIzaSyCaiGJy0o6K1IeznWo8gPO_4KZkllc-9nQ";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: API_KEY });
  }

  async sendMessage(prompt: string, history: { role: 'user' | 'model', parts: { text: string }[] }[] = []) {
    try {
      const model = 'gemini-3-flash-preview';
      const chat = this.ai.chats.create({
        model,
        config: {
          systemInstruction: `You are an AI Counselor for EduManage Portal. Your goal is to help students with academic guidance, motivation, and career advice. Be supportive, concise, and professional. If a student shows severe distress, suggest contacting the human counselor Dr. Williams.`,
        }
      });

      const response = await chat.sendMessage({ message: prompt });
      return response.text;
    } catch (error) {
      console.error("Gemini Error:", error);
      return "I'm having trouble connecting to my knowledge base right now. Please try again later.";
    }
  }
}

export const geminiService = new GeminiService();
