import React, { useState } from 'react';
import { Calendar, Search, Sparkles, ArrowRight, Check } from 'lucide-react';
import { StorageService } from '../services/storage';

interface OccasionPageProps {
  onNavigate: (path: string, options?: any) => void;
}

export const OccasionPage: React.FC<OccasionPageProps> = ({ onNavigate }) => {
  const occasions = StorageService.getOccasions();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const categories = ['All', 'School/Uni', 'Casual', 'Social', 'Work/Formal', 'Relax'];

  const filtered = occasions.filter((occ) => {
    const matchSearch =
      occ.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      occ.thaiName.includes(searchTerm) ||
      occ.vibe.includes(searchTerm) ||
      occ.stylingKey.includes(searchTerm);
    const matchCategory = categoryFilter === 'All' || occ.category === categoryFilter;
    return matchSearch && matchCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-fade-in space-y-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold inline-block">
          📅 Outfit for Occasion
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900">
          แต่งตัวตามโอกาส & สถานการณ์
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          เลือกสถานการณ์ที่คุณกำลังจะไป ไม่ว่าจะเป็นไปเรียน ไปคาเฟ่ สัมภาษณ์งาน หรือไปเดต เพื่อรับคู่สีและแนวทางที่เหมาะสม
        </p>
      </div>

      {/* Filter and Search */}
      <div className="p-4 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ค้นหาโอกาส เช่น คาเฟ่, มหาวิทยาลัย, วันเกิด, สัมภาษณ์..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3.5 py-2 rounded-xl whitespace-nowrap font-medium transition-colors ${
                categoryFilter === cat
                  ? 'bg-emerald-600 text-white font-bold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat === 'All' ? 'ทุกโอกาส' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Occasions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((occ) => (
          <div
            key={occ.id}
            className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                  {occ.category}
                </span>
                <span className="text-xs text-slate-400 font-medium">{occ.name}</span>
              </div>

              <h3 className="text-lg font-bold text-slate-900 mb-1">{occ.thaiName}</h3>
              <p className="text-xs text-emerald-600 font-semibold mb-3">ฟีลลิ่ง: {occ.vibe}</p>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                <strong>หัวใจของการแต่งตัว: </strong>
                {occ.stylingKey}
              </p>

              {/* Suggestions */}
              <div className="space-y-1.5 p-3.5 rounded-2xl bg-slate-50 text-xs text-slate-700 mb-4">
                <p>
                  <strong>ท่อนบน: </strong>
                  {occ.topSuggestion}
                </p>
                <p>
                  <strong>ท่อนล่าง: </strong>
                  {occ.bottomSuggestion}
                </p>
                <p>
                  <strong>รองเท้า: </strong>
                  {occ.shoeSuggestion}
                </p>
              </div>

              {/* Recommended Colors */}
              <div className="mb-4">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  โทนสีแนะนำ:
                </p>
                <div className="flex items-center gap-2">
                  {occ.colorHexes.map((hex, i) => (
                    <div
                      key={i}
                      className="w-5 h-5 rounded-full border border-black/10 shadow-xs"
                      style={{ backgroundColor: hex }}
                      title={occ.recommendedColors[i]}
                    />
                  ))}
                  <span className="text-[11px] text-slate-500 font-medium ml-1">
                    {occ.recommendedColors.join(', ')}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onNavigate('/analyze')}
              className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-emerald-600 hover:text-white text-slate-700 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>สร้าง Look สำหรับ{occ.thaiName}</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
