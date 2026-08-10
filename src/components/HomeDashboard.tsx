import React, { useState } from 'react';
import { 
  Heart, 
  Footprints, 
  Flame, 
  Timer, 
  MapPin, 
  Droplet, 
  Play, 
  Plus, 
  RotateCcw, 
  Info, 
  ChevronRight,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import { UserProfile, DailyActivity, WorkoutRecord } from '../types';
import { formatDistance, formatWater } from '../utils/unitConverter';

interface HomeDashboardProps {
  userProfile: UserProfile;
  dailyActivity: DailyActivity;
  recentWorkout?: WorkoutRecord;
  onStartWorkout: () => void;
  onAddWater: (amountMl: number) => void;
  onRemoveLastWater: () => void;
  onNavigateTab: (tab: 'workout' | 'progress' | 'aicoach') => void;
  simulatedHeartRate: number | null;
  toggleHeartRateSensor: () => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  userProfile,
  dailyActivity,
  recentWorkout,
  onStartWorkout,
  onAddWater,
  onRemoveLastWater,
  onNavigateTab,
  simulatedHeartRate,
  toggleHeartRateSensor,
}) => {
  const [showScoreInfo, setShowScoreInfo] = useState(false);

  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const waterLiters = dailyActivity.waterMl / 1000;
  const waterTargetLiters = userProfile.dailyWaterGoalL;

  return (
    <div className="space-y-6 pb-24 pt-2">
      {/* Welcome Banner & Date */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-800/80 p-5 rounded-3xl border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="space-y-1 relative z-10">
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
            {formattedDate}
          </p>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 font-display">
            Welcome back, {userProfile.displayName || 'Athlete'}! 👋
          </h1>
          <p className="text-sm text-slate-400">
            Ready for your workout today? Let's crush your fitness goals.
          </p>
        </div>

        <button
          onClick={onStartWorkout}
          className="self-start sm:self-center flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] group"
        >
          <Play className="w-5 h-5 fill-current transition-transform group-hover:translate-x-0.5" />
          <span>START WORKOUT</span>
        </button>
      </div>

      {/* Daily Activity Score Section */}
      <div className="bg-slate-900/80 border border-slate-800/90 rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2 font-display">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              Daily Activity Score
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Based on steps, active minutes, calories & hydration
            </p>
          </div>
          <button
            onClick={() => setShowScoreInfo(!showScoreInfo)}
            className="p-2 text-slate-400 hover:text-emerald-400 rounded-xl hover:bg-slate-800 transition-colors"
            title="Score Info"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>

        {showScoreInfo && (
          <div className="mb-4 p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-200 leading-relaxed">
            <p className="font-semibold mb-1 text-emerald-300">ℹ️ Fitness Guidance Disclaimer:</p>
            The Daily Activity Score is a general wellness score from 0–100 calculated from your recorded fitness metrics. It is intended for fitness motivation only and is NOT a medical measurement or clinical diagnostic score.
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center gap-6 py-2">
          {/* Circular Score Gauge */}
          <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="42"
                className="text-slate-800 stroke-current"
                strokeWidth="10"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r="42"
                className="text-emerald-400 stroke-current transition-all duration-1000 ease-out"
                strokeWidth="10"
                strokeDasharray="263.89"
                strokeDashoffset={263.89 - (263.89 * (dailyActivity.score || 0)) / 100}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-black text-slate-100 font-display">
                {dailyActivity.score}
              </span>
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                / 100 PTS
              </span>
            </div>
          </div>

          <div className="flex-1 space-y-3 w-full">
            <div className="flex justify-between text-xs font-semibold text-slate-300">
              <span>Goal Progress Breakdown</span>
              <span className="text-emerald-400">{dailyActivity.score >= 80 ? '🔥 On Fire!' : dailyActivity.score >= 50 ? '👍 Good Progress' : '💪 Keep Moving!'}</span>
            </div>

            {/* Sub progress bars */}
            <div className="space-y-2 text-xs">
              <div>
                <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                  <span>Steps ({dailyActivity.steps.toLocaleString()} / {userProfile.dailyStepGoal.toLocaleString()})</span>
                  <span>{Math.min(100, Math.round((dailyActivity.steps / userProfile.dailyStepGoal) * 100))}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-cyan-400 rounded-full transition-all duration-500" 
                    style={{ width: `${Math.min(100, (dailyActivity.steps / userProfile.dailyStepGoal) * 100)}%` }} 
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                  <span>Active Time ({dailyActivity.activeMinutes}m / {userProfile.dailyWorkoutGoalMin}m)</span>
                  <span>{Math.min(100, Math.round((dailyActivity.activeMinutes / userProfile.dailyWorkoutGoalMin) * 100))}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-amber-400 rounded-full transition-all duration-500" 
                    style={{ width: `${Math.min(100, (dailyActivity.activeMinutes / userProfile.dailyWorkoutGoalMin) * 100)}%` }} 
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                  <span>Water ({waterLiters.toFixed(1)}L / {waterTargetLiters}L)</span>
                  <span>{Math.min(100, Math.round((waterLiters / waterTargetLiters) * 100))}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-400 rounded-full transition-all duration-500" 
                    style={{ width: `${Math.min(100, (waterLiters / waterTargetLiters) * 100)}%` }} 
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Activity Cards Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-100 font-display">Daily Activity Cards</h2>
          <button 
            onClick={() => onNavigateTab('progress')} 
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-0.5"
          >
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {/* Heart Rate Card */}
          <div className="bg-slate-900/80 border border-slate-800/90 rounded-2xl p-4 space-y-2 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center">
                <Heart className="w-4 h-4 fill-current animate-pulse" />
              </div>
              <button 
                onClick={toggleHeartRateSensor}
                className="text-[10px] text-slate-400 hover:text-rose-300 underline"
                title="Toggle Sensor Simulation"
              >
                {simulatedHeartRate ? 'Connected' : 'Unavailable'}
              </button>
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Heart Rate</p>
              {simulatedHeartRate ? (
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-slate-100 font-display">{simulatedHeartRate}</span>
                  <span className="text-xs font-semibold text-slate-400">BPM</span>
                </div>
              ) : (
                <div className="text-xs font-medium text-slate-400 py-1">
                  Data unavailable
                </div>
              )}
            </div>
            <div className="text-[10px] text-slate-400">
              {simulatedHeartRate ? '🟢 Resting normal range' : 'Connect wearable device'}
            </div>
          </div>

          {/* Steps Card */}
          <div className="bg-slate-900/80 border border-slate-800/90 rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                <Footprints className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-medium text-slate-400">
                {Math.round((dailyActivity.steps / userProfile.dailyStepGoal) * 100)}%
              </span>
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Steps</p>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-slate-100 font-display">
                  {dailyActivity.steps.toLocaleString()}
                </span>
              </div>
            </div>
            <p className="text-[10px] text-slate-400 truncate">
              Goal: {userProfile.dailyStepGoal.toLocaleString()}
            </p>
          </div>

          {/* Calories Card */}
          <div className="bg-slate-900/80 border border-slate-800/90 rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <Flame className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-medium text-amber-400">Est.</span>
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Calories</p>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-slate-100 font-display">
                  {dailyActivity.calories}
                </span>
                <span className="text-xs font-semibold text-slate-400">kcal</span>
              </div>
            </div>
            <p className="text-[10px] text-slate-400">
              Active energy burned
            </p>
          </div>

          {/* Active Time Card */}
          <div className="bg-slate-900/80 border border-slate-800/90 rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <Timer className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-medium text-slate-400">
                / {userProfile.dailyWorkoutGoalMin}m
              </span>
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Active Time</p>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-slate-100 font-display">
                  {dailyActivity.activeMinutes}
                </span>
                <span className="text-xs font-semibold text-slate-400">min</span>
              </div>
            </div>
            <p className="text-[10px] text-slate-400">
              Workout & movement
            </p>
          </div>

          {/* Distance Card */}
          <div className="bg-slate-900/80 border border-slate-800/90 rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
                <MapPin className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-medium text-slate-400">
                {userProfile.unitSystem === 'imperial' ? 'mi' : 'km'}
              </span>
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Distance</p>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-slate-100 font-display">
                  {formatDistance(dailyActivity.distanceKm, userProfile.unitSystem).split(' ')[0]}
                </span>
                <span className="text-xs font-semibold text-slate-400">
                  {userProfile.unitSystem === 'imperial' ? 'mi' : 'km'}
                </span>
              </div>
            </div>
            <p className="text-[10px] text-slate-400">
              Recorded outdoor & treadmill
            </p>
          </div>

          {/* Water Card */}
          <div className="bg-slate-900/80 border border-slate-800/90 rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                <Droplet className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-medium text-blue-400">
                {Math.round((waterLiters / waterTargetLiters) * 100)}%
              </span>
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Water</p>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-slate-100 font-display">
                  {waterLiters.toFixed(1)}
                </span>
                <span className="text-xs font-semibold text-slate-400">/ {waterTargetLiters} L</span>
              </div>
            </div>
            <p className="text-[10px] text-slate-400 truncate">
              {formatWater(dailyActivity.waterMl, userProfile.unitSystem)}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Water Tracker Bar */}
      <div className="bg-slate-900/80 border border-slate-800/90 rounded-3xl p-5 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Droplet className="w-5 h-5 text-blue-400" />
            <h3 className="text-sm font-bold text-slate-100 font-display">Quick Hydration Logger</h3>
          </div>
          <button
            onClick={onRemoveLastWater}
            disabled={dailyActivity.waterMl <= 0}
            className="text-[11px] text-slate-400 hover:text-slate-200 disabled:opacity-40 flex items-center gap-1"
            title="Undo last water log"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Undo</span>
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          <button
            onClick={() => onAddWater(250)}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-2xl bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-blue-300 font-semibold text-xs transition-all active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+250 ml</span>
          </button>
          <button
            onClick={() => onAddWater(500)}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-2xl bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-blue-300 font-semibold text-xs transition-all active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+500 ml</span>
          </button>
          <button
            onClick={() => onAddWater(750)}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-2xl bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-blue-300 font-semibold text-xs transition-all active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+750 ml</span>
          </button>
        </div>
      </div>

      {/* Recent Workout Preview Card */}
      {recentWorkout && (
        <div className="bg-slate-900/80 border border-slate-800/90 rounded-3xl p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Recent Workout</span>
            <span className="text-[11px] text-slate-400">
              {new Date(recentWorkout.timestamp).toLocaleDateString()}
            </span>
          </div>

          <div className="flex items-center justify-between bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-slate-100 font-display">
                  {recentWorkout.type}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                  Score {recentWorkout.workoutScore}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {Math.floor(recentWorkout.durationSeconds / 60)} min • {formatDistance(recentWorkout.distanceKm, userProfile.unitSystem)} • {recentWorkout.caloriesBurned} kcal
              </p>
            </div>

            <button
              onClick={() => onNavigateTab('progress')}
              className="p-2 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 rounded-xl transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* AI Coach Quick Recommendation Banner */}
      <div 
        onClick={() => onNavigateTab('aicoach')}
        className="cursor-pointer bg-gradient-to-r from-teal-950/50 via-slate-900 to-emerald-950/40 border border-teal-500/30 rounded-3xl p-5 flex items-center justify-between hover:border-teal-500/50 transition-all shadow-lg"
      >
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-teal-500/20 text-teal-300 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-teal-400 font-display">NAVZLAB AI Coach Tip</p>
            <p className="text-xs text-slate-300 font-medium mt-0.5">
              "Need workout suggestions? Ask your AI Coach for a custom 20-min routine."
            </p>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-teal-400 shrink-0" />
      </div>
    </div>
  );
};
