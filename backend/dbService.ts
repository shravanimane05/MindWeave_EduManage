
import { StudentData, Query } from '../frontend/types';
import { sendAlertToStudent } from './twilioService';

// Master student registry for merging
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
    backlogs: 0
  },
  {
    id: '2', 
    name: 'Shravni Morkhade', 
    prn: 'PRN8788', 
    division: 'A',
    email: 'shravni.morkhade23@pccoepune.org',
    phone: '8788626243', 
    cgpa: 8.2, 
    attendance: 70, 
    riskScore: 75, 
    backlogs: 2
  }
];

class DBService {
  private students: StudentData[] = [];
  private queries: Query[] = [];

  constructor() {
    console.log(`[DB] Initializing connection to MongoDB at ${process.env.MONGODB_URI}`);
    this.load();
  }

  private load() {
    const storedStudents = localStorage.getItem('students');
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

  getAllQueries(division: string) {
    return this.queries.filter(q => q.division === division);
  }

  addQuery(query: Query) {
    this.queries.unshift(query);
    this.save();
  }

  updateQueryStatus(id: string, status: Query['status']) {
    const q = this.queries.find(item => item.id === id);
    if (q) { 
      q.status = status; 
      this.save(); 
    }
  }

  updateQueryReply(id: string, reply: string) {
    const q = this.queries.find(item => item.id === id);
    if (q) {
      q.reply = reply;
      q.status = 'In Progress';
      this.save();
    }
  }

  deleteStudent(id: string) {
    this.students = this.students.filter(s => s.id !== id);
    this.save();
  }

  async uploadStudentData(newData: any[]) {
    const updated = [...this.students];
    const alertQueue: StudentData[] = [];
    
    newData.forEach(record => {
      const idx = updated.findIndex(s => s.prn === record.prn);
      if (idx > -1) {
        updated[idx] = { ...updated[idx], ...record };
        if (updated[idx].attendance < 60) alertQueue.push(updated[idx]);
      } else {
        const master = MASTER_SEED.find(s => s.prn === record.prn);
        if (master) {
          const merged = { ...master, ...record };
          updated.push(merged);
          if (merged.attendance < 60) alertQueue.push(merged);
        } else {
          const newUser = { 
            id: Math.random().toString(36).substr(2, 9), 
            division: 'A', 
            attendance: 75, 
            cgpa: 7.0, 
            riskScore: 50, 
            backlogs: 0,
            ...record 
          };
          updated.push(newUser);
        }
      }
    });
    
    this.students = updated;
    this.save();
    
    for (const student of alertQueue) {
      await sendAlertToStudent(student, 'Attendance Warning');
    }
    return true;
  }

  getDashboardStats(division: string) {
    const divStudents = this.getStudentsByDivision(division);
    const total = divStudents.length;
    const highRisk = divStudents.filter(s => s.riskScore > 70).length;
    const avgCgpa = divStudents.length > 0 
      ? (divStudents.reduce((acc, s) => acc + (s.cgpa || 0), 0) / divStudents.length).toFixed(2) 
      : "0.00";
    return { total, highRisk, avgCgpa };
  }
}

export const dbService = new DBService();
