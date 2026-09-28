import React, { useState } from 'react';
import {
  Sparkles,
  Palette,
  Scissors,
  Shirt,
  Bookmark,
  Check,
  ChevronDown,
  ChevronUp,
  Share2,
  RefreshCw,
  Info,
  ExternalLink,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';
import { FullAnalysisResult, ColorItem } from '../types';
import { StorageService } from '../services/storage';

interface AnalysisResultPageProps {
  onNavigate: (path: string) => void;
  result?: FullAnalysisResult | null;
  onSaveLook: () => void;
}

export const AnalysisResultPage: React.FC<AnalysisResultPageProps> = ({
  onNavigate,
  result,
  onSaveLook
}) => {
  const latestResult = result || StorageService.getLatestAnalysis();

  const [expandedSection, setExpandedSection] = useState<string | null>('complete');
  const [isSaved, setIsSaved] = useState(false);
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  if (!latestResult) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-pink-100 text-pink-600 flex items-center justify-center mx-auto">
          <Sparkles className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800">ยังไม่มีข้อมูลการวิเคราะห์</h2>
        <p className="text-sm text-slate-500">
          เริ่มต้นวิเคราะห์สไตล์ด้วย AI เพื่อรับคำแนะนำการแต่งหน้า ทรงผม และชุดแต่งกายเฉพาะบุคคล
        </p>
        <button
          onClick={() => onNavigate('/analyze')}
          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-indigo-600 text-white font-bold text-sm shadow-md"
        >
          เริ่มการวิเคราะห์สไตล์ทันที ✨
        </button>
      </div>
    );
  }

  const { skinTone, faceShape, bodyProportion, makeup, hairstyles, outfit, completeLook } = latestResult;

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleSave = () => {
    if (completeLook) {
      StorageService.saveLook({
        ...completeLook,
        isFavorite: true
      });
      setIsSaved(true);
      onSaveLook();
      setTimeout(() => setIsSaved(false), 2500);
    }
  };

  const copyToClipboard = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 1500);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-fade-in space-y-10">
      {/* Header Banner */}
      <div className="p-6 sm:p-10 rounded-3xl bg-gradient-to-r from-pink-600 via-rose-500 to-indigo-600 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Style Analysis Complete</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black">Your Style Result</h1>
          <p className="text-xs sm:text-sm text-pink-100 leading-relaxed">
            สรุปผลการวิเคราะห์สไตล์เฉพาะบุคคล ครอบคลุม Personal Color โทนสีเครื่องสำอาง ทรงผมที่รับกับรูปหน้า และการแมตช์ชุดที่สมดุล
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-2">
            <span className="px-3 py-1 rounded-xl bg-white/10 backdrop-blur-md text-xs font-semibold">
              🎨 {skinTone.tone}
            </span>
            <span className="px-3 py-1 rounded-xl bg-white/10 backdrop-blur-md text-xs font-semibold">
              💇 {faceShape.shape}
            </span>
            <span className="px-3 py-1 rounded-xl bg-white/10 backdrop-blur-md text-xs font-semibold">
              👕 {bodyProportion.type}
            </span>
            {latestResult.occasion && (
              <span className="px-3 py-1 rounded-xl bg-white/10 backdrop-blur-md text-xs font-semibold">
                📍 {latestResult.occasion}
              </span>
            )}
          </div>
        </div>

        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-72 h-72 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* COMPLETE LOOK CARD (Top Highlight) */}
      {completeLook && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-pink-400 shadow-xl relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <span className="px-3 py-1 rounded-full bg-pink-100 text-pink-700 text-xs font-bold inline-block mb-1">
                ✨ Recommended Look & Harmony
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                {completeLook.title}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">{completeLook.theme}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleSave}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md ${
                  isSaved
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:opacity-95'
                }`}
              >
                {isSaved ? <Check className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                <span>{isSaved ? 'บันทึกเรียบร้อย!' : 'บันทึกใน Style Profile'}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 rounded-2xl bg-slate-50 border border-slate-100 mb-6 text-xs text-slate-700 leading-relaxed">
            <div className="space-y-3">
              <div className="flex items-start gap-2.5">
                <span className="text-base">💄</span>
                <div>
                  <strong className="text-slate-900 block font-bold">Makeup Vibe:</strong>
                  <span>{completeLook.makeupSummary}</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="text-base">💇</span>
                <div>
                  <strong className="text-slate-900 block font-bold">Hairstyle:</strong>
                  <span>{completeLook.hairSummary}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-2.5">
                <span className="text-base">👕</span>
                <div>
                  <strong className="text-slate-900 block font-bold">Top & Bottom:</strong>
                  <span>{completeLook.top} คู่กับ {completeLook.bottom}</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="text-base">👟</span>
                <div>
                  <strong className="text-slate-900 block font-bold">Shoes & Accessories:</strong>
                  <span>{completeLook.shoes} พร้อม {completeLook.accessories}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Color Palette Chips */}
          <div className="mb-6">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
              Color Harmony Palette
            </h4>
            <div className="flex flex-wrap gap-2.5">
              {completeLook.colorPalette.map((col, idx) => (
                <div
                  key={idx}
                  onClick={() => copyToClipboard(col.hex)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-slate-200 cursor-pointer hover:border-pink-300 transition-colors shadow-sm"
                  title="คลิกเพื่อคัดลอกโค้ดสี"
                >
                  <div
                    className="w-4 h-4 rounded-full border border-black/10 shrink-0"
                    style={{ backgroundColor: col.hex }}
                  />
                  <span className="text-xs font-semibold text-slate-800">{col.name}</span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {copiedHex === col.hex ? 'คัดลอกแล้ว!' : col.hex}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Why it matches */}
          <div className="p-4 rounded-2xl bg-pink-50/70 border border-pink-100 flex items-start gap-3 text-xs text-slate-700">
            <Info className="w-5 h-5 text-pink-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-pink-900 font-bold block mb-0.5">เหตุผลที่องค์ประกอบเหล่านี้เข้ากัน:</strong>
              <p className="leading-relaxed">{completeLook.harmonyExplanation}</p>
            </div>
          </div>
        </div>
      )}

      {/* CATEGORY BREAKDOWN CARDS */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-slate-900">รายละเอียดคำแนะนำแต่ละหมวดหมู่</h3>

        {/* 1. COLOR & SKIN TONE */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm transition-all">
          <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleSection('color')}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
                🎨
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900">
                  Skin Tone Result: {skinTone.tone}
                </h4>
                <p className="text-xs text-slate-500">ความแม่นยำ AI {skinTone.confidence}%</p>
              </div>
            </div>
            <button className="p-2 rounded-xl text-slate-400 hover:text-slate-600">
              {expandedSection === 'color' ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
          </div>

          {expandedSection === 'color' && (
            <div className="mt-6 pt-6 border-t border-slate-100 space-y-5 animate-fade-in text-xs text-slate-600 leading-relaxed">
              <p className="text-slate-700 font-medium">{skinTone.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-2">
                  <h5 className="font-bold text-emerald-800">✨ สีที่เหมาะ ขับผิวสว่าง</h5>
                  <div className="space-y-1.5">
                    {skinTone.bestColors.map((c, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-3.5 h-3.5 rounded-full border border-black/10" style={{ backgroundColor: c.hex }} />
                          <span className="font-semibold text-slate-800">{c.name}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">{c.hex}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 space-y-2">
                  <h5 className="font-bold text-blue-800">💡 สีที่ควรลอง เพื่อลุคใหม่</h5>
                  <div className="space-y-1.5">
                    {skinTone.tryColors.map((c, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-3.5 h-3.5 rounded-full border border-black/10" style={{ backgroundColor: c.hex }} />
                          <span className="font-semibold text-slate-800">{c.name}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">{c.hex}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-100 space-y-2">
                  <h5 className="font-bold text-rose-800">⚠️ สีที่อาจคอนทราสต์มาก</h5>
                  <div className="space-y-1.5">
                    {skinTone.contrastColors.map((c, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-3.5 h-3.5 rounded-full border border-black/10" style={{ backgroundColor: c.hex }} />
                          <span className="font-semibold text-slate-800">{c.name}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">{c.hex}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <span>{skinTone.jewelryComplement}</span>
                <button
                  onClick={() => onNavigate('/makeup')}
                  className="text-pink-600 font-bold hover:underline shrink-0 ml-3"
                >
                  ดูคอลเลกชันเครื่องสำอาง →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 2. MAKEUP PALETTE */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm transition-all">
          <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleSection('makeup')}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-pink-100 text-pink-600 flex items-center justify-center font-bold">
                💄
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900">Your Makeup Palette</h4>
                <p className="text-xs text-slate-500">คำแนะนำ Foundation, Blush, Lip และ Eyeshadow</p>
              </div>
            </div>
            <button className="p-2 rounded-xl text-slate-400 hover:text-slate-600">
              {expandedSection === 'makeup' ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
          </div>

          {expandedSection === 'makeup' && (
            <div className="mt-6 pt-6 border-t border-slate-100 space-y-4 animate-fade-in text-xs text-slate-600">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                  <h5 className="font-bold text-slate-900">เฉดรองพื้นที่ควรทดลอง (Foundation)</h5>
                  <p>{makeup.foundation.advice}</p>
                  <div className="flex gap-2">
                    {makeup.foundation.recommendedShades.map((s, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-lg bg-pink-100 text-pink-700 font-semibold">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                  <h5 className="font-bold text-slate-900">บลัชออน (Blush Flush)</h5>
                  <p>กลุ่มสี: {makeup.blush.categoryName}</p>
                  <p>{makeup.blush.applicationTips}</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                  <h5 className="font-bold text-slate-900">ลิปสติก (Lip Color)</h5>
                  <p>กลุ่มสี: {makeup.lip.categoryName}</p>
                  <p>ฟินิชที่แนะนำ: {makeup.lip.finishRecommendation}</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                  <h5 className="font-bold text-slate-900">อายแชโดว์ (Eyeshadow Harmony)</h5>
                  <p>กลุ่มสี: {makeup.eyeshadow.categoryName}</p>
                  <p>{makeup.eyeshadow.applicationTips}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 3. FACE SHAPE & HAIRSTYLE */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm transition-all">
          <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleSection('hair')}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center font-bold">
                💇
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900">
                  Your Face Shape: {faceShape.thaiName}
                </h4>
                <p className="text-xs text-slate-500">แนะนำทรงผมและการจัดแต่งลุค</p>
              </div>
            </div>
            <button className="p-2 rounded-xl text-slate-400 hover:text-slate-600">
              {expandedSection === 'hair' ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
          </div>

          {expandedSection === 'hair' && (
            <div className="mt-6 pt-6 border-t border-slate-100 space-y-4 animate-fade-in text-xs text-slate-600">
              <p className="text-slate-700 font-medium">{faceShape.description}</p>
              <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-100 text-purple-900">
                <strong>ทริคการจัดทรง: </strong>
                {faceShape.stylingTips}
              </div>

              <h5 className="font-bold text-slate-800 text-sm pt-2">ทรงผมแนะนำสำหรับคุณ:</h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {hairstyles.map((h, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                    <div className="flex items-center justify-between">
                      <h6 className="font-bold text-slate-900 text-xs">{h.name}</h6>
                      <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 text-[10px] font-bold">
                        {h.lookType}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600">{h.description}</p>
                    <p className="text-[10px] text-slate-400 font-medium">✨ {h.stylingTips}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 4. SILHOUETTE & OUTFIT */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm transition-all">
          <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleSection('outfit')}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                👕
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900">
                  สัดส่วนและการแต่งตัว: {bodyProportion.thaiName}
                </h4>
                <p className="text-xs text-slate-500">สมดุลเสื้อผ้า เลเยอร์ และความยาว</p>
              </div>
            </div>
            <button className="p-2 rounded-xl text-slate-400 hover:text-slate-600">
              {expandedSection === 'outfit' ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
          </div>

          {expandedSection === 'outfit' && (
            <div className="mt-6 pt-6 border-t border-slate-100 space-y-4 animate-fade-in text-xs text-slate-600">
              <p className="text-slate-700 font-medium">{bodyProportion.generalDescription}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                  <h6 className="font-bold text-slate-900">เสื้อท่อนบน (Top Advice):</h6>
                  <p>{bodyProportion.topAdvice}</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                  <h6 className="font-bold text-slate-900">กางเกง/กระโปรง (Bottom Advice):</h6>
                  <p>{bodyProportion.bottomAdvice}</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                  <h6 className="font-bold text-slate-900">การเลเยอร์ (Layering Tips):</h6>
                  <p>{bodyProportion.layeringAdvice}</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                  <h6 className="font-bold text-slate-900">การสร้างซิลูเอทสมดุล (Silhouette):</h6>
                  <p>{bodyProportion.silhouetteAdvice}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer Navigation Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-200">
        <button
          onClick={() => onNavigate('/analyze')}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-100 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          <span>วิเคราะห์ใหม่ / ปรับแต่งข้อมูล</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('/outfits')}
            className="px-6 py-3 rounded-2xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-all shadow-md"
          >
            สำรวจคอลเลกชันชุดทั้งหมด →
          </button>
        </div>
      </div>
    </div>
  );
};
