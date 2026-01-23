import { GoogleGenerativeAI } from '@google/generative-ai';
import 'dotenv/config';

async function testGemini() {
  try {
    console.log('Testing Gemini API...');
    console.log('API Key:', process.env.API_KEY ? 'Present' : 'Missing');
    
    const genAI = new GoogleGenerativeAI(process.env.API_KEY);
    
    // Try different model names
    const modelNames = [
      'gemini-pro',
      'gemini-1.5-flash',
      'gemini-1.5-pro',
      'models/gemini-pro',
      'models/gemini-1.5-flash'
    ];
    
    for (const modelName of modelNames) {
      try {
        console.log(`\nTrying model: ${modelName}`);
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent('Hello, test message');
        const response = await result.response;
        console.log(`✅ ${modelName} works!`);
        console.log('Response:', response.text());
        break;
      } catch (error) {
        console.log(`❌ ${modelName} failed:`, error.message);
      }
    }
  } catch (error) {
    console.error('General error:', error.message);
  }
}

testGemini();