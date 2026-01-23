
import React, { useState, useEffect } from 'react';
import { Role, User } from './types';
import Login from './pages/Login';
import { dbService } from './services/dbService';
import Sidebar from './components/Sidebar';
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import UploadPage from './pages/UploadPage';
import StudentQueries from './pages/StudentQueries';
import Chatbot from './components/Chatbot';
import Analytics from './pages/Analytics';
import QueryForm from './pages/QueryForm';
import TeacherFeedback from './pages/TeacherFeedback';
import RiskPredictor from './pages/RiskPredictor';
import StudentRiskPredictor from './pages/StudentRiskPredictor';
import HypotheticalRiskPredictor from './pages/HypotheticalRiskPredictor';
import SearchStudent from './pages/SearchStudent';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Don't auto-login, always show login page first
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      localStorage.removeItem('user'); // Clear any saved login
    }
  }, []);

  const handleLogin = (u: User, remember: boolean = true) => {
    setUser(u);
    if (remember) localStorage.setItem('user', JSON.stringify(u));
    else localStorage.removeItem('user');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    setActiveTab('dashboard');
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  const renderContent = () => {
    if (user.role === Role.STUDENT) {
      switch (activeTab) {
        case 'dashboard': return <StudentDashboard user={user} />;
        case 'analytics': return <Analytics studentPrn={user.prn!} />;
        case 'hypothetical': return <StudentRiskPredictor user={user} />;
        case 'query': return <QueryForm user={user} />;
        default: return <StudentDashboard user={user} />;
      }
    } else {
      switch (activeTab) {
        case 'dashboard': return <TeacherDashboard user={user} />;
        case 'search': return <SearchStudent division={user.division!} />;
        case 'upload': return <UploadPage user={user} onRefresh={() => setActiveTab('dashboard')} />;
        default: return <TeacherDashboard user={user} />;
      }
    }
  };

  return (
    <div className="flex bg-[#f8fafc] min-h-screen">
      {/* Profile Icon */}
      <div className="fixed top-4 left-4 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition shadow-lg"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      
      {/* Sidebar */}
      {sidebarOpen && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setSidebarOpen(false)}></div>
          <Sidebar
            role={user.role}
            activeTab={activeTab}
            setActiveTab={(tab) => {
              setActiveTab(tab);
              setSidebarOpen(false);
            }}
            onLogout={() => {
              handleLogout();
              setSidebarOpen(false);
            }}
          />
        </>
      )}
      
      <main className="flex-1 min-h-screen transition-all">
        {renderContent()}
      </main>
      <Chatbot />
    </div>
  );
};

export default App;
