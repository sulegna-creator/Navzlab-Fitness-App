import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, RefreshCw } from 'lucide-react';
import { AdMob } from '@capacitor-community/admob';
import { Capacitor } from '@capacitor/core';
import { AdMobBanner } from './AdMobBanner';

const API_BASE_URL = 'https://navzlab-fitness.onrender.com';

export const AICoachPage = ({ userProfile, isPremium }: any) => {
  const [messages, setMessages] = useState([{ id: '1', sender: 'ai', text: 'Hello! I am your AI Coach. How can I help?' }]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const showAd = async () => {
    if (isPremium || !Capacitor.isNativePlatform()) return;
    try {
      await AdMob.prepareInterstitial({ adId: 'ca-app-pub-3940256099942544/1033173712' });
      await AdMob.showInterstitial();
    } catch (e) { console.log("Ad Skip"); }
  };

  const handleSend = async () => {
    if (!input.trim() || isSending) return;
    const userText = input;
    setInput('');
    setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'user', text: userText }]);
    setIsSending(true);

    if (!isPremium) showAd();

    try {
      // THE 60-SECOND WAKE UP TIMER
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), 60000); 

      const res = await fetch(`${API_BASE_URL}/api/ai/coach`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText, userProfile }),
        signal: controller.signal
      });
      clearTimeout(id);

      const data = await res.json();
      setMessages(prev => [...prev, { id: 'ai'+Date.now(), sender: 'ai', text: data.reply }]);
    } catch (e: any) {
      let errorMsg = "Brain connection failed.";
      if (e.name === 'AbortError') errorMsg = "Server is waking up. Please try again in 10 seconds!";
      else errorMsg = "Check Render status or network.";
      setMessages(prev => [...prev, { id: 'err', sender: 'ai', text: errorMsg }]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-950 pb-24">
      <div className="p-4 bg-slate-900 border-b border-slate-800 flex justify-between items-center">
        <Bot className="text-teal-400" /> <h1 className="text-white font-black">NAVZLAB AI</h1>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(m => (
          <div key={m.id} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`p-3 rounded-2xl text-xs ${m.sender === 'user' ? 'bg-teal-500 text-black' : 'bg-slate-800 text-white'}`}>{m.text}</div>
          </div>
        ))}
        {isSending && <div className="text-teal-400 text-[10px] animate-pulse italic ml-2">Waking up Coach...</div>}
        <div ref={chatEndRef} />
      </div>
      <div className="p-4 bg-slate-900 flex gap-2">
        <input value={input} onChange={e => setInput(e.target.value)} className="flex-1 bg-slate-950 border-none rounded-xl text-white text-xs p-3" placeholder="Talk to coach..." />
        <button onClick={handleSend} className="bg-teal-500 p-3 rounded-xl"><Send size={16}/></button>
      </div>
      {!isPremium && <AdMobBanner />}
    </div>
  );
};
