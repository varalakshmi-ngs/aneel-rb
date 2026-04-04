'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { adminLogin } from '@/utils/adminApi';
import PccRegistrationForm from '@/components/PccRegistrationForm';

// Simple SVG Icons
const UserIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
  </svg>
);

const ShieldIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const LockIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
  </svg>
);

const ArrowRightIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
  </svg>
);

export default function AdminLogin() {
  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'pcc-login' | 'register'
  const [loginState, setLoginState] = useState({ username: '', password: '' });
  const [pccPasscode, setPccPasscode] = useState('');
  const [authError, setAuthError] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('adminToken')) {
      router.push('/admin/dashboard');
    }
  }, [router]);

  async function handleLogin(event) {
    event.preventDefault();
    setAuthError('');
    setStatusMessage('Signing in...');

    try {
      const data = await adminLogin(loginState.username.trim(), loginState.password);
      localStorage.setItem('adminToken', data.token);
      setStatusMessage('Signed in successfully.');
      router.push('/admin/dashboard');
    } catch (error) {
      setAuthError(error.message || 'Login failed.');
      setStatusMessage('');
    }
  }

  return (
    <div className="min-h-screen bg-blue-500 flex flex-col relative font-sans">
      
      {/* Background Gradient Header */}
      {/* <div className="absolute top-0 left-0 right-0 h-[45vh] bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 flex flex-col items-center pt-16 z-0">
        <h1 className="text-white/90 text-sm font-semibold tracking-wider font-sans mb-3 text-center px-4">
          ANDHRA EVANGELICAL LUTHERAN CHURCH (AELC) HYDERABAD
        </h1>
        <h2 className="text-white text-xl font-medium tracking-wide">
          Admin Portal
        </h2>
      </div> */}

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex items-center justify-center py-10 px-6 pt-4 pb-12 w-full max-w-6xl mx-auto">
        
        {/* Floating Card container */}
        <div className="w-full bg-white rounded-3xl shadow-[0_20px_50px_rgba(8,_112,_184,_0.07)] flex flex-col md:flex-row overflow-hidden border border-slate-100 min-h-[600px]">
          
          {/* Left Column - Image Pane */}
          <div className="w-full md:w-1/2 relative bg-slate-100 hidden md:block p-4">
            {/* The actual image div inside the padding to create an inner card effect */}
            <div 
              className="w-full h-full rounded-2xl bg-cover bg-center relative overflow-hidden shadow-inner flex items-end"
              style={{ backgroundImage: `url('/images/sign.jpg')` }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-0"></div>

              {/* Informational Card over Image */}
              <div className="relative z-10 m-6 p-6 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl w-full">
                <h3 className="text-blue-900 text-xl font-bold mb-2">
                  Welcome to Lutheran Church
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Manage your church administration, oversee member details, organize public events, and stay connected with our community.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Form Pane */}
          <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center bg-white">
            
            <div className="w-full max-w-md mx-auto">
              <h2 className="text-3xl font-bold text-blue-900 mb-2">Sign In</h2>
              <p className="text-slate-500 mb-8 text-sm">Choose your login type to continue</p>

              {/* Pill Toggle Switcher */}
              <div className="bg-slate-100 p-1.5 rounded-full flex mb-8 border border-slate-100">
                <button
                  type="button"
                  onClick={() => setActiveTab('login')}
                  className={`flex-1 py-2.5 text-sm font-semibold rounded-full flex justify-center items-center transition-all duration-300 ${
                    activeTab === 'login'
                      ? 'bg-white text-blue-900 shadow-sm shadow-slate-200 border border-slate-50/50'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <UserIcon className="w-4 h-4 mr-2" /> Admin
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('pcc-login')}
                  className={`flex-1 py-2.5 text-sm font-semibold rounded-full flex justify-center items-center transition-all duration-300 ${
                    activeTab === 'pcc-login' || activeTab === 'register'
                      ? 'bg-white text-blue-900 shadow-sm shadow-slate-200 border border-slate-50/50'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <ShieldIcon className="w-4 h-4 mr-2" /> PCC Login
                </button>
              </div>

              {/* Form Content */}
              <div className="animate-fade-in w-full">
                {activeTab === 'login' && (
                  <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Username
                      </label>
                      <div className="flex items-center bg-slate-50 rounded-xl px-4 py-3.5 border border-slate-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                        <UserIcon className="w-5 h-5 text-slate-400 shrink-0" />
                        <input
                          type="text"
                          value={loginState.username}
                          onChange={(e) => setLoginState({ ...loginState, username: e.target.value })}
                          className="w-full bg-transparent outline-none text-slate-700 text-sm ml-3 font-medium placeholder:font-normal placeholder:text-slate-400"
                          placeholder="Enter admin username"
                          required
                        />
                      </div>
                      <p className="text-[11px] text-slate-400 mt-2 font-medium">Use your assigned admin username to sign in</p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Password
                      </label>
                      <div className="flex items-center bg-slate-50 rounded-xl px-4 py-3.5 border border-slate-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                        <LockIcon className="w-5 h-5 text-slate-400 shrink-0" />
                        <input
                          type="password"
                          value={loginState.password}
                          onChange={(e) => setLoginState({ ...loginState, password: e.target.value })}
                          className="w-full bg-transparent outline-none text-slate-700 text-sm ml-3 font-medium placeholder:font-normal placeholder:text-slate-400"
                          placeholder="Enter your password"
                          required
                        />
                      </div>
                    </div>

                    {authError && (
                      <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600 text-center font-medium animate-pulse">
                        {authError}
                      </div>
                    )}
                    {statusMessage && !authError && (
                      <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl text-sm text-blue-700 text-center font-medium">
                        {statusMessage}
                      </div>
                    )}

                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3.5 rounded-xl flex items-center justify-center transition-all shadow-md shadow-blue-600/20 active:scale-[0.98] mt-2 group"
                    >
                      Sign In as Admin
                      <ArrowRightIcon className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </button>

                    <div className="pt-8 text-center border-t border-slate-100 mt-8">
                      <p className="text-slate-500 text-sm mb-2">Need to return to main site?</p>
                      <a href="/" className="text-blue-600 hover:text-blue-800 text-sm font-semibold hover:underline">
                        Go to Home
                      </a>
                    </div>
                  </form>
                )}

                {activeTab === 'pcc-login' && (
                  <form onSubmit={(e) => { 
                    e.preventDefault(); 
                    if(pccPasscode.trim()){
                      router.push(`/member-profile?passcode=${encodeURIComponent(pccPasscode.trim())}`);
                    }
                  }} className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Member Passcode
                      </label>
                      <div className="flex items-center bg-slate-50 rounded-xl px-4 py-3.5 border border-slate-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                        <LockIcon className="w-5 h-5 text-slate-400 shrink-0" />
                        <input
                          type="password"
                          value={pccPasscode}
                          onChange={(e) => setPccPasscode(e.target.value)}
                          className="w-full bg-transparent outline-none text-slate-700 text-sm ml-3 font-medium placeholder:font-normal placeholder:text-slate-400"
                          placeholder="Enter your assigned passcode"
                          required
                        />
                      </div>
                    </div>

                    {statusMessage && (
                      <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl text-sm text-blue-700 text-center font-medium">
                        {statusMessage}
                      </div>
                    )}

                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3.5 rounded-xl flex items-center justify-center transition-all shadow-md shadow-blue-600/20 active:scale-[0.98] mt-2 group"
                    >
                      Sign In as PCC Member
                      <ArrowRightIcon className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </button>

                    <div className="pt-8 text-center border-t border-slate-100 mt-8">
                      <p className="text-slate-500 text-sm mb-2">If not have register as a PCC Member</p>
                      <button 
                        type="button"
                        onClick={() => setActiveTab('register')}
                        className="text-blue-600 hover:text-blue-800 text-sm font-semibold hover:underline"
                      >
                        Register as PCC
                      </button>
                    </div>
                  </form>
                )}

                {activeTab === 'register' && (
                  <div className="w-full">
                     
                     <div className="w-full border border-slate-100 bg-slate-50 rounded-2xl p-1 overflow-y-auto max-h-[500px]">
                        <PccRegistrationForm onReturn={() => setActiveTab('pcc-login')} />
                     </div>
                  </div>
                )}

              </div>
            </div>

          </div>
        </div>
        
      </div>
    </div>
  );
}

