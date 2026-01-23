import { sendWhatsAppAlert } from './backend/twilioService.js';
import 'dotenv/config';

// Test different student scenarios
async function testDifferentScenarios() {
  console.log('🧪 Testing SMS with different student scenarios...\n');
  
  const scenarios = [
    {
      name: 'Low Attendance Student',
      studentData: { cgpa: 7.5, attendance: 45, backlogs: 0, endsemMarks: 35 },
      riskScore: 75
    },
    {
      name: 'Low CGPA Student', 
      studentData: { cgpa: 4.2, attendance: 80, backlogs: 0, endsemMarks: 30 },
      riskScore: 70
    },
    {
      name: 'Multiple Backlogs Student',
      studentData: { cgpa: 6.5, attendance: 70, backlogs: 3, endsemMarks: 25 },
      riskScore: 65
    },
    {
      name: 'Poor Exam Performance',
      studentData: { cgpa: 6.8, attendance: 78, backlogs: 1, endsemMarks: 15 },
      riskScore: 60
    }
  ];
  
  for (const scenario of scenarios) {
    console.log(`📋 Testing: ${scenario.name}`);
    const result = await sendWhatsAppAlert(
      '9561434774', 
      'Test Student', 
      scenario.riskScore, 
      scenario.studentData
    );
    console.log(`💬 Message: "${result.counselingMessage}"`);
    console.log(`📏 Length: ${result.counselingMessage.length} characters\n`);
  }
}

testDifferentScenarios().catch(console.error);