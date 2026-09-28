import React from 'react';
import {
  Sparkles,
  Camera,
  SlidersHorizontal,
  Compass,
  ArrowRight,
  ShieldCheck,
  Heart,
  Palette,
  Scissors,
  Shirt,
  Calendar,
  Layers,
  Sparkle,
  CheckCircle2
} from 'lucide-react';
import { StorageService } from '../services/storage';

interface HomePageProps {
  onNavigate: (path: string, options?: any) => void;
  onOpenPrivacyModal: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const analysisCount = StorageService.getAnalysisCount();

  const categories = [
    {
      id: 'makeup',
      name: '💄 Makeup',
      title: 'แนะนำโทนสีเครื่องสำอาง',
      desc: 'เฉดสีลิป บลัชออน อายแชโดว์ และโทนรองพื้นที่ช่วยขับผิวของคุณให้สว่างสดใส',
      path: '/makeup',
      color: 'from-pink-500/10 to-rose-500/10 border-pink-200/60 text-pink-700'
    },
    {
      id: 'hair',
      name: '💇 Hairstyle',
      title: 'ทรงผมที่เข้ากับรูปหน้า',
      desc: 'ทรงผมสั้น ยาว เลเยอร์ วูล์ฟคัท บ็อบ ทูบล็อก พร้อมลุคและวิธีเซ็ตผมที่เข้ากับคุณ',
      path: '/hairstyle',
      color: 'from-purple-500/10 to-indigo-500/10 border-purple-200/60 text-purple-700'
    },
    {
      id: 'fashion',
      name: '👕 Fashion',
      title: 'สไตล์เสื้อผ้า & สัดส่วน',
      desc: 'คำแนะนำการแมตช์ท่อนบน ท่อนล่าง รองเท้า และเครื่องประดับอย่างสมดุล',
      path: '/outfits',
      color: 'from-blue-500/10 to-cyan-500/10 border-blue-200/60 text-blue-700'
    },
    {
      id: 'color',
      name: '🎨 Color Tone',
      title: 'วิเคราะห์สีผิว Personal Color',
      desc: 'ค้นพบ Cool Tone, Warm Tone หรือ Neutral Tone พร้อมพาเลตต์สีที่เหมาะกับคุณ',
      path: '/analyze',
      color: 'from-amber-500/10 to-orange-500/10 border-amber-200/60 text-amber-700'
    },
    {
      id: 'events',
      name: '🎉 Events & Festivals',
      title: 'ชุดตามสถานการณ์และเทศกาล',
      desc: 'ไอเดียแต่งตัวไปเรียน ไปคาเฟ่ ไปเดต งานแต่ง งานวันเกิด หรือเทศกาลสำคัญ',
      path: '/occasion',
      color: 'from-emerald-500/10 to-teal-500/10 border-emerald-200/60 text-emerald-700'
    },
    {
      id: 'personal',
      name: '✨ Personal Style',
      title: 'สร้างคำแนะนำเฉพาะบุคคล',
      desc: 'ระบบผสานทุกข้อมูลเข้าด้วยกันและสร้าง Complete Look พร้อมเหตุผลที่เข้ากัน',
      path: '/style',
      color: 'from-fuchsia-500/10 to-pink-500/10 border-fuchsia-200/60 text-fuchsia-700'
    }
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-16 animate-fade-in">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 sm:pt-14 pb-12 sm:pb-20">
        {/* Ambient Gradient Blobs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-pink-300/30 via-purple-200/30 to-indigo-300/20 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-4xl mx-auto text-center px-4">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-100/80 border border-pink-200/80 text-pink-700 text-xs font-bold mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Personal Style Assistant รุ่นใหม่ 2026</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-tight sm:leading-none mb-6">
            <span className="block mb-2">StyleMatch AI</span>
            <span className="bg-gradient-to-r from-pink-600 via-rose-500 to-indigo-600 bg-clip-text text-transparent">
              “ค้นหาสไตล์ที่เหมาะกับคุณ ด้วย AI”
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
            ระบบผู้ช่วยวิเคราะห์สไตล์ส่วนตัวอัจฉริยะ แนะนำการแต่งหน้า ทรงผม และการแต่งตัวจากข้อมูลและรูปภาพของคุณ 
            เน้นการบาลานซ์ซิลูเอท ทรงเสื้อผ้า และคู่สีที่เข้ากันอย่างลงตัว โดยไม่ตัดสินรูปร่าง
          </p>

          {/* 4 Main Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 max-w-4xl mx-auto">
            <button
              onClick={() => onNavigate('/analyze')}
              className="p-4 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-indigo-600 text-white font-bold text-sm shadow-xl shadow-pink-500/25 hover:opacity-95 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>เริ่มวิเคราะห์สไตล์</span>
            </button>

            <button
              onClick={() => onNavigate('/analyze', { mode: 'image' })}
              className="p-4 rounded-2xl bg-white border border-slate-200 text-slate-800 font-bold text-sm hover:border-pink-300 hover:bg-pink-50/50 shadow-sm transition-all flex items-center justify-center gap-2"
            >
              <Camera className="w-4 h-4 text-pink-600" />
              <span>วิเคราะห์จากรูปภาพ</span>
            </button>

            <button
              onClick={() => onNavigate('/analyze', { mode: 'quiz' })}
              className="p-4 rounded-2xl bg-white border border-slate-200 text-slate-800 font-bold text-sm hover:border-indigo-300 hover:bg-indigo-50/50 shadow-sm transition-all flex items-center justify-center gap-2"
            >
              <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
              <span>เลือกสไตล์ด้วยตัวเอง</span>
            </button>

            <button
              onClick={() => onNavigate('/outfits')}
              className="p-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm transition-all flex items-center justify-center gap-2"
            >
              <Compass className="w-4 h-4 text-slate-600" />
              <span>ดูคำแนะนำทั้งหมด</span>
            </button>
          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-10 pt-6 border-t border-slate-200/60 max-w-2xl mx-auto flex items-center justify-around text-xs text-slate-500">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>วิเคราะห์สไตล์แล้วกว่า <strong>{analysisCount}</strong> ครั้ง</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-pink-500" />
              <span>ปลอดภัย ไม่เปิดเผยรูปภาพ</span>
            </div>
            <div className="hidden sm:flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-rose-500" />
              <span>ภาษาเป็นกลาง ไม่ตัดสินรูปร่าง</span>
            </div>
          </div>
        </div>
      </section>

      {/* Category Previews (6 Core Sections) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-3">
            ค้นพบทุกมิติของสไตล์คุณ
          </h2>
          <p className="text-sm text-slate-600">
            แตะเลือกหมวดหมู่เพื่อดูคำแนะนำ คอลเลกชันเฉดสี ทรงผม และชุดแต่งกายที่คัดสรรโดย AI
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => onNavigate(cat.path)}
              className={`p-6 rounded-3xl bg-gradient-to-br ${cat.color} border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer flex flex-col justify-between group`}
            >
              <div>
                <span className="text-2xl font-bold block mb-2">{cat.name}</span>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{cat.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">{cat.desc}</p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-200/50 text-xs font-bold text-slate-800 group-hover:text-pink-600 transition-colors">
                <span>สำรวจหมวดหมู่นี้</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Feature Showcase: Neutral Body Guidance */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white shadow-2xl relative overflow-hidden">
          <div className="max-w-2xl relative z-10 space-y-4">
            <span className="px-3.5 py-1 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30 text-xs font-bold inline-block">
              ✨ Body Positive & Respectful
            </span>
            <h2 className="text-2xl sm:text-3xl font-black">
              การแต่งตัวคือความมั่นใจ ไม่ใช่ตัวเลขบนตาชั่ง
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              StyleMatch AI มุ่งเน้นการให้คำแนะนำด้าน “ทรงเสื้อผ้า เลเยอร์ การจับคู่สี และสัดส่วนที่สมดุล” 
              เพื่อเสริมจุดเด่นและความเป็นตัวคุณอย่างเคารพ ไม่มีการตัดสินรูปร่างว่าดีหรือไม่ดี และไม่ส่งเสริมมาตรฐานที่ไม่สมจริง
            </p>
            <div className="pt-2 flex flex-wrap gap-4">
              <button
                onClick={() => onNavigate('/analyze')}
                className="px-6 py-3 rounded-2xl bg-white text-slate-900 font-bold text-xs hover:bg-slate-100 shadow-md transition-all"
              >
                เริ่มสร้าง Style Profile ของคุณ
              </button>
              <button
                onClick={() => onNavigate('/about')}
                className="px-6 py-3 rounded-2xl bg-slate-800 text-white font-medium text-xs hover:bg-slate-700 transition-all border border-slate-700"
              >
                อ่านแนวคิดระบบของเรา
              </button>
            </div>
          </div>

          <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
        </div>
      </section>
    </div>
  );
};
