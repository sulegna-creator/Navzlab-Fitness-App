export function calculateDailyActivityScore(
  steps: number,
  stepGoal: number,
  activeMinutes: number,
  workoutGoalMin: number,
  waterMl: number,
  waterGoalMl: number,
  calories: number
): number {
  const stepRatio = Math.min(1, steps / Math.max(1, stepGoal));
  const workoutRatio = Math.min(1, activeMinutes / Math.max(1, workoutGoalMin));
  const waterRatio = Math.min(1, waterMl / Math.max(1, waterGoalMl));
  const calorieRatio = Math.min(1, calories / 400);

  // Weighted calculation out of 100
  const rawScore = (stepRatio * 40) + (workoutRatio * 30) + (waterRatio * 20) + (calorieRatio * 10);
  return Math.min(100, Math.max(0, Math.round(rawScore)));
}

export function calculateWorkoutScore(
  durationSeconds: number,
  caloriesBurned: number,
  feeling?: string
): number {
  const durationMin = durationSeconds / 60;
  let base = Math.min(60, (durationMin / 30) * 50);
  let calBonus = Math.min(30, (caloriesBurned / 250) * 30);
  let feelingBonus = 10;
  if (feeling === 'Great') feelingBonus = 10;
  if (feeling === 'Good') feelingBonus = 8;
  if (feeling === 'Okay') feelingBonus = 6;
  if (feeling === 'Tired') feelingBonus = 4;
  if (feeling === 'Dizzy' || feeling === 'Pain') feelingBonus = 0;

  return Math.min(100, Math.round(base + calBonus + feelingBonus));
}
