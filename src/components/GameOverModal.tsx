import React from 'react';
import { Skull, RotateCcw, Home, HelpCircle } from 'lucide-react';
import { Room } from '../types/game';

interface GameOverModalProps {
  room: Room;
  onRestartRoom: () => void;
  onOpenMainMenu: () => void;
  onOpenHelp: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  room,
  onRestartRoom,
  onOpenMainMenu,
  onOpenHelp,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="relative w-full max-w-md bg-red-950/90 border-2 border-red-600 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col items-center text-center">
        {/* Skull Icon */}
        <div className="w-20 h-20 rounded-full bg-red-900/40 border-2 border-red-500 flex items-center justify-center mb-4 shadow-lg shadow-red-900/50 animate-pulse">
          <Skull className="w-10 h-10 text-red-500" />
        </div>

        <h2 className="text-3xl font-extrabold text-red-500 mb-1 tracking-wider uppercase">
          TIME EXPIRED!
        </h2>
        <p className="text-xs text-red-300 mb-6">
          The 60-second timer ran out in {room.name}. You were trapped!
        </p>

        <div className="w-full bg-slate-950 p-4 rounded-2xl border border-red-900/50 mb-6 text-xs text-slate-300 space-y-2 text-left">
          <p className="font-bold text-red-400">💡 Quick Survival Tips:</p>
          <ul className="list-disc list-inside space-y-1 text-slate-400">
            <li>Search desk lamps, trash cans, and book spines for hidden notes.</li>
            <li>Combine items in your inventory (e.g. UV Light Bulb + Flashlight).</li>
            <li>Request hints early using the 💡 button at the top right!</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-2 w-full">
          <button
            onClick={onRestartRoom}
            className="w-full py-3.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-2xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg shadow-red-600/30 active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Try Again (60s)</span>
          </button>

          <button
            onClick={onOpenMainMenu}
            className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold rounded-2xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all border border-slate-800"
          >
            <Home className="w-4 h-4" />
            <span>Main Menu</span>
          </button>
        </div>
      </div>
    </div>
  );
};
