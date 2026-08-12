import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, Sparkles, ShieldAlert, RefreshCw } from 'lucide-react';
import { AdMob } from '@capacitor-community/admob';
import { AdMobBanner } from './AdMobBanner';

// ONLY ONE DECLARATION HERE
const API_BASE_URL = 'https://navzlab-fitness.onrender.com';

export const AICoachPage = ({ userProfile }: any) => {
  const [messages, setMessages] = useState([{ id: '1', sender: 'ai', text: 'Hello! I am your NAVZLAB AI Coach. How can I help you today?' }]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initAdMob = async () => {
      try {
        await AdMob.initialize({ initializeForTesting: true });
      } catch (e) { console.log("AdMob already initialized"); }
    };
    initAdMob();
  }, []);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const showAd = async () => {
    try {
      await AdMob.prepareInterstitial({ adId: 'ca-app-pub-3940256099942544/1033173712' });
      await AdMob.showInterstitial();
    } catch (e) { console.log("Ad skipped", e); }
  };

  const handleSend = async () => {
    if (!input.trim() || isSending) return;
    const userText = input;
    setInput('');
    setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'user', text: userText }]);
    setIsSending(true);
    
    // Trigger ad in the background while user waits
    showAd();

    try {
      const res = await fetch(`${API_BASE_URL}/api/ai/coach`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText, userProfile })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { id: 'ai'+Date.now(), sender: 'ai', text: data.reply || "I am processing that now..." }]);
    } catch (e) {
      setMessages(prev => [...prev, { id: 'err', sender: 'ai', text: "I'm having trouble connecting to my brain. Please check your internet." }]);
    } finally { setIsSending(false); }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-950 pb-20">
      <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Bot className="text-teal-400" /> 
          <h1 className="font-black text-white uppercase tracking-tighter">NAVZLAB AI</h1>
        </div>
        <span className="text-[10px] bg-teal-500/10 text-teal-400 border border-teal-500/20 px-2 py-1 rounded-full font-bold">LIVE</span>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(m => (
          <div key={m.id} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-3 rounded-2xl text-xs ${m.sender === 'user' ? 'bg-teal-500 text-black font-medium' : 'bg-slate-900 text-slate-100 border border-slate-800'}`}>
              {m.text}
            </div>
          </div>
        ))}
        {isSending && <div className="text-teal-500 text-[10px] animate-pulse">Coach is thinking...</div>}
        <div ref={chatEndRef} />
      </div>

      <div className="p-4 bg-slate-900 border-t border-slate-800 flex gap-2">
        <input 
          value={input} 
          onChange={e => setInput(e.target.value)} 
          className="flex-1 bg-slate-950 border-none rounded-xl text-white text-xs p-3 focus:ring-1 focus:ring-teal-500" 
          placeholder="Ask Coach anything..." 
        />
        <button onClick={handleSend} className="bg-teal-500 p-3 rounded-xl text-black hover:bg-teal-400 transition-colors">
          <Send size={16}/>
        </button>
      </div>

      <div className="px-2">
        <AdMobBanner />
      </div>
    </div>
  );
};
