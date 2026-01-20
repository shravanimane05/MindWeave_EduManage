
export class GeminiService {
  private responses = [
    "That's a great question! Focus on consistent study and practice.",
    "Remember, every great achievement starts with dedication. Keep pushing forward!",
    "Don't worry about mistakes - they're learning opportunities. Try again with more focus.",
    "Your attendance looks good! Keep maintaining that discipline.",
    "Have you tried breaking your study sessions into 25-minute blocks? (Pomodoro technique)",
    "Study groups can be really helpful! Consider forming one with classmates.",
    "Getting sleep is crucial for learning. Make sure you're getting 7-8 hours.",
    "Practice past exam questions to get familiar with the exam pattern.",
    "If you're struggling, reach out to your teacher during office hours.",
    "Stay positive! Your effort will pay off eventually.",
    "Try to complete assignments on time - it builds discipline and reduces stress.",
    "Nutrition matters for your brain too! Eat healthy and stay hydrated.",
    "Time management is key to success. Use a planner to organize your tasks.",
    "Active learning is more effective than passive reading. Try summarizing concepts.",
    "You've got this! Believe in yourself and keep moving forward."
  ];

  async sendMessage(prompt: string) {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Intelligent response based on keywords
      const lowerPrompt = prompt.toLowerCase();
      
      if (lowerPrompt.includes('attendance') || lowerPrompt.includes('absent')) {
        return "Your attendance is important for your overall performance. Try to attend all classes and if you must miss, inform your teacher in advance.";
      }
      if (lowerPrompt.includes('marks') || lowerPrompt.includes('score') || lowerPrompt.includes('grade')) {
        return "Focus on consistent learning rather than just marks. Practice regularly and seek help from teachers when you don't understand concepts.";
      }
      if (lowerPrompt.includes('risk') || lowerPrompt.includes('danger')) {
        return "Your performance is being monitored. Work on improving your attendance and marks. You can do better! Would you like specific study tips?";
      }
      if (lowerPrompt.includes('how to') || lowerPrompt.includes('tips')) {
        return "Here are some tips: 1) Study consistently, 2) Attend all classes, 3) Ask questions, 4) Join study groups, 5) Get enough sleep, 6) Manage your time well.";
      }
      if (lowerPrompt.includes('motivation') || lowerPrompt.includes('discouraged')) {
        return "It's normal to feel down sometimes. Remember why you started. Your effort today is building your future. You're capable of great things!";
      }
      if (lowerPrompt.includes('stress') || lowerPrompt.includes('anxious')) {
        return "Stress is normal! Try: deep breathing, take breaks, exercise, talk to friends or counselors. Your mental health matters. You're not alone!";
      }
      if (lowerPrompt.includes('help') || lowerPrompt.includes('support')) {
        return "I'm here to help! You can also reach out to your teachers, counselors, or classmates. Don't hesitate to ask for support.";
      }
      
      // Return random response for other queries
      return this.responses[Math.floor(Math.random() * this.responses.length)];
    } catch (error) {
      console.error("Chatbot Error:", error);
      return "I'm here to help! Feel free to ask me about your studies, tips for improvement, or anything about your academic journey.";
    }
  }
}

export const geminiService = new GeminiService();
