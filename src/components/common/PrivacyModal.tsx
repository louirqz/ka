import React from 'react';
import { ShieldCheck, EyeOff, Trash2, X, Lock } from 'lucide-react';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-pink-100 text-pink-600 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-800">นโยบายความเป็นส่วนตัวของรูปภาพ</h3>
            <p className="text-xs text-slate-500">StyleMatch AI Data & Privacy Protection</p>
          </div>
        </div>

        <div className="space-y-3.5 mb-6 text-sm text-slate-600">
          <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <EyeOff className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-slate-800">ความเป็นส่วนตัว 100%</p>
              <p className="text-xs text-slate-500 mt-0.5">
                รูปถ่ายของคุณจะถูกใช้เพื่อการวิเคราะห์สีผิวและรูปหน้าเฉพาะบุคคลเท่านั้น จะไม่มีการแชร์หรือแสดงรูปของคุณให้ผู้ใช้อื่นเห็นเด็ดขาด
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <Lock className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-slate-800">ประมวลผลอย่างปลอดภัย</p>
              <p className="text-xs text-slate-500 mt-0.5">
                ข้อมูลรูปภาพถูกเข้ารหัสเพื่อความปลอดภัย และไม่ถูกนำไปเผยแพร่ในเชิงพาณิชย์
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <Trash2 className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-slate-800">ควบคุมได้เต็มที่ ลบรูปได้ตลอดเวลา</p>
              <p className="text-xs text-slate-500 mt-0.5">
                คุณสามารถกดปุ่มลบรูปภาพ หรือลบประวัติการวิเคราะห์ได้จากหน้าโปรไฟล์ของคุณทุกเมื่อ
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-5 py-3 rounded-2xl border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition-colors text-sm text-center"
          >
            ยกเลิก
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="flex-1 px-5 py-3 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-indigo-600 text-white font-semibold hover:opacity-95 shadow-lg shadow-pink-500/25 transition-all text-sm text-center"
          >
            รับทราบและดำเนินการต่อ ✨
          </button>
        </div>
      </div>
    </div>
  );
};
