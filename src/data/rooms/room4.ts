import { Room } from '../../types/game';

export const room4: Room = {
  id: 'submarine',
  name: 'Submarine Escape Hatch',
  subtitle: 'A pressurized tactical submarine control deck flooding with water.',
  theme: 'metal',
  backgroundColor: '#0c1a1a',
  accentColor: '#10b981',
  description: 'Equalize ballast pressure valves, inspect the periscope morse code, and turn the heavy submarine emergency hatch wheel.',
  storyIntro: 'CRITICAL WARNING! Hull breach detected! Water level rising! Equalize pressure valves and turn the emergency submarine exit hatch before 60 seconds expire!',
  exitDoorId: 'sub_hatch',
  hotspots: [
    {
      id: 'periscope',
      name: 'Optical Periscope',
      x: 20,
      y: 15,
      width: 15,
      height: 30,
      icon: 'Eye',
      description: 'Look through the periscope to observe distant lighthouse signals.',
      triggersPuzzle: 'periscope_clue',
      customVisual: 'periscope',
    },
    {
      id: 'pressure_valves',
      name: 'Ballast Pressure Panel',
      x: 45,
      y: 20,
      width: 25,
      height: 35,
      icon: 'Gauge',
      description: 'Three mechanical pressure dials regulating the escape hatch lock.',
      triggersPuzzle: 'valve_puzzle',
      customVisual: 'valves',
    },
    {
      id: 'tool_chest',
      name: 'Submarine Emergency Locker',
      x: 10,
      y: 55,
      width: 22,
      height: 30,
      icon: 'Wrench',
      description: 'A yellow steel locker containing emergency dive gear.',
      givesItem: {
        id: 'heavy_wrench',
        name: 'Heavy Steel Pipe Wrench',
        description: 'A heavy 18-inch wrench used to unbolt security hatch clamps.',
        icon: 'Wrench',
        color: '#f97316',
      },
      customVisual: 'locker',
    },
    {
      id: 'sub_hatch',
      name: 'Watertight Emergency Exit Hatch',
      x: 75,
      y: 20,
      width: 20,
      height: 65,
      icon: 'Compass',
      description: 'A heavy circular pressure hatch. Requires Pipe Wrench to remove safety bolt & Hatch Keypad Code.',
      requiredItem: 'heavy_wrench',
      requiredItemFailMsg: 'The hatch wheel is bolted shut! Use the Heavy Steel Pipe Wrench to unbolt the clamp.',
      triggersPuzzle: 'hatch_code',
      unlocksDoor: true,
      customVisual: 'hatch',
    },
  ],
  puzzles: {
    periscope_clue: {
      id: 'periscope_clue',
      type: 'note',
      title: 'Periscope Beacon Inspection',
      description: 'Peering through the periscope optic lens:',
      solution: '',
      data: {
        noteText: `BEACON TRANSMISSION RECEIVED:
Lighthouse Signal Flash Code:
[ 6 ] - [ 3 ] - [ 9 ] - [ 1 ]

TARGET BALLAST PRESSURE RATIO:
Gauge 1: 30 PSI
Gauge 2: 70 PSI
Gauge 3: 40 PSI`,
      },
    },
    valve_puzzle: {
      id: 'valve_puzzle',
      type: 'valves',
      title: 'Ballast Equalizer Valves',
      description: 'Adjust the 3 valve gauges to 30 PSI, 70 PSI, and 40 PSI to release hatch pneumatic locks!',
      solution: [30, 70, 40],
      solvedMessage: 'PNEUMATIC PRESSURE EQUALIZED! Hatch clamps disengaged!',
      hint: 'Set Gauge 1 to 30, Gauge 2 to 70, Gauge 3 to 40.',
    },
    hatch_code: {
      id: 'hatch_code',
      type: 'keypad',
      title: 'Hatch Electronic Access Code',
      description: 'Enter the 4-digit code seen through the periscope (6391).',
      solution: '6391',
      solvedMessage: 'HATCH UNLOCKED! ESCAPE TO THE SURFACE!',
      hint: 'The code spotted via periscope is 6391.',
    },
  },
};
