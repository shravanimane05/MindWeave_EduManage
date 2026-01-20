
import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { dbService } from '../services/dbService';
import { sendAlertToStudent } from '../services/twilioService';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const RISK_DATA = [
  { name: 'Low Risk', value: 45, color: '#22c55e' },
  { name: 'Medium Risk', value: 35, color: '#f59e0b' },
  { name: 'High Risk', value: 20, color: '#ef4444' },
];

const SEMESTER_CGPA = [
  { sem: 'Sem 1', cgpa: 7.2 }, { sem: 'Sem 2', cgpa: 7.5 }, { sem: 'Sem 3', cgpa: 7.1 },
  { sem: 'Sem 4', cgpa: 7.8 }, { sem: 'Sem 5', cgpa: 8.2 }, { sem: 'Sem 6', cgpa: 8.5 },
];

const TeacherDashboard: React.FC<{ user: User }> = ({ user }) => {
  const stats = dbService.getDashboardStats(user.division!);
  const students = dbService.getStudentsByDivision(user.division!);
  const highRiskStudents = students.filter(s => s.riskScore > 70);
  const [toast, setToast] = useState<{msg: string, to: string} | null>(null);

  useEffect(() => {
    const handleTwilio = (e: any) => {
      setToast({ msg: e.detail.message, to: e.detail.to });
      setTimeout(() => setToast(null), 5000);
    };
    window.addEventListener('twilio-sent', handleTwilio);
    return () => window.removeEventListener('twilio-sent', handleTwilio);
  }, []);

  const handleNotify = async (student: any) => {
    await sendAlertToStudent(student, 'Risk');
  };

  return (
    <div className="p-8 space-y-8 relative">
      {toast && (
        <div className="fixed top-6 right-6 z-50 bg-green-600 text-white px-6 py-4 rounded-xl shadow-2xl animate-in slide-in-from-top-10 max-w-sm">
          <div className="flex items-center space-x-3">
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
             <div>
               <p className="font-bold text-sm">Twilio SMS Sent!</p>
               <p className="text-xs opacity-90">Message delivered to {toast.to}</p>
             </div>
          </div>
        </div>
      )}

      <header className="flex justify-between items-center bg-[#1e3a8a] text-white p-4 rounded-lg shadow-md">
        <div className="flex items-center space-x-4">
          <span className="font-bold uppercase tracking-wider">{user.name}</span>
        </div>
        <div className="text-xs opacity-80">Div: {user.division}</div>
      </header>

      <div className="flex items-center space-x-4 bg-white p-6 rounded-xl shadow-sm border w-fit">
        <div className="p-3 bg-blue-100 text-blue-700 rounded-full">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a7 7 0 00-7 7v1h11v-1a7 7 0 00-7-7z" /></svg>
        </div>
        <div>
          <p className="text-xs text-gray-500 font-bold uppercase">Total Students</p>
          <h2 className="text-3xl font-bold text-gray-800">{stats.total}</h2>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl border shadow-sm h-80">
          <h3 className="font-bold mb-4 text-gray-700">Risk Distribution</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={RISK_DATA} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                {RISK_DATA.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white p-6 rounded-xl border shadow-sm h-80">
          <h3 className="font-bold mb-4 text-gray-700">Semester-wise Avg CGPA</h3>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={SEMESTER_CGPA}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="sem" />
              <YAxis domain={[0, 10]} />
              <Tooltip />
              <Line type="monotone" dataKey="cgpa" stroke="#1e3a8a" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <div className="flex items-center space-x-2 mb-6">
          <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
          <h3 className="font-bold text-gray-800">High Risk Students</h3>
        </div>
        <div className="space-y-4">
          {highRiskStudents.length > 0 ? highRiskStudents.map(student => (
            <div key={student.id} className="flex justify-between items-center p-4 bg-red-50 rounded-lg border border-red-100">
              <div>
                <p className="font-bold text-gray-800">{student.name}</p>
                <p className="text-xs text-gray-500">{student.prn}</p>
              </div>
              <div className="flex items-center space-x-3">
                <button onClick={() => handleNotify(student)} className="bg-orange-500 text-white text-xs px-4 py-2 rounded-md font-bold hover:bg-orange-600 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 004.708 4.708l.773-1.548a1 1 0 011.06-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" /></svg>
                  Notify via Twilio
                </button>
                <button className="bg-blue-600 text-white text-xs px-4 py-2 rounded-md font-bold hover:bg-blue-700 transition">View Details</button>
              </div>
            </div>
          )) : (
            <div className="p-8 text-center text-gray-400 italic bg-gray-50 rounded-lg">No students uploaded yet. Dashboard starts at 0.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
