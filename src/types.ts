export type UnitSystem = 'metric' | 'imperial';
export type FitnessLevel = 'Beginner' | 'Intermediate' | 'Advanced';
export type WorkoutType = 'Walking' | 'Running' | 'Cycling' | 'Strength Training' | 'HIIT' | 'Stretching' | 'Treadmill' | 'Custom';
export type FeelingRating = 'Great' | 'Good' | 'Okay' | 'Tired' | 'Dizzy' | 'Pain';
export type GoalType = 'time' | 'distance' | 'calories' | 'none';

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  age: number;
  heightCm: number;
  weightKg: number;
  fitnessLevel: FitnessLevel;
  dailyStepGoal: number;
  dailyWaterGoalL: number;
  dailyWorkoutGoalMin: number;
  dailyDistanceGoalKm: number;
  unitSystem: UnitSystem;
  isGuest: boolean;
  createdAt?: string;
}

export interface WorkoutRecord {
  id: string;
  userId: string;
  type: WorkoutType;
  customType?: string;
  durationSeconds: number;
  distanceKm: number;
  caloriesBurned: number;
  avgHeartRate: number | null;
  maxHeartRate: number | null;
  feeling?: FeelingRating;
  notes?: string;
  workoutScore: number;
  feedback: string;
  timestamp: string; // ISO String
}

export interface WaterLog {
  id: string;
  userId: string;
  amountMl: number;
  timestamp: string;
}

export interface DailyActivity {
  id: string; // YYYY-MM-DD
  userId: string;
  dateStr: string;
  steps: number;
  calories: number;
  activeMinutes: number;
  distanceKm: number;
  waterMl: number;
  heartRateAvg: number | null;
  score: number;
}

export interface AIWorkoutPlan {
  title: string;
  overview: string;
  warmUp: { name: string; duration: string; instructions: string }[];
  mainRoutine: { name: string; sets: string; repsOrTime: string; rest: string; instructions: string }[];
  coolDown: { name: string; duration: string; instructions: string }[];
  safetyReminder: string;
}

export interface AIChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  workoutPlan?: AIWorkoutPlan;
}
