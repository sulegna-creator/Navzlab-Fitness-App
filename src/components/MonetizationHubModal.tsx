import React from 'react';
import { X, Tv, Sparkles, Lock, Unlock, Gift, ShieldCheck, Zap, Award, DollarSign, ChevronRight } from 'lucide-react';

export interface UnlockableModule {
  id: string;
  title: string;
  category: string;
  description: string;
  icon: string;
  coinCost: number;
}

export const PRO_MODULES_LIST: UnlockableModule[] = [
  {
    id: 'pro_hiit_masterclass',
    title: 'Pro Olympic HIIT & Strength Routine',
    category: 'Workouts',
    description: 'High-burn athletic interval programming with custom audio timers & HR zone targets.',
    icon: '⚡',
    coinCost: 50,
  },
  {
    id: 'ai_macro_meal_planner',
    title: 'AI Chef & Macro Nutrition Planner',
    category: 'Nutrition',
    description: 'Custom daily calorie breakdown, high-protein recipes, and dietary auto-calculations.',
    icon: '🥗',
    coinCost: 50,
  },
  {
    id: 'cardio_strain_recovery',
    title: 'Advanced Heart Rate & Recovery Analytics',
    category: 'Analytics',
    description: 'VO2 Max estimations, cardiovascular strain graph, and deep fatigue indicators.',
    icon: '🫀',
    coinCost: 50,
  }
];

interface MonetizationHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  unlockedModules: string[];
  adCoins: number;
  isPremium?: boolean;
  onWatchAdForModule: (module: UnlockableModule) => void;
  onSpendCoinsToUnlock: (module: UnlockableModule) => void;
  onUnlockLifetimePremium?: () => void;
  onOpenAmazonGuide: () => void;
}

export const MonetizationHubModal: React.FC<MonetizationHubModalProps> = ({
  isOpen,
  onClose,
  unlockedModules,
  adCoins,
  isPremium = false,
  onWatchAdForModule,
  onSpendCoinsToUnlock,
  onUnlockLifetimePremium,
  onOpenAmazonGuide,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-900/90 sticky top-0 z-10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Tv className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Ad Rewards & Premium Hub</h3>
              <p className="text-xs text-slate-400">Watch short ads to unlock Pro modules for FREE</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 rounded-full transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-300">
          {/* Lifetime VIP Upgrade Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-500/20 via-purple-500/10 to-emerald-500/10 border border-amber-500/40 relative overflow-hidden shadow-lg">
            <div className="flex items-start justify-between gap-3 relative z-10">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 font-black text-[10px] tracking-wider uppercase shadow-md flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> VIP Unlimited
                  </span>
                  {isPremium && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                      ACTIVE
                    </span>
                  )}
                </div>
                <h4 className="text-base font-extrabold text-white font-display">
                  {isPremium ? '👑 Lifetime VIP Premium Unlocked!' : '👑 Unlock Lifetime Premium Pass'}
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {isPremium
                    ? 'You have 100% ad-free access, unlimited AI generation, and lifetime access to all current and future Pro modules.'
                    : 'Get 100% Ad-Free experience, unlimited AI coaching, and unlock ALL current & future Pro modules forever.'}
                </p>
              </div>
            </div>

            {!isPremium && (
              <div className="mt-4 pt-3 border-t border-amber-500/20 flex flex-wrap items-center justify-between gap-3 relative z-10">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-black text-amber-300 font-display">$4.99</span>
                  <span className="text-xs text-slate-400 line-through">$19.99</span>
                  <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">One-Time Lifetime</span>
                </div>
                <button
                  type="button"
                  onClick={onUnlockLifetimePremium}
                  className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-emerald-400 text-slate-950 font-black text-xs hover:from-amber-300 hover:to-emerald-300 flex items-center gap-2 shadow-lg shadow-amber-500/25 transition-all active:scale-95"
                >
                  <Award className="w-4 h-4" />
                  <span>Unlock Premium Pass ($4.99)</span>
                </button>
              </div>
            )}
          </div>

          {/* Coins Balance Box */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-emerald-500/15 to-teal-500/15 border border-amber-500/30 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">Your Reward Balance</span>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black text-white font-display">{adCoins}</span>
                <span className="text-xs font-semibold text-amber-300">Ad Coins</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-slate-400 block">Earn 50 coins per video ad watched!</span>
            </div>
          </div>

          {/* Module List */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">
              Unlockable Pro Modules
            </h4>

            {PRO_MODULES_LIST.map((module) => {
              const isUnlocked = isPremium || unlockedModules.includes(module.id);

              return (
                <div
                  key={module.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    isUnlocked
                      ? 'bg-emerald-950/20 border-emerald-500/40'
                      : 'bg-slate-800/40 border-slate-700/60 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex gap-3">
                      <span className="text-2xl p-2 rounded-xl bg-slate-800 border border-slate-700 shrink-0">
                        {module.icon}
                      </span>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h5 className="font-bold text-sm text-white">{module.title}</h5>
                          {isUnlocked ? (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold flex items-center gap-1">
                              <Unlock className="w-3 h-3" /> {isPremium ? 'VIP Unlocked' : 'Unlocked'}
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-bold flex items-center gap-1">
                              <Lock className="w-3 h-3" /> Pro Locked
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed">{module.description}</p>
                      </div>
                    </div>
                  </div>

                  {/* Actions if locked */}
                  {!isUnlocked && (
                    <div className="mt-3 pt-3 border-t border-slate-700/50 flex flex-wrap items-center justify-end gap-2">
                      <button
                        onClick={() => onWatchAdForModule(module)}
                        className="py-2 px-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs hover:from-emerald-400 hover:to-teal-400 flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all active:scale-95"
                      >
                        <Tv className="w-3.5 h-3.5" /> Watch 8s Ad to Unlock
                      </button>

                      {adCoins >= module.coinCost && (
                        <button
                          onClick={() => onSpendCoinsToUnlock(module)}
                          className="py-2 px-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold transition-all"
                        >
                          Use {module.coinCost} Coins
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Amazon Appstore Promo banner */}
          <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-bold text-cyan-300 block">Want to publish this app yourself?</span>
              <p className="text-[11px] text-slate-400">Publish to Amazon Appstore for $0 registration fee!</p>
            </div>
            <button
              onClick={() => {
                onClose();
                onOpenAmazonGuide();
              }}
              className="px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 font-bold text-xs border border-cyan-500/40 transition-colors whitespace-nowrap"
            >
              View Guide
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs hover:bg-slate-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
