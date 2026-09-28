import React, { useState } from 'react';
import {
  Sparkles,
  Compass,
  Palette,
  Scissors,
  Shirt,
  Calendar,
  PartyPopper,
  Bookmark,
  Shield,
  User as UserIcon,
  LogOut,
  Menu,
  X,
  KeyRound,
  Info
} from 'lucide-react';
import { User } from '../../types';
import { AuthService } from '../../services/authService';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  currentUser: User | null;
  onOpenAdminPasscode: () => void;
  onLogout: () => void;
  savedCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPath,
  onNavigate,
  currentUser,
  onOpenAdminPasscode,
  onLogout,
  savedCount
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const isAdmin = currentUser?.role === 'admin';

  const navLinks = [
    { label: 'หน้าแรก', path: '/home' },
    { label: 'วิเคราะห์สไตล์', path: '/analyze' },
    { label: 'เมคอัพ', path: '/makeup' },
    { label: 'ทรงผม', path: '/hairstyle' },
    { label: 'แฟชั่นชุด', path: '/outfits' },
    { label: 'ตามโอกาส', path: '/occasion' },
    { label: 'เทศกาล', path: '/festival' },
    { label: 'สไตล์', path: '/style' },
    { label: 'เกี่ยวกับ', path: '/about' }
  ];

  const handleLinkClick = (path: string) => {
    onNavigate(path);
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <div
            onClick={() => handleLinkClick('/home')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-500 via-rose-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-pink-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-black bg-gradient-to-r from-slate-900 via-pink-600 to-indigo-600 bg-clip-text text-transparent">
                StyleMatch
              </span>
              <span className="ml-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-pink-100 text-pink-700">
                AI
              </span>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const isActive = currentPath === link.path;
              return (
                <button
                  key={link.path}
                  onClick={() => handleLinkClick(link.path)}
                  className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-pink-50 text-pink-600 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* Saved button */}
            <button
              onClick={() => handleLinkClick('/saved')}
              className={`p-2.5 rounded-xl border relative transition-colors ${
                currentPath === '/saved'
                  ? 'border-pink-300 bg-pink-50 text-pink-600'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-100/70'
              }`}
              title="ชุดที่บันทึกไว้"
            >
              <Bookmark className="w-4 h-4" />
              {savedCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-pink-500 text-white text-[10px] font-bold flex items-center justify-center shadow-sm">
                  {savedCount}
                </span>
              )}
            </button>

            {/* Admin Backoffice button or passcode unlock */}
            {isAdmin ? (
              <button
                onClick={() => handleLinkClick('/admin/dashboard')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                  currentPath.startsWith('/admin')
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/20'
                    : 'border-indigo-200 bg-indigo-50/70 text-indigo-700 hover:bg-indigo-100'
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                <span>ระบบแอดมิน</span>
              </button>
            ) : (
              <button
                onClick={onOpenAdminPasscode}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 border border-slate-200 hover:bg-slate-100/70 transition-colors"
                title="ใส่รหัสระบบหลังบ้าน"
              >
                <KeyRound className="w-3.5 h-3.5 text-slate-500" />
                <span>รหัสแอดมิน</span>
              </button>
            )}

            {/* User Profile / Login */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 pr-3 rounded-2xl border border-slate-200 hover:border-slate-300 transition-all bg-white"
                >
                  <img
                    src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'}
                    alt={currentUser.name}
                    className="w-7 h-7 rounded-xl object-cover ring-2 ring-pink-500/20"
                  />
                  <div className="text-left hidden md:block">
                    <p className="text-xs font-bold text-slate-800 leading-none">{currentUser.name}</p>
                    <span className="text-[10px] text-pink-600 font-medium">
                      {currentUser.role === 'admin' ? '🛡️ Admin' : '✨ Member'}
                    </span>
                  </div>
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-scale-in">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-800">{currentUser.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                    </div>

                    <button
                      onClick={() => handleLinkClick('/profile')}
                      className="w-full px-4 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <UserIcon className="w-4 h-4 text-slate-400" />
                      <span>โปรไฟล์สไตล์ของฉัน</span>
                    </button>

                    <button
                      onClick={() => handleLinkClick('/saved')}
                      className="w-full px-4 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <Bookmark className="w-4 h-4 text-slate-400" />
                      <span>ชุดที่บันทึกไว้ ({savedCount})</span>
                    </button>

                    {isAdmin && (
                      <button
                        onClick={() => handleLinkClick('/admin/dashboard')}
                        className="w-full px-4 py-2 text-left text-xs font-medium text-indigo-700 hover:bg-indigo-50 flex items-center gap-2"
                      >
                        <Shield className="w-4 h-4 text-indigo-500" />
                        <span>แผงควบคุมแอดมิน</span>
                      </button>
                    )}

                    <div className="my-1 border-t border-slate-100" />

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onLogout();
                      }}
                      className="w-full px-4 py-2 text-left text-xs font-medium text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>ออกจากระบบ</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => handleLinkClick('/login')}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors"
              >
                เข้าสู่ระบบ
              </button>
            )}

            {/* CTA Analyze Button */}
            <button
              onClick={() => handleLinkClick('/analyze')}
              className="hidden xl:flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 via-rose-500 to-indigo-600 text-white font-bold text-xs shadow-md shadow-pink-500/25 hover:opacity-95 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>เริ่มวิเคราะห์</span>
            </button>
          </div>

          {/* Mobile hamburger button */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={() => handleLinkClick('/analyze')}
              className="p-2 rounded-xl bg-pink-500 text-white"
            >
              <Sparkles className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white/95 backdrop-blur-lg px-4 pt-3 pb-6 space-y-2 animate-fade-in">
          <div className="grid grid-cols-2 gap-2 mb-3">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => handleLinkClick(link.path)}
                className={`p-2.5 rounded-xl text-xs text-left font-medium ${
                  currentPath === link.path
                    ? 'bg-pink-100 text-pink-700 font-bold'
                    : 'bg-slate-50 text-slate-700'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={onOpenAdminPasscode}
              className="flex items-center gap-2 text-xs font-semibold text-slate-700 p-2"
            >
              <KeyRound className="w-4 h-4 text-pink-500" />
              <span>ใส่รหัสระบบหลังบ้าน (Admin)</span>
            </button>
            {currentUser ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onLogout();
                }}
                className="text-xs font-semibold text-rose-600 p-2 flex items-center gap-1"
              >
                <LogOut className="w-4 h-4" />
                <span>ออกจากระบบ</span>
              </button>
            ) : (
              <button
                onClick={() => handleLinkClick('/login')}
                className="text-xs font-bold text-pink-600 p-2"
              >
                เข้าสู่ระบบ / ลงทะเบียน
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
