import React from 'react';
import { Home, Sparkles, Shirt, Bookmark, User as UserIcon } from 'lucide-react';

interface BottomNavProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  savedCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentPath,
  onNavigate,
  savedCount
}) => {
  const items = [
    { label: 'Home', path: '/home', icon: Home },
    { label: 'Analyze', path: '/analyze', icon: Sparkles, isHighlight: true },
    { label: 'Style', path: '/style', icon: Shirt },
    { label: 'Saved', path: '/saved', icon: Bookmark, badge: savedCount },
    { label: 'Profile', path: '/profile', icon: UserIcon }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200/90 sm:hidden px-2 py-1.5 safe-area-pb shadow-lg">
      <div className="flex items-center justify-around">
        {items.map((item) => {
          const isActive = currentPath === item.path;
          const Icon = item.icon;

          if (item.isHighlight) {
            return (
              <button
                key={item.path}
                onClick={() => onNavigate(item.path)}
                className="flex flex-col items-center justify-center -mt-5 group"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-pink-500 via-rose-500 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-pink-500/40 group-active:scale-95 transition-transform">
                  <Icon className="w-6 h-6 animate-pulse" />
                </div>
                <span className="text-[10px] font-bold text-pink-600 mt-1">
                  {item.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={item.path}
              onClick={() => onNavigate(item.path)}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-colors relative ${
                isActive ? 'text-pink-600 font-bold' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] mt-0.5">{item.label}</span>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="absolute top-0 right-2 w-4 h-4 rounded-full bg-pink-500 text-white text-[9px] font-bold flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
