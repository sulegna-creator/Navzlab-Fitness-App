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

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle send message
  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || isSending) return;

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
          userProfile: {
            name: userProfile.displayName,
            age: userProfile.age,
            fitnessLevel: userProfile.fitnessLevel,
            dailyStepGoal: userProfile.dailyStepGoal,
            dailyWaterGoal: userProfile.dailyWaterGoalL,
            dailyWorkoutGoal: userProfile.dailyWorkoutGoalMin
          },
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
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          sender: 'ai',
          text: "I am having trouble connecting right now. Please ensure your network is connected and try asking again.",
          timestamp: new Date().toISOString()
        }
      ]);
    } finally {
      setIsSending(false);
    }
  };

  // Handle AI Workout Generator
  const handleGenerateWorkout = async () => {
    setIsGenerating(true);
    setGeneratedPlan(null);

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
      const plan = data.workoutPlan || data.fallbackWorkout;
      setGeneratedPlan(plan);
    } catch (err) {
      console.error(err);
      // Fallback
      setGeneratedPlan({
        title: `${genDuration}-Minute ${genFitnessLevel} ${genGoal} Workout`,
        overview: "A structured, full-body routine designed for safe progressive movement.",
        warmUp: [
          { name: "Arm Circles & Torso Twists", duration: "2 min", instructions: "Gentle mobility movement." },
          { name: "March in Place / Jumping Jacks", duration: "3 min", instructions: "Gradually raise body temperature." }
        ],
        mainRoutine: [
          { name: "Bodyweight Squats", sets: "3", repsOrTime: "10-12 reps", rest: "45 sec", instructions: "Keep chest up and knees aligned over toes." },
          { name: "Push-ups (Incline or Knees)", sets: "3", repsOrTime: "8-10 reps", rest: "45 sec", instructions: "Engage core in plank line." },
          { name: "Reverse Lunges", sets: "3", repsOrTime: "10 reps each leg", rest: "45 sec", instructions: "Control lowering phase." },
          { name: "Plank Hold", sets: "3", repsOrTime: "20-30 sec", rest: "45 sec", instructions: "Maintain glute and core tension." }
        ],
        coolDown: [
          { name: "Standing Hamstring Stretch", duration: "2 min", instructions: "Breathe deeply." },
          { name: "Child's Pose", duration: "3 min", instructions: "Deep diaphragmatic breathing." }
        ],
        safetyReminder: "Listen to your body. Stay hydrated and pause immediately if you experience pain or dizziness."
      });
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
              <h1 className="text-xl font-black text-slate-100 font-display">
                NAVZLAB AI COACH
              </h1>
              <p className="text-xs text-teal-400 font-semibold">
                Monitor. Move. Improve.
              </p>
            </div>
          </div>

          <span className="text-[10px] px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
            Gemini Powered
          </span>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-950 p-1 rounded-2xl border border-slate-800">
          <button
            onClick={() => setActiveSubTab('chat')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === 'chat'
                ? 'bg-teal-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            💬 AI Chat Guidance
          </button>
          <button
            onClick={() => setActiveSubTab('generator')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === 'generator'
                ? 'bg-teal-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            ⚡ Create Workout with AI
          </button>
        </div>
      </div>

      {/* Safety Disclaimer Banner */}
      <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2.5">
        <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <p>
          <strong className="text-slate-200">General Guidance Disclaimer:</strong> NAVZLAB AI Coach provides general wellness, workout, and motivation advice. It does NOT diagnose medical conditions or provide clinical treatment plans. Please consult a medical professional for medical concerns.
        </p>
      </div>

      {/* SUBTAB 1: CHAT INTERFACE */}
      {activeSubTab === 'chat' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-xl space-y-4 flex flex-col h-[520px]">
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto space-y-3.5 pr-1">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[75%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-emerald-500 text-slate-950 font-medium rounded-tr-none'
                      : 'bg-slate-950 text-slate-200 border border-slate-800 rounded-tl-none'
                  }`}
                >
                  <p>{msg.text}</p>
                  <span className="block text-[9px] opacity-60 mt-1 text-right">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}

            {isSending && (
              <div className="flex items-center gap-2 text-xs text-teal-400 p-2">
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>NAVZLAB AI Coach is thinking...</span>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Preset Chips */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {presetQuestions.map((q) => (
              <button
                key={q}
                onClick={() => handleSendMessage(q)}
                disabled={isSending}
                className="whitespace-nowrap px-3 py-1.5 rounded-full bg-slate-950 hover:bg-slate-800 border border-slate-800 text-teal-300 text-[11px] font-medium transition-all"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2 pt-2 border-t border-slate-800"
          >
            <input
              type="text"
              placeholder="Ask AI Coach anything about your workout..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              disabled={isSending}
              className="flex-1 px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-teal-500"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isSending}
              className="p-3 rounded-2xl bg-teal-500 hover:bg-teal-400 disabled:opacity-50 text-slate-950 transition-all font-bold"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* SUBTAB 2: AI WORKOUT GENERATOR */}
      {activeSubTab === 'generator' && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 space-y-5 shadow-xl">
            <h2 className="text-base font-bold text-slate-100 font-display flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" />
              <span>Configure AI Workout Parameters</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {/* Fitness Level */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-300">Fitness Level</label>
                <select
                  value={genFitnessLevel}
                  onChange={(e) => setGenFitnessLevel(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-slate-200"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              {/* Goal */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-300">Primary Goal</label>
                <select
                  value={genGoal}
                  onChange={(e) => setGenGoal(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-slate-200"
                >
                  <option value="Weight management">Weight Management</option>
                  <option value="Endurance">Endurance & Cardio</option>
                  <option value="Strength">Strength & Muscle Tone</option>
                  <option value="General fitness">General Fitness</option>
                  <option value="Flexibility">Flexibility & Mobility</option>
                </select>
              </div>

              {/* Available Time */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-300">Available Duration</label>
                <select
                  value={genDuration}
                  onChange={(e) => setGenDuration(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-slate-200"
                >
                  <option value={10}>10 minutes</option>
                  <option value={20}>20 minutes</option>
                  <option value={30}>30 minutes</option>
                  <option value={45}>45 minutes</option>
                  <option value={60}>60 minutes</option>
                </select>
              </div>

              {/* Equipment */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-300">Equipment Available</label>
                <select
                  value={genEquipment}
                  onChange={(e) => setGenEquipment(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-slate-200"
                >
                  <option value="None">None (Bodyweight)</option>
                  <option value="Dumbbells">Dumbbells</option>
                  <option value="Resistance bands">Resistance Bands</option>
                  <option value="Gym equipment">Full Gym Equipment</option>
                  <option value="Custom">Custom / Mixed</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleGenerateWorkout}
              disabled={isGenerating}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 font-black text-sm shadow-lg shadow-teal-500/20 hover:scale-[1.01] transition-all flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Generating AI Plan...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 fill-current" />
                  <span>GENERATE STRUCTURED WORKOUT</span>
                </>
              )}
            </button>
          </div>

          {/* Render Generated Workout Plan */}
          {generatedPlan && (
            <div className="bg-slate-900/90 border border-teal-500/30 rounded-3xl p-6 space-y-6 shadow-2xl animate-fadeIn">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <span className="text-[10px] font-bold text-teal-400 uppercase tracking-widest">Generated AI Plan</span>
                  <h3 className="text-xl font-black text-slate-100 font-display mt-0.5">{generatedPlan.title}</h3>
                  <p className="text-xs text-slate-400 mt-1">{generatedPlan.overview}</p>
                </div>
                <button
                  onClick={() => onStartCustomAIWorkout(generatedPlan)}
                  className="px-5 py-3 rounded-2xl bg-emerald-500 text-slate-950 font-extrabold text-xs shadow-lg shadow-emerald-500/20 hover:bg-emerald-400 flex items-center gap-2 shrink-0"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Start This Workout</span>
                </button>
              </div>

              {/* Warm up */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider text-amber-400">🔥 Warm-up</h4>
                <div className="space-y-1.5">
                  {generatedPlan.warmUp?.map((item, idx) => (
                    <div key={idx} className="bg-slate-950 p-3 rounded-2xl border border-slate-800 text-xs flex justify-between">
                      <div>
                        <span className="font-bold text-slate-200">{item.name}</span>
                        <p className="text-[11px] text-slate-400">{item.instructions}</p>
                      </div>
                      <span className="font-bold text-slate-400 shrink-0">{item.duration}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Main Routine */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider text-emerald-400">🏋️ Main Routine</h4>
                <div className="space-y-1.5">
                  {generatedPlan.mainRoutine?.map((item, idx) => (
                    <div key={idx} className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 text-xs space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-100">{item.name}</span>
                        <span className="text-[11px] font-semibold text-emerald-400">{item.sets} sets × {item.repsOrTime}</span>
                      </div>
                      <p className="text-[11px] text-slate-400">{item.instructions} • Rest: {item.rest}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cool down */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider text-cyan-400">🧘 Cool-down</h4>
                <div className="space-y-1.5">
                  {generatedPlan.coolDown?.map((item, idx) => (
                    <div key={idx} className="bg-slate-950 p-3 rounded-2xl border border-slate-800 text-xs flex justify-between">
                      <div>
                        <span className="font-bold text-slate-200">{item.name}</span>
                        <p className="text-[11px] text-slate-400">{item.instructions}</p>
                      </div>
                      <span className="font-bold text-slate-400 shrink-0">{item.duration}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Safety Reminder */}
              <div className="p-3.5 rounded-2xl bg-amber-950/40 border border-amber-500/30 text-amber-200 text-xs">
                ⚠️ <strong className="text-amber-300">Safety Caution:</strong> {generatedPlan.safetyReminder}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
