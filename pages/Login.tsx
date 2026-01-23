
import React, { useState } from 'react';
import { Role, User } from '../types';

interface LoginProps {
  onLogin: (user: User, remember?: boolean) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>(Role.STUDENT);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    if (!username || !password) {
      setError('Please enter both username and password');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:4000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
          role: role === Role.STUDENT ? 'Student' : 'Teacher'
        })
      });

      const data = await response.json();

      if (response.ok && data.user) {
        onLogin({
          id: data.user.id,
          username: data.user.username,
          name: data.user.name,
          role: data.user.role === 'Student' ? Role.STUDENT : Role.TEACHER,
          prn: data.user.prn,
          division: data.user.division
        }, rememberMe);
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Connection error. Make sure the backend server is running on port 4000.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1e3a8a] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center mb-4">
            <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20"><path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z" /></svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">EduManage Portal</h1>
          <p className="text-gray-500 text-sm mt-1">Sign in to access your dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input 
              type="text" 
              value={username} 
              onChange={e => setUsername(e.target.value)} 
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition" 
              placeholder={role === Role.STUDENT ? "Enter PRN (e.g., PRN2401001)" : "Enter username"}
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition" 
              placeholder="Enter password"
              disabled={loading}
            />
          </div>

          <div className="flex items-center space-x-6 py-2">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input 
                type="radio" 
                checked={role === Role.STUDENT} 
                onChange={() => setRole(Role.STUDENT)} 
                className="w-4 h-4 text-blue-600"
                disabled={loading}
              />
              <span className={`text-sm ${role === Role.STUDENT ? 'text-gray-900 font-semibold' : 'text-gray-500'}`}>Student</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input 
                type="radio" 
                checked={role === Role.TEACHER} 
                onChange={() => setRole(Role.TEACHER)} 
                className="w-4 h-4 text-blue-600"
                disabled={loading}
              />
              <span className={`text-sm ${role === Role.TEACHER ? 'text-gray-900 font-semibold' : 'text-gray-500'}`}>Teacher</span>
            </label>
          </div>

          {error && <p className="text-red-500 text-xs italic">{error}</p>}

          <button 
            type="submit" 
            className="w-full bg-[#1e3a8a] text-white py-3 rounded-lg font-bold hover:bg-blue-900 transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Demo Credentials:</h3>
          <div className="text-xs text-gray-600 space-y-1">
            <div><strong>Student:</strong> PRN2401001 / student123</div>
            <div><strong>Teacher:</strong> dr_ramesh_singh / teacher123</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
