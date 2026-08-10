import React, { useState } from 'react';
import { X, FlaskConical, CheckCircle2, RotateCcw } from 'lucide-react';
import { soundEngine } from '../../utils/audio';

interface PotionMixerModalProps {
  title: string;
  description: string;
  solution: string[];
  solvedMessage?: string;
  hint?: string;
  onSuccess: () => void;
  onClose: () => void;
  onWrongCodePenalty?: () => void;
}

export const PotionMixerModal: React.FC<PotionMixerModalProps> = ({
  title,
  description,
  solution,
  solvedMessage = 'POTION BREWED SUCCESSFULLY!',
  hint,
  onSuccess,
  onClose,
  onWrongCodePenalty,
}) => {
  const [addedLiquids, setAddedLiquids] = useState<string[]>([]);
  const [status, setStatus] = useState<'idle' | 'brewing' | 'error' | 'success'>('idle');

  const handleAddColor = (color: string) => {
    if (status !== 'idle' || addedLiquids.length >= solution.length) return;
    soundEngine.playClick();
    const nextLiquids = [...addedLiquids, color];
    setAddedLiquids(nextLiquids);

    if (nextLiquids.length === solution.length) {
      // Check sequence
      const isCorrect = nextLiquids.every((c, i) => c === solution[i]);
      setStatus('brewing');

      setTimeout(() => {
        if (isCorrect) {
          soundEngine.playUnlock();
          setStatus('success');
          setTimeout(() => {
            onSuccess();
          }, 1200);
        } else {
          soundEngine.playError();
          setStatus('error');
          if (onWrongCodePenalty) onWrongCodePenalty();
          setTimeout(() => {
            setAddedLiquids([]);
            setStatus('idle');
          }, 1500);
        }
      }, 800);
    }
  };

  const handleReset = () => {
    soundEngine.playClick();
    setAddedLiquids([]);
    setStatus('idle');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="relative w-full max-w-md bg-purple-950/90 border-2 border-purple-500 rounded-3xl p-6 shadow-2xl flex flex-col items-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-purple-900/60 text-purple-300 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-bold text-purple-300 mb-1">{title}</h2>
        <p className="text-xs text-purple-200/80 text-center mb-6">{description}</p>

        {/* Cauldron Display */}
        <div className="relative flex flex-col items-center justify-center w-36 h-36 rounded-full bg-slate-950 border-4 border-purple-600 shadow-inner overflow-hidden mb-6">
          <div
            className={`absolute bottom-0 w-full transition-all duration-500 ${
              status === 'success'
                ? 'h-full bg-emerald-500 animate-pulse'
                : status === 'error'
                ? 'h-full bg-red-600 animate-bounce'
                : addedLiquids.length === 1
                ? 'h-1/3 bg-red-500'
                : addedLiquids.length === 2
                ? 'h-2/3 bg-blue-500'
                : addedLiquids.length === 3
                ? 'h-full bg-amber-400'
                : 'h-2 bg-slate-800'
            }`}
          />
          <FlaskConical className="w-12 h-12 text-purple-200 z-10 animate-bounce" />
        </div>

        {/* Ingredients Buttons */}
        <div className="grid grid-cols-3 gap-3 w-full mb-4">
          <button
            onClick={() => handleAddColor('red')}
            disabled={status !== 'idle'}
            className="py-3 px-2 bg-red-900/80 hover:bg-red-800 text-red-200 border border-red-500 rounded-2xl font-bold text-xs uppercase"
          >
            🔴 Red Liquid
          </button>
          <button
            onClick={() => handleAddColor('blue')}
            disabled={status !== 'idle'}
            className="py-3 px-2 bg-blue-900/80 hover:bg-blue-800 text-blue-200 border border-blue-500 rounded-2xl font-bold text-xs uppercase"
          >
            🔵 Blue Solution
          </button>
          <button
            onClick={() => handleAddColor('yellow')}
            disabled={status !== 'idle'}
            className="py-3 px-2 bg-amber-900/80 hover:bg-amber-800 text-amber-200 border border-amber-500 rounded-2xl font-bold text-xs uppercase"
          >
            🟡 Yellow Sulphur
          </button>
        </div>

        <button
          onClick={handleReset}
          className="flex items-center gap-1 text-xs text-purple-300 hover:text-white"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Cauldron</span>
        </button>

        {hint && <p className="mt-4 text-[11px] text-purple-300 italic text-center">💡 {hint}</p>}
      </div>
    </div>
  );
};
