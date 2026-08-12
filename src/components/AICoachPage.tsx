import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, Send, Sparkles, User, Dumbbell, ShieldAlert,
  Flame, Clock, Target, Play, CheckCircle2, ChevronRight, RefreshCw, Zap
} from 'lucide-react';
import { UserProfile, DailyActivity } from '../types';

interface AICoachPageProps {
  userProfile: UserProfile;
  dailyActivity: DailyActivity;
  onStartWorkout: (title: string, duration: number) => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export const AICoachPage: React.FC<AICoachPageProps> = ({
  userProfile,
  dailyActivity,
  onStartWorkout
}) => {
  const [activeTab, setActiveTab] = useState<'chat' | 'generator'>('chat');
  
  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'ai',
      text: `Hello ${userProfile.displayName || 'Athlete'}! I am your NAVZLAB AI Coach. How can I help you with your training, goals, or recovery today?`,
      timestamp: new Date().toISOString()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Generator state
  const [genFitnessLevel, setGenFitnessLevel] = useState(userProfile.fitnessLevel || 'Beginner');
  const [genGoal, setGenGoal] = useState('General Fitness');
  const [genDuration, setGenDuration] = useState(30);
  const [genEquipment, setGenEquipment] = useState('None (Bodyweight)');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<any | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Helper fetch with timeout and retry
  const fetchWithRetry = async (url: string, options: RequestInit, retries = 2, timeoutMs = 8000): Promise<Response> => {
    for (let attempt = 0; attempt < retries; attempt++) {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), timeoutMs);

      try {
        const response = await fetch(url, {
          ...options,
          signal: controller.signal
        });
        clearTimeout(id);
        if (response.ok) return response;
      } catch (err) {
        clearTimeout(id);
        if (attempt === retries - 1) throw err;
        await new Promise((resolve) => setTimeout(resolve, 1500));
      }
    }
    throw new Error('Server request timed out');
  };

  // Handle send message
  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || isSending) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      timestamp: new Date().toISOString()
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMessage('');
    setIsSending(true);

    try {
      const res = await fetchWithRetry('/api/ai/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: messages.slice(-6),
          userProfile: {
            name: userProfile.displayName,
            age: userProfile.age,
            fitnessLevel: userProfile.fitnessLevel,
            dailyStepGoal: userProfile.dailyStepGoal,
            dailyWaterGoal: userProfile.dailyWaterGoalL,
            dailyWorkoutGoal: userProfile.dailyWorkoutMin
          },
          recentStats: {
            steps: dailyActivity.steps,
            activeMinutes: dailyActivity.activeMinutes,
            waterMl: dailyActivity.waterMl,
            workoutCount: dailyActivity.workoutsCompleted
          }
        })
      });

      const data = await res.json();
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: data.reply || "I'm here to support your goals!",
        timestamp: new Date().toISOString()
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.warn("AI Coach server waking up or unavailable, providing instant guidance:", err);
      
      const lowerText = text.toLowerCase();
      let fallbackText = `I'm here with you, ${userProfile.displayName || 'Athlete'}! `;
      
      if (lowerText.includes("workout") || lowerText.includes("do today")) {
        fallbackText += `For a ${userProfile.fitnessLevel || 'Beginner'} level, try a 25-minute total body session: 5m dynamic warm-up, bodyweight squats, incline push-ups, and 30s plank holds!`;
      } else if (lowerText.includes("perform") || lowerText.includes("stat")) {
        fallbackText += `You've logged ${dailyActivity.steps.toLocaleString()} steps today! Keep pushing toward your ${userProfile.dailyStepGoal?.toLocaleString() || '10,000'} daily goal.`;
      } else {
        fallbackText += `Focus on small daily wins: stay hydrated with your goal of ${userProfile.dailyWaterGoalL || 2.5}L water and keep moving steadily!`;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: fallbackText,
          timestamp: new Date().toISOString()
        }
      ]);
    } finally {
      setIsSending(false);
    }
  };

  // Handle generate workout
  const handleGenerateWorkout = async () => {
    setIsGenerating(true);
    setGeneratedPlan(null);

    try {
      const res = await fetchWithRetry('/api/ai/generate-workout', {
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
      const plan = data.workoutPlan || data.fallbackWorkout;
      setGeneratedPlan(plan);
    } catch (err) {
      console.warn("Generating local fallback AI workout plan:", err);
      setGeneratedPlan({
        title: `${genDuration}-Minute ${genFitnessLevel} ${genGoal} Routine`,
        overview: `A balanced ${genDuration}-minute routine crafted for ${genFitnessLevel.toLowerCase()} athletes focusing on ${genGoal.toLowerCase()}.`,
        warmUp: [
          { name: "Arm Circles & Torso Twists", duration: "2 min", instructions: "Gentle mobility movement." },
          { name: "March in Place / Jumping Jacks", duration: "3 min", instructions: "Gradually raise body temperature." }
        ],
        mainRoutine: [
          { name: genEquipment.includes('Dumbbell') ? "Dumbbell Squats" : "Bodyweight Squats", sets: "3", repsOrTime: "10-12 reps", rest: "45 sec", instructions: "Keep chest up and knees aligned over toes." },
          { name: "Push-ups (Incline or Knees)", sets: "3", repsOrTime: "8-10 reps", rest: "45 sec", instructions: "Engage core in plank line." },
          { name: "Reverse Lunges", sets: "3", repsOrTime: "10 reps each leg", rest: "45 sec", instructions: "Control lowering phase." },
          { name: "Plank Hold", sets: "3", repsOrTime: "20-30 sec", rest: "45 sec", instructions: "Maintain glute and core tension." }
        ],
        coolDown: [
          { name: "Standing Quadriceps & Hamstring Stretch", duration: "2 min", instructions: "Hold gently without bouncing." },
          { name: "Child's Pose Deep Breathing", duration: "3 min", instructions: "Lower heart rate." }
        ],
        safetyReminder: "Listen to your body. Stay hydrated and pause immediately if you experience pain or dizziness."
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-emerald-500/30 text-emerald-200 text-xs font-semibold px-2.5 py-1 rounded-full border border-emerald-400/30 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> NAVZLAB AI Engine
              </span>
              <span className="text-emerald-100/80 text-xs font-medium">Tagline: "Monitor. Move. Improve."</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">NAVZLAB AI Coach</h1>
            <p className="text-emerald-100 text-sm max-w-xl">
              Get intelligent personalized fitness advice, safe exercise guidance, and instant custom workout plans tailored to your level.
            </p>
          </div>

          <div className="flex bg-black/20 p-1.5 rounded-xl border border-white/10 self-start md:self-auto">
            <button
              onClick={() => setActiveTab('chat')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                activeTab === 'chat' ? 'bg-white text-slate-900 shadow-md' : 'text-emerald-100 hover:text-white'
              }`}
            >
              <Bot className="w-4 h-4" /> AI Chat
            </button>
            <button
              onClick={() => setActiveTab('generator')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                activeTab === 'generator' ? 'bg-white text-slate-900 shadow-md' : 'text-emerald-100 hover:text-white'
              }`}
            >
              <Dumbbell className="w-4 h-4" /> Workout Generator
            </button>
          </div>
        </div>
      </div>

      {/* Safety Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 flex items-start gap-3 text-xs text-amber-800">
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold">Health & Safety Disclaimer:</span> NAVZLAB AI Coach provides educational fitness and movement guidance. It is not a substitute for formal medical advice. If you experience chest pain, acute dizziness, or severe pain, stop immediately and seek medical care.
        </div>
      </div>

      {/* Tab 1: AI Chat */}
      {activeTab === 'chat' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[580px]">
          {/* Quick Prompts */}
          <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center gap-2 overflow-x-auto text-xs">
            <span className="text-slate-500 font-medium shrink-0 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-500" /> Quick Ask:
            </span>
            <button
              onClick={() => handleSendMessage("What workout should I do today based on my goals?")}
              className="px-3 py-1.5 bg-white border border-slate-200 rounded-full hover:border-emerald-500 hover:text-emerald-600 transition shrink-0"
            >
              💪 Today's workout suggestion
            </button>
            <button
              onClick={() => handleSendMessage("How am I performing compared to my daily targets?")}
              className="px-3 py-1.5 bg-white border border-slate-200 rounded-full hover:border-emerald-500 hover:text-emerald-600 transition shrink-0"
            >
              📊 Analyze my progress
            </button>
            <button
              onClick={() => handleSendMessage("How can I safely build consistency in my daily steps?")}
              className="px-3 py-1.5 bg-white border border-slate-200 rounded-full hover:border-emerald-500 hover:text-emerald-600 transition shrink-0"
            >
              🎯 Step consistency tips
            </button>
          </div>

          {/* Messages Window */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 ${
                    msg.sender === 'user'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-teal-100 text-teal-800 border border-teal-200'
                  }`}
                >
                  {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-emerald-600 text-white rounded-tr-none'
                      : 'bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200/60'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                  <div
                    className={`text-[10px] mt-1.5 text-right ${
                      msg.sender === 'user' ? 'text-emerald-200' : 'text-slate-400'
                    }`}
                  >
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}

            {isSending && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center text-xs">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-slate-100 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs text-slate-500 flex items-center gap-2">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-600" />
                  NAVZLAB AI Coach is crafting your answer...
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Chat Input */}
          <div className="p-3 bg-white border-t border-slate-200 flex gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask your AI Coach about workouts, nutrition tips, or recovery..."
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputMessage.trim() || isSending}
              className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-medium text-sm hover:bg-emerald-700 disabled:opacity-50 transition flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Tab 2: AI Workout Generator */}
      {activeTab === 'generator' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Controls Form */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Dumbbell className="w-5 h-5 text-emerald-600" /> Custom Workout Specs
            </h2>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600">Fitness Level</label>
              <select
                value={genFitnessLevel}
                onChange={(e) => setGenFitnessLevel(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600">Primary Goal</label>
              <select
                value={genGoal}
                onChange={(e) => setGenGoal(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              >
                <option value="General Fitness">General Fitness</option>
                <option value="Weight Loss & Cardio">Weight Loss & Cardio</option>
                <option value="Muscle Building & Toning">Muscle Building & Toning</option>
                <option value="Core Stability & Posture">Core Stability & Posture</option>
                <option value="Flexibility & Recovery">Flexibility & Recovery</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600">Duration (Minutes)</label>
              <div className="flex gap-2">
                {[15, 20, 30, 45].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setGenDuration(mins)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-medium border transition ${
                      genDuration === mins
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {mins}m
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600">Equipment Available</label>
              <select
                value={genEquipment}
                onChange={(e) => setGenEquipment(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              >
                <option value="None (Bodyweight)">None (Bodyweight)</option>
                <option value="Dumbbells & Resistance Bands">Dumbbells & Resistance Bands</option>
                <option value="Full Gym Access">Full Gym Access</option>
              </select>
            </div>

            <button
              onClick={handleGenerateWorkout}
              disabled={isGenerating}
              className="w-full bg-emerald-600 text-white py-3 rounded-xl font-semibold text-sm hover:bg-emerald-700 disabled:opacity-50 transition shadow-md flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> Generating Plan...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" /> Generate Workout Plan
                </>
              )}
            </button>
          </div>

          {/* Generated Result */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            {generatedPlan ? (
              <div className="space-y-6">
                <div className="border-b border-slate-200 pb-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-slate-900">{generatedPlan.title}</h3>
                    <button
                      onClick={() => onStartWorkout(generatedPlan.title, genDuration)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition flex items-center gap-1.5 shadow-sm"
                    >
                      <Play className="w-3.5 h-3.5" /> Start Timer
                    </button>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{generatedPlan.overview}</p>
                </div>

                {/* Warm Up */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-600 flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5" /> Warm-Up
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {generatedPlan.warmUp?.map((item: any, idx: number) => (
                      <div key={idx} className="bg-amber-50/60 border border-amber-200/60 p-2.5 rounded-xl text-xs">
                        <div className="font-semibold text-slate-800">{item.name}</div>
                        <div className="text-slate-500 text-[11px]">{item.duration} • {item.instructions}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Main Routine */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-600 flex items-center gap-1">
                    <Dumbbell className="w-3.5 h-3.5" /> Main Routine
                  </h4>
                  <div className="space-y-2">
                    {generatedPlan.mainRoutine?.map((item: any, idx: number) => (
                      <div key={idx} className="bg-slate-50 border border-slate-200 p-3 rounded-xl flex items-center justify-between text-xs">
                        <div className="space-y-0.5">
                          <div className="font-semibold text-slate-800">{item.name}</div>
                          <div className="text-slate-500 text-[11px]">{item.instructions}</div>
                        </div>
                        <div className="text-right shrink-0 font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200/50">
                          {item.sets ? `${item.sets} sets × ` : ''}{item.repsOrTime}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Cool Down */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-600 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> Cool-Down & Stretch
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {generatedPlan.coolDown?.map((item: any, idx: number) => (
                      <div key={idx} className="bg-cyan-50/60 border border-cyan-200/60 p-2.5 rounded-xl text-xs">
                        <div className="font-semibold text-slate-800">{item.name}</div>
                        <div className="text-slate-500 text-[11px]">{item.duration} • {item.instructions}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center py-12 space-y-3 text-slate-400">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div className="max-w-xs">
                  <p className="font-semibold text-slate-600 text-sm">No Plan Generated Yet</p>
                  <p className="text-xs text-slate-400 mt-1">Select your specifications on the left and click "Generate Workout Plan".</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
