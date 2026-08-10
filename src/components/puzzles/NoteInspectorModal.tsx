import React, { useState } from 'react';
import { X, Zap, Eye, Lightbulb } from 'lucide-react';
import { soundEngine } from '../../utils/audio';

interface NoteInspectorModalProps {
  title: string;
  noteText: string;
  uvSecretText?: string;
  hasUvTorch?: boolean;
  onClose: () => void;
}

export const NoteInspectorModal: React.FC<NoteInspectorModalProps> = ({
  title,
  noteText,
  uvSecretText,
  hasUvTorch = false,
  onClose,
}) => {
  const [isUvActive, setIsUvActive] = useState<boolean>(false);

  const toggleUv = () => {
    soundEngine.playClick();
    setIsUvActive(!isUvActive);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div
        className={`relative w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl transition-all duration-500 border-2 ${
          isUvActive
            ? 'bg-slate-950 border-purple-500 shadow-purple-900/50'
            : 'bg-amber-50/95 border-amber-200 text-slate-900 shadow-amber-900/20'
        }`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-2 rounded-full transition-colors ${
            isUvActive
              ? 'bg-purple-900/50 hover:bg-purple-800 text-purple-200'
              : 'bg-amber-200/60 hover:bg-amber-300 text-slate-800'
          }`}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <h2
          className={`text-xl font-bold mb-4 ${
            isUvActive ? 'text-purple-300 font-mono tracking-widest' : 'text-amber-900 font-serif'
          }`}
        >
          {title}
        </h2>

        {/* Parchment/Screen Note Box */}
        <div
          className={`p-5 rounded-2xl border min-h-[160px] flex flex-col justify-center whitespace-pre-wrap font-mono text-sm leading-relaxed transition-all duration-500 ${
            isUvActive
              ? 'bg-purple-950/80 border-purple-500/50 text-purple-200 shadow-inner shadow-purple-900'
              : 'bg-amber-100/80 border-amber-300/80 text-amber-950'
          }`}
        >
          {isUvActive ? (
            <div className="animate-pulse space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-purple-400 block border-b border-purple-800 pb-1">
                🔦 ULTRAVIOLET INK REVEALED:
              </span>
              <p className="text-lg font-bold text-cyan-300 tracking-wider">
                {uvSecretText || noteText}
              </p>
            </div>
          ) : (
            <p className="font-serif text-base text-slate-800">{noteText}</p>
          )}
        </div>

        {/* UV Torch Control Toggle */}
        {hasUvTorch && (
          <div className="mt-6 flex flex-col items-center gap-2">
            <button
              onClick={toggleUv}
              className={`w-full py-3 px-4 rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all border shadow-lg ${
                isUvActive
                  ? 'bg-purple-600 hover:bg-purple-500 text-white border-purple-400 shadow-purple-600/40 animate-pulse'
                  : 'bg-purple-950/80 hover:bg-purple-900 text-purple-300 border-purple-700/80'
              }`}
            >
              <Zap className="w-4 h-4 text-purple-300" />
              <span>{isUvActive ? 'Turn Off UV Flashlight' : 'Shine UV Flashlight on Note'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
