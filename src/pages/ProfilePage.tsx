import React, { useState } from 'react';
import {
  User as UserIcon,
  ShieldCheck,
  Trash2,
  Save,
  Check,
  LogOut,
  Palette,
  Sparkles,
  Camera
} from 'lucide-react';
import { StorageService } from '../services/storage';
import { AuthService } from '../services/authService';
import { User, SkinToneType, FaceShapeType, BodyProportionType } from '../types';

interface ProfilePageProps {
  onNavigate: (path: string) => void;
  currentUser: User | null;
  onLogout: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  onNavigate,
  currentUser,
  onLogout
}) => {
  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-pink-100 text-pink-600 flex items-center justify-center mx-auto">
          <UserIcon className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800">เข้าสู่ระบบเพื่อดูโปรไฟล์</h2>
        <p className="text-xs text-slate-500">
          บันทึกการตั้งค่าสไตล์ส่วนตัว ประวัติการวิเคราะห์ และจัดการความปลอดภัยของบัญชี
        </p>
        <button
          onClick={() => onNavigate('/login')}
          className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-pink-500 to-indigo-600 text-white font-bold text-xs shadow-md"
        >
          เข้าสู่ระบบ / ลงทะเบียน
        </button>
      </div>
    );
  }

  const initialProfile = StorageService.getUserProfile(currentUser.id);
  const [skinTone, setSkinTone] = useState<SkinToneType>(initialProfile.skinTone || 'Warm Tone');
  const [faceShape, setFaceShape] = useState<FaceShapeType>(initialProfile.faceShape || 'Oval');
  const [bodyProportion, setBodyProportion] = useState<BodyProportionType>(initialProfile.bodyProportion || 'Straight');
  const [bio, setBio] = useState(initialProfile.bio || '');
  const [isSaved, setIsSaved] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    StorageService.saveUserProfile(currentUser.id, {
      ...initialProfile,
      skinTone,
      faceShape,
      bodyProportion,
      bio
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleDeleteUploadedPhotos = () => {
    if (confirm('คุณต้องการลบข้อมูลรูปภาพที่เคยอัปโหลดทั้งหมดออกจากระบบใช่หรือไม่?')) {
      const latest = StorageService.getLatestAnalysis();
      if (latest) {
        latest.photoUrl = undefined;
        StorageService.setLatestAnalysis(latest);
      }
      alert('ลบรูปภาพทั้งหมดของคุณออกจากระบบเรียบร้อยแล้ว ✨');
    }
  };

  const handleDeleteAccount = () => {
    if (confirm('คำเตือน: คุณต้องการลบบัญชีและข้อมูลทั้งหมดของคุณอย่างถาวรหรือไม่? การกระทำนี้ไม่สามารถย้อนกลับได้')) {
      AuthService.deleteAccount(currentUser.id);
      alert('บัญชีของคุณถูกลบเรียบร้อยแล้ว');
      onLogout();
      onNavigate('/home');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-fade-in space-y-8">
      {/* Header Profile Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <img
          src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
          alt={currentUser.name}
          className="w-24 h-24 rounded-3xl object-cover ring-4 ring-pink-500/20 shadow-md"
        />
        <div className="flex-1 text-center sm:text-left space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900">{currentUser.name}</h1>
            <span className="inline-block px-3 py-0.5 rounded-full text-xs font-bold bg-pink-100 text-pink-700 self-center sm:self-auto">
              {currentUser.role === 'admin' ? '🛡️ Administrator' : '✨ Member'}
            </span>
          </div>
          <p className="text-xs text-slate-500">{currentUser.email}</p>
          <p className="text-xs text-slate-600 max-w-lg leading-relaxed pt-1">
            {bio || 'ยังไม่มีคำแนะนำตัวสั้นๆ สามารถแก้ไขได้ที่แบบฟอร์มด้านล่าง'}
          </p>

          <div className="pt-2 flex flex-wrap gap-2 justify-center sm:justify-start text-xs text-slate-500">
            <span>สมัครสมาชิกเมื่อ: {currentUser.registeredAt}</span>
            <span>•</span>
            <span>ใช้งานล่าสุด: {currentUser.lastActive}</span>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors flex items-center gap-1.5"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>ออกจากระบบ</span>
        </button>
      </div>

      {/* Style Profile Configuration Form */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">My Style Profile (โปรไฟล์สไตล์ของฉัน)</h2>
            <p className="text-xs text-slate-500">
              กำหนดค่าพื้นฐานเกี่ยวกับโทนสีผิว รูปหน้า และสัดส่วนเพื่อนำไปประมวลผลคำแนะนำ
            </p>
          </div>
          {isSaved && (
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
              <Check className="w-4 h-4" />
              <span>บันทึกสำเร็จ</span>
            </span>
          )}
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                โทนสีผิว (Skin Undertone)
              </label>
              <select
                value={skinTone}
                onChange={(e) => setSkinTone(e.target.value as SkinToneType)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500"
              >
                <option value="Warm Tone">Warm Tone (อันเดอร์โทนอุ่น/เหลือง)</option>
                <option value="Cool Tone">Cool Tone (อันเดอร์โทนเย็น/ชมพู)</option>
                <option value="Neutral Tone">Neutral Tone (อันเดอร์โทนกลาง)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                รูปหน้า (Face Shape)
              </label>
              <select
                value={faceShape}
                onChange={(e) => setFaceShape(e.target.value as FaceShapeType)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500"
              >
                <option value="Oval">รูปหน้าไข่ (Oval)</option>
                <option value="Round">รูปหน้ากลม (Round)</option>
                <option value="Square">รูปหน้าเหลี่ยม (Square)</option>
                <option value="Rectangle">รูปหน้ายาว (Rectangle)</option>
                <option value="Heart">รูปหน้ารูปหัวใจ (Heart)</option>
                <option value="Diamond">รูปหน้าเพชร (Diamond)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                สัดส่วนรูปร่าง (Body Proportion)
              </label>
              <select
                value={bodyProportion}
                onChange={(e) => setBodyProportion(e.target.value as BodyProportionType)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500"
              >
                <option value="Straight">Straight / Column</option>
                <option value="Triangle">Triangle / Pear</option>
                <option value="Inverted Triangle">Inverted Triangle</option>
                <option value="Hourglass">Hourglass</option>
                <option value="Rectangle">Rectangle</option>
                <option value="Custom / Not sure">Custom / Not sure</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              เกี่ยวกับสไตล์หรือข้อความของคุณ (Bio)
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="เช่น ชอบแต่งตัวมินิมอลสบายๆ อยากได้ไอเดียไปคาเฟ่และมหาวิทยาลัย..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Save className="w-4 h-4" />
              <span>บันทึกการแก้ไขโปรไฟล์</span>
            </button>
          </div>
        </form>
      </div>

      {/* Privacy and Account Safety Controls */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2.5 text-slate-900 font-bold text-base">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <h3>ความเป็นส่วนตัวและการจัดการข้อมูลส่วนบุคคล</h3>
        </div>
        <p className="text-xs text-slate-500 leading-relaxed">
          ตามนโยบายความเป็นส่วนตัวของ StyleMatch AI คุณมีสิทธิ์ควบคุมข้อมูลและรูปถ่ายของคุณอย่างสมบูรณ์แบบ
        </p>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={handleDeleteUploadedPhotos}
            className="px-4 py-2.5 rounded-xl border border-amber-200 bg-amber-50 text-amber-800 text-xs font-bold hover:bg-amber-100 transition-colors flex items-center justify-center gap-1.5"
          >
            <Camera className="w-4 h-4" />
            <span>ลบรูปถ่ายที่เคยอัปโหลดทั้งหมด</span>
          </button>

          <button
            onClick={handleDeleteAccount}
            className="px-4 py-2.5 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 text-xs font-bold hover:bg-rose-100 transition-colors flex items-center justify-center gap-1.5"
          >
            <Trash2 className="w-4 h-4" />
            <span>ลบบัญชีผู้ใช้ถาวร (Delete Account)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
