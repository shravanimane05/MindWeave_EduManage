
import React, { useState } from 'react';
import { dbService } from '../services/dbService';

const StudentQueries: React.FC<{ division: string }> = ({ division }) => {
  const [search, setSearch] = useState('');
  const queries = dbService.getAllQueries(division);
  const filtered = queries.filter(q => 
    q.studentName.toLowerCase().includes(search.toLowerCase()) || 
    q.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleUpdateStatus = (id: string, status: 'Solved' | 'Pending') => {
    dbService.updateQueryStatus(id, status);
    window.location.reload();
  };

  return (
    <div className="p-8 space-y-8">
      <header className="bg-[#1e3a8a] text-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-bold">Student Queries</h2>
      </header>

      <div className="relative">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </span>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-xl border shadow-sm outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Search query by student name or PRN..."
        />
      </div>

      <div className="space-y-6">
        {filtered.length > 0 ? filtered.map(query => (
          <div key={query.id} className="bg-white p-6 rounded-2xl shadow-sm border relative">
             <div className="absolute top-6 right-6">
               <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                 query.status === 'Solved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
               }`}>
                 {query.status}
               </span>
             </div>
             
             <div className="mb-4">
               <h3 className="text-xl font-bold text-gray-800">{query.title}</h3>
               <p className="text-xs text-gray-400 mt-1">{query.studentName} • {query.prn} • {query.module} • {query.date}</p>
             </div>

             <div className="bg-gray-50 p-4 rounded-xl text-sm text-gray-600 leading-relaxed mb-6 italic">
               "{query.description}"
             </div>

             <div className="flex space-x-3">
               <button className="bg-blue-600 text-white text-xs px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition">Send Reply</button>
               {query.status !== 'Solved' && (
                 <button 
                  onClick={() => handleUpdateStatus(query.id, 'Solved')}
                  className="bg-green-600 text-white text-xs px-6 py-2 rounded-lg font-bold hover:bg-green-700 transition"
                 >
                   Mark as Solved
                 </button>
               )}
             </div>
          </div>
        )) : (
          <div className="p-20 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
             <p className="text-gray-500">No student queries found for division {division}.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentQueries;
