import React, { useState } from 'react';
import { PartyPopper, Sparkles, ArrowRight, Search } from 'lucide-react';
import { StorageService } from '../services/storage';

interface FestivalPageProps {
  onNavigate: (path: string, options?: any) => void;
}

export const FestivalPage: React.FC<FestivalPageProps> = ({ onNavigate }) => {
  const festivals = StorageService.getFestivals();
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = festivals.filter(
    (fes) =>
      fes.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fes.thaiName.includes(searchTerm) ||
      fes.outfitIdeas.includes(searchTerm)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-fade-in space-y-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="px-3.5 py-1 rounded-full bg-rose-100 text-rose-700 text-xs font-bold inline-block">
          🎉 Festival & Seasonal Styling
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900">
          คอลเลกชันสไตล์ตามเทศกาล
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          เตรียมพร้อมทุกเทศกาลสำคัญ ทั้งสงกรานต์ ลอยกระทง ปีใหม่ วาเลนไทน์ ฮาโลวีน คริสต์มาส และรับปริญญา ด้วยลุคที่เข้ากับบรรยากาศ
        </p>
      </div>

      {/* Search Bar */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200 shadow-sm max-w-md mx-auto">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ค้นหาเทศกาล เช่น สงกรานต์, ปีใหม่, วาเลนไทน์..."
            className="w-full pl-10 pr-4 py-2 rounded-2xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
          />
        </div>
      </div>

      {/* Grid of Festivals */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((fes) => (
          <div
            key={fes.id}
            className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-rose-300 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-[10px] font-bold">
                  {fes.dateOrSeason}
                </span>
                <span className="text-xs text-slate-400 font-medium">{fes.name}</span>
              </div>

              <h3 className="text-lg font-bold text-slate-900 mb-1">{fes.thaiName}</h3>
              <p className="text-xs text-rose-600 font-semibold mb-3">สไตล์แนะนำ: {fes.recommendedStyle}</p>

              {/* Ideas Card */}
              <div className="space-y-2 p-3.5 rounded-2xl bg-slate-50 text-xs text-slate-700 mb-4">
                <p>
                  <strong>👕 ชุดที่แนะนำ: </strong>
                  {fes.outfitIdeas}
                </p>
                <p>
                  <strong>💄 เมคอัพ: </strong>
                  {fes.makeupVibe}
                </p>
                <p>
                  <strong>💇 ทรงผม: </strong>
                  {fes.hairVibe}
                </p>
              </div>

              {/* Palette */}
              <div className="mb-4">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  โทนสีเด่นประจำเทศกาล:
                </p>
                <div className="flex items-center gap-2">
                  {fes.colorHexes.map((hex, i) => (
                    <div
                      key={i}
                      className="w-5 h-5 rounded-full border border-black/10 shadow-xs"
                      style={{ backgroundColor: hex }}
                      title={fes.recommendedColors[i]}
                    />
                  ))}
                  <span className="text-[11px] text-slate-500 font-medium ml-1">
                    {fes.recommendedColors.join(', ')}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onNavigate('/analyze')}
              className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-rose-600 hover:text-white text-slate-700 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>สร้าง Look สำหรับ{fes.thaiName}</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
