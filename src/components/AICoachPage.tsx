import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, Sparkles, RefreshCw } from 'lucide-react';
import { AdMob } from '@capacitor-community/admob';
import { Capacitor } from '@capacitor/core';
import { AdMobBanner } from './AdMobBanner';

// --- CONNECTION TO RENDER BACKEND ---
const API_BASE_URL = 'https://navzlab-fitness.onrender.com';

export const AICoachPage = ({ userProfile }: any) => {
  const [messages, setMessages] = useState([
    { id: '1', sender: 'ai', text: 'Hello! I am your NAVZLAB AI Coach. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // --- CRASH FIX: Safe AdMob Initialization ---
  useEffect(() => {
    const initAdMob = async () => {
      // Only initialize if we are on a real Android/iOS device
      if (Capacitor.isNativePlatform()) {
        try {
          await AdMob.initialize({ initializeForTesting: true });
        } catch (e) {
          console.log("AdMob init skipped or failed quietly");
        }
      }
    };
    initAdMob();
  }, []);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // --- MONETIZATION: Show Ad without crashing ---
  const showAd = async () => {
    if (!Capacitor.isNativePlatform()) return;
    try {
      await AdMob.prepareInterstitial({
        adId: 'ca-app-pub-3940256099942544/1033173712' // Google Test ID
      });
      await AdMob.showInterstitial();
    } catch (e) {
      console.log("Ad skipped to prevent crash", e);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isSending) return;
    
    const userText = input;
    setInput('');
    setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'user', text: userText }]);
    setIsSending(true);
    
    // Show Ad while user waits for AI response
    showAd();

    try {
      const res = await fetch(`${API_BASE_URL}/api/ai/coach`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userText, 
          userProfile: {
            displayName: userProfile?.displayName || 'User',
            fitnessLevel: userProfile?.fitnessLevel || 'Beginner'
          } 
        })
      });

      if (!res.ok) throw new Error("Server not responding");

      const data = await res.json();
      setMessages(prev => [...prev, { 
        id: 'ai-' + Date.now(), 
        sender: 'ai', 
        text: data.reply || "I'm thinking about that. Give me a second..." 
      }]);
    } catch (e) {
      console.error("AI Fetch Error:", e);
      setMessages(prev => [...prev, { 
        id: 'err', 
        sender: 'ai', 
        text: "I'm having trouble connecting to my brain. Please check your internet or Render status." 
      }]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-950 pb-24 overflow-hidden">
      {/* Premium Header */}
      <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-teal-500/20 flex items-center justify-center">
            <Bot className="text-teal-400 w-5 h-5" />
          </div>
          <h1 className="font-black text-white uppercase tracking-tighter">NAVZLAB AI</h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="animate-pulse w-2 h-2 rounded-full bg-emerald-500"></span>
          <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">Live</span>
        </div>
      </div>
      
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(m => (
          <div key={m.id} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed ${
              m.sender === 'user' 
                ? 'bg-teal-500 text-slate-950 font-bold rounded-tr-none' 
                : 'bg-slate-900 text-slate-100 border border-slate-800 rounded-tl-none'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
        {isSending && (
          <div className="flex items-center gap-2 text-teal-500 text-[10px] font-bold italic ml-2">
            <RefreshCw className="w-3 h-3 animate-spin" />
            Coach is thinking...
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Box */}
      <div className="p-4 bg-slate-950 border-t border-slate-900">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(); }} 
          className="flex gap-2 p-1.5 bg-slate-900 rounded-2xl border border-slate-800 focus-within:border-teal-500/50 transition-all"
        >
          <input 
            value={input} 
            onChange={e => setInput(e.target.value)} 
            className="flex-1 bg-transparent border-none text-white text-xs p-3 focus:ring-0" 
            placeholder="Ask about your fitness goals..." 
            disabled={isSending}
          />
          <button 
            type="submit" 
            disabled={!input.trim() || isSending}
            className="bg-teal-500 p-3 rounded-xl text-slate-950 hover:bg-teal-400 disabled:opacity-30 transition-all"
          >
            <Send size={18} fill="currentColor" />
          </button>
        </form>
      </div>

      {/* AdMob Banner Placeholder */}
      <div className="px-2 bg-slate-950">
        <AdMobBanner />
      </div>
    </div>
  );
};
