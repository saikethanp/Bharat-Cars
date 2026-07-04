import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Shield, KeyRound, AlertCircle } from 'lucide-react';
import { getSupabase } from '../lib/supabase';

interface AdminGuardProps {
  session: any;
  userRole: string;
  isRoleLoading: boolean;
  children: React.ReactNode;
}

export default function AdminGuard({ session, userRole, isRoleLoading, children }: AdminGuardProps) {
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [loginError, setLoginError] = useState('');

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = getSupabase();
    if (!supabase) {
      setLoginError('Database connection error');
      return;
    }
    const { error } = await supabase.auth.signInWithPassword({
      email: loginForm.email,
      password: loginForm.password
    });
    if (error) {
      setLoginError(error.message);
    } else {
      setLoginError('');
      // App.tsx's onAuthStateChange will trigger, update session and fetch userRole.
    }
  };

  const handleSignOut = async () => {
    const supabase = getSupabase();
    if (supabase) {
      await supabase.auth.signOut();
    }
  };

  if (!session) {
    return (
      <div className="bg-[#0D0D0D] text-white min-h-[90vh] flex items-center justify-center py-12 px-4 relative overflow-hidden" id="admin-login-view">
        {/* Ambient Backdrops */}
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-red-500/5 blur-[150px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-red-600/5 blur-[150px] rounded-full pointer-events-none"></div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-md w-full bg-[#111111]/90 border border-[#2A2A2A] backdrop-blur-xl rounded-xl p-8 space-y-6 shadow-2xl relative z-10" 
          id="admin-login-card"
        >
          <div className="text-center space-y-3">
            <div className="mx-auto w-14 h-14 bg-red-500/5 border border-red-500/20 rounded-xl flex items-center justify-center text-red-500 shadow-lg shadow-red-500/5">
              <Shield className="h-6 w-6 animate-pulse" />
            </div>
            <div className="space-y-1">
              <h2 className="text-[42px] font-serif font-bold uppercase tracking-[0.15em] text-white">Admin Login</h2>
              <p className="text-[13px] font-sans font-medium tracking-[0.15em] text-[#8A8A8A] tracking-wider">Please sign in to continue</p>
            </div>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4" id="login-form">
            <div className="space-y-2">
              <label className="text-[13px] font-sans font-medium tracking-[0.15em] text-[#BDBDBD] uppercase block">Email Address</label>
              <input
                type="email"
                required
                value={loginForm.email}
                onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                className="w-full bg-[#111111] border border-[#2A2A2A] rounded py-3 px-4 text-[16px] text-white placeholder-gray-600 focus:outline-none focus:border-red-500/50 transition-all font-sans"
                id="login-email"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[13px] font-sans font-medium tracking-[0.15em] text-[#BDBDBD] uppercase block">Password</label>
              <input
                type="password"
                required
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                className="w-full bg-[#111111] border border-[#2A2A2A] rounded py-3 px-4 text-[16px] text-white placeholder-gray-600 focus:outline-none focus:border-red-500/50 transition-all font-sans"
                id="login-password"
              />
            </div>

            {loginError && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-[14px] text-rose-500 font-sans text-center bg-rose-500/10 border border-rose-500/20 py-2.5 rounded flex items-center justify-center space-x-1.5"
              >
                <AlertCircle className="h-4 w-4" />
                <span>{loginError}</span>
              </motion.div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 bg-black border border-red-500 text-white hover:border-red-400 hover:shadow-[0_0_15px_rgba(200,16,46,0.5)] font-sans font-semibold text-[16px] rounded tracking-[0.15em] uppercase transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer"
              id="login-authenticate-btn"
            >
              <KeyRound className="h-4 w-4" />
              <span>Sign In</span>
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  if (isRoleLoading) {
    return (
      <div className="bg-[#0D0D0D] text-white min-h-[90vh] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[13px] font-sans font-medium tracking-[0.15em] text-[#8A8A8A] uppercase">Verifying Access...</p>
        </div>
      </div>
    );
  }

  if (userRole !== 'admin') {
    return (
      <div className="bg-[#0D0D0D] text-white min-h-[90vh] flex items-center justify-center py-12 px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-[#111111]/90 border border-rose-500/50 rounded-xl p-8 text-center space-y-6"
        >
          <div className="mx-auto w-16 h-16 bg-rose-500/10 rounded-full flex items-center justify-center text-rose-500 mb-4">
            <Shield className="h-8 w-8" />
          </div>
          <h2 className="text-[32px] font-serif font-bold text-white uppercase tracking-wider">Access Denied</h2>
          <p className="text-[14px] font-sans font-medium text-[#8A8A8A] leading-relaxed">
            You do not have the required permissions to view this page. This area is restricted to administrators only.
          </p>
          <div className="pt-4 border-t border-[#2A2A2A]">
            <button
              onClick={handleSignOut}
              className="px-6 py-3 bg-black border border-rose-500 text-white hover:bg-rose-500/10 font-sans font-semibold text-[14px] rounded tracking-[0.15em] uppercase transition-all cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return <>{children}</>;
}
