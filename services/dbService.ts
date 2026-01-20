
import { StudentData, Query, Feedback, Role } from '../types';

// Helper function to calculate risk score based on attendance and mid-sem marks
function calculateRiskScore(attendance: number, midsemMarks: number, maxMidsemMarks: number = 50): number {
  // Attendance weight: 40%, Mid-sem marks weight: 60%
  
  // Normalize attendance to 0-100 scale (0% = 100 risk, 100% = 0 risk)
  const attendanceRisk = Math.max(0, 100 - attendance);
  
  // Normalize mid-sem marks to 0-100 scale
  const marksPercentage = (midsemMarks / maxMidsemMarks) * 100;
  const marksRisk = Math.max(0, 100 - marksPercentage);
  
  // Calculate overall risk score
  const riskScore = Math.round((attendanceRisk * 0.4) + (marksRisk * 0.6));
  
  return Math.min(100, Math.max(0, riskScore));
}

// Initial student data with realistic information
const INITIAL_STUDENTS: StudentData[] = [
  {
    id: '1',
    name: 'Prerna Shirsath',
    prn: 'PRN2401001',
    division: 'A',
    email: 'prerna.shirsath@student.edu',
    phone: '9561434774',
    cgpa: 8.5,
    attendance: 92,
    backlogs: 0,
    midsemMarks: 38,
    endsemMarks: 0,
    riskScore: 0 // Will be calculated
  },
  {
    id: '2',
    name: 'Shravni Morkhade',
    prn: 'PRN2401002',
    division: 'A',
    email: 'shravni.morkhade@student.edu',
    phone: '8788626243',
    cgpa: 8.2,
    attendance: 70,
    backlogs: 2,
    midsemMarks: 32,
    endsemMarks: 0,
    riskScore: 0
  },
  {
    id: '3',
    name: 'Aarav Kumar',
    prn: 'PRN2401003',
    division: 'A',
    email: 'aarav.kumar@student.edu',
    phone: '9876543210',
    cgpa: 7.9,
    attendance: 85,
    backlogs: 1,
    midsemMarks: 35,
    endsemMarks: 0,
    riskScore: 0
  },
  {
    id: '4',
    name: 'Neha Singh',
    prn: 'PRN2401004',
    division: 'A',
    email: 'neha.singh@student.edu',
    phone: '9765432109',
    cgpa: 8.8,
    attendance: 95,
    backlogs: 0,
    midsemMarks: 42,
    endsemMarks: 0,
    riskScore: 0
  },
  {
    id: '5',
    name: 'Rohan Patel',
    prn: 'PRN2401005',
    division: 'A',
    email: 'rohan.patel@student.edu',
    phone: '9654321098',
    cgpa: 7.5,
    attendance: 80,
    backlogs: 1,
    midsemMarks: 30,
    endsemMarks: 0,
    riskScore: 0
  },
  {
    id: '6',
    name: 'Anjali Verma',
    prn: 'PRN2401006',
    division: 'A',
    email: 'anjali.verma@student.edu',
    phone: '9543210987',
    cgpa: 8.6,
    attendance: 90,
    backlogs: 0,
    midsemMarks: 40,
    endsemMarks: 0,
    riskScore: 0
  },
  {
    id: '7',
    name: 'Vikram Desai',
    prn: 'PRN2401007',
    division: 'A',
    email: 'vikram.desai@student.edu',
    phone: '9432109876',
    cgpa: 7.8,
    attendance: 75,
    backlogs: 2,
    midsemMarks: 28,
    endsemMarks: 0,
    riskScore: 0
  },
  {
    id: '8',
    name: 'Pooja Nair',
    prn: 'PRN2401008',
    division: 'A',
    email: 'pooja.nair@student.edu',
    phone: '9321098765',
    cgpa: 8.9,
    attendance: 98,
    backlogs: 0,
    midsemMarks: 45,
    endsemMarks: 0,
    riskScore: 0
  },
  {
    id: '9',
    name: 'Sanjay Iyer',
    prn: 'PRN2401009',
    division: 'A',
    email: 'sanjay.iyer@student.edu',
    phone: '9210987654',
    cgpa: 7.3,
    attendance: 68,
    backlogs: 3,
    midsemMarks: 25,
    endsemMarks: 0,
    riskScore: 0
  },
  {
    id: '10',
    name: 'Divya Gupta',
    prn: 'PRN2401010',
    division: 'A',
    email: 'divya.gupta@student.edu',
    phone: '9109876543',
    cgpa: 8.4,
    attendance: 88,
    backlogs: 0,
    midsemMarks: 37,
    endsemMarks: 0,
    riskScore: 0
  }
];

// Calculate risk scores for all students
INITIAL_STUDENTS.forEach(student => {
  student.riskScore = calculateRiskScore(student.attendance, student.midsemMarks || 0);
});

// Initial teacher data with realistic information
const INITIAL_TEACHERS: any[] = [
  {
    id: 't1',
    name: 'Dr. Ramesh Singh',
    username: 'dr_ramesh_singh',
    password: 'teacher123',
    role: 'TEACHER',
    division: 'A',
    email: 'ramesh.singh@college.edu',
    phone: '9111111111',
    department: 'CSE',
    experience: 12
  },
  {
    id: 't2',
    name: 'Prof. Anjana Verma',
    username: 'prof_anjana_verma',
    password: 'teacher123',
    role: 'TEACHER',
    division: 'A',
    email: 'anjana.verma@college.edu',
    phone: '9222222222',
    department: 'CSE',
    experience: 8
  },
  {
    id: 't3',
    name: 'Dr. Vikram Kulkarni',
    username: 'dr_vikram_kulkarni',
    password: 'teacher123',
    role: 'TEACHER',
    division: 'B',
    email: 'vikram.kulkarni@college.edu',
    phone: '9333333333',
    department: 'CSE',
    experience: 15
  },
  {
    id: 't4',
    name: 'Prof. Priya Sharma',
    username: 'prof_priya_sharma',
    password: 'teacher123',
    role: 'TEACHER',
    division: 'B',
    email: 'priya.sharma@college.edu',
    phone: '9444444444',
    department: 'CSE',
    experience: 10
  },
  {
    id: 't5',
    name: 'Dr. Arun Patel',
    username: 'dr_arun_patel',
    password: 'teacher123',
    role: 'TEACHER',
    division: 'C',
    email: 'arun.patel@college.edu',
    phone: '9555555555',
    department: 'CSE',
    experience: 18
  }
];

class DBService {
  private students: StudentData[] = [];
  private queries: Query[] = [];
  private teachers: any[] = [];

  constructor() {
    const storedStudents = localStorage.getItem('students');
    const storedTeachers = localStorage.getItem('teachers');
    
    // Load from localStorage if data exists, otherwise initialize with fresh data
    if (storedStudents) {
      this.students = JSON.parse(storedStudents);
    } else {
      this.students = JSON.parse(JSON.stringify(INITIAL_STUDENTS));
      localStorage.setItem('students', JSON.stringify(this.students));
    }
    
    if (storedTeachers) {
      this.teachers = JSON.parse(storedTeachers);
    } else {
      this.teachers = JSON.parse(JSON.stringify(INITIAL_TEACHERS));
      localStorage.setItem('teachers', JSON.stringify(this.teachers));
    }
    
    const storedQueries = localStorage.getItem('queries');
    this.queries = storedQueries ? JSON.parse(storedQueries) : [];
    localStorage.setItem('queries', JSON.stringify(this.queries));
  }

  private save() {
    localStorage.setItem('students', JSON.stringify(this.students));
    localStorage.setItem('queries', JSON.stringify(this.queries));
    localStorage.setItem('teachers', JSON.stringify(this.teachers));
    console.log('💾 Database saved - Queries:', this.queries.length);
  }

  getAllStudents() {
    return this.students;
  }

  getStudentsByDivision(division: string) {
    return this.students.filter(s => s.division === division);
  }

  getStudentByPrn(prn: string) {
    return this.students.find(s => s.prn === prn);
  }

  getAllQueries(division: string) {
    return this.queries.filter(q => q.division === division);
  }

  addQuery(query: Query) {
    this.queries.push(query);
    this.save();
  }

  updateQueryStatus(id: string, status: Query['status']) {
    const query = this.queries.find(q => q.id === id);
    if (query) {
      query.status = status;
      this.save();
    }
  }

  deleteStudent(id: string) {
    this.students = this.students.filter(s => s.id !== id);
    this.save();
  }

  // Merging Logic: Teacher uploads end sem marks by PRN
  async uploadStudentData(newData: any[]) {
    const updatedStudents = [...this.students];
    let matchedCount = 0;
    let unmatchedPRNs: string[] = [];
    
    newData.forEach(record => {
      const prn = record.prn || record.PRN;
      const endsemMarks = record.endsemMarks || record.endsem || record.endSemMarks || record.marks || 0;
      
      if (!prn) return;
      
      const existingIdx = updatedStudents.findIndex(s => s.prn === prn);
      
      if (existingIdx > -1) {
        // Update existing student with end sem marks
        updatedStudents[existingIdx] = { 
          ...updatedStudents[existingIdx], 
          endsemMarks: parseInt(endsemMarks) || 0,
          ...record // Merge any other fields from the upload
        };
        matchedCount++;
      } else {
        // PRN not found in system
        unmatchedPRNs.push(prn);
      }
    });

    this.students = updatedStudents;
    this.save();
    
    if (unmatchedPRNs.length > 0) {
      console.warn(`${unmatchedPRNs.length} PRNs not found: ${unmatchedPRNs.join(', ')}`);
    }
    
    return { success: true, matchedCount, unmatchedPRNs };
  }

  // Update student attendance and recalculate risk score
  updateStudentAttendance(studentId: string, attendance: number) {
    const student = this.students.find(s => s.id === studentId);
    if (student) {
      student.attendance = Math.min(100, Math.max(0, attendance));
      student.riskScore = calculateRiskScore(student.attendance, student.midsemMarks || 0);
      this.save();
      return student;
    }
    return null;
  }

  // Update student mid-sem marks and recalculate risk score
  updateStudentMidsemMarks(studentId: string, midsemMarks: number) {
    const student = this.students.find(s => s.id === studentId);
    if (student) {
      student.midsemMarks = Math.min(50, Math.max(0, midsemMarks));
      student.riskScore = calculateRiskScore(student.attendance, student.midsemMarks);
      this.save();
      return student;
    }
    return null;
  }

  // Update both attendance and marks for a student
  updateStudentPerformance(studentId: string, attendance: number, midsemMarks: number) {
    const student = this.students.find(s => s.id === studentId);
    if (student) {
      student.attendance = Math.min(100, Math.max(0, attendance));
      student.midsemMarks = Math.min(50, Math.max(0, midsemMarks));
      student.riskScore = calculateRiskScore(student.attendance, student.midsemMarks);
      this.save();
      return student;
    }
    return null;
  }

  // Get students sorted by risk score (high risk first)
  getStudentsByRiskScore(division?: string) {
    let students = division ? this.getStudentsByDivision(division) : this.students;
    return [...students].sort((a, b) => b.riskScore - a.riskScore);
  }

  // Get high-risk students
  getHighRiskStudents(division?: string, threshold: number = 70) {
    let students = division ? this.getStudentsByDivision(division) : this.students;
    return students.filter(s => s.riskScore >= threshold);
  }

  // Get all teachers
  getAllTeachers() {
    return this.teachers;
  }

  // Get teacher by division
  getTeachersByDivision(division: string) {
    return this.teachers.filter(t => t.division === division);
  }

  // Get teacher by username
  getTeacherByUsername(username: string) {
    return this.teachers.find(t => t.username === username);
  }

  // Get student by ID
  getStudentById(id: string) {
    return this.students.find(s => s.id === id);
  }

  getDashboardStats(division: string) {
    const divStudents = this.getStudentsByDivision(division);
    const total = divStudents.length;
    const highRisk = divStudents.filter(s => s.riskScore > 70).length;
    const avgCgpa = divStudents.length > 0 ? (divStudents.reduce((acc, s) => acc + s.cgpa, 0) / divStudents.length).toFixed(2) : 0;
    const avgAttendance = divStudents.length > 0 ? Math.round(divStudents.reduce((acc, s) => acc + s.attendance, 0) / divStudents.length) : 0;
    const avgMidsemMarks = divStudents.length > 0 ? Math.round(divStudents.reduce((acc, s) => acc + (s.midsemMarks || 0), 0) / divStudents.length) : 0;
    
    return { 
      total, 
      highRisk, 
      avgCgpa, 
      avgAttendance,
      avgMidsemMarks
    };
  }

  // Get query by ID
  getQueryById(queryId: string) {
    return this.queries.find(q => q.id === queryId);
  }

  // Get all queries submitted by a specific student
  getStudentQueries(studentPrn: string) {
    return this.queries.filter(q => q.studentPrn === studentPrn);
  }

  // Reply to a query (teacher functionality)
  replyToQuery(queryId: string, teacherName: string, replyText: string) {
    const query = this.queries.find(q => q.id === queryId);
    if (query) {
      query.teacherReply = replyText;
      query.teacherName = teacherName;
      query.replyDate = new Date().toISOString().split('T')[0];
      this.save();
      return query;
    }
    return null;
  }

  // Update query status (and optionally add reply)
  updateQueryStatusWithReply(queryId: string, status: 'Pending' | 'In Progress' | 'Solved', teacherName?: string, replyText?: string) {
    const query = this.queries.find(q => q.id === queryId);
    if (query) {
      query.status = status;
      if (teacherName && replyText) {
        query.teacherReply = replyText;
        query.teacherName = teacherName;
        query.replyDate = new Date().toISOString().split('T')[0];
      }
      this.save();
      return query;
    }
    return null;
  }

  // Get all queries for a teacher's division
  getQueriesForTeacher(division: string) {
    const divStudents = this.getStudentsByDivision(division);
    const divStudentPrns = divStudents.map(s => s.prn);
    return this.queries.filter(q => divStudentPrns.includes(q.studentPrn));
  }

  resetDatabase() {
    // Clear all localStorage
    localStorage.removeItem('students');
    localStorage.removeItem('teachers');
    localStorage.removeItem('queries');
    
    // Reinitialize with fresh data and recalculate risk scores
    const freshStudents = JSON.parse(JSON.stringify(INITIAL_STUDENTS));
    freshStudents.forEach((student: StudentData) => {
      student.riskScore = calculateRiskScore(student.attendance, student.midsemMarks || 0);
    });
    
    this.students = freshStudents;
    this.teachers = JSON.parse(JSON.stringify(INITIAL_TEACHERS));
    this.queries = [];
    
    // Save fresh data to localStorage
    localStorage.setItem('students', JSON.stringify(this.students));
    localStorage.setItem('teachers', JSON.stringify(this.teachers));
    localStorage.setItem('queries', JSON.stringify(this.queries));
    
    return { success: true, message: 'Database reset to initial state with 10 students and 5 teachers' };
  }
}

export const dbService = new DBService();
