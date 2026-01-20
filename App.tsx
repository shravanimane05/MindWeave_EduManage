
import React, { useState, useEffect } from 'react';
import { Role, User } from './types';
import Login from './pages/Login';
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
import SearchStudent from './pages/SearchStudent';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const handleLogin = (u: User) => {
    setUser(u);
    localStorage.setItem('user', JSON.stringify(u));
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
        case 'query': return <QueryForm user={user} />;
        case 'feedback': return <TeacherFeedback />;
        default: return <StudentDashboard user={user} />;
      }
    } else {
      switch (activeTab) {
        case 'dashboard': return <TeacherDashboard user={user} />;
        case 'risk': return <RiskPredictor />;
        case 'search': return <SearchStudent division={user.division!} />;
        case 'upload': return <UploadPage user={user} onRefresh={() => setActiveTab('dashboard')} />;
        case 'query': return <StudentQueries division={user.division!} />;
        default: return <TeacherDashboard user={user} />;
      }
    }
  };

  return (
    <div className="flex bg-[#f8fafc] min-h-screen">
      <Sidebar
        role={user.role}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
      />
      <main className="flex-1 ml-64 min-h-screen transition-all">
        {renderContent()}
      </main>
      <Chatbot />
    </div>
  );
};

export default App;
