import connect from './backend/mongoClient.js';

async function clearData() {
  try {
    const db = await connect();
    
    // Clear all student data except basic info
    await db.collection('students').updateMany(
      {},
      { $unset: { attendance: '', cgpa: '', riskScore: '', riskLevel: '', riskReasons: '', endsemMarks: '', backlogs: '', disciplinaryIssues: '' } }
    );
    
    // Clear uploads and alerts
    await db.collection('uploads').deleteMany({});
    await db.collection('student_alerts').deleteMany({});
    
    console.log('✅ All uploaded data cleared from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

clearData();
