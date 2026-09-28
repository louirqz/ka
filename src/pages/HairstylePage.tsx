import React, { useState } from 'react';
import { Search, Scissors, Sparkles, Check, ChevronRight } from 'lucide-react';
import { StorageService } from '../services/storage';
import { FaceShapeType } from '../types';

interface HairstylePageProps {
  onNavigate: (path: string) => void;
}

export const HairstylePage: React.FC<HairstylePageProps> = ({ onNavigate }) => {
  const allHairstyles = StorageService.getHairstyles();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedShape, setSelectedShape] = useState<string>('All');
  const [selectedLength, setSelectedLength] = useState<string>('All');
  const [selectedLook, setSelectedLook] = useState<string>('All');

  const faceShapes = ['All', 'Oval', 'Round', 'Square', 'Rectangle', 'Heart', 'Diamond'];
  const lengths = ['All', 'Short', 'Medium', 'Long'];
  const lookTypes = ['All', 'Korean', 'Cute', 'Cool', 'Clean', 'Smart', 'Casual', 'Sporty', 'Chic'];

  const filtered = allHairstyles.filter((h) => {
    const matchSearch =
      h.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.thaiName.includes(searchTerm) ||
      h.description.includes(searchTerm) ||
      h.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchShape = selectedShape === 'All' || h.faceShapes.includes(selectedShape as FaceShapeType);
    const matchLength = selectedLength === 'All' || h.length === selectedLength;
    const matchLook = selectedLook === 'All' || h.looks.includes(selectedLook);
    return matchSearch && matchShape && matchLength && matchLook;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-fade-in space-y-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="px-3.5 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-bold inline-block">
          💇 Hairstyle Inspiration & Shapes
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900">
          คอลเลกชันทรงผมตามรูปหน้า
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          เลือกทรงผมที่รับกับกรอบหน้าและบุคลิกภาพ ไม่ว่าจะเป็นผมสั้น บ็อบ เลเยอร์ วูล์ฟคัท หน้าม้าเคิร์ทเท่น หรือทูบล็อก
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ค้นหาชื่อทรงผม เช่น วูล์ฟคัท, บ็อบ, เคิร์ทเท่น, ทูบล็อก, ลอนคลาย..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
          />
        </div>

        {/* Filter Pills */}
        <div className="space-y-3 pt-2 text-xs">
          {/* Face Shapes */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <span className="text-slate-400 font-semibold whitespace-nowrap">รูปหน้า:</span>
            {faceShapes.map((shape) => (
              <button
                key={shape}
                onClick={() => setSelectedShape(shape)}
                className={`px-3 py-1.5 rounded-xl whitespace-nowrap font-medium transition-colors ${
                  selectedShape === shape
                    ? 'bg-purple-600 text-white font-bold'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {shape === 'All' ? 'ทั้งหมด' : shape}
              </button>
            ))}
          </div>

          {/* Lengths and Looks */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-slate-400 font-semibold">ความยาว:</span>
            {lengths.map((len) => (
              <button
                key={len}
                onClick={() => setSelectedLength(len)}
                className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                  selectedLength === len
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {len === 'All' ? 'ทุกความยาว' : len}
              </button>
            ))}

            <span className="text-slate-300 mx-2">|</span>

            <span className="text-slate-400 font-semibold">ลุค:</span>
            {lookTypes.slice(0, 6).map((look) => (
              <button
                key={look}
                onClick={() => setSelectedLook(look)}
                className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                  selectedLook === look
                    ? 'bg-pink-600 text-white font-bold'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {look === 'All' ? 'ทุกลุค' : look}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of Hairstyles */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center text-slate-400 bg-white rounded-3xl border border-slate-200">
          <p className="text-sm">ไม่พบทรงผมที่ตรงกับเงื่อนไขที่เลือก</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((hair) => (
            <div
              key={hair.id}
              className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-purple-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-[10px] font-bold">
                    {hair.category} • {hair.length}
                  </span>
                  <div className="flex gap-1">
                    {hair.looks.map((lk) => (
                      <span
                        key={lk}
                        className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[9px] font-semibold"
                      >
                        {lk}
                      </span>
                    ))}
                  </div>
                </div>

                <h3 className="text-base font-bold text-slate-900 mb-1">{hair.name}</h3>
                <p className="text-xs text-purple-700 font-medium mb-3">{hair.thaiName}</p>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">{hair.description}</p>
              </div>

              <div className="space-y-3 pt-3 border-t border-slate-100 text-xs">
                <div className="p-3 rounded-2xl bg-slate-50 text-slate-700">
                  <strong className="text-slate-900 block font-semibold mb-0.5">💡 ทริคการจัดทรง:</strong>
                  <p className="text-[11px] leading-relaxed text-slate-600">{hair.stylingTips}</p>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>เหมาะกับ: {hair.faceShapes.join(', ')}</span>
                  {hair.genderNeutral && (
                    <span className="text-emerald-600 font-semibold">Gender-neutral</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
