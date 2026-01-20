
import React, { useState } from 'react';
import { Role, User } from '../types';

interface LoginProps { onLogin: (user: User) => void; }

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>(Role.STUDENT);
  const [error, setError] = useState('');
  const [showForgot, setShowForgot] = useState(false);
  const [forgotStep, setForgotStep] = useState<'email' | 'otp' | 'reset' | 'success'>('email');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const secret = process.env.JWT_SECRET;
    const token = "jwt_auth_" + btoa(username + secret).substring(0, 10);
    
    if (role === Role.STUDENT) {
      if (username === 'prerna' || username === 'shravni') {
        onLogin({
          id: username === 'prerna' ? '1' : '2',
          username,
          name: username === 'prerna' ? 'Prerna Shirsath' : 'Shravni Morkhade',
          role: Role.STUDENT,
          prn: username === 'prerna' ? 'PRN9561' : 'PRN8788',
          division: 'A',
          token
        });
      } else setError('Student profile not found.');
    } else {
      if (username === 'teacher_a' && password === 'admin') {
        onLogin({ id: 't1', username: 'teacher_a', name: 'Div A Class Teacher', role: Role.TEACHER, division: 'A', token });
      } else setError('Invalid teacher credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-[#1e3a8a] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-10 relative overflow-hidden">
        
        {showForgot && (
          <div className="absolute inset-0 bg-white z-20 p-8 flex flex-col justify-center animate-in slide-in-from-bottom-5">
             <button onClick={() => setShowForgot(false)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-800">
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
             </button>
             <h2 className="text-2xl font-black text-gray-800 mb-6">Reset Access</h2>
             <div className="space-y-4">
               {forgotStep === 'email' && (
                 <>
                   <input type="email" placeholder="Institutional Email" className="w-full p-4 border rounded-2xl outline-none focus:ring-2 focus:ring-blue-500" />
                   <button onClick={() => setForgotStep('otp')} className="w-full bg-blue-600 text-white p-4 rounded-2xl font-black">Send OTP</button>
                 </>
               )}
               {forgotStep === 'otp' && (
                 <>
                   <input type="text" placeholder="Enter 6-digit OTP" className="w-full p-4 border rounded-2xl text-center font-black tracking-widest text-xl outline-none focus:ring-2 focus:ring-blue-500" />
                   <button onClick={() => setForgotStep('reset')} className="w-full bg-blue-600 text-white p-4 rounded-2xl font-black">Verify OTP</button>
                 </>
               )}
               {forgotStep === 'reset' && (
                 <>
                   <input type="password" placeholder="New Password" className="w-full p-4 border rounded-2xl outline-none" />
                   <button onClick={() => setForgotStep('success')} className="w-full bg-blue-600 text-white p-4 rounded-2xl font-black">Update Password</button>
                 </>
               )}
               {forgotStep === 'success' && (
                 <div className="text-center">
                    <p className="text-green-600 font-bold mb-4">Password reset successful!</p>
                    <button onClick={() => {setShowForgot(false); setForgotStep('email');}} className="w-full bg-gray-800 text-white p-4 rounded-2xl font-black">Login Now</button>
                 </div>
               )}
             </div>
          </div>
        )}

        <div className="flex flex-col items-center mb-10">
          <div className="w-20 h-20 bg-blue-50 text-blue-700 rounded-3xl flex items-center justify-center mb-4 shadow-inner">
            <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20"><path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z" /></svg>
          </div>
          <h1 className="text-3xl font-black text-gray-800 tracking-tighter">PCCOE Portal</h1>
          <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest mt-2">Division Management System</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} className="w-full p-4 border-none bg-gray-50 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-medium" />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="w-full p-4 border-none bg-gray-50 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-medium" />
          
          <div className="flex items-center space-x-8 px-2">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input type="radio" checked={role === Role.STUDENT} onChange={() => setRole(Role.STUDENT)} className="w-4 h-4 text-blue-600" />
              <span className={`text-sm font-bold ${role === Role.STUDENT ? 'text-blue-600' : 'text-gray-400'}`}>Student</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input type="radio" checked={role === Role.TEACHER} onChange={() => setRole(Role.TEACHER)} className="w-4 h-4 text-blue-600" />
              <span className={`text-sm font-bold ${role === Role.TEACHER ? 'text-blue-600' : 'text-gray-400'}`}>Teacher</span>
            </label>
          </div>

          {error && <div className="text-red-500 text-xs font-black uppercase tracking-widest bg-red-50 p-3 rounded-xl">{error}</div>}

          <button type="submit" className="w-full bg-[#1e3a8a] text-white p-5 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-900 shadow-xl active:scale-95 transition-all">Sign In</button>
          <button type="button" onClick={() => setShowForgot(true)} className="w-full text-gray-400 text-xs font-bold hover:text-blue-600 transition">Forgot Password?</button>
        </form>
      </div>
    </div>
  );
};
export default Login;
