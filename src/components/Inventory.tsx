import React from 'react';
import { InventoryItem } from '../types/game';
import {
  Key,
  KeyRound,
  Zap,
  Flashlight,
  FileText,
  Lock,
  BookOpen,
  Lightbulb,
  CreditCard,
  Cpu,
  FlaskRound,
  Wrench,
  Gem,
  Plus,
  Eye,
  Info,
} from 'lucide-react';

interface InventoryProps {
  items: InventoryItem[];
  selectedItemId: string | null;
  onSelectItem: (id: string | null) => void;
  onExamineItem: (item: InventoryItem) => void;
  onCombineClick: () => void;
}

export const Inventory: React.FC<InventoryProps> = ({
  items,
  selectedItemId,
  onSelectItem,
  onExamineItem,
  onCombineClick,
}) => {
  const getIcon = (iconName: string, color?: string) => {
    const props = { className: 'w-6 h-6', style: { color: color || '#f59e0b' } };
    switch (iconName) {
      case 'Key':
        return <Key {...props} />;
      case 'KeyRound':
        return <KeyRound {...props} />;
      case 'Zap':
        return <Zap {...props} />;
      case 'Flashlight':
        return <Flashlight {...props} />;
      case 'FileText':
        return <FileText {...props} />;
      case 'CreditCard':
        return <CreditCard {...props} />;
      case 'Cpu':
        return <Cpu {...props} />;
      case 'FlaskRound':
        return <FlaskRound {...props} />;
      case 'Wrench':
        return <Wrench {...props} />;
      case 'Gem':
        return <Gem {...props} />;
      default:
        return <Key {...props} />;
    }
  };

  const selectedItem = items.find((i) => i.id === selectedItemId);

  return (
    <div className="w-full bg-slate-950/95 border-t border-slate-800 text-slate-100 p-3 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xl z-20 backdrop-blur-md">
      {/* Items Grid Bar */}
      <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto py-1 px-1 scrollbar-thin">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-1 hidden sm:inline">
          Inventory:
        </span>

        {items.length === 0 ? (
          <div className="text-xs text-slate-500 italic py-2 px-4 rounded-xl border border-dashed border-slate-800 bg-slate-900/40">
            (Empty - Search the room for items & keys)
          </div>
        ) : (
          items.map((item) => {
            const isSelected = selectedItemId === item.id;
            return (
              <div
                key={item.id}
                onClick={() => onSelectItem(isSelected ? null : item.id)}
                className={`relative group flex-shrink-0 flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-2xl border-2 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-amber-500/20 border-amber-400 shadow-lg shadow-amber-500/20 scale-105'
                    : 'bg-slate-900/80 border-slate-700/80 hover:border-slate-500 hover:bg-slate-800/80'
                }`}
              >
                {getIcon(item.icon, item.color)}

                {/* Equipped Badge */}
                {isSelected && (
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-amber-400 rounded-full border-2 border-slate-950 animate-pulse" />
                )}

                {/* Tooltip on hover */}
                <div className="absolute bottom-full mb-2 hidden group-hover:flex flex-col items-center z-30 pointer-events-none">
                  <div className="bg-slate-900 text-slate-100 text-[11px] font-semibold px-2.5 py-1 rounded-lg border border-slate-700 whitespace-nowrap shadow-xl">
                    {item.name}
                  </div>
                  <div className="w-2 h-2 bg-slate-900 border-r border-b border-slate-700 transform rotate-45 -mt-1" />
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Item Action Controls */}
      {selectedItem ? (
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end bg-slate-900/80 p-2 rounded-xl border border-slate-800">
          <div className="flex flex-col mr-2 max-w-[150px] sm:max-w-[200px]">
            <span className="text-xs font-bold text-amber-300 truncate">{selectedItem.name}</span>
            <span className="text-[10px] text-slate-400 truncate">{selectedItem.description}</span>
          </div>

          <button
            onClick={() => onExamineItem(selectedItem)}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs font-medium flex items-center gap-1 transition-all"
          >
            <Eye className="w-3.5 h-3.5 text-sky-400" />
            <span>Examine</span>
          </button>

          {items.length >= 2 && (
            <button
              onClick={onCombineClick}
              className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-semibold flex items-center gap-1 transition-all"
            >
              <Plus className="w-3.5 h-3.5 text-amber-400" />
              <span>Combine</span>
            </button>
          )}
        </div>
      ) : (
        <div className="text-xs text-slate-400 hidden lg:flex items-center gap-1.5 bg-slate-900/50 px-3 py-1.5 rounded-xl border border-slate-800">
          <Info className="w-3.5 h-3.5 text-slate-500" />
          <span>Click an item to equip or inspect it before using on locks.</span>
        </div>
      )}
    </div>
  );
};
