"use client";

import { useState, useEffect } from 'react';
import { X, RefreshCw, Loader2, User, Lock, AlertCircle, Eye, EyeOff } from 'lucide-react';

export default function AuthModals({ isOpen, onClose, initialView = 'login', onAuthSuccess }) {
  const [view, setView] = useState(initialView); // 'login' or 'signup'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [captchaText, setCaptchaText] = useState('');
  const [expectedCaptcha, setExpectedCaptcha] = useState('');
  const [captchaGrid, setCaptchaGrid] = useState([]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Generate simple CAPTCHA code
  const generateCaptcha = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // exclude confusing chars like 0, O, 1, I
    let code = '';
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setExpectedCaptcha(code);
    setCaptchaText('');

    // Generate random background dots/lines simulation
    const dots = [];
    for (let i = 0; i < 15; i++) {
      dots.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1
      });
    }
    setCaptchaGrid(dots);
  };

  useEffect(() => {
    if (isOpen) {
      setView(initialView);
      setError('');
      setUsername('');
      setPassword('');
      setConfirmPassword('');
      generateCaptcha();
    }
  }, [isOpen, initialView]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: view,
          username,
          password,
          confirmPassword,
          captchaText,
          expectedCaptcha
        })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        onClose();
        if (onAuthSuccess) {
          onAuthSuccess(data.user);
        }
      } else {
        setError(data.error || 'Authentication failed.');
        if (view === 'signup') {
          generateCaptcha();
        }
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-white dark:bg-gray-950 border border-gray-150 dark:border-gray-850 rounded-3xl shadow-2xl overflow-hidden p-8 animate-zoom-in">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-950 dark:hover:text-white rounded-full hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-mono font-bold tracking-tight text-gray-900 dark:text-white mb-2">
            {view === 'login' ? 'Welcome back' : 'Create an account'}
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
            {view === 'login'
              ? 'Enter your username and password to access your account'
              : 'Enter your details to create a new account'}
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/5 border border-red-500/20 text-red-650 dark:text-red-400 text-xs font-semibold rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Username Field */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
              Username
            </label>
            <div className="relative flex items-center">
              <input
                type="text"
                required
                placeholder={view === 'login' ? 'Username or binx_xxxxx' : 'Your username'}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs bg-gray-50 dark:bg-gray-950/40 border border-gray-250 dark:border-gray-850 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium transition-all"
              />
              <User className="w-4 h-4 text-gray-400 absolute left-3.5" />
            </div>
          </div>

          {/* Password Field */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
              Password
            </label>
            <div className="relative flex items-center">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder={view === 'login' ? 'Your password' : 'Create password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 text-xs bg-gray-50 dark:bg-gray-950/40 border border-gray-250 dark:border-gray-850 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium transition-all"
              />
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Signup Only Fields */}
          {view === 'signup' && (
            <>
              {/* Confirm Password */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                  Confirm Password
                </label>
                <div className="relative flex items-center">
                  <input
                    type="password"
                    required
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-xs bg-gray-50 dark:bg-gray-950/40 border border-gray-250 dark:border-gray-850 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium transition-all"
                  />
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5" />
                </div>
              </div>

              {/* CAPTCHA Verification Area */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                  Verify you're human
                </label>
                <div className="flex items-center gap-3">
                  {/* CAPTCHA Grid Display */}
                  <div className="relative w-1/2 h-12 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden flex items-center justify-center select-none font-mono font-black text-lg tracking-[0.4em] text-gray-850 dark:text-gray-200">
                    {/* Background Grid Pattern */}
                    <div className="absolute inset-0 grid grid-cols-6 grid-rows-3 opacity-20 pointer-events-none">
                      {Array.from({ length: 18 }).map((_, idx) => (
                        <div key={idx} className="border-[0.5px] border-gray-500" />
                      ))}
                    </div>
                    {/* CAPTCHA Noise Dots */}
                    {captchaGrid.map((dot, idx) => (
                      <div
                        key={idx}
                        className="absolute bg-gray-450 dark:bg-gray-650 rounded-full opacity-35"
                        style={{
                          left: `${dot.x}%`,
                          top: `${dot.y}%`,
                          width: `${dot.size}px`,
                          height: `${dot.size}px`
                        }}
                      />
                    ))}
                    {/* Expected Text with slight distortion */}
                    <span className="relative transform rotate-1 scale-105 font-extrabold select-none">
                      {expectedCaptcha}
                    </span>
                    {/* Reload Button */}
                    <button
                      type="button"
                      onClick={generateCaptcha}
                      className="absolute right-2 p-1 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      title="Reload Captcha"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <input
                    type="text"
                    required
                    placeholder="ENTER CODE"
                    value={captchaText}
                    onChange={(e) => setCaptchaText(e.target.value)}
                    className="w-1/2 px-4 py-3 text-xs bg-gray-50 dark:bg-gray-950/40 border border-gray-250 dark:border-gray-850 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-bold tracking-widest text-center uppercase transition-all"
                  />
                </div>
              </div>
            </>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gray-900 dark:bg-gray-100 hover:bg-gray-950 dark:hover:bg-white text-white dark:text-gray-950 text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-[0.98] disabled:opacity-75 disabled:scale-100 cursor-pointer flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {view === 'login' ? 'Logging In...' : 'Registering...'}
              </>
            ) : (
              view === 'login' ? 'Login' : 'Sign Up'
            )}
          </button>
        </form>

        {/* View Toggle */}
        <div className="mt-6 text-center text-xs font-semibold text-gray-500 dark:text-gray-400">
          {view === 'login' ? (
            <>
              Don't have an account?{' '}
              <button
                onClick={() => setView('signup')}
                className="text-blue-600 dark:text-blue-400 hover:underline focus:outline-none"
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button
                onClick={() => setView('login')}
                className="text-blue-600 dark:text-blue-400 hover:underline focus:outline-none"
              >
                Login
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
