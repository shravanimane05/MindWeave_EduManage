import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/edumanage';

async function cleanDatabase() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db();
    const studentsCol = db.collection('students');
    const uploadsCol = db.collection('uploads');
    
    // Remove marks-related fields from all students
    const result = await studentsCol.updateMany(
      {},
      {
        $unset: {
          endsemMarks: "",
          riskScore: "",
          riskLevel: "",
          riskReasons: "",
          midsemMarks: ""
        }
      }
    );
    
    console.log(`✅ Updated ${result.modifiedCount} student records`);
    
    // Clear all upload records
    const uploadResult = await uploadsCol.deleteMany({});
    console.log(`✅ Deleted ${uploadResult.deletedCount} upload records`);
    
    // Show remaining fields for verification
    const sampleStudent = await studentsCol.findOne({});
    console.log('✅ Sample student record after cleanup:', sampleStudent);
    
  } catch (error) {
    console.error('❌ Error cleaning database:', error);
  } finally {
    await client.close();
    console.log('Database connection closed');
  }
}

cleanDatabase();