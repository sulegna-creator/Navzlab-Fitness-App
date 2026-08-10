import React, { useState } from 'react';
import { X, Gauge, CheckCircle2 } from 'lucide-react';
import { soundEngine } from '../../utils/audio';

interface ValvePressureModalProps {
  title: string;
  description: string;
  solution: number[]; // [30, 70, 40]
  solvedMessage?: string;
  hint?: string;
  onSuccess: () => void;
  onClose: () => void;
}

export const ValvePressureModal: React.FC<ValvePressureModalProps> = ({
  title,
  description,
  solution,
  solvedMessage = 'PRESSURE EQUALIZED!',
  hint,
  onSuccess,
  onClose,
}) => {
  const [valves, setValves] = useState<number[]>([10, 10, 10]);
  const [status, setStatus] = useState<'idle' | 'success'>('idle');

  const handleAdjust = (index: number, delta: number) => {
    if (status !== 'idle') return;
    soundEngine.playClick();
    const nextValves = [...valves];
    nextValves[index] = Math.max(0, Math.min(100, nextValves[index] + delta));
    setValves(nextValves);

    // Check solution match
    if (
      nextValves[0] === solution[0] &&
      nextValves[1] === solution[1] &&
      nextValves[2] === solution[2]
    ) {
      soundEngine.playUnlock();
      setStatus('success');
      setTimeout(() => {
        onSuccess();
      }, 1200);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="relative w-full max-w-md bg-slate-900 border-2 border-emerald-500 rounded-3xl p-6 shadow-2xl flex flex-col items-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-bold text-emerald-400 mb-1">{title}</h2>
        <p className="text-xs text-slate-300 text-center mb-6">{description}</p>

        <div className="grid grid-cols-3 gap-3 w-full mb-6">
          {[0, 1, 2].map((idx) => (
            <div
              key={idx}
              className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col items-center justify-between shadow-inner"
            >
              <span className="text-xs font-bold text-slate-400 mb-2">Gauge #{idx + 1}</span>

              <div className="relative flex items-center justify-center w-16 h-16 rounded-full border-4 border-emerald-500/80 my-2 bg-slate-900">
                <Gauge className="w-6 h-6 text-emerald-400" />
                <span className="absolute bottom-1 text-xs font-extrabold text-emerald-300 font-mono">
                  {valves[idx]}
                </span>
              </div>

              <div className="flex gap-2 w-full mt-2">
                <button
                  onClick={() => handleAdjust(idx, -10)}
                  className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-bold text-xs"
                >
                  -10
                </button>
                <button
                  onClick={() => handleAdjust(idx, +10)}
                  className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 rounded-lg font-bold text-xs"
                >
                  +10
                </button>
              </div>
            </div>
          ))}
        </div>

        {status === 'success' && (
          <div className="text-emerald-400 font-bold text-sm flex items-center gap-2 mb-2 animate-bounce">
            <CheckCircle2 className="w-5 h-5" />
            <span>{solvedMessage}</span>
          </div>
        )}

        {hint && <p className="text-[11px] text-slate-400 italic text-center">💡 {hint}</p>}
      </div>
    </div>
  );
};
