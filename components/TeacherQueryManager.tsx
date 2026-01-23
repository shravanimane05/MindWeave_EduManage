import React, { useState, useEffect } from 'react';
import { Query, User } from '../types';
import { Send, MessageCircle, CheckCircle, Clock } from 'lucide-react';

interface TeacherQueryManagerProps {
  teacher: User;
  onQueryUpdated?: () => void;
}

const TeacherQueryManager: React.FC<TeacherQueryManagerProps> = ({ teacher, onQueryUpdated }) => {
  const [queries, setQueries] = useState<Query[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuery, setSelectedQuery] = useState<Query | null>(null);
  const [replyText, setReplyText] = useState('');
  const [submittingReply, setSubmittingReply] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'All' | 'Pending' | 'In Progress' | 'Solved'>('All');

  useEffect(() => {
    loadQueries();
  }, [teacher.division]);

  const loadQueries = async () => {
    try {
      // Temporary localStorage solution
      const allQueries = JSON.parse(localStorage.getItem('queries') || '[]');
      const divisionQueries = allQueries.filter((q: any) => q.division === teacher.division);
      setQueries(divisionQueries);
    } catch (error) {
      console.error('Error loading queries:', error);
      setQueries([]);
    } finally {
      setLoading(false);
    }
  };

  const handleReplySubmit = async () => {
    if (!selectedQuery || !replyText.trim()) {
      alert('❌ Please enter a reply');
      return;
    }

    setSubmittingReply(true);

    try {
      // Temporary localStorage solution
      const allQueries = JSON.parse(localStorage.getItem('queries') || '[]');
      const updatedQueries = allQueries.map((q: any) => 
        q.id === selectedQuery.id ? { 
          ...q, 
          teacherReply: replyText.trim(),
          teacherName: teacher.name,
          replyDate: new Date().toISOString().split('T')[0],
          status: 'Replied'
        } : q
      );
      localStorage.setItem('queries', JSON.stringify(updatedQueries));
      
      setReplyText('');
      loadQueries();
      const updatedQuery = updatedQueries.find((q: any) => q.id === selectedQuery.id);
      setSelectedQuery(updatedQuery);
      if (onQueryUpdated) onQueryUpdated();
      alert('✅ Reply sent successfully to student!');
    } catch (error) {
      console.error('❌ Error sending reply:', error);
      alert('❌ Failed to send reply');
    } finally {
      setSubmittingReply(false);
    }
  };

  const handleStatusChange = async (queryId: string, newStatus: 'Pending' | 'In Progress' | 'Solved') => {
    try {
      // Temporary localStorage solution
      const allQueries = JSON.parse(localStorage.getItem('queries') || '[]');
      const updatedQueries = allQueries.map((q: any) => 
        q.id === queryId ? { ...q, status: newStatus } : q
      );
      localStorage.setItem('queries', JSON.stringify(updatedQueries));
      
      loadQueries();
      if (selectedQuery?.id === queryId) {
        const updatedQuery = updatedQueries.find((q: any) => q.id === queryId);
        setSelectedQuery(updatedQuery);
      }
    } catch (error) {
      console.error('❌ Error updating status:', error);
      alert('Failed to update status. Please try again.');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Solved':
        return 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100';
      case 'In Progress':
        return 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100';
      default:
        return 'bg-yellow-50 border-yellow-200 text-yellow-700 hover:bg-yellow-100';
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

  const filteredQueries = filterStatus === 'All' ? queries : queries.filter(q => q.status === filterStatus);

  if (loading) {
    return <div className="p-8">Loading queries...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Student Queries Management</h2>
        <p className="text-gray-600">Review and respond to queries from students in your division</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <p className="text-xs text-gray-500 font-bold uppercase">Total Queries</p>
          <h3 className="text-3xl font-bold text-gray-800">{queries.length}</h3>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <p className="text-xs text-yellow-700 font-bold uppercase">Pending</p>
          <h3 className="text-3xl font-bold text-yellow-700">{queries.filter(q => q.status === 'Pending').length}</h3>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <p className="text-xs text-blue-700 font-bold uppercase">In Progress</p>
          <h3 className="text-3xl font-bold text-blue-700">{queries.filter(q => q.status === 'In Progress').length}</h3>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <p className="text-xs text-green-700 font-bold uppercase">Solved</p>
          <h3 className="text-3xl font-bold text-green-700">{queries.filter(q => q.status === 'Solved').length}</h3>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {(['All', 'Pending', 'In Progress', 'Solved'] as const).map(status => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filterStatus === status
                ? 'bg-[#b8860b] text-white'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="grid grid-cols-3 gap-6">
        {/* Queries List */}
        <div className="col-span-2 space-y-3">
          {filteredQueries.length === 0 ? (
            <div className="bg-white p-12 rounded-xl border text-center">
              <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No queries found</p>
            </div>
          ) : (
            filteredQueries.map(query => (
              <div
                key={query.id}
                onClick={() => setSelectedQuery(query)}
                className={`p-4 rounded-lg border-2 cursor-pointer transition ${
                  selectedQuery?.id === query.id
                    ? 'border-[#b8860b] bg-yellow-50'
                    : `${getStatusColor(query.status)} border-opacity-50`
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {getStatusIcon(query.status)}
                      <h4 className="font-bold text-gray-800">{query.title}</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      <span className="font-medium">From: {query.studentName}</span> ({query.studentPrn})
                    </p>
                    <p className="text-xs text-gray-500">
                      {query.type} • Submitted: {query.submittedDate}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    query.status === 'Solved' ? 'bg-green-100 text-green-700' :
                    query.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {query.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Query Details & Reply Form */}
        <div>
          {selectedQuery ? (
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4 sticky top-8">
              {/* Student Info */}
              <div className="pb-4 border-b">
                <p className="text-xs text-gray-500 font-bold uppercase mb-2">Student</p>
                <p className="font-bold text-gray-800">{selectedQuery.studentName}</p>
                <p className="text-sm text-gray-600">{selectedQuery.studentPrn}</p>
              </div>

              {/* Query Details */}
              <div className="pb-4 border-b">
                <p className="text-xs text-gray-500 font-bold uppercase mb-2">Query</p>
                <p className="text-sm font-medium text-gray-800 mb-2">{selectedQuery.title}</p>
                <p className="text-sm text-gray-700 mb-2">{selectedQuery.description}</p>
                <div className="flex gap-2">
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded">{selectedQuery.type}</span>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded">{selectedQuery.submittedDate}</span>
                </div>
              </div>

              {/* Status Buttons */}
              <div className="pb-4 border-b">
                <p className="text-xs text-gray-500 font-bold uppercase mb-2">Status</p>
                <div className="space-y-2">
                  {(['Pending', 'In Progress', 'Solved'] as const).map(status => (
                    <button
                      key={status}
                      onClick={() => handleStatusChange(selectedQuery.id, status)}
                      className={`w-full px-3 py-2 rounded text-sm font-medium transition ${
                        selectedQuery.status === status
                          ? 'bg-[#b8860b] text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              {/* Current Reply */}
              {selectedQuery.teacherReply && (
                <div className="pb-4 border-b bg-blue-50 p-3 rounded">
                  <p className="text-xs text-blue-900 font-bold uppercase mb-2">Your Reply</p>
                  <p className="text-sm text-blue-900">{selectedQuery.teacherReply}</p>
                  <p className="text-xs text-blue-700 mt-2">{selectedQuery.replyDate}</p>
                </div>
              )}

              {/* Reply Form */}
              <div>
                <label className="text-xs text-gray-500 font-bold uppercase mb-2 block">Send Reply</label>
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type your response to the student..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b8860b] h-24 text-sm"
                />
                <button
                  onClick={handleReplySubmit}
                  disabled={submittingReply || !replyText.trim()}
                  className="w-full mt-3 bg-[#b8860b] text-white py-2 rounded-lg hover:bg-[#996608] disabled:opacity-50 font-medium flex items-center justify-center gap-2 transition"
                >
                  <Send className="w-4 h-4" />
                  {submittingReply ? 'Sending...' : 'Send Reply'}
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 p-6 text-center text-gray-500 h-96 flex items-center justify-center">
              <div>
                <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p>Select a query to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherQueryManager;
