import React from 'react';
import { ShieldAlert, X } from 'lucide-react';

interface SafetyDisclaimerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SafetyDisclaimerModal: React.FC<SafetyDisclaimerModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-5 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-slate-100 font-display">Health & Safety Disclaimer</h3>
            <p className="text-xs text-amber-400 font-semibold">Important User Guidance</p>
          </div>
        </div>

        <div className="space-y-3 text-xs text-slate-300 leading-relaxed bg-slate-950 p-4 rounded-2xl border border-slate-800">
          <p>
            <strong>NAVZLAB Health and Fitness Monitor</strong> is designed strictly for general fitness, wellness tracking, and physical motivation purposes.
          </p>
          <p>
            It is <strong>NOT a medical device</strong> and does NOT diagnose, treat, prevent, or evaluate any clinical or medical condition.
          </p>
          <p>
            Calorie estimates, activity scores, pace calculations, and heart rate readings (where available via connected device sensors) are approximate estimates.
          </p>
          <p>
            <strong>Safety Caution:</strong> During workouts, if you experience chest pain, dizziness, severe shortness of breath, lightheadedness, or severe joint pain, stop exercising immediately and seek medical evaluation.
          </p>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3.5 rounded-2xl bg-emerald-500 text-slate-950 font-extrabold text-xs hover:bg-emerald-400 transition-all"
        >
          I Understand & Agree
        </button>
      </div>
    </div>
  );
};
