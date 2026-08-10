import React from 'react';
import { Activity, ShieldAlert, Sparkles, Moon, Sun, ShoppingBag, Tv } from 'lucide-react';
import { UserProfile } from '../types';

interface HeaderProps {
  userProfile: UserProfile;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  onOpenAuth: () => void;
  onOpenDisclaimer: () => void;
  onOpenAmazonGuide: () => void;
  onOpenAdRewards: () => void;
  adCoins?: number;
  isPremium?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  userProfile,
  darkMode,
  setDarkMode,
  onOpenAuth,
  onOpenDisclaimer,
  onOpenAmazonGuide,
  onOpenAdRewards,
  adCoins = 0,
  isPremium = false,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-4 py-3">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 p-0.5 shadow-lg shadow-emerald-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Activity className="w-5 h-5 text-emerald-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg tracking-wider bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent font-display">
                NAVZLAB
              </span>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full border ${
                isPremium
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
              }`}>
                {isPremium ? '👑 VIP PASS' : '100% FREE'}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium tracking-wide">
              Monitor. Move. Improve.
            </p>
          </div>
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center gap-2">
          {/* Ad Rewards / Unlock Hub Button */}
          <button
            onClick={onOpenAdRewards}
            title="Watch Ad & Unlock Pro Features"
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 transition-all flex items-center gap-1.5 text-xs font-bold"
          >
            <Tv className="w-4 h-4 text-amber-400 animate-bounce" />
            <span className="hidden sm:inline">Watch Ad</span>
            <span className="bg-amber-400 text-slate-950 px-1.5 py-0.2 rounded-full text-[10px] font-extrabold">
              {adCoins} Coins
            </span>
          </button>

          {/* Amazon Appstore Guide */}
          <button
            onClick={onOpenAmazonGuide}
            title="Amazon Appstore & Publishing Guide"
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 transition-all flex items-center gap-1.5 text-xs font-semibold"
          >
            <ShoppingBag className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline text-[11px]">Publish</span>
          </button>

          {/* Safety Disclaimer badge */}
          <button
            onClick={onOpenDisclaimer}
            title="Health & Safety Info"
            className="p-2 rounded-xl text-slate-400 hover:text-amber-400 hover:bg-slate-800/60 transition-colors flex items-center gap-1 text-xs"
          >
            <ShieldAlert className="w-4 h-4 text-amber-400" />
          </button>

          {/* Theme Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            title="Toggle theme"
            className="p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 transition-colors"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-slate-300" />}
          </button>

          {/* User Account Button */}
          <button
            onClick={onOpenAuth}
            className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 transition-all text-xs font-medium text-slate-200"
          >
            <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-xs">
              {userProfile.displayName ? userProfile.displayName.charAt(0).toUpperCase() : 'N'}
            </div>
            <span className="max-w-[80px] truncate hidden xs:inline">
              {userProfile.isGuest ? 'Guest' : userProfile.displayName}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
;
