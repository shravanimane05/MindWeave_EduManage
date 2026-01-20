
import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { dbService } from '../services/dbService';
import { sendAlertToStudent } from '../services/twilioService';
import TeacherQueryManager from '../components/TeacherQueryManager';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar } from 'recharts';

const TeacherDashboard: React.FC<{ user: User }> = ({ user }) => {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{msg: string, to: string} | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'queries'>('dashboard');

  useEffect(() => {
    // Fetch students for this division
    const divStudents = dbService.getStudentsByDivision(user.division!);
    setStudents(divStudents);
    setLoading(false);
  }, [user.division]);

  useEffect(() => {
    const handleTwilio = (e: any) => {
      setToast({ msg: e.detail.message, to: e.detail.to });
      setTimeout(() => setToast(null), 5000);
    };
    window.addEventListener('twilio-sent', handleTwilio);
    return () => window.removeEventListener('twilio-sent', handleTwilio);
  }, []);

  const stats = dbService.getDashboardStats(user.division!);
  const highRiskStudents = students.filter(s => s.riskScore > 70);
  
  // Generate risk distribution data
  const riskDistribution = [
    { name: 'Low Risk (0-30)', value: students.filter(s => s.riskScore < 30).length, color: '#22c55e' },
    { name: 'Medium Risk (30-70)', value: students.filter(s => s.riskScore >= 30 && s.riskScore < 70).length, color: '#f59e0b' },
    { name: 'High Risk (70+)', value: students.filter(s => s.riskScore >= 70).length, color: '#ef4444' }
  ];

  // Generate top performers and struggling students data
  const topPerformers = [...students].sort((a, b) => a.riskScore - b.riskScore).slice(0, 5);
  const strugglingStudents = [...students].sort((a, b) => b.riskScore - a.riskScore).slice(0, 5);

  // Performance summary data
  const performanceSummary = [
    { category: 'Avg Attendance', value: stats.avgAttendance, max: 100, color: '#3b82f6' },
    { category: 'Avg Mid-Sem', value: stats.avgMidsemMarks, max: 50, color: '#8b5cf6' },
    { category: 'Avg CGPA', value: parseFloat(stats.avgCgpa as any) * 10, max: 100, color: '#ec4899' }
  ];

  const handleNotify = async (student: any) => {
    await sendAlertToStudent(student, 'Risk');
  };

  const handleResetDatabase = () => {
    if (window.confirm('⚠️ This will clear all data and reset to 10 students + 5 teachers. Continue?')) {
      const result = dbService.resetDatabase();
      alert(result.message);
      window.location.reload();
    }
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

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
          <span className="font-bold uppercase tracking-wider">{user.name} - Division {user.division}</span>
        </div>
        <div className="flex items-center space-x-6">
          <button onClick={handleResetDatabase} className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded-lg text-xs font-bold transition">
            🔄 Reset DB
          </button>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="flex gap-4 border-b">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-6 py-3 font-bold transition ${
            activeTab === 'dashboard'
              ? 'border-b-4 border-[#b8860b] text-[#b8860b]'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          📊 Dashboard
        </button>
        <button
          onClick={() => setActiveTab('queries')}
          className={`px-6 py-3 font-bold transition ${
            activeTab === 'queries'
              ? 'border-b-4 border-[#b8860b] text-[#b8860b]'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          💬 Queries & Feedback
        </button>
      </div>

      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && (
        <div className="space-y-8">
      {/* Key Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="flex items-center space-x-4 bg-white p-6 rounded-xl shadow-sm border">
          <div className="p-3 bg-blue-100 text-blue-700 rounded-full">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a7 7 0 00-7 7v1h11v-1a7 7 0 00-7-7z" /></svg>
          </div>
          <div>
            <p className="text-xs text-gray-500 font-bold uppercase">Total Students</p>
            <h2 className="text-3xl font-bold text-gray-800">{stats.total}</h2>
          </div>
        </div>

        <div className="flex items-center space-x-4 bg-white p-6 rounded-xl shadow-sm border">
          <div className="p-3 bg-red-100 text-red-700 rounded-full">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
          </div>
          <div>
            <p className="text-xs text-gray-500 font-bold uppercase">High Risk</p>
            <h2 className="text-3xl font-bold text-gray-800">{stats.highRisk}</h2>
          </div>
        </div>

        <div className="flex items-center space-x-4 bg-white p-6 rounded-xl shadow-sm border">
          <div className="p-3 bg-purple-100 text-purple-700 rounded-full">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" /></svg>
          </div>
          <div>
            <p className="text-xs text-gray-500 font-bold uppercase">Avg CGPA</p>
            <h2 className="text-3xl font-bold text-gray-800">{stats.avgCgpa}</h2>
          </div>
        </div>

        <div className="flex items-center space-x-4 bg-white p-6 rounded-xl shadow-sm border">
          <div className="p-3 bg-green-100 text-green-700 rounded-full">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M17.778 8.222c-4.296-4.296-11.26-4.296-15.556 0A1 1 0 01.808 6.808c4.76-4.76 12.624-4.76 17.384 0a1 1 0 01-1.414 1.414zM14.95 11.05a7 7 0 00-9.9 0 1 1 0 01-1.414-1.414 9 9 0 0112.728 0 1 1 0 01-1.414 1.414zM12.12 13.88a3 3 0 00-4.242 0 1 1 0 01-1.415-1.415 5 5 0 017.072 0 1 1 0 01-1.415 1.415zM9 16a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" /></svg>
          </div>
          <div>
            <p className="text-xs text-gray-500 font-bold uppercase">Avg Attendance</p>
            <h2 className="text-3xl font-bold text-gray-800">{stats.avgAttendance}%</h2>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl border shadow-sm h-80">
          <h3 className="font-bold mb-4 text-gray-700">Risk Distribution</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={riskDistribution} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                {riskDistribution.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-xl border shadow-sm h-80">
          <h3 className="font-bold mb-4 text-gray-700">Performance Summary</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={performanceSummary}
              margin={{ top: 5, right: 30, left: 200, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 100]} />
              <YAxis dataKey="category" type="category" width={190} />
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Performers */}
      <div className="grid grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center space-x-2 mb-6">
            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
            <h3 className="font-bold text-gray-800">Top Performers (Low Risk)</h3>
          </div>
          <div className="space-y-3">
            {topPerformers.map((student, i) => (
              <div key={student.id} className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-100">
                <div>
                  <p className="font-bold text-gray-800 text-sm">{i + 1}. {student.name}</p>
                  <p className="text-xs text-gray-500">{student.prn} • Risk: {student.riskScore}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-green-700">Att: {student.attendance}%</p>
                  <p className="text-xs text-gray-500">Mid: {student.midsemMarks}/50</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center space-x-2 mb-6">
            <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
            <h3 className="font-bold text-gray-800">Struggling Students (High Risk)</h3>
          </div>
          <div className="space-y-3">
            {strugglingStudents.map((student, i) => (
              <div key={student.id} className="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-100">
                <div className="flex-1">
                  <p className="font-bold text-gray-800 text-sm">{i + 1}. {student.name}</p>
                  <p className="text-xs text-gray-500">{student.prn} • Risk: {student.riskScore}</p>
                </div>
                <button onClick={() => handleNotify(student)} className="ml-2 bg-orange-500 text-white text-xs px-3 py-1 rounded-md font-bold hover:bg-orange-600 transition">
                  Notify
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* All Students Table */}
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <h3 className="font-bold text-gray-800 mb-6">All Students in Division {user.division}</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-3 px-4 font-bold text-gray-700">Name</th>
                <th className="text-left py-3 px-4 font-bold text-gray-700">PRN</th>
                <th className="text-center py-3 px-4 font-bold text-gray-700">Attendance</th>
                <th className="text-center py-3 px-4 font-bold text-gray-700">Mid-Sem</th>
                <th className="text-center py-3 px-4 font-bold text-gray-700">CGPA</th>
                <th className="text-center py-3 px-4 font-bold text-gray-700">Risk Score</th>
                <th className="text-center py-3 px-4 font-bold text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {students.map(student => {
                const riskStatus = student.riskScore < 30 ? 'Low' : student.riskScore < 70 ? 'Medium' : 'High';
                const statusColor = riskStatus === 'Low' ? 'bg-green-100 text-green-800' : riskStatus === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800';
                
                return (
                  <tr key={student.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-800">{student.name}</td>
                    <td className="py-3 px-4 text-gray-600">{student.prn}</td>
                    <td className="py-3 px-4 text-center text-gray-800 font-medium">{student.attendance}%</td>
                    <td className="py-3 px-4 text-center text-gray-800 font-medium">{student.midsemMarks}/50</td>
                    <td className="py-3 px-4 text-center text-gray-800 font-medium">{student.cgpa}</td>
                    <td className="py-3 px-4 text-center">
                      <span className="font-bold text-lg">{student.riskScore}</span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusColor}`}>
                        {riskStatus} Risk
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
        </div>
      )}

      {/* Queries Tab */}
      {activeTab === 'queries' && (
        <div>
          <TeacherQueryManager teacher={user} />
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;
