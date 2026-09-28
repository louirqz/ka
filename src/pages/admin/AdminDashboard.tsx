import React from 'react';
import {
  Users,
  Activity,
  Sparkles,
  Bookmark,
  TrendingUp,
  Palette,
  Calendar,
  CheckCircle2
} from 'lucide-react';
import { StorageService } from '../../services/storage';

export const AdminDashboard: React.FC = () => {
  const users = StorageService.getUsers();
  const activeUsersCount = users.filter((u) => u.status === 'active').length;
  const analysisCount = StorageService.getAnalysisCount();
  const savedLooksCount = StorageService.getSavedLooks().length;
  const outfitsCount = StorageService.getOutfits().length;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">แผงควบคุมระบบ (Admin Dashboard)</h1>
        <p className="text-xs text-slate-400 mt-1">
          ภาพรวมสถิติการใช้งานระบบ StyleMatch AI ข้อมูลสมาชิก และกิจกรรมการวิเคราะห์
        </p>
      </div>

      {/* 6 Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Total Users */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
          <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
            <Users className="w-4 h-4" />
          </div>
          <span className="text-[11px] text-slate-400">Total Users</span>
          <p className="text-xl font-bold text-white">{users.length} คน</p>
        </div>

        {/* Active Users */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <Activity className="w-4 h-4" />
          </div>
          <span className="text-[11px] text-slate-400">Active Users</span>
          <p className="text-xl font-bold text-emerald-400">{activeUsersCount} บัญชี</p>
        </div>

        {/* Style Analyses */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
          <div className="w-8 h-8 rounded-xl bg-pink-500/10 text-pink-400 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="text-[11px] text-slate-400">Style Analyses</span>
          <p className="text-xl font-bold text-pink-400">{analysisCount} ครั้ง</p>
        </div>

        {/* Saved Outfits */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
          <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
            <Bookmark className="w-4 h-4" />
          </div>
          <span className="text-[11px] text-slate-400">Saved Outfits</span>
          <p className="text-xl font-bold text-purple-400">{savedLooksCount} รายการ</p>
        </div>

        {/* Popular Style */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
            <TrendingUp className="w-4 h-4" />
          </div>
          <span className="text-[11px] text-slate-400">Popular Style</span>
          <p className="text-base font-bold text-amber-400 truncate">Korean / Minimal</p>
        </div>

        {/* Popular Color */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
          <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center">
            <Palette className="w-4 h-4" />
          </div>
          <span className="text-[11px] text-slate-400">Popular Color</span>
          <p className="text-base font-bold text-rose-400 truncate">Warm Coral & Peach</p>
        </div>
      </div>

      {/* SVG Interactive Graphs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: User Growth */}
        <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">การเติบโตของผู้ใช้งาน (User Growth)</h3>
              <p className="text-[11px] text-slate-400">สถิติ 6 เดือนที่ผ่านมา</p>
            </div>
            <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-full">
              +48% YoY
            </span>
          </div>

          <div className="h-44 w-full flex items-end justify-between gap-2 pt-6 px-2">
            {[
              { month: 'เม.ย.', val: 35, users: '420' },
              { month: 'พ.ค.', val: 48, users: '580' },
              { month: 'มิ.ย.', val: 62, users: '760' },
              { month: 'ก.ค.', val: 78, users: '940' },
              { month: 'ส.ค.', val: 90, users: '1,120' },
              { month: 'ก.ย.', val: 110, users: '1,380' }
            ].map((bar, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                <span className="text-[10px] text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  {bar.users}
                </span>
                <div
                  className="w-full rounded-t-xl bg-gradient-to-t from-indigo-600 to-pink-500 hover:from-indigo-500 hover:to-pink-400 transition-all cursor-pointer"
                  style={{ height: `${(bar.val / 110) * 110}px` }}
                />
                <span className="text-[10px] text-slate-400 font-medium">{bar.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 2: Analysis Activity */}
        <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">กิจกรรมการวิเคราะห์สไตล์ (Analysis Activity)</h3>
              <p className="text-[11px] text-slate-400">รายสัปดาห์</p>
            </div>
            <span className="text-xs text-pink-400 font-bold bg-pink-500/10 px-2.5 py-1 rounded-full">
              {analysisCount} Analyses
            </span>
          </div>

          <div className="h-44 w-full flex items-end justify-between gap-2 pt-6 px-2">
            {[
              { day: 'จันทร์', height: 45 },
              { day: 'อังคาร', height: 60 },
              { day: 'พุธ', height: 75 },
              { day: 'พฤหัส', height: 50 },
              { day: 'ศุกร์', height: 95 },
              { day: 'เสาร์', height: 110 },
              { day: 'อาทิตย์', height: 120 }
            ].map((bar, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                <span className="text-[10px] text-pink-300 opacity-0 group-hover:opacity-100 transition-opacity">
                  {bar.height * 2}
                </span>
                <div
                  className="w-full rounded-t-xl bg-gradient-to-t from-pink-600 to-rose-400 hover:opacity-90 transition-all cursor-pointer"
                  style={{ height: `${(bar.height / 120) * 110}px` }}
                />
                <span className="text-[10px] text-slate-400 font-medium">{bar.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 3: Popular Styles */}
        <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white">สไตล์ที่ได้รับความนิยมสูงสุด (Popular Styles)</h3>
          <div className="space-y-3">
            {[
              { name: 'Korean Aesthetic', pct: 38, count: '38%', color: 'bg-pink-500' },
              { name: 'Minimal & Clean', pct: 26, count: '26%', color: 'bg-indigo-500' },
              { name: 'Streetwear & Baggy', pct: 18, count: '18%', color: 'bg-purple-500' },
              { name: 'Y2K Cyber Retro', pct: 10, count: '10%', color: 'bg-amber-500' },
              { name: 'Casual Daily', pct: 8, count: '8%', color: 'bg-emerald-500' }
            ].map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-medium">{item.name}</span>
                  <span className="text-slate-400">{item.count}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full ${item.color} rounded-full`}
                    style={{ width: `${item.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 4: Popular Occasion */}
        <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white">โอกาสที่ผู้ใช้ค้นหาบ่อยสุด (Popular Occasions)</h3>
          <div className="space-y-3">
            {[
              { name: 'ไปคาเฟ่ (Cafe Hopping)', pct: 34, count: '34%', color: 'bg-emerald-500' },
              { name: 'ไปมหาวิทยาลัย (University)', pct: 24, count: '24%', color: 'bg-blue-500' },
              { name: 'ไปออกเดต (Romantic Date)', pct: 20, count: '20%', color: 'bg-rose-500' },
              { name: 'ไปสัมภาษณ์งาน (Job Interview)', pct: 14, count: '14%', color: 'bg-indigo-500' },
              { name: 'งานเทศกาล (Festivals)', pct: 8, count: '8%', color: 'bg-purple-500' }
            ].map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-medium">{item.name}</span>
                  <span className="text-slate-400">{item.count}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full ${item.color} rounded-full`}
                    style={{ width: `${item.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
