import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "AIzaSyDFrYVLS6fbDPcnbHMkCI3HwEMsZr_Kh-E";

let genAI: any = null;

try {
  if (API_KEY) {
    genAI = new GoogleGenerativeAI(API_KEY);
  }
} catch (err) {
  console.error("Failed to initialize Gemini:", err);
}

export class GeminiService {
  private conversationHistory: any[] = [];

  async sendMessage(userMessage: string) {
    try {
      if (!genAI) {
        console.error("Gemini not initialized");
        return "Chatbot is temporarily unavailable. Please try again later.";
      }

      // Get the model
      const model = genAI.getGenerativeModel({
        model: "gemini-pro",
      });

      // Build the conversation with history
      const messages = [
        ...this.conversationHistory,
        {
          role: "user",
          parts: [{ text: userMessage }],
        },
      ];

      // Send message
      const response = await model.generateContent({
        contents: messages,
        generationConfig: {
          maxOutputTokens: 300,
          temperature: 0.7,
        },
      });

      const result = await response.response;
      const botText = result.text();

      // Add to history
      this.conversationHistory.push({
        role: "user",
        parts: [{ text: userMessage }],
      });

      this.conversationHistory.push({
        role: "model",
        parts: [{ text: botText }],
      });

      return botText || "I'm here to help with your studies!";
    } catch (error: any) {
      console.error("Chatbot Error:", error);
      return `I apologize for the error. Please try again. (Error: ${error?.message || "Unknown"})`;
    }
  }

  resetConversation() {
    this.conversationHistory = [];
  }
}

export const geminiService = new GeminiService();
