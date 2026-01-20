
import React, { useState } from 'react';

const RiskPredictor: React.FC = () => {
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [marks, setMarks] = useState('');
  const [attendance, setAttendance] = useState('');
  const [prediction, setPrediction] = useState<number | null>(null);

  const handlePredict = (e: React.FormEvent) => {
    e.preventDefault();
    // Simplified logic for simulation
    const score = 100 - (Number(marks) * 0.6 + Number(attendance) * 0.4);
    setPrediction(Math.max(0, Math.min(100, Math.round(score))));
  };

  return (
    <div className="p-8 space-y-8">
      <header className="bg-[#1e3a8a] text-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-bold">Risk Predictor</h2>
      </header>

      <div className="bg-white p-8 rounded-xl shadow-lg border max-w-2xl mx-auto">
        <div className="flex items-center space-x-2 mb-8 border-b pb-4">
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
          <h3 className="text-lg font-bold text-gray-800">Student Performance Prediction</h3>
        </div>

        <form onSubmit={handlePredict} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Student Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Enter student name"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Subject</label>
              <input
                type="text"
                value={subject}
                onChange={e => setSubject(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Subject"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Marks (%)</label>
              <input
                type="number"
                value={marks}
                onChange={e => setMarks(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg outline-none"
                placeholder="0-100"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Attendance (%)</label>
              <input
                type="number"
                value={attendance}
                onChange={e => setAttendance(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg outline-none"
                placeholder="0-100"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#1e3a8a] text-white py-3 rounded-lg font-bold hover:bg-blue-900 transition shadow-lg mt-4"
          >
            Predict Score
          </button>
        </form>

        {prediction !== null && (
          <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-100 text-center animate-in fade-in zoom-in">
            <p className="text-sm font-medium text-blue-800 uppercase tracking-wider">Predicted Risk Score</p>
            <h4 className={`text-5xl font-black mt-2 ${prediction > 70 ? 'text-red-600' : prediction > 40 ? 'text-orange-500' : 'text-green-600'}`}>
              {prediction}
            </h4>
            <p className="text-xs text-gray-500 mt-2 italic">
              {prediction > 70 ? 'High probability of dropout. Immediate counseling required.' : 
               prediction > 40 ? 'Moderate risk. Monitoring recommended.' : 'Low risk. Performance is stable.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RiskPredictor;
