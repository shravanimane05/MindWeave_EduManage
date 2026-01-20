
import React from 'react';
import { dbService } from '../../backend/dbService';
import { sendAlertToStudent } from '../../backend/twilioService';

const SearchStudent: React.FC<{ division: string }> = ({ division }) => {
  const [search, setSearch] = React.useState('');
  const students = dbService.getStudentsByDivision(division);
  const filtered = students.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.prn.toLowerCase().includes(search.toLowerCase())
  );

  const handleNotify = async (student: any) => {
    await sendAlertToStudent(student, 'Profile Check');
  };

  return (
    <div className="p-8 space-y-8">
      <header className="bg-[#1e3a8a] text-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-bold uppercase tracking-wider">Student Search | Division {division}</h2>
      </header>

      <div className="relative">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </span>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-xl border shadow-lg outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Search by name or PRN..."
        />
      </div>

      <div className="space-y-6">
        {filtered.length > 0 ? filtered.map(student => (
          <div key={student.id} className="bg-white p-6 rounded-2xl shadow-sm border group hover:border-green-300 transition-all">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold">
                  {student.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{student.name}</h3>
                  <p className="text-xs text-gray-400 font-bold">PRN: {student.prn}</p>
                </div>
              </div>
              <button onClick={() => handleNotify(student)} className="bg-green-100 text-green-700 hover:bg-green-200 transition px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center border border-green-200 shadow-sm">
                WhatsApp Notification
              </button>
            </div>

            <div className="grid grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                <p className="text-[10px] uppercase font-black text-blue-400 mb-1">CGPA</p>
                <p className="text-lg font-bold text-blue-800">{student.cgpa}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                <p className="text-[10px] uppercase font-black text-green-400 mb-1">Attendance</p>
                <p className="text-lg font-bold text-green-800">{student.attendance}%</p>
              </div>
              <div className="bg-red-50 p-4 rounded-xl border border-red-100">
                <p className="text-[10px] uppercase font-black text-red-400 mb-1">Risk Score</p>
                <p className="text-lg font-bold text-red-800">{student.riskScore}</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
                <p className="text-[10px] uppercase font-black text-orange-400 mb-1">Backlogs</p>
                <p className="text-lg font-bold text-orange-800">{student.backlogs}</p>
              </div>
            </div>

            <div className="mt-6 flex justify-between items-center border-t border-gray-50 pt-4">
               <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">📞 {student.phone} | ✉️ {student.email}</div>
               <button onClick={() => { if(confirm('Permanently delete student from division A database?')) { dbService.deleteStudent(student.id); window.location.reload(); } }} className="text-red-400 hover:text-red-600 text-[10px] font-black uppercase tracking-tighter transition">Delete Record</button>
            </div>
          </div>
        )) : (
          <div className="p-20 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
            <p className="text-gray-400 font-bold italic uppercase text-xs">No records matching search criteria in Division {division}.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchStudent;
