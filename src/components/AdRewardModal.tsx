import React, { useState, useEffect } from 'react';
import { Play, CheckCircle2, ShieldCheck, Sparkles, X, Volume2, VolumeX, Gift, Lock, Award, Tv } from 'lucide-react';

interface AdRewardModalProps {
  isOpen: boolean;
  onClose: () => void;
  moduleTitle: string;
  moduleId: string;
  onSuccessUnlock: (moduleId: string) => void;
}

const AD_SPONSORS = [
  {
    name: 'FitGear Pro - Smart Hydration',
    tagline: 'Track your electrolytes in real time with Bluetooth Smart Flasks.',
    bgGradient: 'from-blue-600 via-indigo-700 to-purple-800',
    videoTopic: 'Hydration Technology',
    accentColor: 'bg-cyan-500',
  },
  {
    name: 'NutriFuel Organic Whey',
    tagline: 'Clean protein for maximum muscle recovery. 100% Grass-Fed.',
    bgGradient: 'from-amber-600 via-orange-600 to-red-700',
    videoTopic: 'Post-Workout Nutrition',
    accentColor: 'bg-amber-400',
  },
  {
    name: 'ZenMind Sleep & Recovery',
    tagline: 'Deep sleep binaural audio science for faster tissue repair.',
    bgGradient: 'from-emerald-700 via-teal-800 to-slate-900',
    videoTopic: 'Sleep Science & Heart Rate Variability',
    accentColor: 'bg-emerald-400',
  }
];

export const AdRewardModal: React.FC<AdRewardModalProps> = ({
  isOpen,
  onClose,
  moduleTitle,
  moduleId,
  onSuccessUnlock
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(8);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentSponsor, setCurrentSponsor] = useState(AD_SPONSORS[0]);

  useEffect(() => {
    if (isOpen) {
      // Pick random sponsor
      const randomSponsor = AD_SPONSORS[Math.floor(Math.random() * AD_SPONSORS.length)];
      setCurrentSponsor(randomSponsor);
      setIsPlaying(false);
      setTimeLeft(8);
      setIsCompleted(false);
    }
  }, [isOpen]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isPlaying && timeLeft === 0) {
      setIsPlaying(false);
      setIsCompleted(true);
    }
    return () => clearInterval(timer);
  }, [isPlaying, timeLeft]);

  if (!isOpen) return null;

  const handleStartAd = () => {
    setIsPlaying(true);
    setTimeLeft(8);
  };

  const handleClaimReward = () => {
    onSuccessUnlock(moduleId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Top bar */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800/80 bg-slate-900/90">
          <div className="flex items-center gap-2">
            <Tv className="w-5 h-5 text-emerald-400" />
            <div className="flex flex-col">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-200">
                AdMob Interstitial Reward
              </span>
              <span className="text-[10px] font-mono text-slate-500">
                Unit ID: 7496198249
              </span>
            </div>
          </div>
          {!isPlaying && (
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 rounded-full transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Ad Video / Container Screen */}
        <div className={`relative h-64 bg-gradient-to-br ${currentSponsor.bgGradient} p-6 flex flex-col justify-between overflow-hidden`}>
          {/* Animated Background Mesh */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_0,transparent_100%)] pointer-events-none" />

          {/* Ad Controls / Status Header */}
          <div className="relative z-10 flex items-center justify-between">
            <span className="px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase text-slate-900 bg-white/90 backdrop-blur-md rounded-full shadow-sm">
              AD
            </span>

            {isPlaying && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-1.5 rounded-full bg-black/40 text-white backdrop-blur-md hover:bg-black/60 transition-colors"
                >
                  {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                </button>
                <div className="px-3 py-1 rounded-full bg-black/60 text-white text-xs font-mono font-bold backdrop-blur-md border border-white/10">
                  {timeLeft}s
                </div>
              </div>
            )}
          </div>

          {/* Center Banner / Video Simulation */}
          <div className="relative z-10 text-center my-auto px-4">
            {!isPlaying && !isCompleted && (
              <div className="space-y-3">
                <div className="inline-flex p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-xl">
                  <Gift className="w-8 h-8 text-amber-300 animate-bounce" />
                </div>
                <h3 className="text-xl font-bold text-white tracking-tight">
                  Watch 8s Ad to Unlock
                </h3>
                <p className="text-xs text-slate-200 font-medium line-clamp-2 max-w-xs mx-auto">
                  "{moduleTitle}" module will be unlocked for 24 Hours or permanent session!
                </p>
              </div>
            )}

            {isPlaying && (
              <div className="space-y-2 animate-pulse">
                <div className="inline-block text-xs font-semibold uppercase tracking-widest text-emerald-300">
                  {currentSponsor.videoTopic}
                </div>
                <h4 className="text-2xl font-black text-white tracking-tight">
                  {currentSponsor.name}
                </h4>
                <p className="text-xs text-slate-100 font-medium max-w-xs mx-auto">
                  {currentSponsor.tagline}
                </p>
                {/* Simulated playback bar */}
                <div className="w-full bg-black/40 h-1.5 rounded-full overflow-hidden mt-4 border border-white/10">
                  <div
                    className="bg-emerald-400 h-full transition-all duration-1000 ease-linear"
                    style={{ width: `${((8 - timeLeft) / 8) * 100}%` }}
                  />
                </div>
              </div>
            )}

            {isCompleted && (
              <div className="space-y-3 animate-fadeIn">
                <div className="inline-flex p-3 rounded-2xl bg-emerald-500/20 backdrop-blur-md border border-emerald-400/40 text-emerald-300">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-extrabold text-white">
                  Reward Ready!
                </h3>
                <p className="text-xs text-emerald-100 font-medium">
                  Thanks for supporting Navzlab Health & Fitness Monitor!
                </p>
              </div>
            )}
          </div>

          {/* Footer Sponsor Brand info */}
          <div className="relative z-10 flex items-center justify-between text-[11px] text-white/80 font-medium border-t border-white/10 pt-2">
            <span>Sponsor: {currentSponsor.name.split('-')[0]}</span>
            <span className="flex items-center gap-1 text-emerald-300 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" /> AdMonetize Verified
            </span>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="p-5 bg-slate-900 flex flex-col gap-3">
          {!isPlaying && !isCompleted && (
            <>
              <button
                onClick={handleStartAd}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-sm rounded-2xl shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <Play className="w-4 h-4 fill-slate-950" /> Watch Short Video Ad
              </button>
              <button
                onClick={onClose}
                className="w-full py-2.5 px-4 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors text-center"
              >
                Cancel & Keep Locked
              </button>
            </>
          )}

          {isPlaying && (
            <div className="text-center py-2 text-xs text-slate-400 font-medium">
              Please watch the video until completion to receive your unlock reward...
            </div>
          )}

          {isCompleted && (
            <button
              onClick={handleClaimReward}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-amber-400 to-emerald-400 hover:from-amber-300 hover:to-emerald-300 text-slate-950 font-black text-sm rounded-2xl shadow-lg shadow-amber-400/20 flex items-center justify-center gap-2 transition-all active:scale-95 animate-bounce"
            >
              <Sparkles className="w-4 h-4 fill-slate-950" /> Claim Instant Access
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
