import { sendWhatsAppAlert } from './backend/twilioService.js';
import 'dotenv/config';

// Test the SMS functionality
async function testSMS() {
  console.log('🧪 Testing SMS with AI counseling...');
  
  const studentData = {
    cgpa: 4.5,
    attendance: 40,
    backlogs: 0,
    endsemMarks: 20
  };
  
  const result = await sendWhatsAppAlert(
    '9561434774', 
    'Prerna Rajendra Shirsath', 
    65, 
    studentData
  );
  
  console.log('📋 Test Result:', result);
}

testSMS().catch(console.error);