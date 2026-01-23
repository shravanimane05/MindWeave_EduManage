import { MongoClient } from 'mongodb';

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);

async function keepOnlyBasicInfo() {
  try {
    await client.connect();
    const db = client.db('edumanage');
    const studentsCol = db.collection('students');
    
    const result = await studentsCol.updateMany(
      {},
      {
        $unset: {
          originalAttendance: "",
          originalCgpa: "",
          attendance: "",
          cgpa: "",
          endsemMarks: "",
          backlogs: "",
          riskScore: "",
          riskLevel: "",
          riskReasons: ""
        }
      }
    );
    
    console.log(`Cleaned ${result.modifiedCount} students - kept only basic info`);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

keepOnlyBasicInfo();