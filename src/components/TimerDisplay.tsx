import React from 'react';
import { Clock, AlertTriangle } from 'lucide-react';

interface TimerDisplayProps {
  timeLeft: number; // In seconds (e.g., 58.4)
  totalTime?: number; // Default 60
}

export const TimerDisplay: React.FC<TimerDisplayProps> = ({ timeLeft, totalTime = 60 }) => {
  const isCritical = timeLeft <= 15;
  const isDanger = timeLeft <= 5;
  const progressPercent = Math.max(0, Math.min(100, (timeLeft / totalTime) * 100));

  const seconds = Math.floor(timeLeft);
  const milliseconds = Math.floor((timeLeft % 1) * 100);

  const formattedSeconds = String(seconds).padStart(2, '0');
  const formattedMs = String(milliseconds).padStart(2, '0');

  return (
    <div className="relative flex flex-col items-center select-none">
      {/* Outer Glow Container */}
      <div
        className={`relative flex items-center gap-3 px-5 py-2.5 rounded-2xl border transition-all duration-300 shadow-xl ${
          isDanger
            ? 'bg-red-950/90 border-red-500 text-red-400 shadow-red-900/50 animate-pulse scale-105'
            : isCritical
            ? 'bg-amber-950/80 border-amber-500 text-amber-300 shadow-amber-900/40'
            : 'bg-slate-900/80 border-slate-700 text-slate-100 shadow-black/50 backdrop-blur-md'
        }`}
      >
        <div className="relative flex items-center justify-center">
          <Clock
            className={`w-6 h-6 transition-transform ${
              isCritical ? 'animate-bounce text-red-500' : 'text-amber-400'
            }`}
          />
          {isCritical && (
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
          )}
        </div>

        <div className="flex flex-col">
          <div className="flex items-baseline font-mono tracking-wider font-extrabold text-2xl sm:text-3xl leading-none">
            <span className={isCritical ? 'text-red-400' : 'text-slate-100'}>{formattedSeconds}</span>
            <span className="text-sm mx-0.5 opacity-60">.</span>
            <span className="text-lg opacity-80">{formattedMs}</span>
            <span className="text-xs text-slate-400 ml-1 font-sans font-medium uppercase tracking-normal">s</span>
          </div>

          <div className="w-full bg-slate-800/90 h-1.5 rounded-full overflow-hidden mt-1.5 border border-slate-700/50">
            <div
              className={`h-full transition-all duration-100 rounded-full ${
                isDanger ? 'bg-red-500' : isCritical ? 'bg-amber-500' : 'bg-emerald-400'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {isCritical && (
          <div className="hidden sm:flex items-center gap-1 text-xs text-red-400 font-semibold uppercase animate-pulse pl-1">
            <AlertTriangle className="w-4 h-4" />
            <span>Hurry!</span>
          </div>
        )}
      </div>
    </div>
  );
};
