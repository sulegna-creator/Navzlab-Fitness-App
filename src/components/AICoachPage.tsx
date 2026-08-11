import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, Send, Sparkles, Dumbbell, Play, ShieldAlert, Clock, 
  Target, CheckCircle2, RefreshCw, Zap, Info 
} from 'lucide-react';
import { AdMob } from '@capacitor-community/admob';
import { AdMobBanner } from './AdMobBanner';
import { UserProfile, DailyActivity, WorkoutRecord, AIChatMessage, AIWorkoutPlan } from '../types';

// --- CHANGE THIS TO YOUR LIVE BACKEND URL ---
const API_BASE_URL = 'https://YOUR-BACKEND-URL-HERE.com'; 

interface AICoachPageProps {
  userProfile: UserProfile;
  dailyActivity: DailyActivity;
  recentWorkouts: WorkoutRecord[];
  onStartCustomAIWorkout: (plan: AIWorkoutPlan) => void;
}

export const AICoachPage: React.FC<AICoachPageProps> = ({
  userProfile,
  dailyActivity,
  recentWorkouts,
  onStartCustomAIWorkout
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'chat' | 'generator'>('chat');
  const [msgCountSinceAd, setMsgCountSinceAd] = useState(0);

  // Chat state
  const [messages, setMessages] = useState<AIChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'ai',
      text: `Hello ${userProfile.displayName || 'Athlete'}! I am your NAVZLAB AI Coach. How can I help you today?`,
      timestamp: new Date().toISOString()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  // Generator state
  const [genFitnessLevel, setGenFitnessLevel] = useState(userProfile.fitnessLevel || 'Beginner');
  const [genGoal, setGenGoal] = useState('General fitness');
  const [genDuration, setGenDuration] = useState(30);
  const [genEquipment, setGenEquipment] = useState('None');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<AIWorkoutPlan | null>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    AdMob.initialize({ testingDevices: [], initializeForTesting: true });
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const triggerInterstitialAd = async () => {
    try {
      await AdMob.prepareInterstitial({ adId: 'ca-app-pub-3940256099942544/1033173712' });
      await AdMob.showInterstitial();
    } catch (e) { console.log('AdMob skip:', e); }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || isSending) return;

    // Show ad every 3 messages (Non-blocking so AI can start)
    if (msgCountSinceAd >= 2) {
      triggerInterstitialAd();
      setMsgCountSinceAd(0);
    } else {
      setMsgCountSinceAd(prev => prev + 1);
    }

    const userMsg: AIChatMessage = { id: `user-${Date.now()}`, sender: 'user', text, timestamp: new Date().toISOString() };
    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMessage('');
    setIsSending(true);

    try {
      // UPDATED TO USE FULL URL
      const res = await fetch(`${API_BASE_URL}/api/ai/coach`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history: messages.map(m => ({ sender: m.sender, text: m.text })), userProfile })
      });

      const data = await res.json();
      setMessages((prev) => [...prev, {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: data.reply || "I'm here to support your fitness goals safely.",
        timestamp: new Date().toISOString()
      }]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [...prev, { id: 'err', sender: 'ai', text: "Connection error. Please check your internet.", timestamp: new Date().toISOString() }]);
    } finally { setIsSending(false); }
  };

  const handleGenerateWorkout = async () => {
    setIsGenerating(true);
    setGeneratedPlan(null);

    // Show ad while AI generates (Non-blocking)
    triggerInterstitialAd();

    try {
      // UPDATED TO USE FULL URL
      const res = await fetch(`${API_BASE_URL}/api/ai/generate-workout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fitnessLevel: genFitnessLevel, goal: genGoal, durationMinutes: genDuration, equipment: genEquipment })
      });

      const data = await res.json();
      setGeneratedPlan(data.workoutPlan || data.fallbackWorkout);
    } catch (err) {
      console.error(err);
    } finally { setIsGenerating(false); }
  };

  return (
    <div className="space-y-6 pb-24 pt-2">
      {/* Header */}
      <div className="bg-gradient-to-br from-teal-950/60 via-slate-900 to-slate-900 border border-teal-500/30 rounded-3xl p-5 space-y-3 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/20 text-teal-300 flex items-center justify-center font-bold"><Bot className="w-6 h-6" /></div>
            <div>
              <h1 className="text-xl font-black text-slate-100">NAVZLAB AI COACH</h1>
              <p className="text-xs text-teal-400 font-semibold">Monitor. Move. Improve.</p>
            </div>
          </div>
        </div>
        <div className="flex bg-slate-950 p-1 rounded-2xl border border-slate-800">
          <button onClick={() => setActiveSubTab('chat')} className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${activeSubTab === 'chat' ? 'bg-teal-500 text-slate-950' : 'text-slate-400'}`}>💬 Chat</button>
          <button onClick={() => setActiveSubTab('generator')} className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${activeSubTab === 'generator' ? 'bg-teal-500 text-slate-950' : 'text-slate-400'}`}>⚡ Create Workout</button>
        </div>
      </div>

      {/* Main Content Area */}
      {activeSubTab === 'chat' ? (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 shadow-xl flex flex-col h-[480px]">
          <div className="flex-1 overflow-y-auto space-y-3.5 pr-1">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3.5 rounded-2xl text-xs ${msg.sender === 'user' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-950 text-slate-200 border border-slate-800'}`}>
                  <p>{msg.text}</p>
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
          <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="flex items-center gap-2 pt-2 border-t border-slate-800">
            <input type="text" placeholder="Ask AI..." value={inputMessage} onChange={(e) => setInputMessage(e.target.value)} className="flex-1 px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none" />
            <button type="submit" className="p-3 rounded-2xl bg-teal-500 text-slate-950"><Send className="w-4 h-4" /></button>
          </form>
        </div>
      ) : (
        /* Generator View (Same as your previous logic) */
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 space-y-5">
           <button onClick={handleGenerateWorkout} className="w-full py-4 rounded-2xl bg-teal-500 text-slate-950 font-black">GENERATE AI WORKOUT</button>
           {generatedPlan && <div className="text-white p-4 bg-slate-950 rounded-xl">Plan: {generatedPlan.title}</div>}
        </div>
      )}

      {/* Banner Ad Placement */}
      <AdMobBanner />
    </div>
  );
};
