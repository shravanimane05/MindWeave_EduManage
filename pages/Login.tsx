
import React, { useState, useEffect } from 'react';
import { Role, User } from '../types';
import { dbService } from '../services/dbService';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>(Role.STUDENT);
  const [error, setError] = useState('');
  const [students, setStudents] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  
  // Forgot Password States
  const [showForgot, setShowForgot] = useState(false);
  const [forgotStep, setForgotStep] = useState<'email' | 'otp' | 'reset' | 'success'>('email');
  const [forgotEmail, setForgotEmail] = useState('');
  const [otp, setOtp] = useState('');

  useEffect(() => {
    // Load students and teachers from database
    setStudents(dbService.getAllStudents());
    setTeachers(dbService.getAllTeachers());
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }

    if (role === Role.STUDENT) {
      // Check if username is a PRN
      const student = students.find(s => 
        s.prn.toLowerCase() === username.toLowerCase() || 
        s.name.toLowerCase().includes(username.toLowerCase())
      );
      
      if (student && password === 'student123') {
        onLogin({
          id: student.id,
          username: student.prn,
          name: student.name,
          role: Role.STUDENT,
          prn: student.prn,
          division: student.division
        });
      } else {
        setError('Invalid student credentials. Use PRN or Name with password "student123"');
      }
    } else {
      // Teacher login
      const teacher = teachers.find(t => t.username === username);
      
      if (teacher && password === 'teacher123') {
        onLogin({
          id: teacher.id,
          username: teacher.username,
          name: teacher.name,
          role: Role.TEACHER,
          division: teacher.division
        });
      } else {
        setError('Invalid teacher credentials. Password: "teacher123"');
      }
    }
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (forgotStep === 'email') setForgotStep('otp');
    else if (forgotStep === 'otp') setForgotStep('reset');
    else if (forgotStep === 'reset') setForgotStep('success');
  };

  return (
    <div className="min-h-screen bg-[#1e3a8a] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden p-8 relative">
        
        {/* Forgot Password Modal Overlay */}
        {showForgot && (
          <div className="absolute inset-0 bg-white z-20 p-8 flex flex-col justify-center animate-in fade-in slide-in-from-bottom-4">
             <button onClick={() => {setShowForgot(false); setForgotStep('email');}} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
             </button>
             
             <h2 className="text-xl font-bold text-gray-800 mb-2">
               {forgotStep === 'email' && 'Forgot Password'}
               {forgotStep === 'otp' && 'Verify OTP'}
               {forgotStep === 'reset' && 'Set New Password'}
               {forgotStep === 'success' && 'Reset Complete!'}
             </h2>
             <p className="text-sm text-gray-500 mb-6">
               {forgotStep === 'email' && 'Enter your registered email to receive an OTP.'}
               {forgotStep === 'otp' && `We sent a code to ${forgotEmail}.`}
               {forgotStep === 'reset' && 'Choose a strong new password.'}
             </p>

             <form onSubmit={handleForgotSubmit} className="space-y-4">
               {forgotStep === 'email' && (
                 <input type="email" required value={forgotEmail} onChange={e => setForgotEmail(e.target.value)} className="w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" placeholder="yourname@gmail.com" />
               )}
               {forgotStep === 'otp' && (
                 <input type="text" required maxLength={6} value={otp} onChange={e => setOtp(e.target.value)} className="w-full px-4 py-3 border rounded-lg outline-none text-center tracking-[1em] font-bold" placeholder="000000" />
               )}
               {forgotStep === 'reset' && (
                 <>
                   <input type="password" required className="w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" placeholder="New Password" />
                   <input type="password" required className="w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" placeholder="Confirm Password" />
                 </>
               )}
               
               {forgotStep !== 'success' ? (
                 <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition">
                   {forgotStep === 'email' && 'Send OTP'}
                   {forgotStep === 'otp' && 'Verify & Proceed'}
                   {forgotStep === 'reset' && 'Update Password'}
                 </button>
               ) : (
                 <div className="text-center space-y-4">
                   <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                     <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                   </div>
                   <p className="text-sm font-medium text-gray-800">Your password has been reset successfully.</p>
                   <button type="button" onClick={() => {setShowForgot(false); setForgotStep('email');}} className="w-full bg-[#1e3a8a] text-white py-3 rounded-lg font-bold">Back to Login</button>
                 </div>
               )}
             </form>
          </div>
        )}

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
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition" placeholder="Enter username" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition" placeholder="Enter password" />
          </div>

          <div className="flex justify-between items-center text-sm">
             <button type="button" onClick={() => setShowForgot(true)} className="text-blue-600 hover:underline">Forgot Password?</button>
          </div>

          <div className="flex items-center space-x-6 py-2">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input type="radio" checked={role === Role.STUDENT} onChange={() => setRole(Role.STUDENT)} className="w-4 h-4 text-blue-600" />
              <span className={`text-sm ${role === Role.STUDENT ? 'text-gray-900 font-semibold' : 'text-gray-500'}`}>Student</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input type="radio" checked={role === Role.TEACHER} onChange={() => setRole(Role.TEACHER)} className="w-4 h-4 text-blue-600" />
              <span className={`text-sm ${role === Role.TEACHER ? 'text-gray-900 font-semibold' : 'text-gray-500'}`}>Teacher</span>
            </label>
          </div>

          {error && <p className="text-red-500 text-xs italic">{error}</p>}

          <button type="submit" className="w-full bg-[#1e3a8a] text-white py-3 rounded-lg font-bold hover:bg-blue-900 transition-all shadow-lg active:scale-95">Sign In</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
