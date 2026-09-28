import React, { useState } from 'react';
import {
  Palette,
  Scissors,
  Shirt,
  Calendar,
  PartyPopper,
  Sparkles,
  Plus,
  Trash2,
  Edit2,
  Search,
  Check
} from 'lucide-react';
import { StorageService } from '../../services/storage';
import {
  MakeupCatalogItem,
  HairstyleCatalogItem,
  OutfitCatalogItem
} from '../../types';

export const AdminDataManagement: React.FC<{ activeTab?: string }> = ({
  activeTab = 'makeup'
}) => {
  const [tab, setTab] = useState<'makeup' | 'hairstyles' | 'outfits'>('makeup');
  const [searchTerm, setSearchTerm] = useState('');

  // Datasets
  const [makeupList, setMakeupList] = useState(StorageService.getMakeup());
  const [hairList, setHairList] = useState(StorageService.getHairstyles());
  const [outfitList, setOutfitList] = useState(StorageService.getOutfits());

  // Modal for adding
  const [addModalOpen, setAddModalOpen] = useState(false);

  // New Makeup Form
  const [newMakeup, setNewMakeup] = useState<Partial<MakeupCatalogItem>>({
    name: '',
    thaiName: '',
    category: 'Lip',
    tone: 'Warm Tone',
    hexCode: '#E77461',
    finish: 'Velvet',
    description: ''
  });

  const handleDeleteMakeup = (id: string) => {
    if (confirm('คุณต้องการลบข้อมูลเครื่องสำอางนี้ใช่หรือไม่?')) {
      StorageService.deleteMakeup(id);
      setMakeupList(StorageService.getMakeup());
    }
  };

  const handleAddMakeup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMakeup.name || !newMakeup.hexCode) return;

    const item: MakeupCatalogItem = {
      id: `mu_${Date.now()}`,
      name: newMakeup.name || 'New Shade',
      thaiName: newMakeup.thaiName || 'เฉดสีใหม่',
      category: (newMakeup.category as any) || 'Lip',
      tone: (newMakeup.tone as any) || 'Warm Tone',
      hexCode: newMakeup.hexCode || '#E77461',
      colorName: newMakeup.name || '',
      finish: (newMakeup.finish as any) || 'Velvet',
      description: newMakeup.description || 'คำอธิบายเฉดสีใหม่',
      suitableOccasions: ['ไปคาเฟ่', 'ไปเที่ยว']
    };

    StorageService.addMakeup(item);
    setMakeupList(StorageService.getMakeup());
    setAddModalOpen(false);
  };

  const handleDeleteHair = (id: string) => {
    if (confirm('คุณต้องการลบทรงผมนี้ใช่หรือไม่?')) {
      StorageService.deleteHairstyle(id);
      setHairList(StorageService.getHairstyles());
    }
  };

  const handleDeleteOutfit = (id: string) => {
    if (confirm('คุณต้องการลบข้อมูลชุดนี้ใช่หรือไม่?')) {
      StorageService.deleteOutfit(id);
      setOutfitList(StorageService.getOutfits());
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">จัดการข้อมูลระบบ (Catalog Data)</h1>
          <p className="text-xs text-slate-400 mt-1">
            เพิ่ม แก้ไข และลบข้อมูลเครื่องสำอาง ทรงผม และชุดแต่งกายในฐานข้อมูล
          </p>
        </div>

        <button
          onClick={() => setAddModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>เพิ่มข้อมูลใหม่</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 text-xs">
        <button
          onClick={() => setTab('makeup')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-colors ${
            tab === 'makeup'
              ? 'bg-pink-600 text-white'
              : 'text-slate-400 hover:text-white bg-slate-950'
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          <span>เครื่องสำอาง (Makeup: {makeupList.length})</span>
        </button>

        <button
          onClick={() => setTab('hairstyles')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-colors ${
            tab === 'hairstyles'
              ? 'bg-purple-600 text-white'
              : 'text-slate-400 hover:text-white bg-slate-950'
          }`}
        >
          <Scissors className="w-3.5 h-3.5" />
          <span>ทรงผม (Hairstyles: {hairList.length})</span>
        </button>

        <button
          onClick={() => setTab('outfits')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-colors ${
            tab === 'outfits'
              ? 'bg-blue-600 text-white'
              : 'text-slate-400 hover:text-white bg-slate-950'
          }`}
        >
          <Shirt className="w-3.5 h-3.5" />
          <span>ชุดแต่งกาย (Outfits: {outfitList.length})</span>
        </button>
      </div>

      {/* Search */}
      <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ค้นหาข้อมูล..."
            className="w-full pl-9 pr-4 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none"
          />
        </div>
      </div>

      {/* MAKEUP TAB */}
      {tab === 'makeup' && (
        <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden">
          <table className="w-full text-left border-collapse text-xs text-slate-300">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/60 text-slate-400 uppercase text-[10px]">
                <th className="py-3 px-4">เฉดสี / ชื่อ</th>
                <th className="py-3 px-4">หมวดหมู่</th>
                <th className="py-3 px-4">โทนสี (Tone)</th>
                <th className="py-3 px-4">ฟินิช</th>
                <th className="py-3 px-4">โค้ดสี</th>
                <th className="py-3 px-4 text-right">ลบ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {makeupList
                .filter((m) => m.name.toLowerCase().includes(searchTerm.toLowerCase()) || m.thaiName.includes(searchTerm))
                .map((m) => (
                  <tr key={m.id} className="hover:bg-slate-900/40">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-6 h-6 rounded-lg border border-white/20 shrink-0"
                          style={{ backgroundColor: m.hexCode }}
                        />
                        <div>
                          <p className="font-bold text-white">{m.name}</p>
                          <p className="text-[11px] text-slate-400">{m.thaiName}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-300">{m.category}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-md bg-pink-500/10 text-pink-400 text-[10px] font-bold">
                        {m.tone}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-400">{m.finish}</td>
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-400">{m.hexCode}</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleDeleteMakeup(m.id)}
                        className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10"
                        title="ลบข้อมูล"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      {/* HAIRSTYLES TAB */}
      {tab === 'hairstyles' && (
        <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden">
          <table className="w-full text-left border-collapse text-xs text-slate-300">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/60 text-slate-400 uppercase text-[10px]">
                <th className="py-3 px-4">ชื่อทรงผม</th>
                <th className="py-3 px-4">หมวด</th>
                <th className="py-3 px-4">รูปหน้าที่เหมาะ</th>
                <th className="py-3 px-4">ลุค</th>
                <th className="py-3 px-4 text-right">ลบ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {hairList
                .filter((h) => h.name.toLowerCase().includes(searchTerm.toLowerCase()) || h.thaiName.includes(searchTerm))
                .map((h) => (
                  <tr key={h.id} className="hover:bg-slate-900/40">
                    <td className="py-3 px-4">
                      <p className="font-bold text-white">{h.name}</p>
                      <p className="text-[11px] text-slate-400">{h.thaiName}</p>
                    </td>
                    <td className="py-3 px-4 text-purple-400 font-semibold">{h.category}</td>
                    <td className="py-3 px-4 text-slate-400">{h.faceShapes.join(', ')}</td>
                    <td className="py-3 px-4 text-slate-400">{h.looks.join(', ')}</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleDeleteHair(h.id)}
                        className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10"
                        title="ลบข้อมูล"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      {/* OUTFITS TAB */}
      {tab === 'outfits' && (
        <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden">
          <table className="w-full text-left border-collapse text-xs text-slate-300">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/60 text-slate-400 uppercase text-[10px]">
                <th className="py-3 px-4">ชื่อชุด / สไตล์</th>
                <th className="py-3 px-4">โอกาส</th>
                <th className="py-3 px-4">เสื้อ & กางเกง</th>
                <th className="py-3 px-4">ฤดูกาล</th>
                <th className="py-3 px-4 text-right">ลบ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {outfitList
                .filter((o) => o.title.toLowerCase().includes(searchTerm.toLowerCase()) || o.thaiTitle.includes(searchTerm))
                .map((o) => (
                  <tr key={o.id} className="hover:bg-slate-900/40">
                    <td className="py-3 px-4">
                      <p className="font-bold text-white">{o.title}</p>
                      <span className="text-[10px] text-blue-400">{o.style}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-300">{o.occasion}</td>
                    <td className="py-3 px-4 text-slate-400">
                      <span className="truncate block max-w-xs">{o.top} + {o.bottom}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-400">{o.season}</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleDeleteOutfit(o.id)}
                        className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10"
                        title="ลบข้อมูล"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 text-white space-y-4 shadow-2xl relative">
            <button
              onClick={() => setAddModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              ✕
            </button>

            <h3 className="text-base font-bold">เพิ่มเฉดสีเครื่องสำอางใหม่</h3>

            <form onSubmit={handleAddMakeup} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">ชื่อภาษาอังกฤษ</label>
                <input
                  type="text"
                  value={newMakeup.name}
                  onChange={(e) => setNewMakeup({ ...newMakeup, name: e.target.value })}
                  placeholder="เช่น Sunset Rose Glow"
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">ชื่อภาษาไทย</label>
                <input
                  type="text"
                  value={newMakeup.thaiName}
                  onChange={(e) => setNewMakeup({ ...newMakeup, thaiName: e.target.value })}
                  placeholder="เช่น ซันเซ็ทโรสโกลว์"
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1">หมวดหมู่</label>
                  <select
                    value={newMakeup.category}
                    onChange={(e) => setNewMakeup({ ...newMakeup, category: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white"
                  >
                    <option value="Lip">Lip</option>
                    <option value="Blush">Blush</option>
                    <option value="Eyeshadow">Eyeshadow</option>
                    <option value="Foundation">Foundation</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">โทนสี</label>
                  <select
                    value={newMakeup.tone}
                    onChange={(e) => setNewMakeup({ ...newMakeup, tone: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white"
                  >
                    <option value="Warm Tone">Warm Tone</option>
                    <option value="Cool Tone">Cool Tone</option>
                    <option value="Neutral Tone">Neutral Tone</option>
                    <option value="All">All</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1">โค้ดสี HEX</label>
                  <input
                    type="text"
                    value={newMakeup.hexCode}
                    onChange={(e) => setNewMakeup({ ...newMakeup, hexCode: e.target.value })}
                    placeholder="#E77461"
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">ฟินิช</label>
                  <select
                    value={newMakeup.finish}
                    onChange={(e) => setNewMakeup({ ...newMakeup, finish: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white"
                  >
                    <option value="Velvet">Velvet</option>
                    <option value="Matte">Matte</option>
                    <option value="Glossy">Glossy</option>
                    <option value="Satin">Satin</option>
                    <option value="Shimmer">Shimmer</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">คำอธิบาย</label>
                <textarea
                  rows={2}
                  value={newMakeup.description}
                  onChange={(e) => setNewMakeup({ ...newMakeup, description: e.target.value })}
                  placeholder="รายละเอียดและจุดเด่นของสี..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs transition-colors"
              >
                บันทึกเข้าสู่ระบบ
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
