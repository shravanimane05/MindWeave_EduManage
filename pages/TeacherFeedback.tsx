
import React from 'react';
import { Feedback } from '../types';

const FEEDBACKS: Feedback[] = [
  { id: '1', teacherName: 'Dr. Smith', subject: 'Data Structures', content: 'Excellent performance on recent assignments. Keep up the good work!', date: '2025-01-10', rating: 5, sentiment: 'Positive' },
  { id: '2', teacherName: 'Prof. Johnson', subject: 'Physics', content: 'Need to improve lab attendance. Please focus more on practical sessions.', date: '2025-01-12', rating: 3, sentiment: 'Neutral' },
  { id: '3', teacherName: 'Dr. Williams', subject: 'Mathematics', content: 'Good understanding of concepts. Work on solving complex problems faster.', date: '2025-01-14', rating: 4, sentiment: 'Positive' },
];

const TeacherFeedback: React.FC = () => {
  return (
    <div className="p-8 space-y-6">
      <header className="bg-[#1e3a8a] text-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-bold">Teacher Feedback</h2>
      </header>

      <div className="space-y-4">
        {FEEDBACKS.map(f => (
          <div key={f.id} className="bg-white p-6 rounded-xl border shadow-sm relative overflow-hidden">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg text-gray-800">{f.teacherName}</h3>
                <p className="text-sm text-blue-600 font-medium mb-3">{f.subject}</p>
                <p className="text-gray-600 text-sm leading-relaxed">{f.content}</p>
              </div>
              <div className="flex items-center text-yellow-500">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className={`w-5 h-5 ${i < f.rating ? 'fill-current' : 'text-gray-200'}`} viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
            <div className="mt-4 flex justify-between items-center text-xs text-gray-400">
              <span>{f.date}</span>
              <span className={`font-bold px-2 py-0.5 rounded ${
                f.sentiment === 'Positive' ? 'text-green-600 bg-green-50' : 'text-yellow-600 bg-yellow-50'
              }`}>{f.sentiment}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeacherFeedback;
