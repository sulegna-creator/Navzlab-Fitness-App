import { UserProfile, WorkoutRecord, DailyActivity, WaterLog } from '../types';

export const DEFAULT_USER_PROFILE: UserProfile = {
  uid: 'guest-user',
  displayName: 'Fitness Enthusiast',
  email: 'user@navzlab.fit',
  age: 28,
  heightCm: 175,
  weightKg: 70,
  fitnessLevel: 'Intermediate',
  dailyStepGoal: 10000,
  dailyWaterGoalL: 2.5,
  dailyWorkoutGoalMin: 30,
  dailyDistanceGoalKm: 5.0,
  unitSystem: 'metric',
  isGuest: true,
  createdAt: new Date().toISOString()
};

export const DEMO_WORKOUTS: WorkoutRecord[] = [
  {
    id: 'demo-w1',
    userId: 'guest-user',
    type: 'Running',
    durationSeconds: 2538, // 42 min 18 sec
    distanceKm: 5.2,
    caloriesBurned: 326,
    avgHeartRate: 124,
    maxHeartRate: 151,
    feeling: 'Great',
    workoutScore: 87,
    feedback: 'Great job! You maintained a consistent pace and strong endurance throughout today\'s run.',
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    id: 'demo-w2',
    userId: 'guest-user',
    type: 'HIIT',
    durationSeconds: 1800, // 30 min
    distanceKm: 0,
    caloriesBurned: 240,
    avgHeartRate: 138,
    maxHeartRate: 165,
    feeling: 'Good',
    workoutScore: 82,
    feedback: 'High intensity session completed! Strong cardiovascular output.',
    timestamp: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 'demo-w3',
    userId: 'guest-user',
    type: 'Walking',
    durationSeconds: 2100, // 35 min
    distanceKm: 3.1,
    caloriesBurned: 145,
    avgHeartRate: 102,
    maxHeartRate: 118,
    feeling: 'Great',
    workoutScore: 78,
    feedback: 'Smooth recovery walk. Active recovery helps muscle restoration.',
    timestamp: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 'demo-w4',
    userId: 'guest-user',
    type: 'Strength Training',
    durationSeconds: 2700, // 45 min
    distanceKm: 0,
    caloriesBurned: 290,
    avgHeartRate: 115,
    maxHeartRate: 142,
    feeling: 'Good',
    workoutScore: 85,
    feedback: 'Solid resistance session focusing on progressive overload.',
    timestamp: new Date(Date.now() - 86400000 * 3).toISOString()
  },
  {
    id: 'demo-w5',
    userId: 'guest-user',
    type: 'Cycling',
    durationSeconds: 3000, // 50 min
    distanceKm: 12.4,
    caloriesBurned: 380,
    avgHeartRate: 130,
    maxHeartRate: 158,
    feeling: 'Great',
    workoutScore: 90,
    feedback: 'Excellent cycling cadence! Pushed through challenging resistance.',
    timestamp: new Date(Date.now() - 86400000 * 5).toISOString()
  }
];

export const DEMO_WATER_LOGS: WaterLog[] = [
  { id: 'w-log-1', userId: 'guest-user', amountMl: 500, timestamp: new Date(Date.now() - 3600000 * 8).toISOString() },
  { id: 'w-log-2', userId: 'guest-user', amountMl: 350, timestamp: new Date(Date.now() - 3600000 * 5).toISOString() },
  { id: 'w-log-3', userId: 'guest-user', amountMl: 750, timestamp: new Date(Date.now() - 3600000 * 2).toISOString() }
];

export function getTodayDateStr(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
