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
// --- ADDED ADMOB IMPORT ---
import { AdMob } from '@capacitor-community/admob';
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
  
  // --- ADDED AD COUNTER STATE ---
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

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // --- HELPER FUNCTION TO SHOW AD ---
  const showInterstitialAd = async () => {
    try {
      await AdMob.prepareInterstitial({
        adId: 'ca-app-pub-3940256099942544/1033173712', // GOOGLE TEST ID
      });
      await AdMob.showInterstitial();
    } catch (e) {
      console.log('AdMob error or blocked:', e);
    }
  };

  // Handle send message
  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || isSending) return;

    // --- TRIGGER AD EVERY 3 MESSAGES ---
    if (msgCountSinceAd >= 2) {
        await showInterstitialAd();
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

    // --- SHOW AD EVERY TIME A WORKOUT IS GENERATED ---
    await showInterstitialAd();

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

  // ... (REST OF THE RENDER CODE REMAINS THE SAME)
  // ...
