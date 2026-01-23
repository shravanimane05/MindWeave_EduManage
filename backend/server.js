import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connect from './mongoClient.js';
import { calculateRiskScore } from './riskCalculator.js';
import { ObjectId } from 'mongodb';

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

let db;
let studentsCol;
let teachersCol;
let queriesCol;
let uploadsCol;
let alertsCol;

/* =========================
   SEED DATA
========================= */
const STUDENT_SEED = [
  { prn: 'PRN2401001', name: 'Prerna Shirsath', division: 'A', email: 'prerna.shirsath@student.edu', phone: '9561434774' },
  { prn: 'PRN2401002', name: 'Shravni Morkhade', division: 'A', email: 'shravni.morkhade@student.edu', phone: '8788626243' },
  { prn: 'PRN2401003', name: 'Aarav Kumar', division: 'A', email: 'aarav.kumar@student.edu', phone: '9876543210' },
  { prn: 'PRN2401004', name: 'Neha Singh', division: 'A', email: 'neha.singh@student.edu', phone: '9765432109' },
  { prn: 'PRN2401005', name: 'Rohan Patel', division: 'A', email: 'rohan.patel@student.edu', phone: '9654321098' },
  { prn: 'PRN2401006', name: 'Anjali Verma', division: 'A', email: 'anjali.verma@student.edu', phone: '9543210987' },
  { prn: 'PRN2401007', name: 'Vikram Desai', division: 'A', email: 'vikram.desai@student.edu', phone: '9432109876' },
  { prn: 'PRN2401008', name: 'Pooja Nair', division: 'A', email: 'pooja.nair@student.edu', phone: '9321098765' },
  { prn: 'PRN2401009', name: 'Sanjay Iyer', division: 'A', email: 'sanjay.iyer@student.edu', phone: '9210987654' },
  { prn: 'PRN2401010', name: 'Divya Gupta', division: 'A', email: 'divya.gupta@student.edu', phone: '9109876543' },
  { prn: 'PRN2401011', name: 'Rahul Sharma', division: 'A', email: 'rahul.sharma@student.edu', phone: '9098765432' },
  { prn: 'PRN2401012', name: 'Kavya Reddy', division: 'A', email: 'kavya.reddy@student.edu', phone: '8987654321' },
  { prn: 'PRN2401013', name: 'Arjun Mehta', division: 'A', email: 'arjun.mehta@student.edu', phone: '8876543210' },
  { prn: 'PRN2401014', name: 'Sneha Joshi', division: 'A', email: 'sneha.joshi@student.edu', phone: '8765432109' },
  { prn: 'PRN2401015', name: 'Karan Singh', division: 'A', email: 'karan.singh@student.edu', phone: '8654321098' }
];

const TEACHER_SEED = [
  { username: 'dr_ramesh_singh', name: 'Dr. Ramesh Singh', password: 'teacher123', division: 'A' }
];

/* =========================
   INIT DB
========================= */
async function init() {
  db = await connect();
  studentsCol = db.collection('students');
  teachersCol = db.collection('teachers');
  queriesCol = db.collection('queries');
  uploadsCol = db.collection('uploads');
  alertsCol = db.collection('student_alerts');

  if (await studentsCol.countDocuments() === 0) {
    await studentsCol.insertMany(STUDENT_SEED);
  }
  if (await teachersCol.countDocuments() === 0) {
    await teachersCol.insertMany(TEACHER_SEED);
  }

  console.log('✅ MongoDB connected');
}

/* =========================
   ROUTES
========================= */

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

/* ---------- LOGIN ---------- */
app.post('/api/login', async (req, res) => {
  const { username, password, role } = req.body;

  if (role === 'Student') {
    const student = await studentsCol.findOne({ prn: username });
    if (student && password === 'student123') {
      return res.json({ user: { ...student, role: 'Student' } });
    }
    return res.status(401).json({ error: 'Invalid student credentials' });
  }

  const teacher = await teachersCol.findOne({ username });
  if (teacher && teacher.password === password) {
    return res.json({ user: { ...teacher, role: 'Teacher' } });
  }

  res.status(401).json({ error: 'Invalid credentials' });
});

/* ---------- UPLOAD & RISK ---------- */
app.post('/api/upload', async (req, res) => {
  const { data, division, fileName } = req.body;

  const matched = [];
  const unmatched = [];

  for (const record of data) {
    const student = await studentsCol.findOne({ prn: record.prn });
    if (!student) {
      unmatched.push(record.prn);
      continue;
    }

    const attendance =
      record.attendance !== undefined
        ? Math.min(100, Math.max(0, Number(record.attendance)))
        : student.attendance;

    const cgpa =
      record.cgpa !== undefined
        ? Number(record.cgpa)
        : student.cgpa;

    const update = {};
    
    // Only add fields that have actual values
    if (attendance !== undefined) {
      update.attendance = attendance;
    }
    if (cgpa !== undefined) {
      update.cgpa = cgpa;
    }
    if (record.endsemMarks !== undefined) {
      update.endsemMarks = Number(record.endsemMarks);
    }

    // ✅ Risk calculation ONLY if both exist
    if (attendance !== undefined && cgpa !== undefined) {
      console.log(`Calculating risk for ${record.prn}: attendance=${attendance}, cgpa=${cgpa}`);
      const risk = calculateRiskScore(attendance, cgpa);
      console.log(`Risk result: ${risk.totalRiskScore}`);
      update.riskScore = risk.totalRiskScore;
      update.riskLevel = risk.riskLevel;
      update.riskReasons = risk.reasons;
    }

    // Remove any originalAttendance and originalCgpa fields if they exist
    await studentsCol.updateOne(
      { prn: record.prn }, 
      { 
        $set: update,
        $unset: { originalAttendance: "", originalCgpa: "" }
      }
    );
    matched.push(record.prn);
  }

  await uploadsCol.insertOne({
    fileName,
    division,
    uploadDate: new Date().toISOString(),
    matchedCount: matched.length,
    unmatchedCount: unmatched.length
  });

  res.json({ success: true, matched, unmatched });
});

/* ---------- DASHBOARD ---------- */
app.get('/api/dashboard/:division', async (req, res) => {
  const students = await studentsCol.find({ division: req.params.division }).toArray();

  const stats = {
    total: students.length,
    highRisk: students.filter(s => (s.riskScore || 0) >= 50).length,
    avgCgpa: students.length
      ? (students.reduce((a, s) => a + (s.cgpa || 0), 0) / students.length).toFixed(2)
      : 0,
    avgAttendance: students.length
      ? Math.round(students.reduce((a, s) => a + (s.attendance || 0), 0) / students.length)
      : 0
  };

  res.json({ stats, students });
});

/* ---------- STUDENTS ---------- */
app.get('/api/students', async (req, res) => {
  const { division } = req.query;
  const students = await studentsCol.find({ division }).toArray();
  res.json({ students });
});

/* ---------- HIGH RISK ---------- */
app.get('/api/high-risk-students', async (_req, res) => {
  const students = await studentsCol.find({ riskScore: { $gte: 50 } }).toArray();
  res.json(students);
});

/* ---------- CLEAR DATA ---------- */
app.post('/api/clear-data', async (_req, res) => {
  await studentsCol.updateMany(
    {},
    { $unset: { attendance: '', cgpa: '', riskScore: '', riskLevel: '', riskReasons: '', endsemMarks: '' } }
  );
  await uploadsCol.deleteMany({});
  res.json({ success: true, message: 'All uploaded data cleared' });
});

/* ---------- RESET TO SEED ---------- */
app.post('/api/reset-to-seed', async (_req, res) => {
  await studentsCol.deleteMany({});
  await studentsCol.insertMany(STUDENT_SEED);
  await uploadsCol.deleteMany({});
  res.json({ success: true, message: 'Database reset to seed data' });
});

/* ---------- QUERIES ---------- */
app.post('/api/queries', async (req, res) => {
  const query = {
    ...req.body,
    timestamp: new Date().toISOString(),
    date: new Date().toISOString().split('T')[0]
  };
  
  await queriesCol.insertOne(query);
  res.json({ success: true, message: 'Query submitted successfully' });
});

app.get('/api/queries/:division', async (req, res) => {
  const { division } = req.params;
  const queries = await queriesCol.find({ division }).sort({ timestamp: -1 }).toArray();
  res.json({ queries });
});

app.put('/api/queries/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  await queriesCol.updateOne(
    { id },
    { $set: { status } }
  );
  
  res.json({ success: true });
});

app.put('/api/queries/:id/reply', async (req, res) => {
  const { id } = req.params;
  const { teacherReply, teacherName } = req.body;
  
  await queriesCol.updateOne(
    { id },
    { 
      $set: { 
        teacherReply,
        teacherName,
        replyDate: new Date().toISOString().split('T')[0],
        status: 'Replied'
      }
    }
  );
  
  res.json({ success: true });
});

/* ---------- SEND NOTIFICATION ---------- */
app.post('/api/send-notification', async (req, res) => {
  const { phoneNumber, studentName, riskScore, message, studentPrn } = req.body;
  
  await alertsCol.insertOne({
    phoneNumber,
    studentName,
    studentPrn,
    riskScore: riskScore || 0,
    timestamp: new Date().toISOString(),
    message: message || `Notification for ${studentName}`,
    read: false
  });
  
  res.json({ success: true, message: 'Notification sent successfully' });
});

/* ---------- GET STUDENT ALERTS ---------- */
app.get('/api/student-alerts/:prn', async (req, res) => {
  const { prn } = req.params;
  const student = await studentsCol.findOne({ prn });
  
  if (!student) {
    return res.status(404).json({ error: 'Student not found' });
  }
  
  const alerts = await alertsCol.find({ 
    studentName: student.name 
  }).sort({ timestamp: -1 }).toArray();
  
  res.json({ alerts });
});

/* ---------- MARK ALERT READ ---------- */
app.post('/api/mark-alert-read/:alertId', async (req, res) => {
  const { alertId } = req.params;
  
  await alertsCol.updateOne(
    { _id: new ObjectId(alertId) },
    { $set: { read: true } }
  );
  
  res.json({ success: true });
});

/* ---------- CLEANUP ORIGINAL FIELDS ---------- */
app.post('/api/cleanup-original-fields', async (_req, res) => {
  const result = await studentsCol.updateMany(
    {},
    { $unset: { originalAttendance: '', originalCgpa: '' } }
  );
  res.json({ success: true, message: 'Original fields removed', modifiedCount: result.modifiedCount });
});

/* ---------- START ---------- */
const PORT = process.env.SERVER_PORT || 4000;
init().then(() => {
  app.listen(PORT, () =>
    console.log(`🚀 Server running at http://localhost:${PORT}`)
  );
});
