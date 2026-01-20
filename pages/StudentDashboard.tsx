
import React, { useState, useEffect } from 'react';
import { User, Alert } from '../types';
import { dbService } from '../services/dbService';

const StudentDashboard: React.FC<{ user: User }> = ({ user }) => {
  const [studentData, setStudentData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch student data from database
    const data = dbService.getStudentByPrn(user.prn || '');
    setStudentData(data);
    setLoading(false);
  }, [user.prn]);

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  if (!studentData) {
    return <div className="p-8">Student data not found</div>;
  }

  // Determine risk level
  const getRiskLevel = (score: number) => {
    if (score < 30) return { label: 'Low Risk', color: 'text-green-700', bgColor: 'bg-green-50' };
    if (score < 60) return { label: 'Medium Risk', color: 'text-yellow-700', bgColor: 'bg-yellow-50' };
    return { label: 'High Risk', color: 'text-red-700', bgColor: 'bg-red-50' };
  };

  const riskInfo = getRiskLevel(studentData.riskScore);

  // Generate dynamic alerts based on data
  const generateAlerts = (): Alert[] => {
    const alerts: Alert[] = [];
    
    if (studentData.attendance < 75) {
      alerts.push({
        id: '1',
        type: 'Attendance',
        message: `Attendance below 75%. Current: ${studentData.attendance}%`,
        date: 'Today',
        color: 'bg-red-50 text-red-700 border-red-100'
      });
    }
    
    if (studentData.midsemMarks && studentData.midsemMarks < 25) {
      alerts.push({
        id: '2',
        type: 'Assignment',
        message: `Mid-semester marks: ${studentData.midsemMarks}/50. Consider improving!`,
        date: 'Today',
        color: 'bg-yellow-50 text-yellow-700 border-yellow-100'
      });
    }

    if (studentData.backlogs > 0) {
      alerts.push({
        id: '3',
        type: 'Feedback',
        message: `You have ${studentData.backlogs} backlog(s). Focus on improving your performance.`,
        date: 'Today',
        color: 'bg-orange-50 text-orange-700 border-orange-100'
      });
    }

    if (alerts.length === 0) {
      alerts.push({
        id: '4',
        type: 'Feedback',
        message: 'Great! Your performance is on track. Keep up the good work!',
        date: 'Today',
        color: 'bg-blue-50 text-blue-700 border-blue-100'
      });
    }

    return alerts;
  };

  const alerts = generateAlerts();

  return (
    <div className="p-8 space-y-8">
      <header className="flex justify-between items-center bg-[#b8860b] text-white p-4 rounded-lg shadow-md">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-white/20 rounded-md flex items-center justify-center">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z" /></svg>
          </div>
          <span className="font-bold uppercase tracking-wider">{user.prn} | {user.name}</span>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-l-4 border-l-blue-500">
          <p className="text-xs font-bold text-gray-500 uppercase">CGPA</p>
          <h2 className="text-3xl font-bold mt-2 text-gray-800">{studentData.cgpa}</h2>
        </div>
        <div className={`bg-white p-6 rounded-xl shadow-sm border border-l-4 border-l-orange-500 ${riskInfo.bgColor}`}>
          <p className="text-xs font-bold text-gray-500 uppercase">Risk Score</p>
          <h2 className={`text-3xl font-bold mt-2 ${riskInfo.color}`}>{studentData.riskScore}</h2>
          <p className={`text-xs mt-1 ${riskInfo.color}`}>{riskInfo.label}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-l-4 border-l-green-500">
          <p className="text-xs font-bold text-gray-500 uppercase">Attendance</p>
          <h2 className="text-3xl font-bold mt-2 text-gray-800">{studentData.attendance}%</h2>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-l-4 border-l-purple-500">
          <p className="text-xs font-bold text-gray-500 uppercase">Mid-Sem Marks</p>
          <h2 className="text-3xl font-bold mt-2 text-gray-800">{studentData.midsemMarks || 0}/50</h2>
        </div>
      </div>

      {/* Additional Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="font-bold text-gray-800 mb-4">Performance Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Backlogs</span>
              <span className="font-bold text-gray-800">{studentData.backlogs}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Email</span>
              <span className="text-sm text-gray-800">{studentData.email}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Phone</span>
              <span className="font-bold text-gray-800">{studentData.phone}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Division</span>
              <span className="font-bold text-gray-800">{studentData.division}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="font-bold text-gray-800 mb-4">Performance Metrics</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Attendance Progress</span>
                <span className="font-bold">{studentData.attendance}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: `${studentData.attendance}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Mid-Sem Performance</span>
                <span className="font-bold">{Math.round((studentData.midsemMarks / 50) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${(studentData.midsemMarks / 50) * 100}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts Section */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex items-center space-x-2 mb-6">
          <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
          <h3 className="font-bold text-gray-800">Alerts & Notifications</h3>
        </div>
        <div className="space-y-4">
          {alerts.map(alert => (
            <div key={alert.id} className={`p-4 rounded-lg border-l-4 ${alert.color} text-sm`}>
              {alert.message}
            </div>
          ))}
        </div>
      </div>

      
    </div>
  );
};

export default StudentDashboard;
