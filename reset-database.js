import { MongoClient } from 'mongodb';

const uri = 'mongodb://localhost:27017';
const dbName = 'edumanage';

const STUDENTS_DIV_A = [
  { prn: 'PRN2401001', name: 'Prerna Shirsath', division: 'A', email: 'prerna.shirsath@student.edu', phone: '9561434774' },
  { prn: 'PRN2401002', name: 'Shravni Morkhade', division: 'A', email: 'shravni.morkhade@student.edu', phone: '8788626243' },
  { prn: 'PRN2401003', name: 'Aarav Kumar', division: 'A', email: 'aarav.kumar@student.edu', phone: '9876543210' },
  { prn: 'PRN2401004', name: 'Neha Singh', division: 'A', email: 'neha.singh@student.edu', phone: '9765432109' },
  { prn: 'PRN2401005', name: 'Rohan Patel', division: 'A', email: 'rohan.patel@student.edu', phone: '9654321098' }
];

const STUDENTS_DIV_B = [
  { prn: 'PRN2401006', name: 'Anjali Verma', division: 'B', email: 'anjali.verma@student.edu', phone: '9543210987' },
  { prn: 'PRN2401007', name: 'Vikram Desai', division: 'B', email: 'vikram.desai@student.edu', phone: '9432109876' },
  { prn: 'PRN2401008', name: 'Pooja Nair', division: 'B', email: 'pooja.nair@student.edu', phone: '9321098765' },
  { prn: 'PRN2401009', name: 'Sanjay Iyer', division: 'B', email: 'sanjay.iyer@student.edu', phone: '9210987654' },
  { prn: 'PRN2401010', name: 'Divya Gupta', division: 'B', email: 'divya.gupta@student.edu', phone: '9109876543' }
];

const TEACHERS = [
  { username: 'dr_ramesh_singh', name: 'Dr. Ramesh Singh', password: 'teacher123', division: 'A', email: 'ramesh.singh@college.edu', phone: '9111111111' },
  { username: 'prof_anjana_verma', name: 'Prof. Anjana Verma', password: 'teacher123', division: 'B', email: 'anjana.verma@college.edu', phone: '9222222222' }
];

async function resetDatabase() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    const db = client.db(dbName);
    
    console.log('Clearing existing collections...');
    await db.dropDatabase();
    
    console.log('Creating fresh collections...');
    const studentsCol = db.collection('students');
    const teachersCol = db.collection('teachers');
    
    await studentsCol.insertMany([...STUDENTS_DIV_A, ...STUDENTS_DIV_B]);
    await teachersCol.insertMany(TEACHERS);
    
    console.log('Database reset complete!');
    console.log('Inserted', STUDENTS_DIV_A.length + STUDENTS_DIV_B.length, 'students');
    console.log('Inserted', TEACHERS.length, 'teachers');
    
    console.log('\nLogin Credentials:');
    console.log('Teachers:');
    TEACHERS.forEach(t => console.log('  ' + t.username + ' / teacher123 (Division ' + t.division + ')'));
    console.log('Students:');
    [...STUDENTS_DIV_A, ...STUDENTS_DIV_B].forEach(s => console.log('  ' + s.prn + ' / student123 (' + s.name + ' - Division ' + s.division + ')'));
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

resetDatabase();