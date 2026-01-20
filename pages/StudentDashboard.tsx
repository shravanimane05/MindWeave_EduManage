
import React from 'react';
import { User, Alert } from '../types';

const ALERTS: Alert[] = [
  { id: '1', type: 'Assignment', message: 'Assignment submission pending for Data Structures. Due: Jan 20, 2025.', date: 'Today', color: 'bg-red-50 text-red-700 border-red-100' },
  { id: '2', type: 'Attendance', message: 'Attendance below 75% in Physics Lab. Current: 72%', date: 'Yesterday', color: 'bg-yellow-50 text-yellow-700 border-yellow-100' },
  { id: '3', type: 'Feedback', message: 'New teacher feedback available. Posted 2 hours ago.', date: 'Today', color: 'bg-blue-50 text-blue-700 border-blue-100' }
];

const StudentDashboard: React.FC<{ user: User }> = ({ user }) => {
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
        {[
          { label: 'CGPA', value: '8.5', color: 'border-l-4 border-blue-500' },
          { label: 'Risk Score', value: '35', sub: 'Low Risk', color: 'border-l-4 border-orange-500' },
          { label: 'Attendance', value: '92%', color: 'border-l-4 border-green-500' },
          { label: 'Alerts', value: '3', color: 'border-l-4 border-red-500' }
        ].map((stat, i) => (
          <div key={i} className={`bg-white p-6 rounded-xl shadow-sm border ${stat.color}`}>
            <p className="text-xs font-bold text-gray-500 uppercase">{stat.label}</p>
            <h2 className="text-3xl font-bold mt-2 text-gray-800">{stat.value}</h2>
            {stat.sub && <p className="text-xs text-gray-400 mt-1">{stat.sub}</p>}
          </div>
        ))}
      </div>

      {/* Alerts Section */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex items-center space-x-2 mb-6">
          <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
          <h3 className="font-bold text-gray-800">Alerts</h3>
        </div>
        <div className="space-y-4">
          {ALERTS.map(alert => (
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
