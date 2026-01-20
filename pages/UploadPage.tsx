
import React, { useState } from 'react';
import { dbService } from '../services/dbService';
import { User } from '../types';

interface UploadPageProps {
  user: User;
  onRefresh: () => void;
}

const UploadPage: React.FC<UploadPageProps> = ({ user, onRefresh }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [recentUploads, setRecentUploads] = useState([
    { name: 'student_data_jan2024.csv', date: '2024-01-15', status: 'Processed' },
    { name: 'attendance_data.xlsx', date: '2024-01-10', status: 'Processed' },
  ]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    // Simulate processing CSV/Excel and merging
    setTimeout(async () => {
      // Mocked merged data for the test students
      const mockData = [
        { prn: 'PRN9561', unitTest2: 24, cgpa: 8.6 },
        { prn: 'PRN8788', unitTest2: 15, riskScore: 85 }
      ];
      
      await dbService.uploadStudentData(mockData);
        
        setRecentUploads([{ name: file.name, date: new Date().toISOString().split('T')[0], status: 'Processed' }, ...recentUploads]);
        setIsUploading(false);
        alert(`Successfully uploaded ${data.length} student records!`);
        onRefresh();
      } catch (error) {
        console.error('Error processing file:', error);
        alert('Error processing file. Please ensure it is a valid CSV file.');
        setIsUploading(false);
      }
    };
    
    reader.readAsText(file);
  };

  return (
    <div className="p-8 space-y-8">
      <header className="bg-[#1e3a8a] text-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-bold">Upload Data</h2>
      </header>

      <div className="bg-white p-12 rounded-2xl shadow-lg border text-center relative overflow-hidden max-w-2xl mx-auto">
        <div className="absolute top-0 left-0 w-full h-1 bg-blue-600"></div>
        <div className="mb-8 text-left bg-blue-50 p-6 rounded-xl border border-blue-100">
           <h3 className="font-bold text-blue-900 mb-4 flex items-center">
             <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1a1 1 0 112 0v1a1 1 0 11-2 0zM13.464 15.05a1 1 0 010 1.414l-.707.707a1 1 0 01-1.414-1.414l.707-.707zM17 13a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1z" /></svg>
             Upload Student Data
           </h3>
           <p className="text-sm text-gray-600 mb-2">Upload student attendance, marks, and performance data in CSV or Excel format.</p>
           <div className="text-[10px] text-gray-400 font-bold uppercase space-y-1">
             <p>• CSV (.csv)</p>
             <p>• Excel (.xlsx, .xls)</p>
             <p>• Maximum file size: 10MB</p>
           </div>
        </div>

        <div className="border-2 border-dashed border-gray-200 rounded-2xl p-12 hover:border-blue-500 transition group relative">
          {isUploading ? (
            <div className="space-y-4">
               <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
               <p className="text-gray-500 font-medium">Merging records, please wait...</p>
            </div>
          ) : (
            <>
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4 group-hover:text-blue-500 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
              <h4 className="font-bold text-gray-700">Click to upload or drag and drop</h4>
              <p className="text-xs text-gray-400 mt-2">CSV, XLSX, or XLS files only</p>
              <input 
                type="file" 
                accept=".csv,.xlsx,.xls"
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
              />
            </>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden max-w-2xl mx-auto">
        <div className="p-4 border-b bg-gray-50">
          <h3 className="font-bold text-gray-800">Recent Uploads</h3>
        </div>
        <div className="divide-y">
          {recentUploads.map((upload, i) => (
            <div key={i} className="flex justify-between items-center p-4">
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" /></svg>
                <div>
                  <p className="text-sm font-bold text-gray-800">{upload.name}</p>
                  <p className="text-[10px] text-gray-400 uppercase font-bold">{upload.date}</p>
                </div>
              </div>
              <span className="text-[10px] bg-green-100 text-green-700 px-3 py-1 rounded-full font-bold">{upload.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UploadPage;
