import React, { useState } from 'react';
import { 
  User, 
  Settings, 
  ShieldCheck, 
  Download, 
  Trash2, 
  Database, 
  Moon, 
  Sun, 
  Globe, 
  Bell, 
  Save, 
  LogOut, 
  ShieldAlert,
  CheckCircle2,
  Sparkles,
  ShoppingBag,
  Tv
} from 'lucide-react';
import { UserProfile, UnitSystem, FitnessLevel } from '../types';
import { formatHeight, formatWeight } from '../utils/unitConverter';

interface ProfileSettingsPageProps {
  userProfile: UserProfile;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  onPopulateDemoData: () => void;
  onClearAllData: () => void;
  onOpenAuthModal: () => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  onOpenAmazonGuide?: () => void;
  onOpenAdRewards?: () => void;
  isPremium?: boolean;
  onUnlockLifetimePremium?: () => void;
}

export const ProfileSettingsPage: React.FC<ProfileSettingsPageProps> = ({
  userProfile,
  onUpdateProfile,
  onPopulateDemoData,
  onClearAllData,
  onOpenAuthModal,
  darkMode,
  setDarkMode,
  onOpenAmazonGuide,
  onOpenAdRewards,
  isPremium = false,
  onUnlockLifetimePremium
}) => {
  const [formData, setFormData] = useState<UserProfile>(userProfile);
  const [isSaved, setIsSaved] = useState(false);
  const [notifications, setNotifications] = useState(true);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(userProfile, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `NAVZLAB_Fitness_Profile_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6 pb-24 pt-2">
      {/* Title Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 space-y-2 shadow-xl">
        <h1 className="text-2xl font-black text-slate-100 font-display">
          PROFILE & SETTINGS ⚙️
        </h1>
        <p className="text-xs text-slate-400">
          Manage your personal fitness metrics, daily goals, units, and privacy.
        </p>
      </div>

      {/* Profile Form Card */}
      <form onSubmit={handleSaveProfile} className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-5 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-xl">
              {formData.displayName ? formData.displayName.charAt(0).toUpperCase() : 'N'}
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100 font-display">Personal Fitness Profile</h2>
              <p className="text-xs text-slate-400">
                {formData.isGuest ? 'Guest Account (Local Data)' : formData.email}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenAuthModal}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-emerald-400 font-bold border border-slate-700"
          >
            {formData.isGuest ? 'Sign In / Account' : 'Manage Auth'}
          </button>
        </div>

        {isSaved && (
          <div className="p-3 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Profile settings saved successfully!</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          {/* Display Name */}
          <div className="space-y-1">
            <label className="font-bold text-slate-300">Display Name</label>
            <input
              type="text"
              value={formData.displayName}
              onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
              className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Age */}
          <div className="space-y-1">
            <label className="font-bold text-slate-300">Age (Years)</label>
            <input
              type="number"
              min={10}
              max={120}
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
              className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Height */}
          <div className="space-y-1">
            <label className="font-bold text-slate-300">
              Height ({formData.unitSystem === 'imperial' ? 'Inches / Ft' : 'cm'})
            </label>
            <input
              type="number"
              value={formData.heightCm}
              onChange={(e) => setFormData({ ...formData, heightCm: Number(e.target.value) })}
              className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-emerald-500"
            />
            <p className="text-[10px] text-slate-400">
              Formatted: {formatHeight(formData.heightCm, formData.unitSystem)}
            </p>
          </div>

          {/* Weight */}
          <div className="space-y-1">
            <label className="font-bold text-slate-300">
              Weight ({formData.unitSystem === 'imperial' ? 'lbs' : 'kg'})
            </label>
            <input
              type="number"
              value={formData.weightKg}
              onChange={(e) => setFormData({ ...formData, weightKg: Number(e.target.value) })}
              className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-emerald-500"
            />
            <p className="text-[10px] text-slate-400">
              Formatted: {formatWeight(formData.weightKg, formData.unitSystem)}
            </p>
          </div>

          {/* Fitness Level */}
          <div className="space-y-1">
            <label className="font-bold text-slate-300">Fitness Level</label>
            <select
              value={formData.fitnessLevel}
              onChange={(e) => setFormData({ ...formData, fitnessLevel: e.target.value as FitnessLevel })}
              className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-emerald-500"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          {/* Daily Step Goal */}
          <div className="space-y-1">
            <label className="font-bold text-slate-300">Daily Step Goal</label>
            <input
              type="number"
              step={500}
              value={formData.dailyStepGoal}
              onChange={(e) => setFormData({ ...formData, dailyStepGoal: Number(e.target.value) })}
              className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Daily Water Goal */}
          <div className="space-y-1">
            <label className="font-bold text-slate-300">Daily Water Goal (Liters)</label>
            <input
              type="number"
              step={0.1}
              value={formData.dailyWaterGoalL}
              onChange={(e) => setFormData({ ...formData, dailyWaterGoalL: Number(e.target.value) })}
              className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Daily Workout Goal */}
          <div className="space-y-1">
            <label className="font-bold text-slate-300">Daily Workout Goal (Minutes)</label>
            <input
              type="number"
              step={5}
              value={formData.dailyWorkoutGoalMin}
              onChange={(e) => setFormData({ ...formData, dailyWorkoutGoalMin: Number(e.target.value) })}
              className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
        >
          <Save className="w-4 h-4" />
          <span>Save Profile Changes</span>
        </button>
      </form>

      {/* App Preferences */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
        <h2 className="text-base font-bold text-slate-100 font-display flex items-center gap-2">
          <Settings className="w-5 h-5 text-emerald-400" />
          <span>App Preferences & Configuration</span>
        </h2>

        <div className="space-y-3 text-xs">
          {/* Unit System */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
            <div className="flex items-center gap-2.5">
              <Globe className="w-4 h-4 text-cyan-400" />
              <div>
                <span className="font-bold text-slate-200">Measurement Units</span>
                <p className="text-[10px] text-slate-400">Choose Metric (km/kg) or Imperial (mi/lbs)</p>
              </div>
            </div>

            <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => onUpdateProfile({ unitSystem: 'metric' })}
                className={`px-3 py-1 rounded-lg text-xs font-bold ${
                  userProfile.unitSystem === 'metric' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400'
                }`}
              >
                Metric
              </button>
              <button
                type="button"
                onClick={() => onUpdateProfile({ unitSystem: 'imperial' })}
                className={`px-3 py-1 rounded-lg text-xs font-bold ${
                  userProfile.unitSystem === 'imperial' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400'
                }`}
              >
                Imperial
              </button>
            </div>
          </div>

          {/* Theme */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
            <div className="flex items-center gap-2.5">
              {darkMode ? <Moon className="w-4 h-4 text-amber-300" /> : <Sun className="w-4 h-4 text-slate-300" />}
              <div>
                <span className="font-bold text-slate-200">App Theme Mode</span>
                <p className="text-[10px] text-slate-400">High-contrast Dark or Light display</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setDarkMode(!darkMode)}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold"
            >
              {darkMode ? 'Dark Theme' : 'Light Theme'}
            </button>
          </div>

          {/* Notifications */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
            <div className="flex items-center gap-2.5">
              <Bell className="w-4 h-4 text-emerald-400" />
              <div>
                <span className="font-bold text-slate-200">Daily Reminder Notifications</span>
                <p className="text-[10px] text-slate-400">Hydration & workout prompt reminders</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setNotifications(!notifications)}
              className={`w-11 h-6 rounded-full transition-colors relative ${
                notifications ? 'bg-emerald-500' : 'bg-slate-800'
              }`}
            >
              <span className={`w-4 h-4 rounded-full bg-slate-950 absolute top-1 transition-all ${
                notifications ? 'right-1' : 'left-1'
              }`} />
            </button>
          </div>
        </div>
      </div>

      {/* Monetization & Lifetime Premium Pass */}
      <div className="bg-gradient-to-br from-amber-950/30 via-slate-900 to-slate-900 border border-amber-500/30 rounded-3xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-100 font-display flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-amber-400" />
            <span>Monetization & In-App Purchases</span>
          </h2>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border ${
            isPremium
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
          }`}>
            {isPremium ? '👑 VIP ACTIVE' : 'PRO OPTIONS'}
          </span>
        </div>

        {/* Premium Pass Status or Buy Option */}
        <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-white flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Lifetime VIP Pass ($4.99)
              </span>
              {isPremium && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  UNLOCKED
                </span>
              )}
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              100% Ad-Free experience + Unlimited AI generation + Lifetime access to all current and future Pro modules.
            </p>
          </div>

          {!isPremium && onUnlockLifetimePremium && (
            <button
              type="button"
              onClick={onUnlockLifetimePremium}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-emerald-400 text-slate-950 font-black text-xs hover:from-amber-300 hover:to-emerald-300 transition-all shadow-md shrink-0 active:scale-95 whitespace-nowrap"
            >
              Unlock ($4.99)
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {onOpenAdRewards && (
            <button
              type="button"
              onClick={onOpenAdRewards}
              className="p-3.5 rounded-2xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-bold flex items-center justify-center gap-2 transition-all"
            >
              <Tv className="w-4 h-4 text-amber-400" />
              <span>Ad Rewards & Pro Hub</span>
            </button>
          )}

          {onOpenAmazonGuide && (
            <button
              type="button"
              onClick={onOpenAmazonGuide}
              className="p-3.5 rounded-2xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 font-bold flex items-center justify-center gap-2 transition-all"
            >
              <ShoppingBag className="w-4 h-4 text-cyan-400" />
              <span>Amazon Publishing Guide</span>
            </button>
          )}
        </div>
      </div>

      {/* Data Management & Testing Tools */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
        <h2 className="text-base font-bold text-slate-100 font-display flex items-center gap-2">
          <Database className="w-5 h-5 text-amber-400" />
          <span>Data Management & Development Tools</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <button
            onClick={onPopulateDemoData}
            className="p-3.5 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-emerald-400 font-bold flex items-center justify-center gap-2 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Populate Demo Data</span>
          </button>

          <button
            onClick={handleExportJSON}
            className="p-3.5 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-cyan-400 font-bold flex items-center justify-center gap-2 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Export Data JSON</span>
          </button>

          <button
            onClick={onClearAllData}
            className="p-3.5 rounded-2xl bg-slate-950 hover:bg-rose-950/40 border border-slate-800 hover:border-rose-500/40 text-rose-400 font-bold flex items-center justify-center gap-2 transition-all"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear Local Data</span>
          </button>
        </div>
      </div>

      {/* Health & Safety Disclaimer Banner */}
      <div className="bg-slate-900/90 border border-amber-500/30 rounded-3xl p-5 space-y-2 shadow-xl">
        <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
          <ShieldAlert className="w-4 h-4" />
          <span>NAVZLAB Health & Safety Disclaimer</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          NAVZLAB Health and Fitness Monitor is designed for general fitness and wellness tracking. It is not a medical device and does not diagnose, treat, or prevent medical conditions. Fitness measurements and calorie estimates may be approximate.
        </p>
      </div>
    </div>
  );
};
