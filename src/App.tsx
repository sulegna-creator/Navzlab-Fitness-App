import React, { useState, useEffect } from 'react';
import { AdMob } from '@capacitor-community/admob';
import { Capacitor } from '@capacitor/core';
import { SplashScreen } from '@capacitor/splash-screen'; // IMPORT THIS
import { Navigation } from './components/Navigation';
import { Header } from './components/Header';
import { HomeDashboard } from './components/HomeDashboard';
import { WorkoutScreen } from './components/WorkoutScreen';
import { ProgressPage } from './components/ProgressPage';
import { AICoachPage } from './components/AICoachPage';
import { ProfileSettingsPage } from './components/ProfileSettingsPage';
import { AdMobBanner } from './components/AdMobBanner';
import { DEFAULT_USER_PROFILE, DEMO_WORKOUTS } from './utils/initialData';

export function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [userProfile] = useState(DEFAULT_USER_PROFILE);
  const [isPremium] = useState(() => localStorage.getItem('navzlab_is_premium') === 'true');

  useEffect(() => {
    const initApp = async () => {
      if (Capacitor.isNativePlatform()) {
        try {
          // 1. Initialize AdMob
          await AdMob.initialize({ initializeForTesting: true });
          
          // 2. FORCE HIDE THE LOADING SCREEN
          await SplashScreen.hide(); 
          
          console.log("App Ready and Loading Screen Hidden");
        } catch (e) {
          // Even if AdMob fails, hide the loading screen so user can see dashboard
          await SplashScreen.hide();
        }
      }
    };
    initApp();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased">
      <Header userProfile={userProfile} isPremium={isPremium} />
      <main className="flex-1 max-w-2xl w-full mx-auto px-4 pt-3 pb-24">
        {activeTab === 'home' && <HomeDashboard userProfile={userProfile} dailyActivity={{ steps: 7500 } as any} />}
        {activeTab === 'workout' && <WorkoutScreen userProfile={userProfile} />}
        {activeTab === 'progress' && <ProgressPage userProfile={userProfile} workoutHistory={DEMO_WORKOUTS} />}
        {activeTab === 'aicoach' && <AICoachPage userProfile={userProfile} isPremium={isPremium} />}
        {activeTab === 'profile' && <ProfileSettingsPage userProfile={userProfile} isPremium={isPremium} />}
      </main>
      
      {!isPremium && <AdMobBanner />}
      <Navigation activeTab={activeTab as any} setActiveTab={setActiveTab as any} />
    </div>
  );
}
export default App;
