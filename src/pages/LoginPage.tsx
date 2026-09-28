import React, { useState } from 'react';
import { Sparkles, Lock, Mail, ArrowRight, ShieldCheck, KeyRound, AlertCircle, CheckCircle2 } from 'lucide-react';
import { AuthService } from '../services/authService';
import { User } from '../types';

interface LoginPageProps {
  onNavigate: (path: string) => void;
  onLoginSuccess: (user: User) => void;
  onOpenAdminPasscode: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onNavigate,
  onLoginSuccess,
  onOpenAdminPasscode
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [forgotModalOpen, setForgotModalOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!email || !password) {
      setError('กรุณากรอกอีเมลและรหัสผ่าน');
      return;
    }

    const res = AuthService.login(email, password, rememberMe);
    if (res.success && res.user) {
      setSuccess(res.message);
      setTimeout(() => {
        onLoginSuccess(res.user!);
        if (res.user?.role === 'admin') {
          onNavigate('/admin/dashboard');
        } else {
          onNavigate('/home');
        }
      }, 500);
    } else {
      setError(res.message);
    }
  };

  const handleQuickDemoUser = () => {
    setEmail('nichanan.style@example.com');
    setPassword('password123');
  };

  const handleQuickDemoAdmin = () => {
    setEmail('admin@stylematch.ai');
    setPassword('admin1234');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 sm:py-16 animate-fade-in">
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-500 via-rose-500 to-indigo-600 flex items-center justify-center text-white mx-auto shadow-md shadow-pink-500/20">
            <Sparkles className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-slate-900">เข้าสู่ระบบ</h1>
          <p className="text-xs text-slate-500">
            ยินดีต้อนรับสู่ StyleMatch AI Personal Assistant
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">อีเมล (Email)</label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 text-xs focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500"
                required
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">รหัสผ่าน (Password)</label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 text-xs focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500"
                required
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 cursor-pointer text-slate-600">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-slate-300 text-pink-600 focus:ring-pink-500"
              />
              <span>จดจำการเข้าสู่ระบบ (Remember Me)</span>
            </label>

            <button
              type="button"
              onClick={() => setForgotModalOpen(true)}
              className="text-pink-600 font-semibold hover:underline"
            >
              ลืมรหัสผ่าน?
            </button>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-indigo-600 text-white font-bold text-xs shadow-lg shadow-pink-500/25 hover:opacity-95 transition-all flex items-center justify-center gap-1.5"
          >
            <span>เข้าสู่ระบบ</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Demo Credentials */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
          <p className="text-[11px] font-bold text-slate-600 text-center">
            ⚡ บัญชีทดสอบระบบ (Demo Accounts):
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleQuickDemoUser}
              className="py-1.5 px-2 rounded-xl bg-white border border-slate-200 hover:border-pink-300 text-[11px] text-slate-700 font-medium transition-colors"
            >
              👤 สมาชิกทั่วไป (User)
            </button>
            <button
              type="button"
              onClick={handleQuickDemoAdmin}
              className="py-1.5 px-2 rounded-xl bg-white border border-slate-200 hover:border-indigo-300 text-[11px] text-indigo-700 font-medium transition-colors"
            >
              🛡️ ผู้ดูแลระบบ (Admin)
            </button>
          </div>
        </div>

        {/* Admin Passcode Direct Unlock Prompt */}
        <div className="pt-2 border-t border-slate-100 text-center space-y-2">
          <button
            type="button"
            onClick={onOpenAdminPasscode}
            className="inline-flex items-center gap-1.5 text-xs text-indigo-700 font-semibold hover:underline"
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>มีรหัสผ่านระบบหลังบ้าน? ใส่รหัสแอดมินที่นี่</span>
          </button>

          <p className="text-xs text-slate-500">
            ยังไม่มีบัญชีผู้ใช้?{' '}
            <button
              onClick={() => onNavigate('/register')}
              className="text-pink-600 font-bold hover:underline"
            >
              ลงทะเบียนใหม่ฟรี ✨
            </button>
          </p>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {forgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-xl border border-slate-100 text-center space-y-4">
            <h3 className="text-lg font-bold text-slate-900">รีเซ็ตรหัสผ่าน</h3>
            <p className="text-xs text-slate-600">
              สำหรับระบบตัวอย่าง สามารถเข้าสู่ระบบด้วยบัญชีทดสอบ หรือใช้อีเมลที่คุณได้ลงทะเบียนไว้ได้ทันที
            </p>
            <button
              onClick={() => setForgotModalOpen(false)}
              className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs"
            >
              เข้าใจแล้ว
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
