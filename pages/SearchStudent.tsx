
import React from 'react';
import { dbService } from '../services/dbService';
import { sendAlertToStudent } from '../services/twilioService';

const SearchStudent: React.FC<{ division: string }> = ({ division }) => {
  const [search, setSearch] = React.useState('');
  const students = dbService.getStudentsByDivision(division);
  const filtered = students.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.prn.toLowerCase().includes(search.toLowerCase())
  );

  const handleNotify = async (student: any) => {
    await sendAlertToStudent(student, 'General');
  };

  return (
    <div className="p-8 space-y-8">
      <header className="bg-[#1e3a8a] text-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-bold">Individual Student Search</h2>
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
          placeholder="Search by name or PRN..."
        />
      </div>

      <div className="space-y-6">
        {filtered.length > 0 ? filtered.map(student => (
          <div key={student.id} className="bg-white p-6 rounded-2xl shadow-sm border group hover:border-blue-300 transition-all">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{student.name}</h3>
                  <p className="text-xs text-gray-500">PRN: {student.prn}</p>
                </div>
              </div>
              <button onClick={() => handleNotify(student)} className="bg-orange-100 text-orange-700 hover:bg-orange-200 transition px-4 py-2 rounded-lg text-xs font-bold flex items-center border border-orange-200">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 004.708 4.708l.773-1.548a1 1 0 011.06-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" /></svg>
                Twilio Alert
              </button>
            </div>

            <div className="grid grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-xl">
                <p className="text-[10px] uppercase font-bold text-gray-400">CGPA</p>
                <p className="text-lg font-bold text-blue-800">{student.cgpa}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-xl">
                <p className="text-[10px] uppercase font-bold text-gray-400">Attendance</p>
                <p className="text-lg font-bold text-green-800">{student.attendance}%</p>
              </div>
              <div className="bg-red-50 p-4 rounded-xl">
                <p className="text-[10px] uppercase font-bold text-gray-400">Risk Score</p>
                <p className="text-lg font-bold text-red-800">{student.riskScore}</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-xl">
                <p className="text-[10px] uppercase font-bold text-gray-400">Backlogs</p>
                <p className="text-lg font-bold text-orange-800">{student.backlogs}</p>
              </div>
            </div>

            <div className="mt-6 flex justify-between items-center border-t pt-4">
               <div className="text-xs text-gray-400 italic">Contact: {student.phone} | {student.email}</div>
               <button onClick={() => { if(confirm('Remove student record?')) { dbService.deleteStudent(student.id); window.location.reload(); } }} className="text-red-400 hover:text-red-600 text-[10px] font-bold uppercase tracking-tighter">Delete Student</button>
            </div>
          </div>
        )) : (
          <div className="p-20 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
            <p className="text-gray-500 italic">No student records active in this division dashboard. Upload data to populate.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchStudent;
