import React, { useState } from 'react';
import { Bookmark, Trash2, Sparkles, ExternalLink, Calendar, ArrowRight } from 'lucide-react';
import { StorageService } from '../services/storage';
import { CompleteLook } from '../types';

interface SavedPageProps {
  onNavigate: (path: string, options?: any) => void;
  onUpdateCount: () => void;
}

export const SavedPage: React.FC<SavedPageProps> = ({ onNavigate, onUpdateCount }) => {
  const [savedLooks, setSavedLooks] = useState<CompleteLook[]>(StorageService.getSavedLooks());
  const [selectedLook, setSelectedLook] = useState<CompleteLook | null>(null);

  const handleDelete = (id: string) => {
    if (confirm('คุณต้องการลบชุดที่บันทึกไว้นี้ใช่หรือไม่?')) {
      StorageService.deleteSavedLook(id);
      setSavedLooks(StorageService.getSavedLooks());
      onUpdateCount();
      if (selectedLook?.id === id) {
        setSelectedLook(null);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-fade-in space-y-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="px-3.5 py-1 rounded-full bg-pink-100 text-pink-700 text-xs font-bold inline-block">
          🔖 My Wardrobe Collection
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900">
          ชุดและลุคที่คุณบันทึกไว้ ({savedLooks.length})
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          รวมทุกลุค Complete Look และชุดที่คุณชื่นชอบจากการวิเคราะห์ของ StyleMatch AI
        </p>
      </div>

      {savedLooks.length === 0 ? (
        <div className="p-16 text-center bg-white rounded-3xl border border-slate-200 shadow-sm max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-pink-50 text-pink-500 flex items-center justify-center mx-auto">
            <Bookmark className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">ยังไม่มีชุดที่บันทึกไว้</h3>
          <p className="text-xs text-slate-500">
            เมื่อคุณวิเคราะห์สไตล์หรือเลือกชุดที่ชอบ สามารถกดปุ่ม “บันทึกชุด” เพื่อเก็บไว้ดูที่นี่ได้ตลอดเวลา
          </p>
          <button
            onClick={() => onNavigate('/analyze')}
            className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-pink-500 to-indigo-600 text-white font-bold text-xs shadow-md"
          >
            เริ่มสร้างสไตล์ใหม่ ✨
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedLooks.map((look) => (
            <div
              key={look.id}
              className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-pink-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-3 py-1 rounded-full bg-pink-100 text-pink-700 text-[10px] font-bold">
                    {look.occasion}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {look.date}
                    </span>
                    <button
                      onClick={() => handleDelete(look.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="ลบชุดนี้"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h3 className="text-base font-bold text-slate-900 mb-1">{look.title}</h3>
                <p className="text-xs text-pink-600 font-semibold mb-3">{look.theme}</p>

                {/* Quick preview */}
                <div className="space-y-1.5 p-3.5 rounded-2xl bg-slate-50 text-xs text-slate-700 mb-4">
                  <p>
                    <strong>👕 เสื้อ: </strong>
                    {look.top}
                  </p>
                  <p>
                    <strong>👖 กางเกง/กระโปรง: </strong>
                    {look.bottom}
                  </p>
                  <p>
                    <strong>👟 รองเท้า: </strong>
                    {look.shoes}
                  </p>
                </div>

                {/* Color swatches */}
                <div className="flex items-center gap-1.5 mb-4">
                  {look.colorPalette.map((col, i) => (
                    <div
                      key={i}
                      className="w-5 h-5 rounded-full border border-black/10 shadow-xs"
                      style={{ backgroundColor: col.hex }}
                      title={col.name}
                    />
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  {look.skinTone} • {look.faceShape}
                </span>
                <button
                  onClick={() => setSelectedLook(look)}
                  className="text-xs font-bold text-pink-600 hover:underline flex items-center gap-1"
                >
                  <span>ดูรายละเอียด</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Look Detail Modal */}
      {selectedLook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={() => setSelectedLook(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              ✕
            </button>

            <span className="px-3 py-1 rounded-full bg-pink-100 text-pink-700 text-xs font-bold inline-block mb-2">
              ✨ Saved Complete Look
            </span>
            <h2 className="text-xl font-bold text-slate-900 mb-1">{selectedLook.title}</h2>
            <p className="text-xs text-slate-500 mb-5">{selectedLook.theme}</p>

            <div className="space-y-4 text-xs text-slate-700 mb-6">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <strong className="text-slate-900 font-bold block">💄 การแต่งหน้า (Makeup):</strong>
                <p>{selectedLook.makeupSummary}</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <strong className="text-slate-900 font-bold block">💇 ทรงผม (Hairstyle):</strong>
                <p>{selectedLook.hairSummary}</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <strong className="text-slate-900 font-bold block">👕 เสื้อผ้าและการแต่งกาย:</strong>
                <p>เสื้อ: {selectedLook.top}</p>
                <p>กางเกง/กระโปรง: {selectedLook.bottom}</p>
                <p>รองเท้า: {selectedLook.shoes}</p>
                <p>เครื่องประดับ: {selectedLook.accessories}</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-pink-50 border border-pink-100 text-pink-950 space-y-1">
                <strong className="font-bold block">เหตุผลที่คู่กัน (Harmony Reason):</strong>
                <p className="leading-relaxed">{selectedLook.harmonyExplanation}</p>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-slate-100">
              <button
                onClick={() => handleDelete(selectedLook.id)}
                className="text-xs font-medium text-rose-600 hover:underline flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>ลบชุดนี้ออกจากคลัง</span>
              </button>
              <button
                onClick={() => setSelectedLook(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs"
              >
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
