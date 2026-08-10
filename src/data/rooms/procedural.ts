import { Room } from '../../types/game';

// Procedurally generate a fresh 60-second room with random code & clues
export function generateRandomGauntletRoom(level: number): Room {
  const themes: Array<'dark-wood' | 'cyber' | 'mystic' | 'metal' | 'marble'> = [
    'dark-wood',
    'cyber',
    'mystic',
    'metal',
    'marble',
  ];
  const selectedTheme = themes[(level - 1) % themes.length];

  // Generate random 4-digit code
  const randomCode = Math.floor(1000 + Math.random() * 9000).toString();
  const digit1 = randomCode[0];
  const digit2 = randomCode[1];
  const digit3 = randomCode[2];
  const digit4 = randomCode[3];

  const keyItemId = `gauntlet_key_${level}`;

  return {
    id: `gauntlet_level_${level}`,
    name: `Gauntlet Sector ${level}`,
    subtitle: `Procedural Security Chamber #${level} - 60 Seconds!`,
    theme: selectedTheme,
    backgroundColor:
      selectedTheme === 'cyber'
        ? '#080d1a'
        : selectedTheme === 'mystic'
        ? '#130e20'
        : selectedTheme === 'metal'
        ? '#0f172a'
        : '#18181b',
    accentColor:
      selectedTheme === 'cyber'
        ? '#06b6d4'
        : selectedTheme === 'mystic'
        ? '#c084fc'
        : '#f59e0b',
    description: `Procedural Chamber #${level}. Find the key, decode PIN ${randomCode}, and escape before time runs out!`,
    storyIntro: `CHAMBER #${level} INITIALIZED! 60 seconds on the clock. Decode the terminal security lock and locate Sector Key #${level}!`,
    exitDoorId: 'exit_door',
    hotspots: [
      {
        id: 'clue_terminal',
        name: 'Data Scanner Terminal',
        x: 18,
        y: 25,
        width: 24,
        height: 35,
        icon: 'Monitor',
        description: 'A holographic terminal displaying encrypted chamber diagnostics.',
        triggersPuzzle: 'terminal_puzzle',
        customVisual: 'terminal',
      },
      {
        id: 'supply_crate',
        name: 'Reinforced Supply Crate',
        x: 55,
        y: 50,
        width: 22,
        height: 32,
        icon: 'Box',
        description: `A sealed steel crate containing Sector Key #${level}.`,
        givesItem: {
          id: keyItemId,
          name: `Sector ${level} Access Key`,
          description: `A heavy security bypass key required for Exit Door #${level}.`,
          icon: 'KeyRound',
          color: '#38bdf8',
        },
        customVisual: 'cabinet',
      },
      {
        id: 'exit_door',
        name: `Sector Exit Portal ${level}`,
        x: 75,
        y: 20,
        width: 20,
        height: 65,
        icon: 'DoorClosed',
        description: `Sector exit doorway. Insert Sector ${level} Access Key AND enter 4-digit Security PIN.`,
        requiredItem: keyItemId,
        requiredItemFailMsg: `Requires Sector ${level} Access Key from the Supply Crate!`,
        triggersPuzzle: 'door_pin',
        unlocksDoor: true,
        customVisual: 'door',
      },
    ],
    puzzles: {
      terminal_puzzle: {
        id: 'terminal_puzzle',
        type: 'note',
        title: `Terminal Decryption - Level ${level}`,
        description: 'SECURITY SYSTEM ENCRYPTION REPORT:',
        solution: '',
        data: {
          noteText: `CHAMBER #${level} DIAGNOSTICS:
- Digit 1: [ ${digit1} ]
- Digit 2: [ ${digit2} ]
- Digit 3: [ ${digit3} ]
- Digit 4: [ ${digit4} ]

COMBINED SECURITY PIN: ${randomCode}
1. Collect Sector Key #${level} from the Supply Crate.
2. Insert Sector Key into Exit Door and enter PIN: ${randomCode}`,
        },
      },
      door_pin: {
        id: 'door_pin',
        type: 'keypad',
        title: `Sector ${level} Portal Deadbolt`,
        description: `Enter the 4-digit code decrypted at the Data Terminal (${randomCode}).`,
        solution: randomCode,
        solvedMessage: `SECTOR ${level} ESCAPED SUCCESSFULLY!`,
        hint: `The decrypted code is ${randomCode}.`,
      },
    },
  };
}
