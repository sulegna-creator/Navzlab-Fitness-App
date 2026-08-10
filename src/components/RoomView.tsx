import React, { useState } from 'react';
import { Room, Hotspot, InventoryItem } from '../types/game';
import {
  Briefcase,
  Lightbulb,
  FileText,
  Image,
  Lock,
  BookOpen,
  Clock,
  DoorClosed,
  Terminal,
  Cpu,
  Server,
  Radio,
  ShieldAlert,
  FlaskConical,
  Sun,
  Scroll,
  Eye,
  Gauge,
  Wrench,
  Compass,
  Sparkles,
  Pyramid,
  Gem,
  ShieldCheck,
  Search,
} from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface RoomViewProps {
  room: Room;
  selectedItem: InventoryItem | null;
  onHotspotClick: (hotspot: Hotspot) => void;
  examinedHotspots: string[];
}

export const RoomView: React.FC<RoomViewProps> = ({
  room,
  selectedItem,
  onHotspotClick,
  examinedHotspots,
}) => {
  const [hoveredHotspotId, setHoveredHotspotId] = useState<string | null>(null);

  const isUvTorchEquipped = selectedItem?.id === 'uv_torch';

  const getHotspotIcon = (iconName?: string) => {
    const props = { className: 'w-6 h-6 text-amber-300' };
    switch (iconName) {
      case 'Briefcase':
        return <Briefcase {...props} />;
      case 'Lightbulb':
        return <Lightbulb {...props} />;
      case 'FileText':
        return <FileText {...props} />;
      case 'Image':
        return <Image {...props} />;
      case 'Lock':
        return <Lock {...props} />;
      case 'BookOpen':
        return <BookOpen {...props} />;
      case 'Clock':
        return <Clock {...props} />;
      case 'DoorClosed':
        return <DoorClosed {...props} />;
      case 'Terminal':
        return <Terminal {...props} />;
      case 'Cpu':
        return <Cpu {...props} />;
      case 'Server':
        return <Server {...props} />;
      case 'Radio':
        return <Radio {...props} />;
      case 'ShieldAlert':
        return <ShieldAlert {...props} />;
      case 'FlaskConical':
        return <FlaskConical {...props} />;
      case 'Sun':
        return <Sun {...props} />;
      case 'Scroll':
        return <Scroll {...props} />;
      case 'Eye':
        return <Eye {...props} />;
      case 'Gauge':
        return <Gauge {...props} />;
      case 'Wrench':
        return <Wrench {...props} />;
      case 'Compass':
        return <Compass {...props} />;
      case 'Sparkles':
        return <Sparkles {...props} />;
      case 'Pyramid':
        return <Pyramid {...props} />;
      case 'Gem':
        return <Gem {...props} />;
      case 'ShieldCheck':
        return <ShieldCheck {...props} />;
      default:
        return <Search {...props} />;
    }
  };

  return (
    <div
      className="relative w-full h-full min-h-[420px] sm:min-h-[520px] rounded-3xl overflow-hidden border-2 border-slate-800 shadow-2xl select-none transition-colors duration-700 flex items-center justify-center"
      style={{
        backgroundColor: room.backgroundColor,
      }}
    >
      {/* Dynamic Background Room Canvas SVG Graphics */}
      <svg
        className="absolute inset-0 w-full h-full opacity-35 pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-slate-700" />
          </pattern>
          <radialGradient id="vignette" cx="50%" cy="50%" r="50%">
            <stop offset="60%" stopColor="transparent" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.85" />
          </radialGradient>
        </defs>

        <rect width="100%" height="100%" fill="url(#grid)" />
        <rect width="100%" height="100%" fill="url(#vignette)" />

        {/* Room Theme Visual Details */}
        {room.theme === 'dark-wood' && (
          <g className="text-amber-900/30">
            <rect x="5%" y="80%" width="90%" height="20%" fill="currentColor" />
            <line x1="10%" y1="0%" x2="5%" y2="80%" stroke="currentColor" strokeWidth="3" />
            <line x1="90%" y1="0%" x2="95%" y2="80%" stroke="currentColor" strokeWidth="3" />
          </g>
        )}

        {room.theme === 'cyber' && (
          <g className="text-cyan-500/20">
            <path d="M 0,200 L 300,100 L 600,100 L 900,200" fill="none" stroke="currentColor" strokeWidth="2" />
            <circle cx="50%" cy="50%" r="180" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="5,5" />
          </g>
        )}

        {room.theme === 'mystic' && (
          <g className="text-purple-500/20">
            <circle cx="50%" cy="40%" r="220" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <polygon points="500,100 400,350 600,350" fill="none" stroke="currentColor" strokeWidth="1" />
          </g>
        )}
      </svg>

      {/* Ultraviolet Light Beam Effect Overlay */}
      {isUvTorchEquipped && (
        <div className="absolute inset-0 z-10 pointer-events-none bg-purple-950/40 mix-blend-color-dodge animate-pulse flex items-center justify-center">
          <div className="w-96 h-96 rounded-full bg-purple-500/30 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-cyan-300 font-mono text-sm tracking-widest font-bold bg-slate-950/80 px-4 py-2 rounded-xl border border-purple-500/80 shadow-2xl">
            🔦 UV TORCH ACTIVE: Secret Glowing Ink Revealed! (Exit PIN: 8153)
          </div>
        </div>
      )}

      {/* Room Story Intro Banner */}
      <div className="absolute top-4 left-4 right-4 z-10 flex justify-center pointer-events-none">
        <div className="bg-slate-950/85 backdrop-blur-md px-4 py-2 rounded-2xl border border-slate-800 text-slate-300 text-xs font-medium text-center shadow-xl max-w-xl">
          {room.storyIntro}
        </div>
      </div>

      {/* Interactive Hotspots Container */}
      <div className="relative w-full h-full p-6">
        {room.hotspots.map((hotspot) => {
          const isHovered = hoveredHotspotId === hotspot.id;
          const isExamined = examinedHotspots.includes(hotspot.id);

          return (
            <div
              key={hotspot.id}
              onClick={() => {
                soundEngine.playClick();
                onHotspotClick(hotspot);
              }}
              onMouseEnter={() => setHoveredHotspotId(hotspot.id)}
              onMouseLeave={() => setHoveredHotspotId(null)}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 cursor-pointer group"
              style={{
                left: `${hotspot.x}%`,
                top: `${hotspot.y}%`,
                width: `${hotspot.width}%`,
                height: `${hotspot.height}%`,
              }}
            >
              {/* Hotspot Visual Card / Frame */}
              <div
                className={`w-full h-full rounded-2xl border-2 flex flex-col items-center justify-center p-2 transition-all duration-300 shadow-xl relative overflow-hidden backdrop-blur-sm ${
                  isHovered
                    ? 'bg-amber-500/25 border-amber-400 scale-105 shadow-amber-500/30 z-30'
                    : isExamined
                    ? 'bg-slate-900/60 border-slate-700/80 hover:border-amber-500/60'
                    : 'bg-slate-900/85 border-amber-500/50 hover:border-amber-400'
                }`}
              >
                {/* Glowing Corner Accents */}
                <span className="absolute top-1 left-1 w-2 h-2 border-t-2 border-l-2 border-amber-400/80 rounded-tl" />
                <span className="absolute top-1 right-1 w-2 h-2 border-t-2 border-r-2 border-amber-400/80 rounded-tr" />
                <span className="absolute bottom-1 left-1 w-2 h-2 border-b-2 border-l-2 border-amber-400/80 rounded-bl" />
                <span className="absolute bottom-1 right-1 w-2 h-2 border-b-2 border-r-2 border-amber-400/80 rounded-br" />

                {/* Object Icon */}
                <div className="p-2.5 rounded-2xl bg-slate-950/80 border border-slate-800 shadow-inner mb-1 group-hover:scale-110 transition-transform">
                  {getHotspotIcon(hotspot.icon)}
                </div>

                {/* Object Title */}
                <span className="text-[11px] sm:text-xs font-bold text-slate-100 text-center truncate w-full px-1 drop-shadow">
                  {hotspot.name}
                </span>

                {/* Inspect Indicator Badge */}
                {isHovered && (
                  <span className="mt-1 px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 font-extrabold text-[9px] uppercase tracking-wider animate-bounce">
                    SEARCH
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
