import React, { useState } from 'react';
import { X, Cpu, CheckCircle2 } from 'lucide-react';
import { soundEngine } from '../../utils/audio';

interface WireCircuitModalProps {
  title: string;
  description: string;
  solution: number[];
  solvedMessage?: string;
  hint?: string;
  onSuccess: () => void;
  onClose: () => void;
}

export const WireCircuitModal: React.FC<WireCircuitModalProps> = ({
  title,
  description,
  solution,
  solvedMessage = 'CIRCUIT BREAKER REENERGIZED!',
  hint,
  onSuccess,
  onClose,
}) => {
  const [connections, setConnections] = useState<number[]>([]);
  const [status, setStatus] = useState<'idle' | 'success'>('idle');

  const wires = [
    { id: 0, name: 'Red Phase Line', color: '#ef4444' },
    { id: 1, name: 'Blue Data Line', color: '#3b82f6' },
    { id: 2, name: 'Green Ground Wire', color: '#22c55e' },
    { id: 3, name: 'Yellow Power Rail', color: '#eab308' },
  ];

  const handleWireClick = (id: number) => {
    if (status !== 'idle' || connections.includes(id)) return;
    soundEngine.playClick();
    const next = [...connections, id];
    setConnections(next);

    if (next.length === wires.length) {
      soundEngine.playUnlock();
      setStatus('success');
      setTimeout(() => {
        onSuccess();
      }, 1200);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="relative w-full max-w-md bg-slate-900 border-2 border-cyan-500/80 rounded-3xl p-6 shadow-2xl flex flex-col items-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-bold text-cyan-400 mb-1">{title}</h2>
        <p className="text-xs text-slate-300 text-center mb-6">{description}</p>

        <div className="w-full space-y-3 mb-6">
          {wires.map((wire) => {
            const isConnected = connections.includes(wire.id);
            const orderIndex = connections.indexOf(wire.id) + 1;
            return (
              <button
                key={wire.id}
                onClick={() => handleWireClick(wire.id)}
                disabled={isConnected}
                className={`w-full p-3.5 rounded-2xl border-2 flex items-center justify-between transition-all ${
                  isConnected
                    ? 'bg-slate-950 border-emerald-500 opacity-80'
                    : 'bg-slate-800 border-slate-700 hover:border-cyan-400'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full shadow-md"
                    style={{ backgroundColor: wire.color }}
                  />
                  <span className="text-sm font-bold text-slate-100">{wire.name}</span>
                </div>
                {isConnected ? (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-bold">
                    Connected #{orderIndex}
                  </span>
                ) : (
                  <span className="text-xs text-cyan-400 font-semibold">Connect</span>
                )}
              </button>
            );
          })}
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
