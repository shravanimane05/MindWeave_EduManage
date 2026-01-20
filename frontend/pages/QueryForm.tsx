
import React, { useState, useEffect } from 'react';
import { User, Query } from '../types';
import { dbService } from '../../backend/dbService';

const QueryForm: React.FC<{ user: User }> = ({ user }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('Assignment Clarification');
  const [module, setModule] = useState('');
  const [queries, setQueries] = useState<Query[]>([]);

  useEffect(() => {
    setQueries(dbService.getAllQueries(user.division!).filter(q => q.studentId === user.id));
  }, [user.id, user.division]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newQuery: Query = {
      id: Math.random().toString(36).substr(2, 9),
      studentId: user.id,
      studentName: user.name,
      prn: user.prn!,
      division: user.division!,
      title,
      description,
      type,
      module,
      date: new Date().toISOString().split('T')[0],
      status: 'Pending'
    };
    dbService.addQuery(newQuery);
    setQueries(prev => [newQuery, ...prev]);
    setTitle('');
    setDescription('');
    setModule('');
    alert('Query submitted to your division teacher successfully.');
  };

  return (
    <div className="p-8 space-y-8 bg-gray-50/50 min-h-screen">
      <header className="bg-[#1e3a8a] text-white p-6 rounded-2xl shadow-xl flex justify-between items-center border-b-4 border-blue-900">
        <h2 className="text-xl font-black uppercase tracking-widest">Academic Support</h2>
      </header>

      <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-black text-gray-800 uppercase tracking-tight mb-8">Raise New Issue</h3>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              type="text" required value={title} onChange={e => setTitle(e.target.value)}
              className="w-full px-5 py-4 border-none bg-gray-50 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-medium"
              placeholder="Query Subject"
            />
            <input
              type="text" required value={module} onChange={e => setModule(e.target.value)}
              className="w-full px-5 py-4 border-none bg-gray-50 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-medium"
              placeholder="Module Name"
            />
          </div>
          <textarea
            required value={description} onChange={e => setDescription(e.target.value)} rows={4}
            className="w-full px-5 py-4 border-none bg-gray-50 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-medium"
            placeholder="Detailed description..."
          />
          <button type="submit" className="w-full bg-[#1e3a8a] text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] hover:bg-blue-900 transition-all">
            Send Inquiry
          </button>
        </form>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b bg-gray-50/50 flex justify-between items-center">
          <h3 className="font-black text-gray-700 uppercase text-xs tracking-[0.2em]">Inquiry History</h3>
        </div>
        <div className="divide-y">
          {queries.length > 0 ? queries.map(q => (
            <div key={q.id} className="p-8 hover:bg-gray-50 transition-colors">
               <div className="flex justify-between items-start mb-4">
                 <div>
                    <h4 className="text-lg font-black text-gray-800 tracking-tight">{q.title}</h4>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">{q.module} • {q.date}</p>
                 </div>
                 <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                    q.status === 'Solved' ? 'bg-green-50 text-green-700 border-green-100' :
                    q.status === 'Pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-100' : 'bg-blue-50 text-blue-700 border-blue-100'
                  }`}>
                    {q.status}
                  </span>
               </div>
               <p className="text-sm text-gray-600 mb-6 italic">"{q.description}"</p>
               {q.reply && (
                 <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                    <p className="text-[10px] font-black uppercase text-blue-700 tracking-widest mb-1">Teacher's Feedback:</p>
                    <p className="text-sm font-medium text-gray-800">{q.reply}</p>
                 </div>
               )}
            </div>
          )) : (
            <div className="p-20 text-center text-gray-400 italic">No inquiries found.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QueryForm;
