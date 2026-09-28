import React, { useState } from 'react';
import { Sparkles, Search, Filter, Copy, Check, Heart, Plus } from 'lucide-react';
import { StorageService } from '../services/storage';
import { MakeupCatalogItem } from '../types';

interface MakeupPageProps {
  onNavigate: (path: string) => void;
}

export const MakeupPage: React.FC<MakeupPageProps> = ({ onNavigate }) => {
  const allMakeup = StorageService.getMakeup();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [toneFilter, setToneFilter] = useState<string>('All');
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  const categories = ['All', 'Lip', 'Blush', 'Eyeshadow', 'Foundation'];
  const tones = ['All', 'Warm Tone', 'Cool Tone', 'Neutral Tone'];

  const filtered = allMakeup.filter((item) => {
    const matchSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.thaiName.includes(searchTerm) ||
      item.description.includes(searchTerm);
    const matchCategory = categoryFilter === 'All' || item.category === categoryFilter;
    const matchTone = toneFilter === 'All' || item.tone === toneFilter || item.tone === 'All';
    return matchSearch && matchCategory && matchTone;
  });

  const handleCopy = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 1500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-fade-in space-y-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="px-3.5 py-1 rounded-full bg-pink-100 text-pink-700 text-xs font-bold inline-block">
          💄 Makeup Palette & Shades
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900">
          คอลเลกชันเฉดสีเครื่องสำอาง
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          ค้นหาเฉดสีลิปสติก บลัชออน อายแชโดว์ และโทนรองพื้นที่เข้ากับสีผิวของคุณ พร้อมฟินิชและคำแนะนำโอกาสที่เหมาะสม
        </p>
      </div>

      {/* Search and Filter Bar */}
      <div className="p-4 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ค้นหาชื่อเฉดสี เช่น คอรัล, เบอร์รี่, นู้ด, พีช..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500"
            />
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                  categoryFilter === cat
                    ? 'bg-pink-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Tone Filters */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-100 text-xs">
          <span className="text-slate-400 font-medium">โทนสีผิว:</span>
          {tones.map((t) => (
            <button
              key={t}
              onClick={() => setToneFilter(t)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                toneFilter === t
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Makeup Items */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center text-slate-400 bg-white rounded-3xl border border-slate-200">
          <p className="text-sm">ไม่พบเครื่องสำอางที่ตรงกับเงื่อนไขการค้นหา</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-pink-300 transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Color Swatch Circle */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-2xl shadow-inner border border-black/10 transition-transform group-hover:scale-105"
                      style={{ backgroundColor: item.hexCode }}
                    />
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        {item.category}
                      </span>
                      <p className="text-xs text-slate-400 font-mono mt-0.5">{item.hexCode}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleCopy(item.hexCode)}
                    className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                    title="คัดลอกโค้ดสี"
                  >
                    {copiedHex === item.hexCode ? (
                      <Check className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>

                <h3 className="font-bold text-slate-900 text-sm mb-0.5">{item.name}</h3>
                <p className="text-xs text-pink-600 font-semibold mb-2">{item.thaiName}</p>
                <p className="text-xs text-slate-500 leading-relaxed line-clamp-3 mb-4">
                  {item.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="font-medium text-slate-600">ฟินิช: {item.finish}</span>
                <span className="px-2 py-0.5 rounded-md bg-pink-50 text-pink-700 font-semibold">
                  {item.tone}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
