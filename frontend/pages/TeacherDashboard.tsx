
import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { dbService } from '../../backend/dbService';

const TeacherDashboard: React.FC<{ user: User }> = ({ user }) => {
  const stats = dbService.getDashboardStats(user.division!);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    const handleTwilio = (e: any) => {
      setToast(`WhatsApp Alert sent to ${e.detail.to}`);
      setTimeout(() => setToast(null), 4000);
    };
    window.addEventListener('twilio-sent', handleTwilio);
    return () => window.removeEventListener('twilio-sent', handleTwilio);
  }, []);

  return (
    <div className="p-8 space-y-8 relative">
      {toast && (
        <div className="fixed top-6 right-6 bg-[#1e3a8a] text-white px-8 py-4 rounded-2xl shadow-2xl border-b-4 border-blue-900 animate-bounce z-50">
          <p className="text-xs font-black uppercase tracking-widest">{toast}</p>
        </div>
      )}

      <header className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-gray-800 tracking-tighter">Welcome, {user.name}</h2>
          <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mt-2">Class Teacher | Division {user.division}</p>
        </div>
        <div className="bg-blue-50 px-6 py-2 rounded-full text-blue-600 font-black text-xs uppercase tracking-widest">Active Session</div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { label: 'Total Students', value: stats.total, color: 'bg-white' },
          { label: 'Avg Division CGPA', value: stats.avgCgpa, color: 'bg-white' },
          { label: 'Critical Risk Count', value: stats.highRisk, color: 'bg-red-50', text: 'text-red-600' }
        ].map((stat, i) => (
          <div key={i} className={`${stat.color} p-10 rounded-3xl border border-gray-100 shadow-sm`}>
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-4">{stat.label}</p>
            <h2 className={`text-5xl font-black ${stat.text || 'text-gray-800'} tracking-tighter`}>{stat.value}</h2>
          </div>
        ))}
      </div>

      <div className="bg-[#1e3a8a] p-10 rounded-3xl text-white shadow-xl relative overflow-hidden">
        <h3 className="text-xl font-black uppercase tracking-widest mb-2">Division Insight</h3>
        <p className="text-sm opacity-70 leading-relaxed max-w-lg">Students are only visible once their recent examination data is merged into the system. High-risk students will trigger automated WhatsApp alerts.</p>
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full"></div>
      </div>
    </div>
  );
};
export default TeacherDashboard;
