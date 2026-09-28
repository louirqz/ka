import React, { useState } from 'react';
import { Lock, KeyRound, ShieldAlert, CheckCircle2, ArrowRight, X } from 'lucide-react';
import { AuthService } from '../../services/authService';

interface AdminPasscodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminPasscodeModal: React.FC<AdminPasscodeModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!passcode.trim()) {
      setError('กรุณากรอกรหัสผ่านระบบหลังบ้าน');
      return;
    }

    setIsVerifying(true);
    setTimeout(() => {
      const res = AuthService.verifyAdminPasscode(passcode);
      setIsVerifying(false);
      if (res.success) {
        setSuccess(res.message);
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 600);
      } else {
        setError(res.message);
      }
    }, 400);
  };

  const handleUseDemoKey = () => {
    setPasscode('admin1234');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-pink-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3.5 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-rose-500/25">
            <KeyRound className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold">เข้าสู่ระบบหลังบ้าน (Admin)</h3>
            <p className="text-xs text-slate-400">ใส่รหัสผ่านความปลอดภัยเพื่อจัดการระบบ</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center gap-2.5 text-xs text-rose-300">
            <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-4 p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2.5 text-xs text-emerald-300">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
              รหัสผ่านระบบหลังบ้าน (Admin Passcode)
            </label>
            <div className="relative">
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="ระบุรหัสผ่าน เช่น admin1234"
                className="w-full px-4 py-3.5 rounded-2xl bg-slate-800/90 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500 text-sm tracking-wider"
                autoFocus
              />
              <Lock className="w-4 h-4 text-slate-400 absolute right-4 top-4" />
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-[11px] text-slate-400">รหัสแอดมินเริ่มต้น:</span>
              <button
                type="button"
                onClick={handleUseDemoKey}
                className="text-[11px] text-pink-400 hover:text-pink-300 font-medium underline underline-offset-2"
              >
                ใส่รหัสอัตโนมัติ (admin1234)
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isVerifying}
              className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-indigo-600 hover:opacity-95 text-white font-semibold text-sm shadow-lg shadow-pink-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isVerifying ? (
                <span>กำลังตรวจสอบความปลอดภัย...</span>
              ) : (
                <>
                  <span>ยืนยันรหัสเข้าแอดมิน</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        <div className="mt-6 pt-5 border-t border-slate-800 text-center">
          <p className="text-xs text-slate-400">
            เฉพาะผู้ดูแลระบบ StyleMatch AI เท่านั้น ผู้ใช้ทั่วไปไม่มีสิทธิ์เข้าถึงหน้านี้
          </p>
        </div>
      </div>
    </div>
  );
};
