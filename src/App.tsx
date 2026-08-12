import React, { useState, useEffect } from 'react';
import { 
  Home, 
  Dumbbell, 
  LineChart, 
  Bot, 
  User,
  Heart,
  Timer,
  Zap,
  Flame,
  Droplets,
  Calendar,
  ChevronRight,
  TrendingUp,
  Award,
  Plus
} from 'lucide-react';
// --- ADDED THESE IMPORTS ---
import { AdMob } from '@capacitor-community/admob';
import { Capacitor } from '@capacitor/core';

import { HomeDashboard } from './components/HomeDashboard';
import { WorkoutPage } from './components/WorkoutPage';
import { ProgressPage } from './components/ProgressPage';
import { AICoachPage } from './components/AICoachPage';
import { ProfileSettingsPage } from './components/ProfileSettingsPage';
import { AuthModal } from './components/AuthModal';
import { UserProfile, DailyActivity, WorkoutRecord, AIWorkoutPlan } from './types';

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  
  // --- ADDED ADMOB INITIALIZATION ---
  useEffect(() => {
    const initAdMob = async () => {
      // Only run on real phone to prevent browser crashes
      if (Capacitor.isNativePlatform()) {
        try {
          await AdMob.initialize({
            initializeForTesting: true, // Set to false when you go to Play Store
          });
          console.log("AdMob Engine Ready 🚀");
        } catch (e) {
          console.log("AdMob already running or failed quietly");
        }
      }
    };
    initAdMob();
  }, []);

  // Mock data for initial state
  const [dailyActivity, setDailyActivity] = useState<DailyActivity>({
    id: new Date().toISOString().split('T')[0],
    userId: 'user123',
    dateStr: new Date().toISOString().split('T')[0],
    steps: 6432,
    calories: 320,
    activeMinutes: 42,
    distanceKm: 4.8,
    waterMl: 1200,
    score: 72
  });

  const [recentWorkouts, setRecentWorkouts] = useState<WorkoutRecord[]>([
    {
      id: 'w1',
      userId: 'user123',
      type: 'Running',
      durationSeconds: 1800,
      caloriesBurned: 350,
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      feeling: 'Good',
      workoutScore: 85,
      feedback: "Great consistency! You maintained a steady pace throughout the run."
    },
    {
      id: 'w2',
      userId: 'user123',
      type: 'Strength',
      durationSeconds: 2700,
      caloriesBurned: 280,
      timestamp: new Date(Date.now() - 172800000).toISOString(),
      feeling: 'Great',
      workoutScore: 92,
      feedback: "Excellent intensity. Your heart rate recovery was optimal."
    }
  ]);

  const handleStartCustomAIWorkout = (plan: AIWorkoutPlan) => {
    console.log("Starting AI Plan:", plan.title);
    setActiveTab('workout');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomeDashboard dailyActivity={dailyActivity} recentWorkouts={recentWorkouts} onWaterAdd={(ml) => setDailyActivity(prev => ({ ...prev, waterMl: prev.waterMl + ml }))} />;
      case 'workout':
        return <WorkoutPage onWorkoutComplete={(workout) => setRecentWorkouts(prev => [workout, ...prev])} />;
      case 'progress':
        return <ProgressPage dailyActivity={dailyActivity} workouts={recentWorkouts} />;
      case 'ai-coach':
        return <AICoachPage userProfile={userProfile || { uid: 'guest', displayName: 'Athlete' } as any} dailyActivity={dailyActivity} recentWorkouts={recentWorkouts} onStartCustomAIWorkout={handleStartCustomAIWorkout} />;
      case 'profile':
        return <ProfileSettingsPage userProfile={userProfile} onAuthClick={() => setShowAuthModal(true)} />;
      default:
        return <HomeDashboard dailyActivity={dailyActivity} recentWorkouts={recentWorkouts} onWaterAdd={(ml) => setDailyActivity(prev => ({ ...prev, waterMl: prev.waterMl + ml }))} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100 selection:bg-emerald-500 selection:text-slate-950">
      <main className="max-w-md mx-auto min-h-screen relative shadow-2xl shadow-emerald-900/10">
        <div className="pb-24 pt-4 px-4">
          {renderContent()}
        </div>

        {/* Floating Bottom Navigation */}
        <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-sm bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-2 flex items-center justify-between shadow-2xl z-50">
          <NavItem active={activeTab === 'home'} icon={<Home />} label="Home" onClick={() => setActiveTab('home')} />
          <NavItem active={activeTab === 'workout'} icon={<Dumbbell />} label="Workout" onClick={() => setActiveTab('workout')} />
          <NavItem active={activeTab === 'progress'} icon={<LineChart />} label="Progress" onClick={() => setActiveTab('progress')} />
          <NavItem active={activeTab === 'ai-coach'} icon={<Bot />} label="AI Coach" onClick={() => setActiveTab('ai-coach')} />
          <NavItem active={activeTab === 'profile'} icon={<User />} label="Profile" onClick={() => setActiveTab('profile')} />
        </nav>
      </main>

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} onAuthSuccess={(profile) => { setUserProfile(profile); setShowAuthModal(false); }} />}
    </div>
  );
}

function NavItem({ active, icon, label, onClick }: { active: boolean, icon: React.ReactNode, label: string, onClick: () => void }) {
  return (
    <button onClick={onClick} className={`flex flex-col items-center justify-center p-2 rounded-2xl transition-all duration-300 ${active ? 'bg-emerald-500 text-slate-950 scale-110 shadow-lg shadow-emerald-500/20' : 'text-slate-500 hover:text-slate-300'}`}>
      {React.cloneElement(icon as React.ReactElement, { size: 20, strokeWidth: active ? 2.5 : 2 })}
      <span className="text-[10px] font-bold mt-1 uppercase tracking-tighter">{label}</span>
    </button>
  );
}

export default App;
