
export enum Role {
  STUDENT = 'Student',
  TEACHER = 'Teacher'
}

export interface User {
  id: string;
  username: string;
  name: string;
  role: Role;
  division?: string;
  prn?: string;
}

export interface StudentData {
  id: string;
  name: string;
  prn: string;
  division: string;
  email: string;
  phone: string;
  cgpa: number;
  attendance: number;
  riskScore: number;
  backlogs: number;
  unitTest1?: number;
  unitTest2?: number;
  semesterMarks?: {
    [key: string]: number;
  };
}

export interface Query {
  id: string;
  studentId: string;
  studentName: string;
  prn: string;
  division: string;
  title: string;
  description: string;
  type: string;
  module: string;
  date: string;
  status: 'Pending' | 'In Progress' | 'Solved';
}

export interface Feedback {
  id: string;
  teacherName: string;
  subject: string;
  content: string;
  date: string;
  rating: number;
  sentiment: 'Positive' | 'Neutral' | 'Negative';
}

export interface Alert {
  id: string;
  type: 'Assignment' | 'Attendance' | 'Feedback';
  message: string;
  date: string;
  color: string;
}
