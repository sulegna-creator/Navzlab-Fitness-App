import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from './lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { AdMob } from '@capacitor-community/admob';
import { Capacitor } from '@capacitor/core';
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
  const [userProfile, setUserProfile] = useState(DEFAULT_USER_PROFILE);
  const [isPremium, setIsPremium] = useState(() => localStorage.getItem('navzlab_is_premium') === 'true');

  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      AdMob.initialize({ initializeForTesting: true }).catch(() => {});
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased">
      <Header userProfile={userProfile} isPremium={isPremium} />
      <main className="flex-1 max-w-2xl w-full mx-auto px-4 pt-3">
        {activeTab === 'home' && <HomeDashboard userProfile={userProfile} dailyActivity={{ steps: 7500 } as any} />}
        {activeTab === 'workout' && <WorkoutScreen userProfile={userProfile} />}
        {activeTab === 'progress' && <ProgressPage userProfile={userProfile} workoutHistory={DEMO_WORKOUTS} />}
        {activeTab === 'aicoach' && <AICoachPage userProfile={userProfile} isPremium={isPremium} />}
        {activeTab === 'profile' && <ProfileSettingsPage userProfile={userProfile} isPremium={isPremium} />}
        {!isPremium && <AdMobBanner />}
      </main>
      <Navigation activeTab={activeTab as any} setActiveTab={setActiveTab as any} />
    </div>
  );
}
export default App;
