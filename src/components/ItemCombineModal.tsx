import React, { useState } from 'react';
import { X, Plus, Sparkles, AlertCircle } from 'lucide-react';
import { InventoryItem } from '../types/game';
import { soundEngine } from '../utils/audio';

interface ItemCombineModalProps {
  items: InventoryItem[];
  onCombine: (item1Id: string, item2Id: string) => void;
  onClose: () => void;
}

export const ItemCombineModal: React.FC<ItemCombineModalProps> = ({
  items,
  onCombine,
  onClose,
}) => {
  const [selected1, setSelected1] = useState<string | null>(items[0]?.id || null);
  const [selected2, setSelected2] = useState<string | null>(items[1]?.id || null);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const item1 = items.find((i) => i.id === selected1);
  const item2 = items.find((i) => i.id === selected2);

  const handleCombine = () => {
    if (!item1 || !item2 || item1.id === item2.id) {
      setErrorMsg('Select two different items to combine!');
      return;
    }

    if (item1.combinableWith === item2.id || item2.combinableWith === item1.id) {
      soundEngine.playItemPickup();
      onCombine(item1.id, item2.id);
    } else {
      soundEngine.playError();
      setErrorMsg('These two items cannot be combined!');
      setTimeout(() => setErrorMsg(''), 1800);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="relative w-full max-w-md bg-slate-900 border-2 border-amber-500/80 rounded-3xl p-6 shadow-2xl flex flex-col items-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-bold text-amber-400 mb-1 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <span>Workbench & Crafting</span>
        </h2>
        <p className="text-xs text-slate-300 text-center mb-6">
          Combine items in your inventory to craft useful tools!
        </p>

        {/* Selected Items Combination Preview */}
        <div className="flex items-center justify-center gap-4 w-full mb-6">
          <div className="flex flex-col items-center p-3 bg-slate-950 border border-slate-800 rounded-2xl w-28 text-center min-h-[90px] justify-center">
            {item1 ? (
              <>
                <span className="text-xs font-bold text-amber-300 mb-1">{item1.name}</span>
                <span className="text-[10px] text-slate-400 truncate w-full">{item1.description}</span>
              </>
            ) : (
              <span className="text-xs text-slate-600">Select Item 1</span>
            )}
          </div>

          <Plus className="w-6 h-6 text-amber-400 flex-shrink-0 animate-pulse" />

          <div className="flex flex-col items-center p-3 bg-slate-950 border border-slate-800 rounded-2xl w-28 text-center min-h-[90px] justify-center">
            {item2 ? (
              <>
                <span className="text-xs font-bold text-amber-300 mb-1">{item2.name}</span>
                <span className="text-[10px] text-slate-400 truncate w-full">{item2.description}</span>
              </>
            ) : (
              <span className="text-xs text-slate-600">Select Item 2</span>
            )}
          </div>
        </div>

        {/* Selection Grids */}
        <div className="w-full space-y-2 mb-6">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Choose Items:
          </span>
          <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
            {items.map((item) => {
              const isSelected1 = selected1 === item.id;
              const isSelected2 = selected2 === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (!selected1) setSelected1(item.id);
                    else if (!selected2 && item.id !== selected1) setSelected2(item.id);
                    else if (selected1 === item.id) setSelected1(null);
                    else setSelected2(item.id);
                  }}
                  className={`p-2.5 rounded-xl border text-left text-xs font-semibold transition-all ${
                    isSelected1
                      ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                      : isSelected2
                      ? 'bg-sky-500/20 border-sky-400 text-sky-300'
                      : 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-750'
                  }`}
                >
                  <div className="truncate">{item.name}</div>
                </button>
              );
            })}
          </div>
        </div>

        {errorMsg && (
          <div className="flex items-center gap-1.5 text-xs text-red-400 font-bold mb-4 animate-shake">
            <AlertCircle className="w-4 h-4" />
            <span>{errorMsg}</span>
          </div>
        )}

        <button
          onClick={handleCombine}
          className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-amber-500/20 active:scale-95"
        >
          Craft & Combine
        </button>
      </div>
    </div>
  );
};
