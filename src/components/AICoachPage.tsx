import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, Sparkles, ShieldAlert, RefreshCw } from 'lucide-react';
import { AdMob } from '@capacitor-community/admob';
import { AdMobBanner } from './AdMobBanner';

const API_BASE_URL = 'https://navzlab-fitness.onrender.com'; // <--- CHANGE THIS

export const AICoachPage = ({ userProfile }: any) => {
  const [messages, setMessages] = useState([{ id: '1', sender: 'ai', text: 'Hello! How can I help you today?' }]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    AdMob.initialize({ initializeForTesting: true });
  }, []);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const showAd = async () => {
    try {
      await AdMob.prepareInterstitial({ adId: 'ca-app-pub-3940256099942544/1033173712' });
      await AdMob.showInterstitial();
    } catch (e) { console.log(e); }
  };

  const handleSend = async () => {
    if (!input.trim() || isSending) return;
    const userText = input;
    setInput('');
    setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'user', text: userText }]);
    setIsSending(true);
    
    // Trigger ad while waiting
    showAd();

    try {
      const res = await fetch(`${API_BASE_URL}/api/ai/coach`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText, userProfile })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { id: 'ai'+Date.now(), sender: 'ai', text: data.reply }]);
    } catch (e) {
      setMessages(prev => [...prev, { id: 'err', sender: 'ai', text: "Check your internet or server." }]);
    } finally { setIsSending(false); }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-950 pb-20">
      <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center gap-3">
        <Bot className="text-teal-400" /> <h1 className="font-black text-white">NAVZLAB AI</h1>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(m => (
          <div key={m.id} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-2xl text-xs ${m.sender === 'user' ? 'bg-teal-500 text-black' : 'bg-slate-800 text-white'}`}>{m.text}</div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>
      <div className="p-4 bg-slate-900 flex gap-2">
        <input value={input} onChange={e => setInput(e.target.value)} className="flex-1 bg-slate-950 border-none rounded-xl text-white text-xs p-3" placeholder="Ask anything..." />
        <button onClick={handleSend} className="bg-teal-500 p-3 rounded-xl"><Send size={16}/></button>
      </div>
      <AdMobBanner />
    </div>
  );
};
