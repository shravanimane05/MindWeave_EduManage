
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const CURRENT_PERFORMANCE = [
  { week: 'Week 1', score: 65 },
  { week: 'Week 2', score: 72 },
  { week: 'Week 3', score: 78 },
  { week: 'Week 4', score: 80 },
  { week: 'Week 5', score: 82 },
  { week: 'Week 6', score: 85 },
];

const MONTHLY_ATTENDANCE = [
  { month: 'Jan', attendance: 95 },
  { month: 'Feb', attendance: 92 },
  { month: 'Mar', attendance: 88 },
  { month: 'Apr', attendance: 96 },
  { month: 'May', attendance: 94 },
  { month: 'Jun', attendance: 91 },
];

const SUBJECT_ATTENDANCE = [
  { subject: 'Math', attendance: 85 },
  { subject: 'Physics', attendance: 75 },
  { subject: 'Chemistry', attendance: 92 },
  { subject: 'CS', attendance: 98 },
  { subject: 'English', attendance: 90 },
];

const Analytics: React.FC<{ studentPrn: string }> = () => {
  return (
    <div className="p-8 space-y-8">
      <header className="flex justify-between items-center bg-[#1e3a8a] text-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-bold">Analytics</h2>
      </header>

      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Semester', value: '6' },
          { label: 'Attendance', value: '92%' },
          { label: 'Backlog', value: '0' },
          { label: 'CGPA', value: '8.5' }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-4 rounded-lg border shadow-sm">
            <p className="text-xs text-gray-500">{stat.label}</p>
            <h3 className="text-xl font-bold text-gray-800">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <h3 className="font-bold mb-4 text-gray-700">Current Performance</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={CURRENT_PERFORMANCE}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="score" stroke="#1e3a8a" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <h3 className="font-bold mb-4 text-gray-700">Monthly Attendance</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MONTHLY_ATTENDANCE}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="attendance" fill="#1e3a8a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border shadow-sm">
        <h3 className="font-bold mb-4 text-gray-700">Subject-wise Attendance</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={SUBJECT_ATTENDANCE}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="subject" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="attendance" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
