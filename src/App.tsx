import React, { useState, useEffect } from 'react';
import { SplashScreen } from '@capacitor/splash-screen';
import { Capacitor } from '@capacitor/core';
import { AdMob } from '@capacitor-community/admob';
import { Navigation } from './components/Navigation';
import { Header } from './components/Header';
import { HomeDashboard } from './components/HomeDashboard';
import { AICoachPage } from './components/AICoachPage';
import { AdMobBanner } from './components/AdMobBanner';
import { DEFAULT_USER_PROFILE } from './utils/initialData';

export function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [userProfile] = useState(DEFAULT_USER_PROFILE);
  const [isPremium] = useState(() => localStorage.getItem('navzlab_is_premium') === 'true');

  useEffect(() => {
    const init = async () => {
      if (Capacitor.isNativePlatform()) {
        try {
          await AdMob.initialize({ initializeForTesting: true });
          // Force the loading screen to disappear
          await SplashScreen.hide();
        } catch (e) {
          await SplashScreen.hide();
        }
      }
    };
    init();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col antialiased">
      <Header userProfile={userProfile} isPremium={isPremium} />
      <main className="flex-1 max-w-2xl w-full mx-auto px-4 pb-24">
        {activeTab === 'home' && <HomeDashboard userProfile={userProfile} dailyActivity={{ steps: 7500 } as any} />}
        {activeTab === 'aicoach' && <AICoachPage userProfile={userProfile} isPremium={isPremium} />}
        {/* AdMob logic */}
        {!isPremium && <AdMobBanner />}
      </main>
      <Navigation activeTab={activeTab as any} setActiveTab={setActiveTab as any} />
    </div>
  );
}
export default App;
