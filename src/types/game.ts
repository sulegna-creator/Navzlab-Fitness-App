export type GameMode = 'campaign' | 'gauntlet';

export type RoomId = 'detective' | 'cyber' | 'alchemist' | 'submarine' | 'museum' | string;

export interface InventoryItem {
  id: string;
  name: string;
  description: string;
  icon: string; // Lucide icon name or custom visual key
  color?: string;
  combinableWith?: string; // ID of item it combines with
  combinationResultId?: string; // Resulting item ID
  inspectDetails?: {
    text?: string;
    imageSvg?: string;
    hiddenCode?: string;
    requiresUv?: boolean;
  };
}

export type PuzzleType = 
  | 'keypad' 
  | 'dial' 
  | 'wires' 
  | 'note' 
  | 'potions' 
  | 'valves' 
  | 'mirrors' 
  | 'books'
  | 'clock';

export interface PuzzleConfig {
  id: string;
  type: PuzzleType;
  title: string;
  description: string;
  solution: string | number | number[] | string[];
  solvedItemGrant?: InventoryItem;
  solvedMessage?: string;
  hint?: string;
  data?: Record<string, any>;
}

export interface Hotspot {
  id: string;
  name: string;
  x: number; // Percentage 0-100
  y: number; // Percentage 0-100
  width: number; // Percentage
  height: number; // Percentage
  icon?: string;
  description?: string;
  requiredItem?: string; // Item needed to interact
  requiredItemFailMsg?: string;
  givesItem?: InventoryItem;
  triggersPuzzle?: string; // Puzzle ID
  unlocksDoor?: boolean;
  isUnlocked?: boolean;
  isExamined?: boolean;
  customVisual?: string; // Visual key for SVG rendering
}

export interface Room {
  id: RoomId;
  name: string;
  subtitle: string;
  theme: 'dark-wood' | 'cyber' | 'mystic' | 'metal' | 'marble';
  backgroundColor: string;
  accentColor: string;
  description: string;
  storyIntro: string;
  hotspots: Hotspot[];
  puzzles: Record<string, PuzzleConfig>;
  initialInventory?: InventoryItem[];
  exitDoorId: string; // Hotspot ID of the final door
}

export interface GameStats {
  roomsCompleted: number;
  bestTimes: Record<string, number>; // Room ID to seconds remaining
  totalEscapes: number;
  totalAttempts: number;
  hintsUsedCount: number;
  achievements: string[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
}
