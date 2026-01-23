import React, { useState, useEffect } from 'react';
import { User } from '../types';
import TeacherQueryManager from '../components/TeacherQueryManager';

const TeacherDashboard: React.FC<{ user: User }> = ({ user }) => {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'queries'>('dashboard');

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/students?division=${user.division}`);
        const data = await response.json();
        setStudents(data.students || []);
      } catch (error) {
        console.error('Error fetching students:', error);
        setStudents([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStudents();
  }, [user.division]);

  const stats = {
    total: students.length,
    highRisk: students.filter(s => (s.riskScore || 0) >= 50).length,
    avgCgpa: students.length > 0 ? (students.reduce((acc, s) => acc + (s.cgpa || 0), 0) / students.length).toFixed(2) : '0.00',
    avgAttendance: students.length > 0 ? Math.round(students.reduce((acc, s) => acc + (s.attendance || 0), 0) / students.length) : 0
  };


  const hasUploadedData = students.some(s => s.riskScore !== undefined || s.attendance !== undefined || s.cgpa !== undefined);
  
  const topPerformers = hasUploadedData ? 
    [...students]
      .filter(s => (s.riskScore || 0) < 50)
      .sort((a, b) => (a.riskScore || 0) - (b.riskScore || 0))
      .slice(0, 5) : [];
  
  const strugglingStudents = hasUploadedData ? 
    [...students]
      .filter(s => (s.riskScore || 0) >= 50)
      .sort((a, b) => (b.riskScore || 0) - (a.riskScore || 0))
      .slice(0, 5) : [];

  const handleNotify = async (student: any) => {
    const message = prompt('Enter notification message:');
    if (!message) return;
    
    try {
      const response = await fetch('http://localhost:4000/api/send-notification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phoneNumber: student.phone,
          studentName: student.name,
          riskScore: student.riskScore || 0,
          message: message
        })
      });
      
      const result = await response.json();
      if (result.success) {
        alert(`Notification sent to ${student.name}!`);
      } else {
        alert('Failed to send notification: ' + result.error);
      }
    } catch (error) {
      console.error('Notification error:', error);
      alert('Error sending notification');
    }
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="p-8 space-y-8">
      <header className="bg-[#1e3a8a] text-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-bold">{user.name} - Division {user.division}</h2>
      </header>

      <div className="flex gap-4 border-b">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-6 py-3 font-bold transition ${
            activeTab === 'dashboard'
              ? 'border-b-4 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Dashboard
        </button>
        <button
          onClick={() => setActiveTab('queries')}
          className={`px-6 py-3 font-bold transition ${
            activeTab === 'queries'
              ? 'border-b-4 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Queries & Feedback
        </button>
      </div>

      {activeTab === 'dashboard' && (
        <div className="space-y-8">
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <p className="text-xs text-gray-500 font-bold uppercase">Total Students</p>
              <h2 className="text-3xl font-bold text-gray-800">{stats.total}</h2>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <p className="text-xs text-gray-500 font-bold uppercase">High Risk</p>
              <h2 className="text-3xl font-bold text-red-600">{stats.highRisk}</h2>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <p className="text-xs text-gray-500 font-bold uppercase">Avg CGPA</p>
              <h2 className="text-3xl font-bold text-gray-800">{stats.avgCgpa}</h2>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <p className="text-xs text-gray-500 font-bold uppercase">Avg Attendance</p>
              <h2 className="text-3xl font-bold text-gray-800">{stats.avgAttendance}%</h2>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <h3 className="font-bold text-gray-800 mb-4">Top Performers (Low Risk)</h3>
              {!hasUploadedData ? (
                <div className="text-center py-8 text-gray-500">
                  <p className="text-sm">No data uploaded yet</p>
                  <p className="text-xs mt-1">Upload student marks to see top performers</p>
                </div>
              ) : topPerformers.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p className="text-sm">No low-risk students</p>
                  <p className="text-xs mt-1">All students have risk scores {'>='} 50</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {topPerformers.map((student, i) => (
                    <div key={student._id || student.id} className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-100">
                      <div>
                        <p className="font-bold text-gray-800 text-sm">{i + 1}. {student.name}</p>
                        <p className="text-xs text-gray-500">{student.prn} - Risk: {student.riskScore || 0}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold text-green-700">Att: {student.attendance || 0}%</p>
                        <p className="text-xs text-gray-500">End: {student.endsemMarks || 0}/50</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <h3 className="font-bold text-gray-800 mb-4">Struggling Students (High Risk)</h3>
              {!hasUploadedData ? (
                <div className="text-center py-8 text-gray-500">
                  <p className="text-sm">No data uploaded yet</p>
                  <p className="text-xs mt-1">Upload student marks to see struggling students</p>
                </div>
              ) : strugglingStudents.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p className="text-sm">No high-risk students</p>
                  <p className="text-xs mt-1">All students have risk scores {'<'} 50</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {strugglingStudents.map((student, i) => (
                    <div key={student._id || student.id} className="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-100">
                      <div className="flex-1">
                        <p className="font-bold text-gray-800 text-sm">{i + 1}. {student.name}</p>
                        <p className="text-xs text-gray-500">{student.prn} - Risk: {student.riskScore || 0}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h3 className="font-bold text-gray-800 mb-6">All Students in Division {user.division}</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-3 px-4 font-bold text-gray-700">Name</th>
                    <th className="text-left py-3 px-4 font-bold text-gray-700">PRN</th>
                    <th className="text-center py-3 px-4 font-bold text-gray-700">Attendance</th>
                    <th className="text-center py-3 px-4 font-bold text-gray-700">End-Sem</th>
                    <th className="text-center py-3 px-4 font-bold text-gray-700">CGPA</th>
                    <th className="text-center py-3 px-4 font-bold text-gray-700">Risk Score</th>
                    <th className="text-center py-3 px-4 font-bold text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map(student => {
                    const riskScore = student.riskScore || 0;
                    const riskStatus = riskScore >= 50 ? 'High' : 'Low';
                    const statusColor = riskStatus === 'Low' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
                    
                    return (
                      <tr key={student._id || student.id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium text-gray-800">{student.name}</td>
                        <td className="py-3 px-4 text-gray-600">{student.prn}</td>
                        <td className="py-3 px-4 text-center text-gray-800 font-medium">{student.attendance !== undefined ? student.attendance : '-'}%</td>
                        <td className="py-3 px-4 text-center text-gray-800 font-medium">{student.endsemMarks !== undefined ? student.endsemMarks : '-'}/50</td>
                        <td className="py-3 px-4 text-center text-gray-800 font-medium">{student.cgpa !== undefined ? student.cgpa : '-'}</td>
                        <td className="py-3 px-4 text-center">
                          <span className="font-bold text-lg">{riskScore}</span>
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

      {activeTab === 'queries' && (
        <div>
          <TeacherQueryManager teacher={user} />
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;