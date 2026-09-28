import React from 'react';
import { Sparkles, Shield, Heart, KeyRound, Info } from 'lucide-react';

interface FooterProps {
  onNavigate: (path: string) => void;
  onOpenAdminPasscode: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenAdminPasscode }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-24 sm:pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand info */}
          <div className="md:col-span-1 space-y-4">
            <div
              onClick={() => onNavigate('/home')}
              className="flex items-center gap-2.5 cursor-pointer"
            >
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-pink-500 via-rose-500 to-indigo-600 flex items-center justify-center text-white shadow-md">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="text-xl font-black text-white">StyleMatch AI</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              ระบบผู้ช่วยวิเคราะห์สไตล์ส่วนตัวด้วย AI สำหรับแนะนำการแต่งหน้า ทรงผม และการแต่งตัวจากข้อมูลและรูปภาพของผู้ใช้ ค้นหาตัวตนที่เปล่งประกายในแบบของคุณ
            </p>
            <div className="flex items-center gap-2 text-xs text-pink-400 font-medium">
              <Heart className="w-3.5 h-3.5 fill-pink-500 text-pink-500" />
              <span>ส่งเสริมความมั่นใจในทุกเฉดผิวและทุกสรีระ</span>
            </div>
          </div>

          {/* Quick Links 1 */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              การวิเคราะห์สไตล์
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button
                  onClick={() => onNavigate('/analyze')}
                  className="hover:text-white transition-colors"
                >
                  วิเคราะห์สีผิว & ทรงหน้า
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/makeup')}
                  className="hover:text-white transition-colors"
                >
                  แนะนำ Makeup & โทนสี
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/hairstyle')}
                  className="hover:text-white transition-colors"
                >
                  แนะนำทรงผมตามรูปหน้า
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/outfits')}
                  className="hover:text-white transition-colors"
                >
                  คอลเลกชันชุด & สัดส่วน
                </button>
              </li>
            </ul>
          </div>

          {/* Quick Links 2 */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              โอกาส & สไตล์
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button
                  onClick={() => onNavigate('/occasion')}
                  className="hover:text-white transition-colors"
                >
                  ชุดตามโอกาส (Occasion)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/festival')}
                  className="hover:text-white transition-colors"
                >
                  ชุดตามเทศกาล (Festivals)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/style')}
                  className="hover:text-white transition-colors"
                >
                  แคตตาล็อก 15 สไตล์แฟชั่น
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/about')}
                  className="hover:text-white transition-colors"
                >
                  เกี่ยวกับ StyleMatch AI
                </button>
              </li>
            </ul>
          </div>

          {/* Security & Admin */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              ระบบหลังบ้าน & ความปลอดภัย
            </h4>
            <p className="text-xs text-slate-400 mb-3 leading-relaxed">
              จัดการสมาชิก ข้อมูลเครื่องสำอาง ทรงผม และชุดแต่งกาย
            </p>
            <button
              onClick={onOpenAdminPasscode}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-xs font-medium text-pink-300 transition-colors w-full justify-center"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>ใส่รหัสระบบหลังบ้าน (Admin)</span>
            </button>
          </div>
        </div>

        {/* Disclaimer box */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-800/60 border border-slate-800 mb-8 flex items-start gap-3">
          <Info className="w-5 h-5 text-pink-400 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-400 leading-relaxed">
            <span className="font-semibold text-slate-200">ข้อควรทราบ (AI Disclaimer): </span>
            ผลลัพธ์จาก AI เป็นคำแนะนำทั่วไป ไม่ใช่การวินิจฉัยหรือการประเมินคุณค่าของบุคคล การวิเคราะห์สัดส่วนรูปร่างเป็นเพียงแนวทางเพื่อช่วยเลือกทรงเสื้อผ้า สี และสไตล์ที่เข้ากันเท่านั้น ผู้ใช้สามารถเลือกแต่งตัวตามความชอบและความมั่นใจของตนเองได้อย่างอิสระ
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p>© 2026 StyleMatch AI. ค้นหาสไตล์ที่เหมาะกับคุณ ด้วย AI.</p>
          <div className="flex items-center gap-4">
            <button onClick={() => onNavigate('/about')} className="hover:text-slate-300">
              ข้อกำหนดและเงื่อนไข
            </button>
            <span>•</span>
            <button onClick={() => onNavigate('/about')} className="hover:text-slate-300">
              นโยบายความเป็นส่วนตัว
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
