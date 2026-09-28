import React, { useState } from 'react';
import { KeyRound, Shield, FileText, CheckCircle2, AlertTriangle, RefreshCw, Lock } from 'lucide-react';
import { StorageService } from '../../services/storage';

export const AdminSettingsLogs: React.FC = () => {
  const [currentPasscode, setCurrentPasscode] = useState(StorageService.getAdminPasscode());
  const [newPasscode, setNewPasscode] = useState('');
  const [confirmPasscode, setConfirmPasscode] = useState('');
  const [passcodeSuccess, setPasscodeSuccess] = useState<string | null>(null);
  const [passcodeError, setPasscodeError] = useState<string | null>(null);

  const [logs, setLogs] = useState(StorageService.getAdminLogs());

  const handleUpdatePasscode = (e: React.FormEvent) => {
    e.preventDefault();
    setPasscodeSuccess(null);
    setPasscodeError(null);

    if (!newPasscode.trim()) {
      setPasscodeError('กรุณาระบุรหัสผ่านใหม่');
      return;
    }

    if (newPasscode.length < 6) {
      setPasscodeError('รหัสผ่านแอดมินต้องมีความยาวอย่างน้อย 6 ตัวอักษร');
      return;
    }

    if (newPasscode !== confirmPasscode) {
      setPasscodeError('รหัสผ่านใหม่และการยืนยันรหัสผ่านไม่ตรงกัน');
      return;
    }

    StorageService.setAdminPasscode(newPasscode.trim());
    setCurrentPasscode(newPasscode.trim());
    setNewPasscode('');
    setConfirmPasscode('');
    setPasscodeSuccess('อัปเดตรหัสผ่านระบบหลังบ้าน (Admin Passcode) สำเร็จแล้ว 🛡️');
    setLogs(StorageService.getAdminLogs());
  };

  const handleResetDemoData = () => {
    if (confirm('คุณต้องการรีเซ็ตข้อมูลตัวอย่างทั้งหมดกลับเป็นค่าเริ่มต้นหรือไม่? ข้อมูลที่เพิ่มใหม่จะถูกรีเซ็ต')) {
      localStorage.clear();
      alert('รีเซ็ตข้อมูลระบบกลับเป็นค่าเริ่มต้นเรียบร้อยแล้ว กำลังรีโหลด...');
      window.location.reload();
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-black text-white">ตั้งค่าระบบ & บันทึกประวัติ (Settings & Audit Logs)</h1>
        <p className="text-xs text-slate-400 mt-1">
          จัดการรหัสผ่านความปลอดภัยระบบหลังบ้าน และตรวจสอบบันทึกกิจกรรมของผู้ดูแลระบบ
        </p>
      </div>

      {/* Admin Passcode Update Card */}
      <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-4 max-w-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">รหัสผ่านระบบหลังบ้าน (Admin Passcode)</h2>
            <p className="text-[11px] text-slate-400">ใช้สำหรับปลดล็อกสิทธิ์ผู้ดูแลระบบทันที</p>
          </div>
        </div>

        {passcodeSuccess && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{passcodeSuccess}</span>
          </div>
        )}

        {passcodeError && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{passcodeError}</span>
          </div>
        )}

        <form onSubmit={handleUpdatePasscode} className="space-y-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center">
            <span className="text-slate-400">รหัสแอดมินปัจจุบัน:</span>
            <span className="font-mono text-pink-400 font-bold">{currentPasscode}</span>
          </div>

          <div>
            <label className="block text-slate-400 mb-1">รหัสผ่านใหม่ (อย่างน้อย 6 ตัวอักษร)</label>
            <input
              type="password"
              value={newPasscode}
              onChange={(e) => setNewPasscode(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500"
              required
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1">ยืนยันรหัสผ่านใหม่</label>
            <input
              type="password"
              value={confirmPasscode}
              onChange={(e) => setConfirmPasscode(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-colors shadow-md"
          >
            บันทึกรหัสแอดมินใหม่
          </button>
        </form>
      </div>

      {/* Audit Logs Table */}
      <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <FileText className="w-5 h-5 text-pink-400" />
            <h2 className="text-sm font-bold text-white">บันทึกกิจกรรมระบบ (Audit Logs)</h2>
          </div>
          <span className="text-xs text-slate-500 font-mono">{logs.length} รายการ</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/60 text-slate-400 uppercase text-[10px]">
                <th className="py-2.5 px-3">เวลา</th>
                <th className="py-2.5 px-3">ผู้ดำเนินการ</th>
                <th className="py-2.5 px-3">การกระทำ (Action)</th>
                <th className="py-2.5 px-3">เป้าหมาย</th>
                <th className="py-2.5 px-3">รายละเอียด</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-900/40">
                  <td className="py-2.5 px-3 font-mono text-[11px] text-slate-400">{log.timestamp}</td>
                  <td className="py-2.5 px-3 font-semibold text-white">{log.adminName}</td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-pink-300">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-300">{log.target}</td>
                  <td className="py-2.5 px-3 text-slate-400">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* System reset option */}
      <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div>
          <h3 className="font-bold text-rose-300">รีเซ็ตข้อมูลจำลองระบบ (System Factory Reset)</h3>
          <p className="text-slate-400 text-[11px] mt-0.5">
            ล้างแคช LocalStorage และโหลดข้อมูลเริ่มต้น 20+ เมคอัพ, 20+ ทรงผม, 30+ ชุด, 15+ โอกาส, 10+ เทศกาล
          </p>
        </div>
        <button
          onClick={handleResetDemoData}
          className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold shrink-0 transition-colors"
        >
          รีเซ็ตข้อมูลระบบ
        </button>
      </div>
    </div>
  );
};
