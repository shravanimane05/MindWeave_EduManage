import React, { useState, useEffect } from 'react';
import { Query, User } from '../types';
import { dbService } from '../services/dbService';
import { MessageCircle } from 'lucide-react';

const TeacherFeedback: React.FC<{ user?: User }> = ({ user }) => {
  const [queries, setQueries] = useState<Query[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get current logged-in user from localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const currentUser = JSON.parse(savedUser);
      if (currentUser.prn) {
        // Student - get their queries with teacher feedback
        const studentQueries = dbService.getStudentQueries(currentUser.prn);
        setQueries(studentQueries.filter(q => q.teacherReply));
      }
    }
    setLoading(false);
  }, []);

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="p-8 space-y-6">
      <header className="bg-[#1e3a8a] text-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-bold">Teacher Feedback on Your Queries</h2>
      </header>

      {queries.length === 0 ? (
        <div className="bg-white p-12 rounded-xl border text-center">
          <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No feedback received yet</p>
          <p className="text-gray-400 text-sm mt-2">Submit a query to get teacher feedback</p>
        </div>
      ) : (
        <div className="space-y-4">
          {queries.map(query => (
            <div key={query.id} className="bg-white p-6 rounded-xl border shadow-sm relative overflow-hidden">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg text-gray-800">{query.teacherName}</h3>
                  <p className="text-sm text-blue-600 font-medium mb-2">{query.title}</p>
                  <p className="text-gray-600 text-sm leading-relaxed">{query.teacherReply}</p>
                </div>
              </div>
              <div className="mt-4 flex justify-between items-center text-xs">
                <span className="text-gray-500">{query.replyDate}</span>
                <div className="flex items-center gap-2">
                  <span className={`font-bold px-3 py-1 rounded ${
                    query.status === 'Solved' ? 'bg-green-100 text-green-700' :
                    query.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {query.status}
                  </span>
                </div>
              </div>
              <div className="mt-3 text-xs text-gray-400 border-t pt-3">
                <p><strong>Your Query:</strong> {query.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeacherFeedback;
