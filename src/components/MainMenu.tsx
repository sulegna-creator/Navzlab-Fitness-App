import React, { useState } from 'react';
import {
  Play,
  Zap,
  Trophy,
  HelpCircle,
  Clock,
  Key,
  Shield,
  RotateCcw,
  Star,
  Sparkles,
  Flame,
  Award,
} from 'lucide-react';
import { CAMPAIGN_ROOMS } from '../data/rooms';
import { GameStats } from '../types/game';

interface MainMenuProps {
  onSelectCampaignRoom: (roomId: string) => void;
  onStartGauntlet: () => void;
  stats: GameStats;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  onSelectCampaignRoom,
  onStartGauntlet,
  stats,
}) => {
  const [activeTab, setActiveTab] = useState<'rooms' | 'gauntlet' | 'stats' | 'guide'>('rooms');

  return (
    <div className="relative w-full min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-between p-4 sm:p-8 font-sans select-none overflow-y-auto">
      {/* Background Animated Gradient Glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-10 w-96 h-96 bg-red-600/10 rounded-full blur-3xl" />
      </div>

      {/* Main Header / Title Banner */}
      <div className="relative z-10 flex flex-col items-center text-center mt-4 sm:mt-8 max-w-2xl">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-extrabold uppercase tracking-widest mb-3">
          <Clock className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
          <span>High-Stakes Escape Puzzle</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white drop-shadow-2xl mb-2">
          ESCAPE THE ROOM
        </h1>

        <div className="flex items-center justify-center gap-3 text-2xl sm:text-4xl font-extrabold text-amber-400 tracking-wider">
          <span className="px-3 py-1 bg-red-600 text-white rounded-xl shadow-lg shadow-red-600/40 animate-pulse">
            60 SECONDS
          </span>
        </div>

        <p className="mt-4 text-sm sm:text-base text-slate-400 leading-relaxed max-w-lg">
          The concept is simple: You have 60 seconds to escape. Search for hidden keys, decipher keypad PINs, solve puzzles, and unlock doors before time expires!
        </p>
      </div>

      {/* Mode Navigation Tabs */}
      <div className="relative z-10 flex items-center justify-center gap-2 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800 my-6 max-w-lg w-full">
        <button
          onClick={() => setActiveTab('rooms')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'rooms'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Key className="w-4 h-4" />
          <span>Campaign</span>
        </button>

        <button
          onClick={() => setActiveTab('gauntlet')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'gauntlet'
              ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Flame className="w-4 h-4 text-amber-300" />
          <span>60s Gauntlet</span>
        </button>

        <button
          onClick={() => setActiveTab('stats')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'stats'
              ? 'bg-slate-800 text-amber-300 border border-amber-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Trophy className="w-4 h-4" />
          <span>Records</span>
        </button>

        <button
          onClick={() => setActiveTab('guide')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'guide'
              ? 'bg-slate-800 text-amber-300 border border-amber-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>Guide</span>
        </button>
      </div>

      {/* Tab Content Container */}
      <div className="relative z-10 w-full max-w-4xl mb-8">
        {/* Campaign Rooms Grid */}
        {activeTab === 'rooms' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {CAMPAIGN_ROOMS.map((room, idx) => {
              const bestTime = stats.bestTimes[room.id];
              return (
                <div
                  key={room.id}
                  onClick={() => onSelectCampaignRoom(room.id)}
                  className="group relative bg-slate-900/90 border-2 border-slate-800 hover:border-amber-400 rounded-3xl p-5 transition-all duration-300 cursor-pointer shadow-xl hover:shadow-amber-500/10 flex flex-col justify-between hover:-translate-y-1"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-slate-800 text-amber-400 border border-slate-700">
                        Room {idx + 1}
                      </span>
                      {bestTime !== undefined && (
                        <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1 bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-800">
                          <Clock className="w-3 h-3" />
                          {bestTime.toFixed(1)}s
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-extrabold text-white group-hover:text-amber-400 transition-colors mb-1">
                      {room.name}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed mb-4">
                      {room.subtitle}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                    <span className="text-xs font-semibold text-slate-500 group-hover:text-slate-300">
                      ⏱️ 60s Limit
                    </span>
                    <button className="px-3.5 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs uppercase flex items-center gap-1 group-hover:bg-amber-400 transition-colors shadow">
                      <span>Start</span>
                      <Play className="w-3.5 h-3.5 fill-slate-950" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Endless 60s Gauntlet Banner */}
        {activeTab === 'gauntlet' && (
          <div className="bg-gradient-to-br from-red-950/80 via-slate-900 to-amber-950/80 border-2 border-red-600/80 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-red-600/20 border border-red-500 flex items-center justify-center mb-4">
              <Flame className="w-8 h-8 text-red-500 animate-bounce" />
            </div>

            <h3 className="text-2xl font-black text-white mb-2">SURVIVAL 60s GAUNTLET</h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-md mb-6 leading-relaxed">
              Test your escape skills in back-to-back procedurally generated rooms with randomized codes and fresh puzzle setups! How many rooms can you escape?
            </p>

            <button
              onClick={onStartGauntlet}
              className="py-4 px-8 bg-red-600 hover:bg-red-500 text-white font-extrabold text-sm uppercase tracking-wider rounded-2xl shadow-xl shadow-red-600/30 transition-all flex items-center gap-2 active:scale-95"
            >
              <Play className="w-5 h-5 fill-white" />
              <span>Launch 60s Gauntlet</span>
            </button>
          </div>
        )}

        {/* Records & Stats */}
        {activeTab === 'stats' && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            <h3 className="text-lg font-bold text-amber-400 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              <span>Escape Career Statistics</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center">
                <span className="text-2xl font-black text-emerald-400">{stats.roomsCompleted}</span>
                <span className="text-[11px] text-slate-400 block mt-1">Rooms Escaped</span>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center">
                <span className="text-2xl font-black text-amber-400">{stats.totalAttempts}</span>
                <span className="text-[11px] text-slate-400 block mt-1">Total Attempts</span>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center">
                <span className="text-2xl font-black text-sky-400">{stats.hintsUsedCount}</span>
                <span className="text-[11px] text-slate-400 block mt-1">Hints Requested</span>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center">
                <span className="text-2xl font-black text-purple-400">
                  {Object.keys(stats.bestTimes).length}
                </span>
                <span className="text-[11px] text-slate-400 block mt-1">Unique Clears</span>
              </div>
            </div>
          </div>
        )}

        {/* Guide */}
        {activeTab === 'guide' && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
            <h3 className="text-lg font-bold text-amber-400 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-amber-400" />
              <span>How to Play "Escape the Room: 60 Seconds"</span>
            </h3>

            <div className="space-y-3 pt-2">
              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800">
                <p className="font-bold text-amber-300 mb-1">⏱️ 1. The 60-Second Timer</p>
                <p className="text-slate-400">
                  You have exactly 60 seconds from the moment you step into the room. Entering wrong keypad codes or failing chemical potion mixes incurs a 5-second penalty!
                </p>
              </div>

              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800">
                <p className="font-bold text-amber-300 mb-1">🔑 2. Hidden Items & Combination</p>
                <p className="text-slate-400">
                  Search desk drawers, books, and wastebaskets. Combine complementary items in your inventory (e.g. Empty Flashlight + UV Bulb = UV Torch) to unlock hidden clues!
                </p>
              </div>

              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800">
                <p className="font-bold text-amber-300 mb-1">💡 3. Interactive Hint System</p>
                <p className="text-slate-400">
                  Stuck on a puzzle? Click the 💡 Hint button at the top right to receive a direct nudge for the active room!
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <footer className="relative z-10 text-[11px] text-slate-500 text-center">
        Escape the Room: 60 Seconds • Built for fast-paced brain-teasing fun
      </footer>
    </div>
  );
};
