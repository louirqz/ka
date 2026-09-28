import React from 'react';
import { Sparkles, Heart, ShieldCheck, Scale, CheckCircle2, ArrowRight } from 'lucide-react';

interface AboutPageProps {
  onNavigate: (path: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 animate-fade-in space-y-12">
      {/* Title */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <span className="px-3.5 py-1 rounded-full bg-pink-100 text-pink-700 text-xs font-bold inline-block">
          ✨ About StyleMatch AI
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          ค้นหาสไตล์ที่ใช่ และมั่นใจในทุกวัน
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          เราเชื่อว่าแฟชั่นและการแต่งตัวคือการเฉลิมฉลองความเป็นตัวของตัวเอง ไม่ใช่การตัดสินหรือการจัดกรอบตายตัว
        </p>
      </div>

      {/* Main Mission Card */}
      <div className="p-8 sm:p-10 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-6">
        <h2 className="text-xl font-bold text-slate-900">ภารกิจและแนวคิดหลักของเรา</h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          <strong>StyleMatch AI</strong> ได้รับการพัฒนาขึ้นเพื่อเป็นผู้ช่วยส่วนตัวอัจฉริยะ 
          ช่วยให้ผู้ใช้ทุกคนสามารถสำรวจโทนสีผิว (Personal Color) รูปหน้า และแนวทางเสื้อผ้าที่ช่วยขับจุดเด่นของตนเองได้อย่างสนุกสนาน เข้าถึงง่าย และเหมาะสมกับทุกสถานการณ์
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-pink-50/60 border border-pink-100 space-y-2">
            <Heart className="w-5 h-5 text-pink-600" />
            <h3 className="font-bold text-slate-900 text-xs">Body Neutrality</h3>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              ภาษาที่เป็นกลาง ไม่ตัดสินรูปร่างว่าดีหรือไม่ดี เน้นคำแนะนำเรื่องการจับคู่สี ทรงเสื้อผ้า และการจัดวางสัดส่วนที่สมดุล
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 space-y-2">
            <ShieldCheck className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-slate-900 text-xs">Privacy First</h3>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              รูปภาพของคุณเป็นข้อมูลส่วนตัว จะไม่ถูกเผยแพร่หรือแชร์ให้ผู้อื่น และคุณสามารถสั่งลบรูปภาพทั้งหมดได้ทุกเมื่อ
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-2">
            <Scale className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-slate-900 text-xs">Inclusive & Flexible</h3>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              ครอบคลุมทุกเฉดสีผิว ทุกเพศ ทุกสไตล์แฟชั่น และทุกโอกาสในชีวิตประจำวันอย่างเท่าเทียม
            </p>
          </div>
        </div>
      </div>

      {/* Mandatory Disclaimer Box */}
      <div className="p-6 sm:p-8 rounded-3xl bg-amber-50 border-2 border-amber-300 text-amber-950 space-y-3 shadow-sm">
        <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
          <span>⚠️ ข้อควรทราบและข้อสงวนสิทธิ์ (Disclaimer)</span>
        </div>
        <p className="text-xs sm:text-sm text-amber-900 leading-relaxed font-medium">
          “ผลลัพธ์จาก AI เป็นคำแนะนำทั่วไป ไม่ใช่การวินิจฉัยหรือการประเมินคุณค่าของบุคคล และผู้ใช้สามารถเลือกแต่งตัวตามความชอบของตนเองได้”
        </p>
        <p className="text-xs text-amber-800 leading-relaxed">
          ระบบ StyleMatch AI ออกแบบมาเพื่อเป็นไอเดียและแรงบันดาลใจในการเลือกซื้อเสื้อผ้าและเครื่องสำอาง ไม่จำกัดสิทธิในการแสดงออกหรือการแต่งตัวของคุณในทุกกรณี
        </p>
      </div>

      {/* CTA Section */}
      <div className="text-center pt-4">
        <button
          onClick={() => onNavigate('/analyze')}
          className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-indigo-600 text-white font-bold text-sm shadow-xl shadow-pink-500/25 hover:opacity-95 transition-all inline-flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>เริ่มค้นหาสไตล์ของคุณตอนนี้</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
