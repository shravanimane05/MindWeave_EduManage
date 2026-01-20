
import React, { useState, useEffect } from 'react';
import { dbService } from '../../backend/dbService';
import { Query } from '../types';

const StudentQueries: React.FC<{ division: string }> = ({ division }) => {
  const [search, setSearch] = useState('');
  const [queries, setQueries] = useState<Query[]>([]);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const loadQueries = () => {
    setQueries(dbService.getAllQueries(division));
  };

  useEffect(() => {
    loadQueries();
  }, [division]);

  const filtered = queries.filter(q => 
    q.studentName.toLowerCase().includes(search.toLowerCase()) || 
    q.title.toLowerCase().includes(search.toLowerCase()) ||
    q.prn.toLowerCase().includes(search.toLowerCase())
  );

  const handleUpdateStatus = (id: string, status: 'Solved' | 'Pending') => {
    dbService.updateQueryStatus(id, status);
    loadQueries();
    alert(`Query status updated to ${status}.`);
  };

  const handleSendReply = (id: string) => {
    if (!replyText.trim()) return;
    dbService.updateQueryReply(id, replyText);
    loadQueries();
    alert('Response sent to student successfully.');
    setReplyingTo(null);
    setReplyText('');
  };

  return (
    <div className="p-8 space-y-8 min-h-screen">
      <header className="bg-[#1e3a8a] text-white p-6 rounded-2xl shadow-xl flex justify-between items-center border-b-4 border-blue-900">
        <div>
          <h2 className="text-xl font-black uppercase tracking-widest">Division {division} Student Support</h2>
          <p className="text-[10px] font-bold opacity-70 mt-1 uppercase tracking-[0.2em]">Academic Inquiry Management</p>
        </div>
      </header>

      <div className="relative">
        <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </span>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-4 rounded-2xl border shadow-md outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
          placeholder="Filter by Student Name, PRN, or Subject..."
        />
      </div>

      <div className="space-y-6">
        {filtered.length > 0 ? filtered.map(query => (
          <div key={query.id} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 relative hover:shadow-lg transition-all">
             <div className="absolute top-8 right-8">
               <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                 query.status === 'Solved' ? 'bg-green-50 text-green-700 border-green-100' : 
                 query.status === 'In Progress' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                 'bg-yellow-50 text-yellow-700 border-yellow-100 animate-pulse'
               }`}>
                 {query.status}
               </span>
             </div>
             
             <div className="mb-6">
               <h3 className="text-lg font-black text-gray-800 tracking-tight">{query.title}</h3>
               <div className="flex items-center space-x-3 text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-2">
                 <span className="text-blue-600">{query.studentName}</span>
                 <span>•</span>
                 <span>{query.prn}</span>
                 <span>•</span>
                 <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-500">{query.module}</span>
                 <span>•</span>
                 <span>{query.date}</span>
               </div>
             </div>

             <div className="bg-gray-50/50 p-6 rounded-2xl text-sm text-gray-600 leading-relaxed mb-8 border border-gray-100 italic">
               "{query.description}"
             </div>

             {query.reply && (
                <div className="bg-blue-50 p-6 rounded-2xl mb-6 border border-blue-100">
                  <p className="text-[10px] font-black uppercase tracking-widest text-blue-800 mb-2">Teacher Response History:</p>
                  <p className="text-sm font-medium text-blue-900">{query.reply}</p>
                </div>
             )}

             {replyingTo === query.id ? (
               <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                 <textarea
                   autoFocus
                   value={replyText}
                   onChange={e => setReplyText(e.target.value)}
                   className="w-full p-4 border rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                   placeholder="Type your resolution or guidance here..."
                   rows={3}
                 />
                 <div className="flex space-x-3">
                   <button 
                     onClick={() => handleSendReply(query.id)}
                     className="bg-blue-600 text-white text-[10px] px-8 py-3 rounded-xl font-black uppercase tracking-widest hover:bg-blue-700"
                   >
                     Submit Reply
                   </button>
                   <button 
                     onClick={() => setReplyingTo(null)}
                     className="bg-gray-100 text-gray-500 text-[10px] px-8 py-3 rounded-xl font-black uppercase tracking-widest"
                   >
                     Cancel
                   </button>
                 </div>
               </div>
             ) : (
               <div className="flex space-x-4">
                 <button 
                   onClick={() => { setReplyingTo(query.id); setReplyText(query.reply || ''); }}
                   className="bg-[#1e3a8a] text-white text-[10px] px-10 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-900 transition-all shadow-md active:scale-95 flex items-center"
                 >
                   <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>
                   {query.reply ? 'Edit Response' : 'Reply to Student'}
                 </button>
                 {query.status !== 'Solved' && (
                   <button 
                    onClick={() => handleUpdateStatus(query.id, 'Solved')}
                    className="bg-green-600 text-white text-[10px] px-10 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-green-700 transition-all shadow-md active:scale-95 flex items-center"
                   >
                     <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                     Mark as Solved
                   </button>
                 )}
               </div>
             )}
          </div>
        )) : (
          <div className="p-24 text-center bg-white rounded-3xl border-2 border-dashed border-gray-100">
             <p className="text-gray-400 font-black uppercase text-xs tracking-[0.2em]">Inbox Clear for Division {division}.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentQueries;
