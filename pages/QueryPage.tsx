import React, { useState, useEffect } from 'react';
import { User, Query } from '../types';
import { dbService } from '../services/dbService';
import { Send, MessageCircle, CheckCircle, Clock, Trash2 } from 'lucide-react';

const QueryPage: React.FC<{ user: User }> = ({ user }) => {
  const [queries, setQueries] = useState<Query[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Academic' | 'Financial' | 'Personal' | 'Technical'>('All');
  const [formData, setFormData] = useState({ title: '', description: '', type: 'Academic' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadQueries();
  }, [user.prn]);

  const loadQueries = () => {
    // Only load queries for THIS student
    const studentQueries = dbService.getStudentQueries(user.prn || '');
    console.log('📥 Loaded queries for', user.prn, ':', studentQueries);
    setQueries(studentQueries);
    setLoading(false);
  };

  const handleSubmitQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) {
      alert('Please fill in all fields');
      return;
    }

    setSubmitting(true);

    try {
      const newQuery: Query = {
        id: 'Q_' + Date.now(),
        studentPrn: user.prn || '',
        studentName: user.name || '',
        title: formData.title,
        description: formData.description,
        type: formData.type as 'Academic' | 'Financial' | 'Personal' | 'Technical',
        status: 'Pending',
        submittedDate: new Date().toISOString().split('T')[0],
      };

      console.log('📨 Submitting new query:', newQuery);
      dbService.addQuery(newQuery);
      console.log('✅ Query added to database');
      
      setFormData({ title: '', description: '', type: 'Academic' });
      setShowForm(false);
      loadQueries();

      alert('✅ Query submitted successfully! Your class teacher will review it soon.');
    } catch (error) {
      console.error('❌ Error submitting query:', error);
      alert('Failed to submit query. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteQuery = (queryId: string) => {
    if (window.confirm('Are you sure you want to delete this query?')) {
      // In a real system, you'd have a deleteQuery method
      alert('Delete functionality will be added');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Solved':
        return 'bg-green-50 border-green-200 text-green-700';
      case 'In Progress':
        return 'bg-blue-50 border-blue-200 text-blue-700';
      default:
        return 'bg-yellow-50 border-yellow-200 text-yellow-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Solved':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'In Progress':
        return <Clock className="w-5 h-5 text-blue-600" />;
      default:
        return <MessageCircle className="w-5 h-5 text-yellow-600" />;
    }
  };

  const getCategoryColor = (type: string) => {
    const colors: {[key: string]: string} = {
      'Academic': 'bg-blue-100 text-blue-700',
      'Financial': 'bg-green-100 text-green-700',
      'Personal': 'bg-purple-100 text-purple-700',
      'Technical': 'bg-orange-100 text-orange-700'
    };
    return colors[type] || 'bg-gray-100 text-gray-700';
  };

  const filteredQueries = selectedCategory === 'All' 
    ? queries 
    : queries.filter(q => q.type === selectedCategory);

  const categoryStats = {
    'Academic': queries.filter(q => q.type === 'Academic').length,
    'Financial': queries.filter(q => q.type === 'Financial').length,
    'Personal': queries.filter(q => q.type === 'Personal').length,
    'Technical': queries.filter(q => q.type === 'Technical').length,
  };

  if (loading) {
    return <div className="p-8">Loading your queries...</div>;
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="bg-[#b8860b] text-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold">My Queries</h1>
        <p className="text-sm mt-2 opacity-90">Private conversation between you and your class teacher</p>
      </div>

      {/* Submit Button */}
      <div className="flex gap-3">
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-[#b8860b] text-white px-6 py-3 rounded-lg hover:bg-[#996608] transition font-bold"
        >
          <Send className="w-4 h-4" />
          Submit New Query
        </button>
      </div>

      {/* Query Submission Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-4">📝 Submit Your Query</h2>
          <form onSubmit={handleSubmitQuery} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Query Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b8860b]"
                placeholder="What's your query about?"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b8860b] h-32"
                placeholder="Provide detailed information about your query"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Query Category</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b8860b]"
              >
                <option value="Academic">📚 Academic</option>
                <option value="Financial">💰 Financial</option>
                <option value="Personal">👤 Personal</option>
                <option value="Technical">🔧 Technical</option>
              </select>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2 bg-[#b8860b] text-white rounded-lg hover:bg-[#996608] disabled:opacity-50 font-bold"
              >
                {submitting ? '⏳ Submitting...' : '✅ Submit Query'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Category Filter */}
      <div className="space-y-3">
        <p className="text-sm font-bold text-gray-700 uppercase">Filter by Category</p>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              selectedCategory === 'All'
                ? 'bg-[#b8860b] text-white'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            All ({queries.length})
          </button>
          {(['Academic', 'Financial', 'Personal', 'Technical'] as const).map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                selectedCategory === category
                  ? 'bg-[#b8860b] text-white'
                  : `${getCategoryColor(category)} border hover:opacity-80`
              }`}
            >
              {category} ({categoryStats[category]})
            </button>
          ))}
        </div>
      </div>

      {/* Queries List */}
      <div className="space-y-4">
        {filteredQueries.length === 0 ? (
          <div className="bg-white p-12 rounded-xl border border-gray-200 text-center">
            <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">
              {selectedCategory === 'All' 
                ? 'No queries yet' 
                : `No ${selectedCategory.toLowerCase()} queries`}
            </p>
            <p className="text-gray-400 text-sm mt-2">Submit your first query to get teacher feedback</p>
          </div>
        ) : (
          filteredQueries.map((query) => (
            <div key={query.id} className={`bg-white p-6 rounded-xl border-2 ${getStatusColor(query.status)}`}>
              {/* Query Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {getStatusIcon(query.status)}
                    <h3 className="text-lg font-bold text-gray-800">{query.title}</h3>
                  </div>
                  <p className="text-sm text-gray-600 flex gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getCategoryColor(query.type)}`}>
                      {query.type}
                    </span>
                    <span className="text-gray-500">Submitted: {query.submittedDate}</span>
                  </p>
                </div>
                <div className="text-right">
                  <span className={`inline-block px-4 py-2 rounded-lg font-semibold text-sm ${
                    query.status === 'Solved' ? 'bg-green-100 text-green-700' :
                    query.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {query.status}
                  </span>
                </div>
              </div>

              {/* Query Description */}
              <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm font-medium text-gray-700 mb-2">Your Query:</p>
                <p className="text-gray-700">{query.description}</p>
              </div>

              {/* Teacher Reply */}
              {query.teacherReply ? (
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm font-bold text-green-900 mb-2">
                    ✅ Reply from {query.teacherName} ({query.replyDate})
                  </p>
                  <p className="text-gray-800">{query.teacherReply}</p>
                </div>
              ) : (
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-center">
                  <p className="text-sm text-gray-600">⏳ <strong>Awaiting teacher feedback...</strong></p>
                  <p className="text-xs text-gray-500 mt-1">Your class teacher will respond soon</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default QueryPage;
