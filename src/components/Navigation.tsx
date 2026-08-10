import React from 'react';
import { Home, Dumbbell, BarChart3, Bot, User } from 'lucide-react';

export type NavTab = 'home' | 'workout' | 'progress' | 'aicoach' | 'profile';

interface NavigationProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  activeWorkoutRunning?: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  setActiveTab,
  activeWorkoutRunning
}) => {
  const navItems: { id: NavTab; label: string; icon: any; badge?: boolean }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'workout', label: 'Workout', icon: Dumbbell, badge: activeWorkoutRunning },
    { id: 'progress', label: 'Progress', icon: BarChart3 },
    { id: 'aicoach', label: 'AI Coach', icon: Bot },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 dark:bg-slate-950/95 backdrop-blur-xl border-t border-slate-800/80 px-2 py-2 safe-area-pb">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`relative flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl transition-all duration-200 ${
                isActive
                  ? 'text-emerald-400 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              {isActive && (
                <div className="absolute inset-0 bg-emerald-500/10 rounded-2xl border border-emerald-500/20" />
              )}
              
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-110 text-emerald-400' : ''}`} />
                {item.badge && (
                  <span className="absolute -top-1 -right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full animate-ping" />
                )}
                {item.badge && (
                  <span className="absolute -top-1 -right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full" />
                )}
              </div>

              <span className="relative text-[11px] mt-1 font-medium tracking-tight">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
