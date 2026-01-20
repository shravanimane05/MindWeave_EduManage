
import { StudentData, Query, Feedback, Role } from '../types';

// Sample student data with mid sem marks
const INITIAL_STUDENTS: StudentData[] = [
  { id: '1', name: 'Prerna Shirsath', prn: 'PRN9561', division: 'A', email: 'prerna@gmail.com', phone: '9561434774', cgpa: 8.5, attendance: 92, riskScore: 35, backlogs: 0, midsemMarks: 38, endsemMarks: 0 },
  { id: '2', name: 'Shravni Morkhade', prn: 'PRN8788', division: 'A', email: 'shravni@gmail.com', phone: '8788626243', cgpa: 8.2, attendance: 70, riskScore: 75, backlogs: 2, midsemMarks: 32, endsemMarks: 0 },
  { id: '3', name: 'Aarav Kumar', prn: 'PRN9101', division: 'A', email: 'aarav@gmail.com', phone: '9876543210', cgpa: 7.9, attendance: 85, riskScore: 45, backlogs: 1, midsemMarks: 35, endsemMarks: 0 },
  { id: '4', name: 'Neha Singh', prn: 'PRN9202', division: 'A', email: 'neha@gmail.com', phone: '9765432109', cgpa: 8.8, attendance: 95, riskScore: 15, backlogs: 0, midsemMarks: 42, endsemMarks: 0 },
  { id: '5', name: 'Rohan Patel', prn: 'PRN9303', division: 'A', email: 'rohan@gmail.com', phone: '9654321098', cgpa: 7.5, attendance: 80, riskScore: 60, backlogs: 1, midsemMarks: 30, endsemMarks: 0 },
  { id: '6', name: 'Anjali Verma', prn: 'PRN9404', division: 'A', email: 'anjali@gmail.com', phone: '9543210987', cgpa: 8.6, attendance: 90, riskScore: 30, backlogs: 0, midsemMarks: 40, endsemMarks: 0 },
  { id: '7', name: 'Vikram Desai', prn: 'PRN9505', division: 'A', email: 'vikram@gmail.com', phone: '9432109876', cgpa: 7.8, attendance: 75, riskScore: 55, backlogs: 2, midsemMarks: 28, endsemMarks: 0 },
  { id: '8', name: 'Pooja Nair', prn: 'PRN9606', division: 'A', email: 'pooja@gmail.com', phone: '9321098765', cgpa: 8.9, attendance: 98, riskScore: 10, backlogs: 0, midsemMarks: 45, endsemMarks: 0 },
  { id: '9', name: 'Sanjay Iyer', prn: 'PRN9707', division: 'A', email: 'sanjay@gmail.com', phone: '9210987654', cgpa: 7.3, attendance: 68, riskScore: 70, backlogs: 3, midsemMarks: 25, endsemMarks: 0 },
  { id: '10', name: 'Divya Gupta', prn: 'PRN9808', division: 'A', email: 'divya@gmail.com', phone: '9109876543', cgpa: 8.4, attendance: 88, riskScore: 40, backlogs: 0, midsemMarks: 37, endsemMarks: 0 }
];

// Sample teacher data
const INITIAL_TEACHERS: any[] = [
  { id: 't1', name: 'Dr. John Smith', username: 'teacher_a', role: 'TEACHER', division: 'A', email: 'john.smith@college.edu', phone: '9111111111' },
  { id: 't2', name: 'Prof. Sarah Johnson', username: 'teacher_b', role: 'TEACHER', division: 'B', email: 'sarah.johnson@college.edu', phone: '9222222222' },
  { id: 't3', name: 'Dr. Rajesh Kumar', username: 'teacher_c', role: 'TEACHER', division: 'C', email: 'rajesh.kumar@college.edu', phone: '9333333333' },
  { id: 't4', name: 'Prof. Emily Davis', username: 'teacher_d', role: 'TEACHER', division: 'A', email: 'emily.davis@college.edu', phone: '9444444444' },
  { id: 't5', name: 'Dr. Amit Patel', username: 'teacher_e', role: 'TEACHER', division: 'B', email: 'amit.patel@college.edu', phone: '9555555555' }
];

class DBService {
  private students: StudentData[] = [];
  private queries: Query[] = [];
  private teachers: any[] = [];

  constructor() {
    // Initialize with fresh data - clears old data
    this.students = JSON.parse(JSON.stringify(INITIAL_STUDENTS));
    this.teachers = JSON.parse(JSON.stringify(INITIAL_TEACHERS));
    
    // Save to localStorage
    localStorage.setItem('students', JSON.stringify(this.students));
    localStorage.setItem('teachers', JSON.stringify(this.teachers));
    localStorage.setItem('queries', JSON.stringify([]));
    
    const storedQueries = localStorage.getItem('queries');
    this.queries = storedQueries ? JSON.parse(storedQueries) : [];
  }

  private save() {
    localStorage.setItem('students', JSON.stringify(this.students));
    localStorage.setItem('queries', JSON.stringify(this.queries));
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

  getDashboardStats(division: string) {
    const divStudents = this.getStudentsByDivision(division);
    const total = divStudents.length;
    const highRisk = divStudents.filter(s => s.riskScore > 70).length;
    const avgCgpa = divStudents.length > 0 ? (divStudents.reduce((acc, s) => acc + s.cgpa, 0) / divStudents.length).toFixed(2) : 0;
    return { total, highRisk, avgCgpa };
  }
}

export const dbService = new DBService();
