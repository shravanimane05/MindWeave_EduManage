const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

export class GeminiService {
  private conversationHistory: any[] = [];

  async sendMessage(userMessage: string) {
    try {
      if (!API_KEY) {
        throw new Error("API key not configured");
      }

      // Build conversation with full history
      const messages = [
        ...this.conversationHistory,
        {
          role: "user",
          content: userMessage,
        },
      ];

      console.log("Sending to OpenRouter:", { messages, model: "openai/gpt-3.5-turbo" });

      // Call OpenRouter API with better error handling
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": typeof window !== 'undefined' ? window.location.href : "http://localhost:3000",
          "User-Agent": "EduManage-Portal/1.0",
        },
        body: JSON.stringify({
          model: "openai/gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: `You are a helpful, friendly AI Academic Counselor for students and teachers.
Respond naturally and conversationally. Give practical, personalized advice about studies, career, stress, motivation.
Be encouraging and empathetic. Keep responses concise (2-4 sentences).
For students: help with study tips, time management, stress, grades, attendance.
For teachers: help with pedagogy, student engagement, assessment.`,
            },
            ...messages,
          ],
          max_tokens: 300,
          temperature: 0.7,
        }),
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("API Error Response:", errorData);
        throw new Error(errorData.error?.message || `API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log("API Response:", data);

      const botText = data.choices?.[0]?.message?.content;

      if (!botText) {
        throw new Error("No response from API");
      }

      // Store in history
      this.conversationHistory.push({
        role: "user",
        content: userMessage,
      });

      this.conversationHistory.push({
        role: "assistant",
        content: botText,
      });

      return botText;
    } catch (error: any) {
      console.error("Chatbot Error Details:", error);
      return `I'm having trouble responding right now. Error: ${error?.message || "Unknown"}. Please try again!`;
    }
  }

  resetConversation() {
    this.conversationHistory = [];
  }
}

export const geminiService = new GeminiService();
