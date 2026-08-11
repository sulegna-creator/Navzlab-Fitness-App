import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  Dumbbell, 
  Play, 
  ShieldAlert, 
  Clock, 
  Target, 
  CheckCircle2, 
  RefreshCw,
  Zap,
  Info
} from 'lucide-react';
// --- NATIVE ADMOB IMPORTS ---
import { AdMob } from '@capacitor-community/admob';
import { AdMobBanner } from './AdMobBanner';
import { UserProfile, DailyActivity, WorkoutRecord, AIChatMessage, AIWorkoutPlan } from '../types';

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
      text: `Hello ${userProfile.displayName || 'Athlete'}! I am your NAVZLAB AI Coach. I can analyze your activity stats, suggest tailored workouts, and guide your fitness journey safely. How can I help you today?`,
      timestamp: new Date().toISOString()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  // Generator form state
  const [genFitnessLevel, setGenFitnessLevel] = useState(userProfile.fitnessLevel || 'Beginner');
  const [genGoal, setGenGoal] = useState('General fitness');
  const [genDuration, setGenDuration] = useState(30);
  const [genEquipment, setGenEquipment] = useState('None');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<AIWorkoutPlan | null>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // --- INITIALIZE ADMOB ON LOAD ---
  useEffect(() => {
    AdMob.initialize({
      testingDevices: [],
      initializeForTesting: true,
    });
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // --- HELPER FUNCTION TO SHOW INTERSTITIAL ---
  const triggerInterstitialAd = async () => {
    try {
      await AdMob.prepareInterstitial({
        adId: 'ca-app-pub-3940256099942544/1033173712', // GOOGLE TEST ID
      });
      await AdMob.showInterstitial();
    } catch (e) {
      console.log('AdMob skipped or failed:', e);
    }
  };

  // Handle send message
  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || isSending) return;

    // Trigger Ad every 3 user messages
    if (msgCountSinceAd >= 2) {
      await triggerInterstitialAd();
      setMsgCountSinceAd(0);
    } else {
      setMsgCountSinceAd(prev => prev + 1);
    }

    const userMsg: AIChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toISOString()
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMessage('');
    setIsSending(true);

    try {
      const res = await fetch('/api/ai/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: messages.map(m => ({ sender: m.sender, text: m.text })),
          userProfile,
          recentStats: {
            steps: dailyActivity.steps,
            activeMinutes: dailyActivity.activeMinutes,
            waterMl: dailyActivity.waterMl,
            workoutCount: recentWorkouts.length
          }
        })
      });

      const data = await res.json();
      const aiMsg: AIChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: data.reply || "I'm here to support your fitness goals safely.",
        timestamp: new Date().toISOString()
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSending(false);
    }
  };

  // Handle AI Workout Generator
  const handleGenerateWorkout = async () => {
    setIsGenerating(true);
    setGeneratedPlan(null);

    // Show ad before displaying the "Premium" AI workout result
    await triggerInterstitialAd();

    try {
      const res = await fetch('/api/ai/generate-workout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fitnessLevel: genFitnessLevel,
          goal: genGoal,
          durationMinutes: genDuration,
          equipment: genEquipment
        })
      });

      const data = await res.json();
      setGeneratedPlan(data.workoutPlan || data.fallbackWorkout);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const presetQuestions = [
    "What workout should I do today?",
    "How did I perform this week?",
    "Give me a beginner workout.",
    "How can I improve my consistency?"
  ];

  return (
    <div className="space-y-6 pb-24 pt-2">
      {/* Title Header */}
      <div className="bg-gradient-to-br from-teal-950/60 via-slate-900 to-slate-900 border border-teal-500/30 rounded-3xl p-5 space-y-3 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/20 text-teal-300 flex items-center justify-center font-bold">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-100 font-display">NAVZLAB AI COACH</h1>
              <p className="text-xs text-teal-400 font-semibold">Monitor. Move. Improve.</p>
            </div>
          </div>
          <span className="text-[10px] px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">Gemini Powered</span>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-950 p-1 rounded-2xl border border-slate-800">
          <button onClick={() => setActiveSubTab('chat')} className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${activeSubTab === 'chat' ? 'bg-teal-500 text-slate-950' : 'text-slate-400'}`}>💬 AI Chat Guidance</button>
          <button onClick={() => setActiveSubTab('generator')} className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${activeSubTab === 'generator' ? 'bg-teal-500 text-slate-950' : 'text-slate-400'}`}>⚡ Create Workout</button>
        </div>
      </div>

      {/* Safety Disclaimer */}
      <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2.5">
        <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <p><strong className="text-slate-200">Disclaimer:</strong> NAVZLAB AI Coach provides general guidance. Please consult a doctor for medical concerns.</p>
      </div>

      {/* Chat Subtab */}
      {activeSubTab === 'chat' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-4 flex flex-col h-[520px]">
          <div className="flex-1 overflow-y-auto space-y-3.5 pr-1">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.sender === 'ai' && <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center shrink-0"><Bot className="w-4 h-4" /></div>}
                <div className={`max-w-[85%] p-3.5 rounded-2xl text-xs ${msg.sender === 'user' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-950 text-slate-200 border border-slate-800'}`}>
                  <p>{msg.text}</p>
                </div>
              </div>
            ))}
            {isSending && <div className="flex items-center gap-2 text-xs text-teal-400 p-2"><Sparkles className="w-4 h-4 animate-spin" /><span>Thinking...</span></div>}
            <div ref={chatEndRef} />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {presetQuestions.map((q) => <button key={q} onClick={() => handleSendMessage(q)} className="px-3 py-1.5 rounded-full bg-slate-950 border border-slate-800 text-teal-300 text-[11px]">{q}</button>)}
          </div>
          <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="flex items-center gap-2 pt-2 border-t border-slate-800">
            <input type="text" placeholder="Ask AI Coach..." value={inputMessage} onChange={(e) => setInputMessage(e.target.value)} className="flex-1 px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none" />
            <button type="submit" className="p-3 rounded-2xl bg-teal-500 text-slate-950"><Send className="w-4 h-4" /></button>
          </form>
        </div>
      )}

      {/* Generator Subtab */}
      {activeSubTab === 'generator' && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 space-y-5 shadow-xl">
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2"><Zap className="w-5 h-5 text-amber-400" /><span>AI Parameters</span></h2>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <label className="text-slate-300">Level</label>
                <select value={genFitnessLevel} onChange={(e) => setGenFitnessLevel(e.target.value as any)} className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200">
                  <option value="Beginner">Beginner</option><option value="Intermediate">Intermediate</option><option value="Advanced">Advanced</option>
                </select>
              </div>
              {/* ... other selects ... */}
            </div>
            <button onClick={handleGenerateWorkout} disabled={isGenerating} className="w-full py-4 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 font-black flex justify-center gap-2">
              {isGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <span>{isGenerating ? 'GENERATING...' : 'GENERATE AI PLAN'}</span>
            </button>
          </div>
          {generatedPlan && (
              <div className="p-6 bg-slate-900 border border-teal-500/30 rounded-3xl">
                  <h3 className="text-lg font-bold">{generatedPlan.title}</h3>
                  <button onClick={() => onStartCustomAIWorkout(generatedPlan)} className="mt-4 px-4 py-2 bg-emerald-500 rounded-xl text-slate-950">Start Now</button>
              </div>
          )}
        </div>
      )}

      {/* --- ADDED BANNER AD AT BOTTOM --- */}
      <div className="px-2">
          <AdMobBanner 
            publisherId="ca-app-pub-3940256099942544" 
            adSlot="6300978111" 
          />
      </div>

    </div>
  );
};
