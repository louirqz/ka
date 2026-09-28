import React, { useState } from 'react';
import { Sparkles, Search, ArrowRight, Check } from 'lucide-react';
import { StorageService } from '../services/storage';

interface StylesPageProps {
  onNavigate: (path: string, options?: any) => void;
}

export const StylesPage: React.FC<StylesPageProps> = ({ onNavigate }) => {
  const styles = StorageService.getStyles();
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = styles.filter(
    (st) =>
      st.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      st.thaiName.includes(searchTerm) ||
      st.description.includes(searchTerm)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-fade-in space-y-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="px-3.5 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold inline-block">
          ✨ 15+ Fashion Aesthetics
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900">
          รวม 15 สไตล์แฟชั่นยอดนิยม
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          สำรวจเอกลักษณ์ของแต่ละสไตล์ ตั้งแต่มินิมอล สตรีท เคป๊อป วายทูเค ซิตี้บอยญี่ปุ่น ไปจนถึงลักชูรี พร้อมชิ้นหลักที่ควรมีในตู้เสื้อผ้า
        </p>
      </div>

      {/* Search */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200 shadow-sm max-w-md mx-auto">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ค้นหาสไตล์ เช่น Minimal, Korean, Y2K, Street..."
            className="w-full pl-10 pr-4 py-2 rounded-2xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Grid of Styles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((st) => (
          <div
            key={st.id}
            className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                  {st.name}
                </span>
                <div className="flex gap-1">
                  {st.vibeKeywords.map((vk) => (
                    <span
                      key={vk}
                      className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-medium"
                    >
                      #{vk}
                    </span>
                  ))}
                </div>
              </div>

              <h3 className="text-lg font-bold text-slate-900 mb-1">{st.thaiName}</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">{st.description}</p>

              {/* Key pieces */}
              <div className="p-3.5 rounded-2xl bg-slate-50 text-xs text-slate-700 mb-4 space-y-1.5">
                <span className="font-bold text-slate-900 block text-[11px] uppercase tracking-wider">
                  ชิ้นไอเทมหลัก (Key Pieces):
                </span>
                <ul className="list-disc list-inside space-y-1 text-slate-600">
                  {st.keyPieces.map((kp, i) => (
                    <li key={i}>{kp}</li>
                  ))}
                </ul>
              </div>

              {/* Color swatches */}
              <div className="mb-4">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Signature Palette:
                </span>
                <div className="flex items-center gap-2">
                  {st.colorHexes.map((hex, i) => (
                    <div
                      key={i}
                      className="w-5 h-5 rounded-full border border-black/10 shadow-xs"
                      style={{ backgroundColor: hex }}
                      title={st.signatureColors[i]}
                    />
                  ))}
                  <span className="text-[11px] text-slate-500 font-medium ml-1">
                    {st.signatureColors.slice(0, 3).join(', ')}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onNavigate('/analyze')}
              className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-indigo-600 hover:text-white text-slate-700 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>สร้าง Look สไตล์ {st.name}</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
