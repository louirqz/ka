import React, { useState } from 'react';
import { Search, Shirt, Bookmark, Check, Sparkles, Filter } from 'lucide-react';
import { StorageService } from '../services/storage';
import { OutfitCatalogItem } from '../types';

interface OutfitsPageProps {
  onNavigate: (path: string) => void;
  onSaveLook: () => void;
}

export const OutfitsPage: React.FC<OutfitsPageProps> = ({ onNavigate, onSaveLook }) => {
  const allOutfits = StorageService.getOutfits();
  const [searchTerm, setSearchTerm] = useState('');
  const [styleFilter, setStyleFilter] = useState('All');
  const [occasionFilter, setOccasionFilter] = useState('All');
  const [seasonFilter, setSeasonFilter] = useState('All');
  const [savedId, setSavedId] = useState<string | null>(null);

  const styles = ['All', 'Minimal', 'Street', 'Korean', 'Smart Casual', 'Casual', 'Y2K', 'Cute', 'Cool', 'Luxury', 'Japanese', 'Vintage', 'Sporty', 'Formal'];
  const seasons = ['All', 'Summer', 'Winter', 'Rainy'];

  const filtered = allOutfits.filter((item) => {
    const matchSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.thaiTitle.includes(searchTerm) ||
      item.top.includes(searchTerm) ||
      item.bottom.includes(searchTerm) ||
      item.description.includes(searchTerm);
    const matchStyle = styleFilter === 'All' || item.style === styleFilter;
    const matchOccasion = occasionFilter === 'All' || item.occasion === occasionFilter;
    const matchSeason = seasonFilter === 'All' || item.season === seasonFilter || item.season === 'All';
    return matchSearch && matchStyle && matchOccasion && matchSeason;
  });

  const handleSaveOutfit = (outfit: OutfitCatalogItem) => {
    StorageService.saveLook({
      id: `outfit_saved_${outfit.id}_${Date.now()}`,
      title: outfit.title,
      date: new Date().toISOString().substring(0, 10),
      theme: `${outfit.style} Style Look`,
      occasion: outfit.occasion,
      vibe: outfit.description,
      skinTone: 'Warm Tone',
      faceShape: 'Oval',
      bodyProportion: 'Straight',
      makeupSummary: 'เมคอัพโทนธรรมชาติเข้ากับสีชุด',
      hairSummary: 'ทรงผมสไตล์รีแลกซ์เข้ากับชุด',
      top: outfit.top,
      bottom: outfit.bottom,
      shoes: outfit.shoes,
      accessories: outfit.accessories,
      colorPalette: outfit.hexPalette.map((hex, i) => ({ name: outfit.colors[i] || 'Color', hex })),
      harmonyExplanation: outfit.description,
      isFavorite: true
    });

    setSavedId(outfit.id);
    onSaveLook();
    setTimeout(() => setSavedId(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-fade-in space-y-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="px-3.5 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold inline-block">
          👕 Outfits & Wardrobe Matching
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900">
          คอลเลกชันไอเดียการแต่งตัว
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          รวมไอเดียการแมตช์เสื้อ กางเกง กระโปรง รองเท้า และเครื่องประดับ กว่า 30+ สไตล์ สำหรับทุกสถานการณ์
        </p>
      </div>

      {/* Search and Filters */}
      <div className="p-4 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ค้นหาไอเดียชุด เช่น เบลเซอร์, ลินิน, เดนิม, คาร์โก้, เดรส..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        {/* Styles Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-400 font-semibold whitespace-nowrap">สไตล์:</span>
          {styles.map((st) => (
            <button
              key={st}
              onClick={() => setStyleFilter(st)}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap font-medium transition-colors ${
                styleFilter === st
                  ? 'bg-blue-600 text-white font-bold'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Seasons */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-100 text-xs">
          <span className="text-slate-400 font-semibold">ฤดูกาล:</span>
          {seasons.map((s) => (
            <button
              key={s}
              onClick={() => setSeasonFilter(s)}
              className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                seasonFilter === s
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Outfits */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center text-slate-400 bg-white rounded-3xl border border-slate-200">
          <p className="text-sm">ไม่พบชุดที่ตรงกับเงื่อนไขการค้นหา</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((outfit) => (
            <div
              key={outfit.id}
              className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold">
                      {outfit.style}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-medium">
                      {outfit.occasion}
                    </span>
                  </div>

                  <button
                    onClick={() => handleSaveOutfit(outfit)}
                    className="p-2 rounded-xl text-slate-400 hover:text-pink-600 hover:bg-pink-50 transition-colors"
                    title="บันทึกชุดนี้"
                  >
                    {savedId === outfit.id ? (
                      <Check className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <Bookmark className="w-4 h-4" />
                    )}
                  </button>
                </div>

                <h3 className="text-base font-bold text-slate-900 mb-1">{outfit.title}</h3>
                <p className="text-xs text-blue-600 font-semibold mb-3">{outfit.thaiTitle}</p>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">{outfit.description}</p>

                {/* Outfit breakdown */}
                <div className="space-y-2 p-3.5 rounded-2xl bg-slate-50 text-xs text-slate-700 mb-4">
                  <div className="flex items-start gap-2">
                    <span className="font-semibold text-slate-900 shrink-0">เสื้อ:</span>
                    <span>{outfit.top}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-semibold text-slate-900 shrink-0">กางเกง/กระโปรง:</span>
                    <span>{outfit.bottom}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-semibold text-slate-900 shrink-0">รองเท้า:</span>
                    <span>{outfit.shoes}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-semibold text-slate-900 shrink-0">พร็อพ:</span>
                    <span>{outfit.accessories}</span>
                  </div>
                </div>
              </div>

              {/* Color chips */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  {outfit.hexPalette.map((hex, i) => (
                    <div
                      key={i}
                      className="w-5 h-5 rounded-full border border-black/10 shadow-xs"
                      style={{ backgroundColor: hex }}
                      title={outfit.colors[i]}
                    />
                  ))}
                </div>
                <button
                  onClick={() => handleSaveOutfit(outfit)}
                  className="text-pink-600 font-bold hover:underline text-[11px]"
                >
                  {savedId === outfit.id ? 'บันทึกแล้ว ✨' : '+ บันทึกชุด'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
