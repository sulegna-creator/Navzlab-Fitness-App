import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  Square, 
  CheckCircle2, 
  AlertTriangle, 
  RotateCcw, 
  Activity, 
  Heart, 
  Flame, 
  Timer, 
  MapPin, 
  Zap, 
  Sparkles,
  ChevronRight,
  ShieldAlert,
  ArrowLeft
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserProfile, WorkoutType, FeelingRating, WorkoutRecord, GoalType } from '../types';
import { formatDistance, formatPace } from '../utils/unitConverter';
import { calculateWorkoutScore } from '../utils/activityScore';

interface WorkoutScreenProps {
  userProfile: UserProfile;
  onSaveWorkout: (workout: Omit<WorkoutRecord, 'id' | 'userId'>) => void;
  onNavigateTab: (tab: 'home' | 'progress') => void;
  simulatedHeartRate: number | null;
  toggleHeartRateSensor: () => void;
  customAIPlan?: any; // If coming directly from AI Workout Generator
}

type WorkoutState = 'CHOOSER' | 'SETUP' | 'ACTIVE' | 'PAUSED' | 'CONFIRM_FINISH' | 'CHECKIN' | 'SUMMARY';

export const WorkoutScreen: React.FC<WorkoutScreenProps> = ({
  userProfile,
  onSaveWorkout,
  onNavigateTab,
  simulatedHeartRate,
  toggleHeartRateSensor,
  customAIPlan
}) => {
  const [screenState, setScreenState] = useState<WorkoutState>('CHOOSER');
  
  // Selection state
  const [selectedType, setSelectedType] = useState<WorkoutType>('Running');
  const [customTypeName, setCustomTypeName] = useState('');
  const [goalType, setGoalType] = useState<GoalType>('time');
  const [targetValue, setTargetValue] = useState<number>(30); // 30 mins or 5 km or 300 kcal

  // Active workout state
  const [seconds, setSeconds] = useState(0);
  const [distanceKm, setDistanceKm] = useState(0);
  const [caloriesBurned, setCaloriesBurned] = useState(0);
  const [heartRates, setHeartRates] = useState<number[]>([]);
  const [userFeeling, setUserFeeling] = useState<FeelingRating | undefined>(undefined);
  const [workoutNotes, setWorkoutNotes] = useState('');

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto initialize if custom AI plan passed
  useEffect(() => {
    if (customAIPlan) {
      setSelectedType('Custom');
      setCustomTypeName(customAIPlan.title || 'AI Custom Workout');
      setGoalType('time');
      setTargetValue(30);
      setScreenState('SETUP');
    }
  }, [customAIPlan]);

  // Active Timer Tick
  useEffect(() => {
    if (screenState === 'ACTIVE') {
      timerRef.current = setInterval(() => {
        setSeconds((prev) => {
          const newSec = prev + 1;
          
          // Estimate calories burned (~8-12 kcal/min based on workout type)
          const calPerSec = (selectedType === 'HIIT' || selectedType === 'Running' ? 0.2 : 0.13);
          setCaloriesBurned(Math.round(newSec * calPerSec));

          // Estimate distance for distance-based activities
          if (['Running', 'Walking', 'Cycling', 'Treadmill'].includes(selectedType)) {
            const kmPerSec = selectedType === 'Running' ? 0.0028 : selectedType === 'Cycling' ? 0.005 : 0.0014;
            setDistanceKm(parseFloat((newSec * kmPerSec).toFixed(2)));
          }

          // Sample Heart Rate if active
          if (simulatedHeartRate) {
            const variance = Math.floor(Math.random() * 5) - 2;
            const currentBpm = Math.min(185, Math.max(90, simulatedHeartRate + variance));
            setHeartRates((prevHR) => [...prevHR, currentBpm]);
          }

          return newSec;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [screenState, selectedType, simulatedHeartRate]);

  // Format seconds to HH:MM:SS
  const formatTimer = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    if (hrs > 0) {
      return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Workout Intensity Status Logic
  const getIntensityBadge = () => {
    if (!simulatedHeartRate && heartRates.length === 0) {
      return { label: '🟢 ON TRACK', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' };
    }
    const currentHr = heartRates.length > 0 ? heartRates[heartRates.length - 1] : (simulatedHeartRate || 120);
    if (currentHr >= 160) {
      return { label: '🟡 HIGH INTENSITY', color: 'bg-amber-500/10 text-amber-400 border-amber-500/30' };
    }
    if (currentHr >= 175) {
      return { label: '🔴 STOP & REST', color: 'bg-rose-500/10 text-rose-400 border-rose-500/30' };
    }
    return { label: '🟢 GOOD INTENSITY', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' };
  };

  // Finish Handlers
  const handleProceedToFeelingCheckin = () => {
    setScreenState('CHECKIN');
  };

  const handleCompleteWorkout = (feelingChoice?: FeelingRating) => {
    const finalFeeling = feelingChoice || userFeeling || 'Good';
    setUserFeeling(finalFeeling);

    // Calculate HR averages
    const avgHR = heartRates.length > 0 ? Math.round(heartRates.reduce((a, b) => a + b, 0) / heartRates.length) : null;
    const maxHR = heartRates.length > 0 ? Math.max(...heartRates) : null;

    const score = calculateWorkoutScore(seconds, caloriesBurned, finalFeeling);

    const workoutData = {
      type: selectedType === 'Custom' && customTypeName ? (customTypeName as WorkoutType) : selectedType,
      customType: selectedType === 'Custom' ? customTypeName : undefined,
      durationSeconds: seconds,
      distanceKm,
      caloriesBurned,
      avgHeartRate: avgHR,
      maxHeartRate: maxHR,
      feeling: finalFeeling,
      notes: workoutNotes,
      workoutScore: score,
      feedback: `Workout Complete! You maintained steady effort for ${Math.floor(seconds / 60)} minutes.`,
      timestamp: new Date().toISOString()
    };

    onSaveWorkout(workoutData);
    setScreenState('SUMMARY');

    // Fire Confetti!
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const resetWorkoutState = () => {
    setSeconds(0);
    setDistanceKm(0);
    setCaloriesBurned(0);
    setHeartRates([]);
    setUserFeeling(undefined);
    setWorkoutNotes('');
    setScreenState('CHOOSER');
  };

  // Calculate HR summary statistics
  const avgHeartRate = heartRates.length > 0 ? Math.round(heartRates.reduce((a, b) => a + b, 0) / heartRates.length) : null;
  const maxHeartRate = heartRates.length > 0 ? Math.max(...heartRates) : null;
  const workoutScore = calculateWorkoutScore(seconds, caloriesBurned, userFeeling);

  const workoutTypesList: { type: WorkoutType; icon: string; desc: string }[] = [
    { type: 'Running', icon: '🏃', desc: 'Cardio & outdoor road runs' },
    { type: 'Walking', icon: '🚶', desc: 'Brisk pace & step tracking' },
    { type: 'Cycling', icon: '🚴', desc: 'Road cycling & stationary bike' },
    { type: 'Strength Training', icon: '🏋️', desc: 'Weights, dumbbells & reps' },
    { type: 'HIIT', icon: '⚡', desc: 'High intensity interval circuit' },
    { type: 'Stretching', icon: '🧘', desc: 'Flexibility & active recovery' },
    { type: 'Treadmill', icon: '🏃‍♂️', desc: 'Indoor running & incline walk' },
    { type: 'Custom', icon: '✏️', desc: 'Define custom activity type' }
  ];

  return (
    <div className="space-y-6 pb-24 pt-2">
      {/* 1. CHOOSER STATE */}
      {screenState === 'CHOOSER' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-800/80 p-6 rounded-3xl border border-slate-800 shadow-xl">
            <h1 className="text-2xl font-extrabold text-slate-100 font-display">
              START WORKOUT 🏋️
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Select an activity type to configure your workout goals.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {workoutTypesList.map((item) => (
              <button
                key={item.type}
                onClick={() => {
                  setSelectedType(item.type);
                  setScreenState('SETUP');
                }}
                className={`p-4 rounded-2xl text-left border transition-all flex items-center justify-between group ${
                  selectedType === item.type
                    ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
                    : 'bg-slate-900/80 hover:bg-slate-800/80 border-slate-800 text-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <h3 className="font-bold text-sm text-slate-100 font-display">{item.type}</h3>
                    <p className="text-[11px] text-slate-400">{item.desc}</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-emerald-400 transition-colors" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 2. SETUP STATE */}
      {screenState === 'SETUP' && (
        <div className="space-y-6">
          <button
            onClick={() => setScreenState('CHOOSER')}
            className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-slate-200"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Choose Different Activity</span>
          </button>

          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Setup Activity</span>
                <h2 className="text-2xl font-extrabold text-slate-100 font-display mt-0.5">
                  {selectedType === 'Custom' ? 'Custom Workout' : selectedType}
                </h2>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-2xl font-bold">
                {selectedType === 'Running' ? '🏃' : selectedType === 'Cycling' ? '🚴' : selectedType === 'HIIT' ? '⚡' : '🏋️'}
              </div>
            </div>

            {/* Custom Activity Name Input */}
            {selectedType === 'Custom' && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Custom Activity Name</label>
                <input
                  type="text"
                  placeholder="e.g. Pilates, Kettlebell Circuit, Swimming..."
                  value={customTypeName}
                  onChange={(e) => setCustomTypeName(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>
            )}

            {/* Workout Goal Selection */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Select Workout Goal
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['time', 'distance', 'calories', 'none'] as GoalType[]).map((g) => (
                  <button
                    key={g}
                    onClick={() => {
                      setGoalType(g);
                      if (g === 'time') setTargetValue(30);
                      if (g === 'distance') setTargetValue(5);
                      if (g === 'calories') setTargetValue(300);
                    }}
                    className={`py-3 px-3 rounded-2xl border text-xs font-bold capitalize transition-all ${
                      goalType === g
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {g === 'none' ? 'No Goal' : g}
                  </button>
                ))}
              </div>

              {/* Target Adjustment Slider / Input */}
              {goalType !== 'none' && (
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-slate-300">Target {goalType}</span>
                    <span className="text-emerald-400 text-base">
                      {targetValue} {goalType === 'time' ? 'min' : goalType === 'distance' ? (userProfile.unitSystem === 'imperial' ? 'mi' : 'km') : 'kcal'}
                    </span>
                  </div>

                  <input
                    type="range"
                    min={goalType === 'time' ? 5 : goalType === 'distance' ? 1 : 50}
                    max={goalType === 'time' ? 180 : goalType === 'distance' ? 42 : 1500}
                    step={goalType === 'time' ? 5 : goalType === 'distance' ? 0.5 : 25}
                    value={targetValue}
                    onChange={(e) => setTargetValue(Number(e.target.value))}
                    className="w-full accent-emerald-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
                  />
                </div>
              )}
            </div>

            {/* Start Button */}
            <button
              onClick={() => {
                setSeconds(0);
                setDistanceKm(0);
                setCaloriesBurned(0);
                setHeartRates([]);
                setScreenState('ACTIVE');
              }}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-extrabold text-base shadow-lg shadow-emerald-500/25 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>START WORKOUT</span>
            </button>
          </div>
        </div>
      )}

      {/* 3. ACTIVE WORKOUT MODE */}
      {screenState === 'ACTIVE' && (
        <div className="space-y-6">
          {/* Header Banner */}
          <div className="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-2xl px-5 py-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-xs font-extrabold text-slate-100 uppercase tracking-widest font-display">
                {selectedType === 'Custom' ? customTypeName || 'Custom Workout' : selectedType} IN PROGRESS
              </span>
            </div>

            {/* Intensity Badge */}
            <div className={`px-3 py-1 rounded-full text-[11px] font-bold border ${getIntensityBadge().color}`}>
              {getIntensityBadge().label}
            </div>
          </div>

          {/* Main Huge Timer Display */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center shadow-2xl relative overflow-hidden">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-1">Duration</p>
            <div className="text-5xl sm:text-7xl font-black text-slate-100 font-display tracking-tight text-emerald-400">
              {formatTimer(seconds)}
            </div>

            {goalType === 'time' && (
              <p className="text-xs text-slate-400 mt-2">
                Target: {targetValue} min ({Math.min(100, Math.round((seconds / 60 / targetValue) * 100))}% complete)
              </p>
            )}
          </div>

          {/* Large Live Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Heart Rate */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-center space-y-1">
              <div className="flex items-center justify-center gap-1.5 text-rose-400 text-xs font-bold uppercase">
                <Heart className="w-4 h-4 fill-current animate-pulse" />
                <span>Heart Rate</span>
              </div>
              {simulatedHeartRate || heartRates.length > 0 ? (
                <div className="text-2xl font-extrabold text-slate-100 font-display">
                  {heartRates.length > 0 ? heartRates[heartRates.length - 1] : simulatedHeartRate} <span className="text-xs font-normal text-slate-400">BPM</span>
                </div>
              ) : (
                <div className="text-xs font-medium text-slate-400 py-1">
                  Heart rate unavailable
                </div>
              )}
              <button 
                onClick={toggleHeartRateSensor} 
                className="text-[10px] text-slate-400 hover:text-slate-200 underline"
              >
                {simulatedHeartRate ? 'Connected' : 'Simulate Sensor'}
              </button>
            </div>

            {/* Calories */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-center space-y-1">
              <div className="flex items-center justify-center gap-1.5 text-amber-400 text-xs font-bold uppercase">
                <Flame className="w-4 h-4" />
                <span>Calories</span>
              </div>
              <div className="text-2xl font-extrabold text-slate-100 font-display">
                {caloriesBurned} <span className="text-xs font-normal text-slate-400">kcal</span>
              </div>
              <span className="text-[10px] text-slate-400">Estimated</span>
            </div>

            {/* Distance */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-center space-y-1">
              <div className="flex items-center justify-center gap-1.5 text-cyan-400 text-xs font-bold uppercase">
                <MapPin className="w-4 h-4" />
                <span>Distance</span>
              </div>
              <div className="text-2xl font-extrabold text-slate-100 font-display">
                {formatDistance(distanceKm, userProfile.unitSystem).split(' ')[0]} <span className="text-xs font-normal text-slate-400">{userProfile.unitSystem === 'imperial' ? 'mi' : 'km'}</span>
              </div>
              <span className="text-[10px] text-slate-400">Recorded</span>
            </div>

            {/* Pace */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-center space-y-1">
              <div className="flex items-center justify-center gap-1.5 text-purple-400 text-xs font-bold uppercase">
                <Zap className="w-4 h-4" />
                <span>Pace</span>
              </div>
              <div className="text-2xl font-extrabold text-slate-100 font-display">
                {formatPace(seconds, distanceKm, userProfile.unitSystem)}
              </div>
              <span className="text-[10px] text-slate-400">Average</span>
            </div>
          </div>

          {/* Active Workout Action Controls */}
          <div className="grid grid-cols-2 gap-4 pt-4">
            <button
              onClick={() => setScreenState('PAUSED')}
              className="py-4 rounded-2xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 text-amber-300 font-extrabold text-base transition-all flex items-center justify-center gap-2"
            >
              <Pause className="w-5 h-5 fill-current" />
              <span>PAUSE</span>
            </button>

            <button
              onClick={() => setScreenState('CONFIRM_FINISH')}
              className="py-4 rounded-2xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 text-rose-300 font-extrabold text-base transition-all flex items-center justify-center gap-2"
            >
              <Square className="w-5 h-5 fill-current" />
              <span>FINISH</span>
            </button>
          </div>
        </div>
      )}

      {/* 4. PAUSED STATE OVERLAY */}
      {screenState === 'PAUSED' && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-sm w-full text-center space-y-6 shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
              <Pause className="w-8 h-8 fill-current" />
            </div>

            <div>
              <h2 className="text-2xl font-black text-slate-100 font-display">WORKOUT PAUSED</h2>
              <p className="text-xs text-slate-400 mt-1">Take a breath and hydrate before resuming.</p>
              <p className="text-3xl font-extrabold text-emerald-400 font-display mt-3">
                {formatTimer(seconds)}
              </p>
            </div>

            <div className="space-y-2.5">
              <button
                onClick={() => setScreenState('ACTIVE')}
                className="w-full py-3.5 rounded-2xl bg-emerald-500 text-slate-950 font-extrabold text-sm shadow-lg shadow-emerald-500/20 hover:bg-emerald-400 transition-all flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>RESUME WORKOUT</span>
              </button>

              <button
                onClick={() => setScreenState('CONFIRM_FINISH')}
                className="w-full py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm transition-all flex items-center justify-center gap-2"
              >
                <Square className="w-4 h-4 fill-current" />
                <span>END WORKOUT</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. CONFIRM FINISH MODAL */}
      {screenState === 'CONFIRM_FINISH' && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-sm w-full text-center space-y-6 shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h2 className="text-xl font-black text-slate-100 font-display">
                Are you sure you want to finish this workout?
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                You've completed {formatTimer(seconds)} of activity.
              </p>
            </div>

            <div className="space-y-2.5">
              <button
                onClick={handleProceedToFeelingCheckin}
                className="w-full py-3.5 rounded-2xl bg-emerald-500 text-slate-950 font-extrabold text-sm hover:bg-emerald-400 transition-all"
              >
                Finish Workout
              </button>

              <button
                onClick={() => setScreenState('ACTIVE')}
                className="w-full py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-sm transition-all"
              >
                Continue Workout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. USER FEELING CHECK-IN */}
      {screenState === 'CHECKIN' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl">
          <div className="text-center space-y-1">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Post-Workout Check-In</span>
            <h2 className="text-2xl font-black text-slate-100 font-display">How are you feeling?</h2>
            <p className="text-xs text-slate-400">Recording your feeling helps tailor workout stats & recovery.</p>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { rating: 'Great', emoji: '😊', color: 'hover:border-emerald-500 hover:bg-emerald-500/10' },
              { rating: 'Good', emoji: '🙂', color: 'hover:border-teal-500 hover:bg-teal-500/10' },
              { rating: 'Okay', emoji: '😐', color: 'hover:border-blue-500 hover:bg-blue-500/10' },
              { rating: 'Tired', emoji: '😓', color: 'hover:border-amber-500 hover:bg-amber-500/10' },
              { rating: 'Dizzy', emoji: '😵', color: 'hover:border-rose-500 hover:bg-rose-500/10' },
              { rating: 'Pain', emoji: '😣', color: 'hover:border-rose-500 hover:bg-rose-500/10' },
            ].map((item) => (
              <button
                key={item.rating}
                onClick={() => {
                  setUserFeeling(item.rating as FeelingRating);
                }}
                className={`p-4 rounded-2xl border text-center transition-all ${item.color} ${
                  userFeeling === item.rating
                    ? 'border-emerald-500 bg-emerald-500/20 text-emerald-200'
                    : 'bg-slate-950 border-slate-800 text-slate-200'
                }`}
              >
                <div className="text-3xl mb-1">{item.emoji}</div>
                <div className="font-bold text-sm">{item.rating}</div>
              </button>
            ))}
          </div>

          {/* Safety Alert for Dizzy or Pain */}
          {(userFeeling === 'Dizzy' || userFeeling === 'Pain') && (
            <div className="p-4 rounded-2xl bg-rose-950/60 border border-rose-500/50 text-rose-200 text-xs space-y-1.5 animate-fadeIn">
              <div className="flex items-center gap-2 text-rose-400 font-bold">
                <ShieldAlert className="w-5 h-5" />
                <span>⚠️ Important Health & Safety Warning</span>
              </div>
              <p>
                You indicated feeling dizzy or experiencing pain. Please stop exercising immediately, sit down in a safe area, drink water, and seek appropriate medical attention if symptoms persist or worsen.
              </p>
            </div>
          )}

          {/* Optional notes */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">Workout Notes (Optional)</label>
            <input
              type="text"
              placeholder="e.g. Great weather, pushed hard on last set..."
              value={workoutNotes}
              onChange={(e) => setWorkoutNotes(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-emerald-500"
            />
          </div>

          <button
            onClick={() => handleCompleteWorkout(userFeeling)}
            className="w-full py-4 rounded-2xl bg-emerald-500 text-slate-950 font-extrabold text-base shadow-lg shadow-emerald-500/20 hover:bg-emerald-400 transition-all"
          >
            Save & View Summary 🎉
          </button>
        </div>
      )}

      {/* 7. WORKOUT SUMMARY */}
      {screenState === 'SUMMARY' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-emerald-950/60 via-slate-900 to-slate-900 border border-emerald-500/30 rounded-3xl p-6 text-center space-y-2 shadow-2xl">
            <span className="text-4xl animate-bounce inline-block">🎉</span>
            <h1 className="text-3xl font-black text-slate-100 font-display">WORKOUT COMPLETE</h1>
            <p className="text-xs text-emerald-400 font-semibold">
              Awesome effort! Here is your workout performance summary.
            </p>
          </div>

          {/* Summary Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Duration</p>
              <p className="text-2xl font-black text-slate-100 font-display mt-1">
                {formatTimer(seconds)}
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Distance</p>
              <p className="text-2xl font-black text-slate-100 font-display mt-1">
                {formatDistance(distanceKm, userProfile.unitSystem)}
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Est. Calories</p>
              <p className="text-2xl font-black text-amber-400 font-display mt-1">
                {caloriesBurned} <span className="text-xs text-slate-400 font-normal">kcal</span>
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Avg Heart Rate</p>
              <p className="text-2xl font-black text-rose-400 font-display mt-1">
                {avgHeartRate ? `${avgHeartRate} BPM` : 'N/A'}
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Max Heart Rate</p>
              <p className="text-2xl font-black text-rose-400 font-display mt-1">
                {maxHeartRate ? `${maxHeartRate} BPM` : 'N/A'}
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Workout Score</p>
              <p className="text-2xl font-black text-emerald-400 font-display mt-1">
                {workoutScore} / 100
              </p>
            </div>
          </div>

          {/* Feedback & Disclaimer */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 space-y-2">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">User Feedback</h3>
            <p className="text-xs text-slate-300 bg-slate-950 p-3.5 rounded-2xl border border-slate-800/80">
              "Great job! You maintained a consistent workout duration today."
            </p>
            <p className="text-[11px] text-slate-500 italic pt-1">
              * Note: Calorie and fitness estimates are approximate calculations for general fitness tracking.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5">
            <button
              onClick={() => onNavigateTab('home')}
              className="w-full py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm transition-all"
            >
              SAVE WORKOUT & GO HOME
            </button>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={resetWorkoutState}
                className="py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-all"
              >
                START ANOTHER WORKOUT
              </button>

              <button
                onClick={() => onNavigateTab('progress')}
                className="py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-emerald-400 font-bold text-xs transition-all"
              >
                VIEW PROGRESS
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
