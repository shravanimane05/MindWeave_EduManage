
import React, { useState, useEffect } from 'react';
import { User, Query } from '../types';

const QueryForm: React.FC<{ user: User }> = ({ user }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('Assignment Clarification');
  const [module, setModule] = useState('');

  const [queries, setQueries] = useState<Query[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQueries();
  }, [user.division]);

  const loadQueries = async () => {
    try {
      // Temporary localStorage solution
      const allQueries = JSON.parse(localStorage.getItem('queries') || '[]');
      const studentQueries = allQueries.filter((q: any) => q.studentPrn === user.prn);
      setQueries(studentQueries);
    } catch (error) {
      console.error('Error loading queries:', error);
      setQueries([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newQuery = {
        id: Math.random().toString(36).substr(2, 9),
        studentPrn: user.prn!,
        studentName: user.name,
        division: user.division!,
        title,
        description,
        type,
        module,
        submittedDate: new Date().toISOString().split('T')[0],
        status: 'Pending'
      };
      
      // Temporary localStorage solution
      const existingQueries = JSON.parse(localStorage.getItem('queries') || '[]');
      existingQueries.push(newQuery);
      localStorage.setItem('queries', JSON.stringify(existingQueries));
      
      setTitle('');
      setDescription('');
      setModule('');
      alert('Query submitted successfully!');
      loadQueries();
    } catch (error) {
      console.error('Error submitting query:', error);
      alert('Error submitting query');
    }
  };

  return (
    <div className="p-8 space-y-8">
      <header className="bg-[#1e3a8a] text-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-bold">Query Form</h2>
      </header>

      <div className="bg-white p-8 rounded-xl shadow-sm border">
        <h3 className="text-lg font-bold mb-6 text-gray-800">Submit New Query</h3>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Enter query title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              required
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Describe your query in detail..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Query Type</label>
              <select
                value={type}
                onChange={e => setType(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg outline-none"
              >
                <option>Assignment Clarification</option>
                <option>Lab Report Issue</option>
                <option>Exam Date Query</option>
                <option>Attendance Discrepancy</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Module</label>
              <input
                type="text"
                value={module}
                onChange={e => setModule(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg outline-none"
                placeholder="e.g., Data Structures, Physics Lab"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-[#1e3a8a] text-white py-3 rounded-lg font-bold hover:bg-blue-900 transition shadow-lg"
          >
            Submit Query
          </button>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="p-4 border-b bg-gray-50">
          <h3 className="font-bold text-gray-800">Your Queries</h3>
        </div>
        <div className="space-y-4">
          {queries.length > 0 ? queries.map(q => (
            <div key={q.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-gray-800">{q.title}</h4>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  q.status === 'Solved' ? 'bg-green-100 text-green-700' :
                  q.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  {q.status}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2">{q.description}</p>
              <div className="text-xs text-gray-500 mb-3">
                <span>Module: {q.module || 'N/A'}</span> • <span>Date: {q.submittedDate}</span>
              </div>
              {q.teacherReply && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-bold text-blue-900">Teacher Reply:</span>
                    <span className="text-xs text-blue-700">{q.replyDate}</span>
                  </div>
                  <p className="text-sm text-blue-900">{q.teacherReply}</p>
                  {q.teacherName && (
                    <p className="text-xs text-blue-700 mt-1">- {q.teacherName}</p>
                  )}
                </div>
              )}
            </div>
          )) : (
            <div className="text-center py-8 text-gray-400 italic">No queries found.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QueryForm;
