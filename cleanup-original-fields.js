import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = process.env.MONGODB_DB || 'edumanage';

async function cleanupOriginalFields() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db(dbName);
    const studentsCol = db.collection('students');
    
    // Remove originalAttendance and originalCgpa fields from all documents
    const result = await studentsCol.updateMany(
      {},
      { $unset: { originalAttendance: '', originalCgpa: '' } }
    );
    
    console.log(`✅ Cleanup completed! Modified ${result.modifiedCount} documents`);
    
    // Show sample of cleaned data
    const sampleStudents = await studentsCol.find({}).limit(3).toArray();
    console.log('📋 Sample cleaned records:');
    sampleStudents.forEach(student => {
      console.log(`- ${student.name} (${student.prn}): attendance=${student.attendance}, cgpa=${student.cgpa}`);
      if (student.originalAttendance !== undefined || student.originalCgpa !== undefined) {
        console.log('  ⚠️  Still has original fields!');
      }
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
  }
}

cleanupOriginalFields();