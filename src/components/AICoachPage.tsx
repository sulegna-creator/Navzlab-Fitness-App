import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, Send, Sparkles, ShieldAlert, RefreshCw, Zap, Play 
} from 'lucide-react';
import { AdMob } from '@capacitor-community/admob';
import { AdMobBanner } from './AdMobBanner';
import { UserProfile, DailyActivity, WorkoutRecord, AIChatMessage, AIWorkoutPlan } from '../types';

// --- PASTE YOUR RENDER URL HERE ---
const API_BASE_URL = 'https://navzlab-fitness-app.onrender.com'; 

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
      text: `Hello ${userProfile.displayName || 'Athlete'}! I am your NAVZLAB AI Coach. I can analyze your stats and suggest tailored workouts. How can I help you today?`,
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
    // Initialize AdMob Engine
    AdMob.initialize({ testingDevices: [], initializeForTesting: true });
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // --- MONETIZATION: SHOW FULL SCREEN AD ---
  const triggerInterstitialAd = async () => {
    try {
      await AdMob.prepareInterstitial({ adId: 'ca-app-pub-3940256099942544/1033173712' });
      await AdMob.showInterstitial();
    } catch (e) { console.log('AdMob skip:', e); }
  };

  // --- AI CHAT LOGIC ---
  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || isSending) return;

    // Show Ad every 3 messages
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
      const res = await fetch(`${API_BASE_URL}/api/ai/coach`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history: messages.map(m => ({ sender: m.sender, text: m.text })), userProfile })
      });

      const data = await res.json();
      setMessages((prev) => [...prev, {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: data.reply || "I'm processing your fitness data. One moment...",
        timestamp: new Date().toISOString()
      }]);
    } catch (err) {
      setMessages((prev) => [...prev, { id: 'err', sender: 'ai', text: "AI is offline. Check Render backend.", timestamp: new Date().toISOString() }]);
    } finally { setIsSending(false); }
  };

  // --- AI WORKOUT GENERATOR LOGIC ---
  const handleGenerateWorkout = async () => {
    setIsGenerating(true);
    setGeneratedPlan(null);
    triggerInterstitialAd(); // Monetize the generation

    try {
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
    <div className="flex flex-col h-screen bg-slate-950 text-slate-100 overflow-hidden">
      {/* Header */}
      <div className="p-4 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Bot className="w-8 h-8 text-teal-400" />
            <h1 className="text-lg font-black tracking-tighter uppercase italic">NAVZLAB AI</h1>
          </div>
          <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-1 rounded-full font-bold">Premium Active</span>
        </div>
        
        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button onClick={() => setActiveSubTab('chat')} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${activeSubTab === 'chat' ? 'bg-teal-500 text-slate-950' : 'text-slate-400'}`}>Chat Coach</button>
          <button onClick={() => setActiveSubTab('generator')} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${activeSubTab === 'generator' ? 'bg-teal-500 text-slate-950' : 'text-slate-400'}`}>Workout Gen</button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {activeSubTab === 'chat' ? (
          <div className="flex flex-col h-full space-y-4">
             <div className="flex-1 space-y-4 overflow-y-auto">
                {messages.map(msg => (
                  <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-3 rounded-2xl text-xs ${msg.sender === 'user' ? 'bg-teal-500 text-slate-950 rounded-tr-none' : 'bg-slate-900 text-slate-200 border border-slate-800 rounded-tl-none'}`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                {isSending && <div className="text-teal-400 text-[10px] animate-pulse italic">Coach is typing...</div>}
                <div ref={chatEndRef} />
             </div>
             
             <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="flex gap-2 p-2 bg-slate-900 rounded-2xl border border-slate-800">
               <input value={inputMessage} onChange={(e) => setInputMessage(e.target.value)} placeholder="Ask about your workout..." className="flex-1 bg-transparent border-none text-xs focus:ring-0" />
               <button type="submit" className="p-2 bg-teal-500 rounded-xl text-slate-950"><Send className="w-4 h-4" /></button>
             </form>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 font-bold uppercase">Equipment</label>
                    <select value={genEquipment} onChange={(e) => setGenEquipment(e.target.value)} className="w-full bg-slate-950 border-slate-800 rounded-xl text-xs text-white">
                      <option value="None">Bodyweight</option><option value="Dumbbells">Dumbbells</option><option value="Gym">Full Gym</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 font-bold uppercase">Duration</label>
                    <select value={genDuration} onChange={(e) => setGenDuration(Number(e.target.value))} className="w-full bg-slate-950 border-slate-800 rounded-xl text-xs text-white">
                      <option value={15}>15m</option><option value={30}>30m</option><option value={45}>45m</option>
                    </select>
                  </div>
                </div>
                <button onClick={handleGenerateWorkout} className="w-full py-3 bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 font-black rounded-2xl flex items-center justify-center gap-2">
                  {isGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  GENERATE PLAN
                </button>
            </div>
            {generatedPlan && (
              <div className="bg-slate-900 border border-teal-500/30 rounded-3xl p-5 space-y-4">
                <h3 className="font-black text-teal-400">{generatedPlan.title}</h3>
                <button onClick={() => onStartCustomAIWorkout(generatedPlan)} className="w-full py-2 bg-emerald-500 text-slate-950 font-bold rounded-xl text-xs">Start Now</button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Banner Ad Area (Above Navigation) */}
      <div className="bg-slate-950 border-t border-slate-900 px-4 pt-2 pb-24">
        <AdMobBanner />
      </div>
    </div>
  );
};
