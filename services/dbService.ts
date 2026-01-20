
import { StudentData, Query, Feedback, Role } from '../types';

// The "Master Database" - these students exist in the system but aren't "active" in a division 
// until the teacher uploads their recent marks/data.
const MASTER_SEED: StudentData[] = [
  {
    id: '1',
    name: 'Prerna Shirsath',
    prn: 'PRN9561',
    division: 'A',
    email: 'prernashirsath@gmail.com',
    phone: '9561434774',
    cgpa: 8.5,
    attendance: 92,
    riskScore: 35,
    backlogs: 0,
  },
  {
    id: '2',
    name: 'Shravni Morkhade',
    prn: 'PRN8788',
    division: 'A',
    email: 'shravni.morkhade33@gmail.com',
    phone: '8788626243',
    cgpa: 8.2,
    attendance: 70,
    riskScore: 75,
    backlogs: 2,
  }
];

class DBService {
  private students: StudentData[] = [];
  private queries: Query[] = [];

  constructor() {
    const storedStudents = localStorage.getItem('students');
    // Start with 0 as requested, or load from previous session
    this.students = storedStudents ? JSON.parse(storedStudents) : [];

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

  // Merging Logic: Teacher uploads partial data (PRN + UT2 marks)
  async uploadStudentData(newData: any[]) {
    const updatedStudents = [...this.students];
    
    newData.forEach(record => {
      const existingIdx = updatedStudents.findIndex(s => s.prn === record.prn);
      
      if (existingIdx > -1) {
        // Update existing student in the active dashboard
        updatedStudents[existingIdx] = { ...updatedStudents[existingIdx], ...record };
      } else {
        // Look in master seed for info not in the upload (like email/phone)
        const masterRecord = MASTER_SEED.find(s => s.prn === record.prn);
        if (masterRecord) {
           updatedStudents.push({ ...masterRecord, ...record });
        } else {
           // Entirely new student
           updatedStudents.push({
             id: Math.random().toString(36).substr(2, 9),
             division: 'A', // Default to current teacher's division
             attendance: 75,
             cgpa: 7.0,
             riskScore: 50,
             backlogs: 0,
             ...record,
           });
        }
      }
    });

    this.students = updatedStudents;
    this.save();
    return true;
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
