import { Room, RoomId } from '../../types/game';
import { room1 } from './room1';
import { room2 } from './room2';
import { room3 } from './room3';
import { room4 } from './room4';
import { room5 } from './room5';
import { generateRandomGauntletRoom } from './procedural';

export const CAMPAIGN_ROOMS: Room[] = [room1, room2, room3, room4, room5];

export function getRoomById(id: RoomId): Room | undefined {
  if (id.startsWith('gauntlet_level_')) {
    const levelNum = parseInt(id.replace('gauntlet_level_', ''), 10) || 1;
    return generateRandomGauntletRoom(levelNum);
  }
  return CAMPAIGN_ROOMS.find((r) => r.id === id);
}
