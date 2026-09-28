import React from 'react';
import {
  LayoutDashboard,
  Users,
  Palette,
  Scissors,
  Shirt,
  Calendar,
  PartyPopper,
  Sparkles,
  FileText,
  Settings,
  ArrowLeft,
  ShieldAlert,
  LogOut
} from 'lucide-react';
import { User } from '../../types';

interface AdminLayoutProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  currentUser: User | null;
  onOpenAdminPasscode: () => void;
  onLogout: () => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentPath,
  onNavigate,
  currentUser,
  onOpenAdminPasscode,
  onLogout,
  children
}) => {
  const isAdmin = currentUser?.role === 'admin';

  const menuItems = [
    { label: 'แดชบอร์ดหลัก', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'จัดการสมาชิก (Users)', path: '/admin/users', icon: Users },
    { label: 'ข้อมูลเมคอัพ (Makeup)', path: '/admin/makeup', icon: Palette },
    { label: 'ข้อมูลทรงผม (Hairstyles)', path: '/admin/hairstyles', icon: Scissors },
    { label: 'ข้อมูลชุดแต่งกาย (Outfits)', path: '/admin/outfits', icon: Shirt },
    { label: 'โอกาส (Occasions)', path: '/admin/occasions', icon: Calendar },
    { label: 'เทศกาล (Festivals)', path: '/admin/festivals', icon: PartyPopper },
    { label: 'สไตล์แฟชั่น (Styles)', path: '/admin/styles', icon: Sparkles },
    { label: 'บันทึกระบบ (Logs & Audit)', path: '/admin/logs', icon: FileText },
    { label: 'ตั้งค่า & รหัสผ่าน (Settings)', path: '/admin/settings', icon: Settings }
  ];

  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-5 animate-fade-in">
        <div className="w-16 h-16 rounded-3xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-slate-900">พื้นที่สงวนเฉพาะผู้ดูแลระบบ</h2>
        <p className="text-xs text-slate-600 leading-relaxed">
          คุณต้องมีสิทธิ์ระดับ Admin หรือใส่รหัสผ่านความปลอดภัยระบบหลังบ้านเพื่อเข้าใช้งานหน้านี้
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <button
            onClick={onOpenAdminPasscode}
            className="px-6 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md"
          >
            🔑 ใส่รหัสผ่านระบบหลังบ้าน (Passcode)
          </button>
          <button
            onClick={() => onNavigate('/home')}
            className="px-6 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
          >
            กลับสู่หน้าหลัก
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col md:flex-row animate-fade-in">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-950 border-r border-slate-800 p-5 flex flex-col justify-between shrink-0">
        <div className="space-y-6">
          {/* Logo & return to site */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-pink-500 to-indigo-600 flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-black text-base tracking-tight text-white">
                StyleMatch <span className="text-pink-400 text-xs">Admin</span>
              </span>
            </div>
            <button
              onClick={() => onNavigate('/home')}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="กลับสู่หน้าเว็บผู้ใช้"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>

          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3">
            <img
              src={currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80'}
              alt="Admin"
              className="w-9 h-9 rounded-xl object-cover ring-2 ring-indigo-500"
            />
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-white truncate">{currentUser?.name}</p>
              <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Super Admin
              </span>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const isActive = currentPath === item.path;
              const Icon = item.icon;
              return (
                <button
                  key={item.path}
                  onClick={() => onNavigate(item.path)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-pink-500/20 to-indigo-500/20 text-pink-400 border border-pink-500/30 font-bold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="pt-6 border-t border-slate-800 space-y-2">
          <button
            onClick={() => onNavigate('/home')}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-medium text-slate-300 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>กลับสู่หน้าเว็บไซต์</span>
          </button>
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-medium text-rose-400 hover:bg-rose-500/10 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>ออกจากระบบ</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-8 max-w-6xl overflow-y-auto">
        {children}
      </main>
    </div>
  );
};
