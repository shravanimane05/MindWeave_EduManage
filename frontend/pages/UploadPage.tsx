
import React, { useState } from 'react';
import { dbService } from '../../backend/dbService';
import { User } from '../types';

const UploadPage: React.FC<{user: User, onRefresh: () => void}> = ({ user, onRefresh }) => {
  const [loading, setLoading] = useState(false);

  const handleUpload = () => {
    setLoading(true);
    // Simulation of a teacher uploading recent marks and attendance for Division A
    setTimeout(async () => {
      /**
       * Data Integrity Protocol:
       * Teacher uploads ONLY identifying PRN and recent metrics.
       * The system merges this with the student's master profile.
       */
      await dbService.uploadStudentData([
        { prn: 'PRN9561', unitTest1: 22, unitTest2: 23, cgpa: 8.7, attendance: 95 }, // Prerna
        { prn: 'PRN8788', unitTest1: 10, unitTest2: 12, riskScore: 88, attendance: 58 } // Shravni (Below 60% -> Triggers Alert)
      ]);
      
      setLoading(false);
      alert('Examination Dataset Merged! System detected Shravni Morkhade has critical attendance (<60%) and has dispatched an automated WhatsApp Alert.');
      onRefresh(); // Trigger dashboard refresh to see new dynamic chart states
    }, 2000);
  };

  return (
    <div className="p-8 space-y-8">
      <header className="bg-[#1e3a8a] text-white p-6 rounded-2xl shadow-xl">
        <h2 className="text-xl font-black uppercase tracking-[0.2em]">Division Performance Sync</h2>
      </header>

      <div className="bg-white p-12 rounded-3xl shadow-2xl border border-gray-100 max-w-2xl mx-auto text-center">
        <div className="mb-10 text-left bg-blue-50 p-8 rounded-2xl border border-blue-100 shadow-inner">
           <h3 className="font-black text-blue-900 mb-4 uppercase text-xs tracking-[0.2em] flex items-center">
             <div className="w-2 h-2 bg-blue-600 rounded-full mr-3 animate-pulse"></div>
             Master Merge Engine
           </h3>
           <p className="text-sm text-gray-600 leading-relaxed mb-4">The portal intelligently merges incoming CSV/Excel data with the student registry. You only need to provide <strong>PRN</strong> and <strong>Marks/Attendance</strong>.</p>
           <ul className="text-[10px] text-blue-500 font-black uppercase space-y-3">
             <li className="flex items-center"><span className="w-1.5 h-1.5 bg-blue-300 rounded-full mr-3"></span> Automated Risk Recalculation</li>
             <li className="flex items-center"><span className="w-1.5 h-1.5 bg-blue-300 rounded-full mr-3"></span> Unit Test Comparative Analytics</li>
             <li className="flex items-center"><span className="w-1.5 h-1.5 bg-red-400 rounded-full mr-3 animate-ping"></span> Real-time WhatsApp Alerts for Attendance < 60%</li>
           </ul>
        </div>

        <div className="border-4 border-dashed border-gray-100 rounded-3xl p-20 hover:border-blue-500 transition-all flex flex-col items-center justify-center bg-gray-50/50 group relative cursor-pointer overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center space-y-8">
              <div className="relative">
                <div className="w-20 h-20 border-8 border-blue-100 rounded-full"></div>
                <div className="w-20 h-20 border-8 border-blue-600 border-t-transparent rounded-full animate-spin absolute top-0"></div>
              </div>
              <p className="text-blue-900 font-black uppercase text-xs tracking-[0.2em] animate-pulse">Processing Division A Dataset...</p>
            </div>
          ) : (
            <>
              <div className="p-8 bg-white rounded-3xl shadow-lg mb-8 group-hover:scale-110 transition-transform">
                <svg className="w-14 h-14 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
              </div>
              <h4 className="font-black text-gray-800 text-2xl mb-2 tracking-tight">Upload Student Files</h4>
              <p className="text-xs text-gray-400 mb-12 uppercase font-black tracking-[0.3em]">Division-A Security Protocol</p>
              
              <button 
                onClick={handleUpload} 
                className="bg-[#1e3a8a] text-white px-16 py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-900 shadow-2xl transform active:scale-95 transition-all hover:shadow-blue-200 relative z-10"
              >
                Trigger Data Merge
              </button>
            </>
          )}
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-50 rounded-full opacity-50"></div>
        </div>
      </div>
    </div>
  );
};
export default UploadPage;
