import { MongoClient } from 'mongodb';

const uri = 'mongodb://localhost:27017';
const dbName = 'edumanage';

const STUDENTS = [
  { prn: 'PRN2401001', name: 'Prerna Rajendra Shirsath', division: 'A', email: 'prerna.shirsath@student.edu', phone: '9561434774', cgpa: 8.5, attendance: 92, backlogs: 0, disciplinaryIssues: false },
  { prn: 'PRN2401002', name: 'Shravani Morkhade', division: 'A', email: 'shravni.morkhade@student.edu', phone: '8788626243', cgpa: 8.2, attendance: 70, backlogs: 1, disciplinaryIssues: false },
  { prn: 'PRN2401003', name: 'Aarav Kumar', division: 'A', email: 'aarav.kumar@student.edu', phone: '9876543210', cgpa: 7.9, attendance: 85, backlogs: 0, disciplinaryIssues: false },
  { prn: 'PRN2401004', name: 'Neha Singh', division: 'A', email: 'neha.singh@student.edu', phone: '9765432109', cgpa: 8.8, attendance: 95, backlogs: 0, disciplinaryIssues: false },
  { prn: 'PRN2401005', name: 'Rohan Patel', division: 'A', email: 'rohan.patel@student.edu', phone: '9654321098', cgpa: 7.5, attendance: 80, backlogs: 2, disciplinaryIssues: false }
];

const TEACHERS = [
  { username: 'dr_ramesh_singh', name: 'Dr. Ramesh Singh', password: 'teacher123', division: 'A', email: 'ramesh.singh@college.edu', phone: '9111111111' }
];

async function resetDB() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    const db = client.db(dbName);
    
    await db.dropDatabase();
    
    await db.collection('students').insertMany(STUDENTS);
    await db.collection('teachers').insertMany(TEACHERS);
    
    console.log('✅ Database reset with 5 students!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
  }
}

resetDB();