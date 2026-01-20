
import React, { useState } from 'react';
import { User, Query } from '../types';
import { dbService } from '../services/dbService';

const QueryForm: React.FC<{ user: User }> = ({ user }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('Assignment Clarification');
  const [module, setModule] = useState('');

  const queries = dbService.getAllQueries(user.division!).filter(q => q.studentId === user.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newQuery: Query = {
      id: Math.random().toString(36).substr(2, 9),
      studentId: user.id,
      studentName: user.name,
      prn: user.prn!,
      division: user.division!,
      title,
      description,
      type,
      module,
      date: new Date().toISOString().split('T')[0],
      status: 'Pending'
    };
    dbService.addQuery(newQuery);
    setTitle('');
    setDescription('');
    setModule('');
    alert('Query submitted successfully!');
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
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-bold">
            <tr>
              <th className="px-6 py-3">Title</th>
              <th className="px-6 py-3">Module</th>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {queries.length > 0 ? queries.map(q => (
              <tr key={q.id}>
                <td className="px-6 py-4 font-medium text-gray-800">{q.title}</td>
                <td className="px-6 py-4 text-gray-500">{q.module}</td>
                <td className="px-6 py-4 text-gray-500">{q.date}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                    q.status === 'Solved' ? 'bg-green-100 text-green-700' :
                    q.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {q.status}
                  </span>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-400 italic">No queries found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default QueryForm;
