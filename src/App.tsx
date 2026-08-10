import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { auth, db } from './lib/firebase';
import { NavTab, Navigation } from './components/Navigation';
import { Header } from './components/Header';
import { HomeDashboard } from './components/HomeDashboard';
import { WorkoutScreen } from './components/WorkoutScreen';
import { ProgressPage } from './components/ProgressPage';
import { AICoachPage } from './components/AICoachPage';
import { ProfileSettingsPage } from './components/ProfileSettingsPage';
import { AuthModal } from './components/AuthModal';
import { SafetyDisclaimerModal } from './components/SafetyDisclaimerModal';
import { AdRewardModal } from './components/AdRewardModal';
import { AmazonAppstoreGuideModal } from './components/AmazonAppstoreGuideModal';
import { MonetizationHubModal, UnlockableModule } from './components/MonetizationHubModal';
import { IapCheckoutModal } from './components/IapCheckoutModal';
import { AdMobBanner } from './components/AdMobBanner';

import { UserProfile, WorkoutRecord, DailyActivity, WaterLog, AIWorkoutPlan } from './types';
import { DEFAULT_USER_PROFILE, DEMO_WORKOUTS, DEMO_WATER_LOGS, getTodayDateStr } from './utils/initialData';
import { calculateDailyActivityScore } from './utils/activityScore';

export function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [simulatedHeartRate, setSimulatedHeartRate] = useState<number | null>(128);

  // User Profile
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('navzlab_profile');
    return saved ? JSON.parse(saved) : DEFAULT_USER_PROFILE;
  });

  // Workout History
  const [workoutHistory, setWorkoutHistory] = useState<WorkoutRecord[]>(() => {
    const saved = localStorage.getItem('navzlab_workouts');
    return saved ? JSON.parse(saved) : DEMO_WORKOUTS;
  });

  // Water Logs
  const [waterLogs, setWaterLogs] = useState<WaterLog[]>(() => {
    const saved = localStorage.getItem('navzlab_water');
    return saved ? JSON.parse(saved) : DEMO_WATER_LOGS;
  });

  // Modals & Monetization State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isDisclaimerOpen, setIsDisclaimerOpen] = useState(false);
  const [customAIPlan, setCustomAIPlan] = useState<AIWorkoutPlan | null>(null);

  // Lifetime Premium & Monetization State
  const [isPremium, setIsPremium] = useState<boolean>(() => {
    return localStorage.getItem('navzlab_is_premium') === 'true';
  });

  const [unlockedModules, setUnlockedModules] = useState<string[]>(() => {
    const saved = localStorage.getItem('navzlab_unlocked');
    return saved ? JSON.parse(saved) : ['pro_hiit_masterclass'];
  });

  const [adCoins, setAdCoins] = useState<number>(() => {
    const saved = localStorage.getItem('navzlab_coins');
    return saved ? parseInt(saved, 10) : 50;
  });

  const [isAdModalOpen, setIsAdModalOpen] = useState(false);
  const [activeAdModule, setActiveAdModule] = useState<{ id: string; title: string } | null>(null);
  const [isAmazonGuideOpen, setIsAmazonGuideOpen] = useState(false);
  const [isMonetizationHubOpen, setIsMonetizationHubOpen] = useState(false);
  const [isIapModalOpen, setIsIapModalOpen] = useState(false);

  // Sync monetization state to localStorage
  useEffect(() => {
    localStorage.setItem('navzlab_is_premium', isPremium ? 'true' : 'false');
  }, [isPremium]);

  useEffect(() => {
    localStorage.setItem('navzlab_unlocked', JSON.stringify(unlockedModules));
  }, [unlockedModules]);

  useEffect(() => {
    localStorage.setItem('navzlab_coins', adCoins.toString());
  }, [adCoins]);

  const handleConfirmLifetimePurchase = () => {
    setIsPremium(true);
    setUnlockedModules(['pro_hiit_masterclass', 'ai_macro_meal_planner', 'cardio_strain_recovery']);
  };

  // Handlers for unlocking modules
  const handleUnlockModuleSuccess = (moduleId: string) => {
    if (!unlockedModules.includes(moduleId)) {
      setUnlockedModules((prev) => [...prev, moduleId]);
    }
    // Award bonus 50 ad coins for watching ad
    setAdCoins((prev) => prev + 50);
  };

  const handleWatchAdForModule = (module: UnlockableModule) => {
    setActiveAdModule({ id: module.id, title: module.title });
    setIsAdModalOpen(true);
  };

  const handleSpendCoinsToUnlock = (module: UnlockableModule) => {
    if (adCoins >= module.coinCost) {
      setAdCoins((prev) => prev - module.coinCost);
      if (!unlockedModules.includes(module.id)) {
        setUnlockedModules((prev) => [...prev, module.id]);
      }
    }
  };

  // Dark mode effect
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('navzlab_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem('navzlab_workouts', JSON.stringify(workoutHistory));
  }, [workoutHistory]);

  useEffect(() => {
    localStorage.setItem('navzlab_water', JSON.stringify(waterLogs));
  }, [waterLogs]);

  // Firebase Auth State Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Fetch or create user doc in Firestore
        try {
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userSnap = await getDoc(userDocRef);

          if (userSnap.exists()) {
            const data = userSnap.data() as UserProfile;
            setUserProfile({ ...data, isGuest: false });
          } else {
            const newProfile: UserProfile = {
              ...userProfile,
              uid: firebaseUser.uid,
              displayName: firebaseUser.displayName || 'Athlete',
              email: firebaseUser.email || '',
              isGuest: false
            };
            await setDoc(userDocRef, newProfile);
            setUserProfile(newProfile);
          }

          // Fetch user workouts from Firestore
          const wQuery = query(collection(db, 'workouts'), where('userId', '==', firebaseUser.uid));
          const wSnap = await getDocs(wQuery);
          if (!wSnap.empty) {
            const remoteWorkouts: WorkoutRecord[] = wSnap.docs.map(docSnap => ({
              ...(docSnap.data() as WorkoutRecord),
              id: docSnap.id
            }));
            setWorkoutHistory(remoteWorkouts);
          }
        } catch (err) {
          console.error("Firestore sync error:", err);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Compute Today's Daily Activity
  const todayStr = getTodayDateStr();
  const todayWaterMl = waterLogs
    .filter(log => log.timestamp.startsWith(todayStr))
    .reduce((sum, log) => sum + log.amountMl, 0);

  const todayWorkouts = workoutHistory.filter(w => w.timestamp.startsWith(todayStr));
  const todayActiveMins = todayWorkouts.reduce((sum, w) => sum + Math.floor(w.durationSeconds / 60), 0);
  const todayCalories = todayWorkouts.reduce((sum, w) => sum + w.caloriesBurned, 0);
  const todayDistance = todayWorkouts.reduce((sum, w) => sum + w.distanceKm, 0);

  // Estimating steps based on distance & workout active time
  const todaySteps = Math.round(todayDistance * 1350 + todayActiveMins * 85);

  const todayScore = calculateDailyActivityScore(
    todaySteps,
    userProfile.dailyStepGoal,
    todayActiveMins,
    userProfile.dailyWorkoutGoalMin,
    todayWaterMl,
    userProfile.dailyWaterGoalL * 1000,
    todayCalories
  );

  const dailyActivity: DailyActivity = {
    id: todayStr,
    userId: userProfile.uid,
    dateStr: todayStr,
    steps: Math.max(todaySteps, 6842), // Fallback base steps for demo vibrancy
    calories: Math.max(todayCalories, 326),
    activeMinutes: Math.max(todayActiveMins, 42),
    distanceKm: Math.max(todayDistance, 5.2),
    waterMl: todayWaterMl > 0 ? todayWaterMl : 1600,
    heartRateAvg: simulatedHeartRate,
    score: todayScore > 0 ? todayScore : 87
  };

  // Water Actions
  const handleAddWater = async (amountMl: number) => {
    const newLog: WaterLog = {
      id: `water-${Date.now()}`,
      userId: userProfile.uid,
      amountMl,
      timestamp: new Date().toISOString()
    };

    setWaterLogs((prev) => [newLog, ...prev]);

    if (!userProfile.isGuest && auth.currentUser) {
      try {
        await addDoc(collection(db, 'waterLogs'), newLog);
      } catch (err) {
        console.error("Error saving water log to Firestore:", err);
      }
    }
  };

  const handleRemoveLastWater = () => {
    setWaterLogs((prev) => prev.slice(1));
  };

  // Workout Save
  const handleSaveWorkout = async (workoutData: Omit<WorkoutRecord, 'id' | 'userId'>) => {
    const newRecord: WorkoutRecord = {
      ...workoutData,
      id: `workout-${Date.now()}`,
      userId: userProfile.uid
    };

    setWorkoutHistory((prev) => [newRecord, ...prev]);

    if (!userProfile.isGuest && auth.currentUser) {
      try {
        await addDoc(collection(db, 'workouts'), newRecord);
      } catch (err) {
        console.error("Error saving workout to Firestore:", err);
      }
    }
  };

  // Demo Data Populate
  const handlePopulateDemoData = () => {
    setWorkoutHistory(DEMO_WORKOUTS);
    setWaterLogs(DEMO_WATER_LOGS);
    setUserProfile(DEFAULT_USER_PROFILE);
  };

  const handleClearAllData = () => {
    setWorkoutHistory([]);
    setWaterLogs([]);
    localStorage.removeItem('navzlab_workouts');
    localStorage.removeItem('navzlab_water');
  };

  // Start Custom AI Workout from AI Coach
  const handleStartCustomAIWorkout = (plan: AIWorkoutPlan) => {
    setCustomAIPlan(plan);
    setActiveTab('workout');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col antialiased selection:bg-emerald-500 selection:text-slate-950">
      {/* Top Header */}
      <Header
        userProfile={userProfile}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenDisclaimer={() => setIsDisclaimerOpen(true)}
        onOpenAmazonGuide={() => setIsAmazonGuideOpen(true)}
        onOpenAdRewards={() => setIsMonetizationHubOpen(true)}
        adCoins={adCoins}
        isPremium={isPremium}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-2xl w-full mx-auto px-4 pt-3">
        {activeTab === 'home' && (
          <HomeDashboard
            userProfile={userProfile}
            dailyActivity={dailyActivity}
            recentWorkout={workoutHistory[0]}
            onStartWorkout={() => setActiveTab('workout')}
            onAddWater={handleAddWater}
            onRemoveLastWater={handleRemoveLastWater}
            onNavigateTab={(tab) => setActiveTab(tab)}
            simulatedHeartRate={simulatedHeartRate}
            toggleHeartRateSensor={() => setSimulatedHeartRate(simulatedHeartRate ? null : 128)}
          />
        )}

        {activeTab === 'workout' && (
          <WorkoutScreen
            userProfile={userProfile}
            onSaveWorkout={handleSaveWorkout}
            onNavigateTab={(tab) => setActiveTab(tab)}
            simulatedHeartRate={simulatedHeartRate}
            toggleHeartRateSensor={() => setSimulatedHeartRate(simulatedHeartRate ? null : 128)}
            customAIPlan={customAIPlan}
          />
        )}

        {activeTab === 'progress' && (
          <ProgressPage
            userProfile={userProfile}
            workoutHistory={workoutHistory}
            dailyActivity={dailyActivity}
          />
        )}

        {activeTab === 'aicoach' && (
          <AICoachPage
            userProfile={userProfile}
            dailyActivity={dailyActivity}
            recentWorkouts={workoutHistory}
            onStartCustomAIWorkout={handleStartCustomAIWorkout}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileSettingsPage
            userProfile={userProfile}
            onUpdateProfile={(updated) => setUserProfile({ ...userProfile, ...updated })}
            onPopulateDemoData={handlePopulateDemoData}
            onClearAllData={handleClearAllData}
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            onOpenAmazonGuide={() => setIsAmazonGuideOpen(true)}
            onOpenAdRewards={() => setIsMonetizationHubOpen(true)}
            isPremium={isPremium}
            onUnlockLifetimePremium={() => setIsIapModalOpen(true)}
          />
        )}

        {/* AdMob Bottom Banner Ad Slot */}
        <AdMobBanner publisherId="ca-app-pub-8379818450369013" adSlot="5676564129" className="pb-16" />
      </main>

      {/* Bottom Navigation */}
      <Navigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Modals */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        userProfile={userProfile}
        onAuthSuccess={(authData) => {
          setUserProfile((prev) => ({ ...prev, ...authData }));
        }}
      />

      <SafetyDisclaimerModal
        isOpen={isDisclaimerOpen}
        onClose={() => setIsDisclaimerOpen(false)}
      />

      <AdRewardModal
        isOpen={isAdModalOpen}
        onClose={() => setIsAdModalOpen(false)}
        moduleTitle={activeAdModule?.title || 'Pro Feature Unlock'}
        moduleId={activeAdModule?.id || 'pro_module'}
        onSuccessUnlock={handleUnlockModuleSuccess}
      />

      <AmazonAppstoreGuideModal
        isOpen={isAmazonGuideOpen}
        onClose={() => setIsAmazonGuideOpen(false)}
      />

      <MonetizationHubModal
        isOpen={isMonetizationHubOpen}
        onClose={() => setIsMonetizationHubOpen(false)}
        unlockedModules={unlockedModules}
        adCoins={adCoins}
        isPremium={isPremium}
        onWatchAdForModule={handleWatchAdForModule}
        onSpendCoinsToUnlock={handleSpendCoinsToUnlock}
        onUnlockLifetimePremium={() => setIsIapModalOpen(true)}
        onOpenAmazonGuide={() => setIsAmazonGuideOpen(true)}
      />

      <IapCheckoutModal
        isOpen={isIapModalOpen}
        onClose={() => setIsIapModalOpen(false)}
        onConfirmPurchase={handleConfirmLifetimePurchase}
      />
    </div>
  );
}

export default App;
