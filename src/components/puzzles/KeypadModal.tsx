import React, { useState } from 'react';
import { X, Delete, CheckCircle2, AlertCircle } from 'lucide-react';
import { soundEngine } from '../../utils/audio';

interface KeypadModalProps {
  title: string;
  description: string;
  solution: string;
  solvedMessage?: string;
  hint?: string;
  onSuccess: () => void;
  onClose: () => void;
  onWrongCodePenalty?: () => void;
}

export const KeypadModal: React.FC<KeypadModalProps> = ({
  title,
  description,
  solution,
  solvedMessage = 'ACCESS GRANTED!',
  hint,
  onSuccess,
  onClose,
  onWrongCodePenalty,
}) => {
  const [inputCode, setInputCode] = useState<string>('');
  const [status, setStatus] = useState<'idle' | 'error' | 'success'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleKeyPress = (num: string) => {
    if (status !== 'idle') return;
    soundEngine.playClick();
    if (inputCode.length < 8) {
      setInputCode((prev) => prev + num);
    }
  };

  const handleClear = () => {
    if (status !== 'idle') return;
    soundEngine.playClick();
    setInputCode('');
  };

  const handleDelete = () => {
    if (status !== 'idle') return;
    soundEngine.playClick();
    setInputCode((prev) => prev.slice(0, -1));
  };

  const handleSubmit = () => {
    if (status !== 'idle' || inputCode.length === 0) return;

    if (inputCode === solution) {
      soundEngine.playUnlock();
      setStatus('success');
      setTimeout(() => {
        onSuccess();
      }, 1200);
    } else {
      soundEngine.playError();
      setStatus('error');
      setErrorMessage('INCORRECT PIN (-5 SECONDS PENALTY!)');
      if (onWrongCodePenalty) onWrongCodePenalty();

      setTimeout(() => {
        setInputCode('');
        setStatus('idle');
        setErrorMessage('');
      }, 1500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="relative w-full max-w-sm bg-slate-900 border-2 border-slate-700 rounded-3xl p-6 shadow-2xl flex flex-col items-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <h2 className="text-xl font-bold text-amber-400 mb-1 text-center">{title}</h2>
        <p className="text-xs text-slate-300 text-center mb-4 leading-relaxed">{description}</p>

        {/* Digital Display Screen */}
        <div
          className={`w-full py-4 px-6 rounded-2xl border-2 mb-6 flex flex-col items-center justify-center font-mono tracking-widest text-3xl font-extrabold shadow-inner transition-colors min-h-[72px] ${
            status === 'success'
              ? 'bg-emerald-950/90 border-emerald-500 text-emerald-400 shadow-emerald-900/50'
              : status === 'error'
              ? 'bg-red-950/90 border-red-500 text-red-400 shadow-red-900/50 animate-shake'
              : 'bg-slate-950 border-slate-800 text-amber-300'
          }`}
        >
          {status === 'success' ? (
            <div className="flex items-center gap-2 text-lg text-emerald-400 tracking-normal font-bold">
              <CheckCircle2 className="w-6 h-6 animate-bounce" />
              <span>{solvedMessage}</span>
            </div>
          ) : status === 'error' ? (
            <div className="flex items-center gap-1.5 text-xs text-red-400 tracking-normal font-bold text-center">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          ) : (
            <span>{inputCode ? inputCode : '_ _ _ _'}</span>
          )}
        </div>

        {/* 10-Key Numpad */}
        <div className="grid grid-cols-3 gap-3 w-full mb-4">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
            <button
              key={num}
              onClick={() => handleKeyPress(num)}
              className="py-3.5 bg-slate-800 hover:bg-slate-700 active:bg-amber-500 active:text-slate-950 rounded-2xl border border-slate-700 text-xl font-bold text-slate-100 transition-all shadow-md active:scale-95"
            >
              {num}
            </button>
          ))}

          <button
            onClick={handleClear}
            className="py-3.5 bg-slate-800/80 hover:bg-red-900/40 hover:text-red-300 rounded-2xl border border-slate-700 text-xs font-semibold text-slate-400 transition-all"
          >
            CLR
          </button>

          <button
            onClick={() => handleKeyPress('0')}
            className="py-3.5 bg-slate-800 hover:bg-slate-700 active:bg-amber-500 active:text-slate-950 rounded-2xl border border-slate-700 text-xl font-bold text-slate-100 transition-all shadow-md active:scale-95"
          >
            0
          </button>

          <button
            onClick={handleDelete}
            className="py-3.5 bg-slate-800/80 hover:bg-slate-700 rounded-2xl border border-slate-700 text-slate-300 flex items-center justify-center transition-all"
          >
            <Delete className="w-5 h-5" />
          </button>
        </div>

        {/* Enter / Unlock Button */}
        <button
          onClick={handleSubmit}
          disabled={status !== 'idle' || !inputCode}
          className={`w-full py-3.5 rounded-2xl font-bold text-sm tracking-wider uppercase transition-all shadow-lg ${
            status !== 'idle' || !inputCode
              ? 'bg-slate-800 text-slate-600 border border-slate-700 cursor-not-allowed'
              : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20 active:scale-95'
          }`}
        >
          ENTER SECURITY CODE
        </button>

        {hint && <p className="mt-4 text-[11px] text-slate-400 italic text-center">💡 Hint: {hint}</p>}
      </div>
    </div>
  );
};
