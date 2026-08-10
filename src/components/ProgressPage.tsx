import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from 'recharts';
import { 
  Trophy, 
  Target, 
  Calendar, 
  Footprints, 
  Flame, 
  Timer, 
  MapPin, 
  Droplet, 
  ChevronRight,
  Filter,
  Dumbbell,
  Clock,
  X
} from 'lucide-react';
import { UserProfile, WorkoutRecord, DailyActivity } from '../types';
import { formatDistance, formatWater } from '../utils/unitConverter';

interface ProgressPageProps {
  userProfile: UserProfile;
  workoutHistory: WorkoutRecord[];
  dailyActivity: DailyActivity;
}

type TimeframeOption = '7' | '30' | '90';
type ViewTab = 'daily' | 'weekly' | 'monthly';

export const ProgressPage: React.FC<ProgressPageProps> = ({
  userProfile,
  workoutHistory,
  dailyActivity
}) => {
  const [timeframe, setTimeframe] = useState<TimeframeOption>('7');
  const [viewTab, setViewTab] = useState<ViewTab>('weekly');
  const [selectedWorkoutModal, setSelectedWorkoutModal] = useState<WorkoutRecord | null>(null);

  // Generate chart data based on selected timeframe
  const daysCount = parseInt(timeframe);
  
  const chartData = Array.from({ length: daysCount }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (daysCount - 1 - i));
    const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    
    // Calculate pseudo or actual stats for historical dates
    const daySeed = (i + 1) * 7;
    const isToday = i === daysCount - 1;

    const steps = isToday ? dailyActivity.steps : Math.min(13000, 5000 + (daySeed * 240) % 7000);
    const calories = isToday ? dailyActivity.calories : Math.min(600, 180 + (daySeed * 18) % 350);
    const activeMinutes = isToday ? dailyActivity.activeMinutes : Math.min(90, 20 + (daySeed * 3) % 50);
    const waterMl = isToday ? dailyActivity.waterMl : Math.min(3000, 1200 + (daySeed * 50) % 1500);

    return {
      date: label,
      steps,
      calories,
      activeMinutes,
      waterLiters: parseFloat((waterMl / 1000).toFixed(1))
    };
  });

  // Aggregated totals
  const totalWorkouts = workoutHistory.length;
  const totalActiveMin = workoutHistory.reduce((sum, w) => sum + Math.floor(w.durationSeconds / 60), 0);
  const totalDistanceKm = workoutHistory.reduce((sum, w) => sum + w.distanceKm, 0);
  const totalCalories = workoutHistory.reduce((sum, w) => sum + w.caloriesBurned, 0);
  const avgDailySteps = Math.round(chartData.reduce((sum, d) => sum + d.steps, 0) / chartData.length);

  // Personal Records
  const longestWorkoutSec = workoutHistory.length > 0 ? Math.max(...workoutHistory.map(w => w.durationSeconds)) : 0;
  const maxCaloriesBurned = workoutHistory.length > 0 ? Math.max(...workoutHistory.map(w => w.caloriesBurned)) : 0;
  const maxDistanceKm = workoutHistory.length > 0 ? Math.max(...workoutHistory.map(w => w.distanceKm)) : 0;

  return (
    <div className="space-y-6 pb-24 pt-2">
      {/* Title & Timeframe Selector */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-black text-slate-100 font-display">
              PROGRESS & ANALYTICS 📊
            </h1>
            <p className="text-xs text-slate-400">
              Track long-term trends, personal records, and goal completion.
            </p>
          </div>

          {/* Timeframe selector tabs */}
          <div className="flex bg-slate-950 p-1 rounded-2xl border border-slate-800 self-start sm:self-auto">
            {(['7', '30', '90'] as TimeframeOption[]).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  timeframe === tf
                    ? 'bg-emerald-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tf} DAYS
              </button>
            ))}
          </div>
        </div>

        {/* Daily / Weekly / Monthly View Tabs */}
        <div className="flex border-b border-slate-800 pt-1">
          {(['daily', 'weekly', 'monthly'] as ViewTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setViewTab(tab)}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${
                viewTab === tab
                  ? 'border-emerald-400 text-emerald-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab} View
            </button>
          ))}
        </div>
      </div>

      {/* Summary Cards based on ViewTab */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Total Workouts</p>
          <p className="text-2xl font-black text-slate-100 font-display">{totalWorkouts}</p>
          <p className="text-[10px] text-emerald-400">Recorded sessions</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Active Time</p>
          <p className="text-2xl font-black text-amber-400 font-display">{totalActiveMin} <span className="text-xs font-normal text-slate-400">min</span></p>
          <p className="text-[10px] text-slate-400">Total duration</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Total Distance</p>
          <p className="text-2xl font-black text-cyan-400 font-display">{formatDistance(totalDistanceKm, userProfile.unitSystem)}</p>
          <p className="text-[10px] text-slate-400">Cardio accumulation</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Avg Daily Steps</p>
          <p className="text-2xl font-black text-emerald-400 font-display">{avgDailySteps.toLocaleString()}</p>
          <p className="text-[10px] text-slate-400">Over {timeframe} days</p>
        </div>
      </div>

      {/* Activity Charts Section */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 space-y-6 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-100 font-display flex items-center gap-2">
            <Footprints className="w-5 h-5 text-cyan-400" />
            <span>Steps Activity Trend</span>
          </h2>
          <span className="text-xs text-slate-400">{timeframe}-Day Overview</span>
        </div>

        <div className="h-56 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="stepsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px', color: '#f8fafc' }}
              />
              <Area type="monotone" dataKey="steps" stroke="#06b6d4" strokeWidth={3} fillOpacity={1} fill="url(#stepsGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Calories and Active Minutes Bar Chart */}
        <div className="pt-4 border-t border-slate-800 space-y-4">
          <h2 className="text-base font-bold text-slate-100 font-display flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-400" />
            <span>Calories Burned (kcal)</span>
          </h2>

          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px', color: '#f8fafc' }}
                />
                <Bar dataKey="calories" fill="#f59e0b" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Fitness Goals Progress Bars */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-100 font-display flex items-center gap-2">
            <Target className="w-5 h-5 text-emerald-400" />
            <span>Fitness Goals</span>
          </h2>
          <span className="text-xs text-emerald-400 font-semibold">Active Goals</span>
        </div>

        <div className="space-y-4">
          {/* Steps Goal */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-slate-200">Daily Steps</span>
              <span className="text-emerald-400">
                {dailyActivity.steps.toLocaleString()} / {userProfile.dailyStepGoal.toLocaleString()}
              </span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-cyan-400 rounded-full" 
                style={{ width: `${Math.min(100, (dailyActivity.steps / userProfile.dailyStepGoal) * 100)}%` }} 
              />
            </div>
          </div>

          {/* Workout Goal */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-slate-200">Daily Workout Time</span>
              <span className="text-emerald-400">
                {dailyActivity.activeMinutes} / {userProfile.dailyWorkoutGoalMin} min
              </span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-amber-400 rounded-full" 
                style={{ width: `${Math.min(100, (dailyActivity.activeMinutes / userProfile.dailyWorkoutGoalMin) * 100)}%` }} 
              />
            </div>
          </div>

          {/* Weekly Workouts Goal */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-slate-200">Weekly Workouts Target</span>
              <span className="text-emerald-400">
                {Math.min(5, workoutHistory.length)} / 5 workouts
              </span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-400 rounded-full" 
                style={{ width: `${Math.min(100, (workoutHistory.length / 5) * 100)}%` }} 
              />
            </div>
          </div>

          {/* Water Goal */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-slate-200">Daily Water Intake</span>
              <span className="text-emerald-400">
                {(dailyActivity.waterMl / 1000).toFixed(1)} / {userProfile.dailyWaterGoalL} L
              </span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-400 rounded-full" 
                style={{ width: `${Math.min(100, (dailyActivity.waterMl / (userProfile.dailyWaterGoalL * 1000)) * 100)}%` }} 
              />
            </div>
          </div>
        </div>
      </div>

      {/* Personal Records (PRs) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-400" />
          <h2 className="text-base font-bold text-slate-100 font-display">Personal Records (PRs)</h2>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 text-center">
            <p className="text-[10px] font-bold text-slate-400 uppercase">Max Calorie Session</p>
            <p className="text-lg font-black text-amber-400 font-display mt-1">{maxCaloriesBurned} <span className="text-[10px] text-slate-400 font-normal">kcal</span></p>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 text-center">
            <p className="text-[10px] font-bold text-slate-400 uppercase">Longest Duration</p>
            <p className="text-lg font-black text-emerald-400 font-display mt-1">{Math.floor(longestWorkoutSec / 60)} <span className="text-[10px] text-slate-400 font-normal">min</span></p>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 text-center">
            <p className="text-[10px] font-bold text-slate-400 uppercase">Max Distance</p>
            <p className="text-lg font-black text-cyan-400 font-display mt-1">{formatDistance(maxDistanceKm, userProfile.unitSystem)}</p>
          </div>
        </div>
      </div>

      {/* Workout History List */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-100 font-display flex items-center gap-2">
            <Calendar className="w-5 h-5 text-emerald-400" />
            <span>Workout History</span>
          </h2>
          <span className="text-xs text-slate-400">{workoutHistory.length} Total</span>
        </div>

        <div className="space-y-2.5">
          {workoutHistory.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-xs">
              No workouts logged yet. Start your first workout today!
            </div>
          ) : (
            workoutHistory.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedWorkoutModal(item)}
                className="bg-slate-950 p-4 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all cursor-pointer flex items-center justify-between group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-lg">
                    {item.type === 'Running' ? '🏃' : item.type === 'Walking' ? '🚶' : item.type === 'Cycling' ? '🚴' : item.type === 'HIIT' ? '⚡' : '🏋️'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-100 font-display">{item.type}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20">
                        Score {item.workoutScore}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {new Date(item.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} • {Math.floor(item.durationSeconds / 60)} min • {formatDistance(item.distanceKm, userProfile.unitSystem)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-amber-400 hidden xs:inline">{item.caloriesBurned} kcal</span>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Workout Detail Modal */}
      {selectedWorkoutModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-5 shadow-2xl relative">
            <button
              onClick={() => setSelectedWorkoutModal(null)}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-2xl font-bold">
                {selectedWorkoutModal.type === 'Running' ? '🏃' : '🏋️'}
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-100 font-display">{selectedWorkoutModal.type}</h3>
                <p className="text-xs text-slate-400">
                  {new Date(selectedWorkoutModal.timestamp).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
                <p className="text-[10px] text-slate-400 font-bold uppercase">Duration</p>
                <p className="text-lg font-bold text-slate-100 font-display mt-1">
                  {Math.floor(selectedWorkoutModal.durationSeconds / 60)} min {selectedWorkoutModal.durationSeconds % 60}s
                </p>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
                <p className="text-[10px] text-slate-400 font-bold uppercase">Distance</p>
                <p className="text-lg font-bold text-cyan-400 font-display mt-1">
                  {formatDistance(selectedWorkoutModal.distanceKm, userProfile.unitSystem)}
                </p>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
                <p className="text-[10px] text-slate-400 font-bold uppercase">Estimated Calories</p>
                <p className="text-lg font-bold text-amber-400 font-display mt-1">
                  {selectedWorkoutModal.caloriesBurned} kcal
                </p>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
                <p className="text-[10px] text-slate-400 font-bold uppercase">Avg Heart Rate</p>
                <p className="text-lg font-bold text-rose-400 font-display mt-1">
                  {selectedWorkoutModal.avgHeartRate ? `${selectedWorkoutModal.avgHeartRate} BPM` : 'Unavailable'}
                </p>
              </div>
            </div>

            {selectedWorkoutModal.feeling && (
              <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300">User Feeling Check-In</span>
                <span className="text-xs font-bold text-emerald-400">
                  {selectedWorkoutModal.feeling === 'Great' ? '😊 Great' : selectedWorkoutModal.feeling === 'Good' ? '🙂 Good' : '😐 Okay'}
                </span>
              </div>
            )}

            <button
              onClick={() => setSelectedWorkoutModal(null)}
              className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
