import React from 'react';
import { Trophy, Star, ArrowRight, RotateCcw, Home, Clock } from 'lucide-react';
import { Room } from '../types/game';

interface VictoryModalProps {
  room: Room;
  timeLeft: number;
  hintsUsed: number;
  onNextRoom?: () => void;
  onRestartRoom: () => void;
  onOpenMainMenu: () => void;
  hasNextRoom: boolean;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  room,
  timeLeft,
  hintsUsed,
  onNextRoom,
  onRestartRoom,
  onOpenMainMenu,
  hasNextRoom,
}) => {
  // Calculate star rating (3 stars: > 25s left & 0 hints; 2 stars: > 10s left; 1 star: completed)
  const stars = timeLeft >= 25 && hintsUsed === 0 ? 3 : timeLeft >= 10 ? 2 : 1;
  const timeFormatted = timeLeft.toFixed(2);

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="relative w-full max-w-md bg-slate-900 border-2 border-amber-500 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col items-center text-center">
        {/* Trophy Icon */}
        <div className="w-20 h-20 rounded-full bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center mb-4 shadow-lg shadow-amber-500/30 animate-bounce">
          <Trophy className="w-10 h-10 text-amber-400" />
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-amber-400 mb-1">ROOM ESCAPED!</h2>
        <p className="text-xs text-slate-300 mb-4">{room.name} cleared in time!</p>

        {/* Stars */}
        <div className="flex items-center gap-2 mb-6">
          {[1, 2, 3].map((s) => (
            <Star
              key={s}
              className={`w-8 h-8 transition-all duration-300 ${
                s <= stars
                  ? 'text-amber-400 fill-amber-400 scale-110 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]'
                  : 'text-slate-700'
              }`}
            />
          ))}
        </div>

        {/* Stats card */}
        <div className="w-full bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3 mb-6 shadow-inner">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-emerald-400" /> Time Remaining:
            </span>
            <span className="text-emerald-400 font-mono text-base font-extrabold">
              {timeFormatted}s
            </span>
          </div>

          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-400">Hints Requested:</span>
            <span className="text-slate-200">{hintsUsed}</span>
          </div>

          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-400">Escape Rating:</span>
            <span className="text-amber-300 uppercase">
              {stars === 3 ? '⚡ Master Speedrunner' : stars === 2 ? '🕵️ Sleuth' : '🚪 Survivor'}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-2 w-full">
          {hasNextRoom && onNextRoom && (
            <button
              onClick={onNextRoom}
              className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-2xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/20 active:scale-95"
            >
              <span>Next Room</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={onRestartRoom}
            className="w-full py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-2xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all border border-slate-700"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Replay 60s</span>
          </button>

          <button
            onClick={onOpenMainMenu}
            className="w-full py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-2xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all border border-slate-700"
          >
            <Home className="w-4 h-4" />
            <span>Menu</span>
          </button>
        </div>
      </div>
    </div>
  );
};
