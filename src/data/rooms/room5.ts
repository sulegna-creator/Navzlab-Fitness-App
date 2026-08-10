import { Room } from '../../types/game';

export const room5: Room = {
  id: 'museum',
  name: 'Museum Artifact Gallery',
  subtitle: 'A high-security museum vault protected by lasers, weight pedestals, and hieroglyphs.',
  theme: 'marble',
  backgroundColor: '#1c1917',
  accentColor: '#eab308',
  description: 'Align the laser reflection mirrors, translate the ancient Egyptian hieroglyph tablet, and retrieve the Master Diamond Key.',
  storyIntro: 'SECURITY ALERT! The laser grid will permanently lock down the museum gallery in 60 seconds. Redirect the laser array and escape with the priceless Diamond Key!',
  exitDoorId: 'vault_exit',
  hotspots: [
    {
      id: 'mirror_array',
      name: 'Laser Mirror Turrets',
      x: 18,
      y: 20,
      width: 28,
      height: 35,
      icon: 'Sparkles',
      description: 'Optical mirrors redirecting a red security laser beam.',
      triggersPuzzle: 'mirror_laser_puzzle',
      customVisual: 'mirrors',
    },
    {
      id: 'hieroglyph_tablet',
      name: 'Egyptian Rosette Tablet',
      x: 52,
      y: 18,
      width: 18,
      height: 28,
      icon: 'Pyramid',
      description: 'An ancient stone tablet with carved Egyptian symbols.',
      triggersPuzzle: 'hieroglyph_clue',
      customVisual: 'tablet',
    },
    {
      id: 'exhibit_pedestal',
      name: 'Glass Diamond Pedestal',
      x: 35,
      y: 55,
      width: 25,
      height: 35,
      icon: 'Gem',
      description: 'A glass display casing protecting the Master Diamond Key.',
      givesItem: {
        id: 'diamond_key',
        name: 'Master Diamond Key',
        description: 'A brilliant multi-faceted key crafted from pure diamond. Fits the high-security gallery exit.',
        icon: 'Gem',
        color: '#67e8f9',
      },
      customVisual: 'pedestal',
    },
    {
      id: 'vault_exit',
      name: 'High-Security Vault Gate',
      x: 75,
      y: 20,
      width: 20,
      height: 65,
      icon: 'ShieldCheck',
      description: 'A reinforced titanium gate with a diamond key receptor and a 4-digit hieroglyph PIN pad.',
      requiredItem: 'diamond_key',
      requiredItemFailMsg: 'Requires the Master Diamond Key from the center display pedestal.',
      triggersPuzzle: 'vault_pin',
      unlocksDoor: true,
      customVisual: 'vaultdoor',
    },
  ],
  puzzles: {
    hieroglyph_clue: {
      id: 'hieroglyph_clue',
      type: 'note',
      title: 'Hieroglyph Translation Key',
      description: 'Decoded Stone Symbols:',
      solution: '',
      data: {
        noteText: `EGYPTIAN NUMERAL TRANSLATION:
𓋹 Ankh = 2
𓁹 Eye of Horus = 5
𓆣 Scarab Beetle = 8
f Sacred Pyramid = 3

VAULT ENTRY CODE PATTERN:
Ankh -> Eye -> Scarab -> Pyramid
(Code: 2 5 8 3)`,
      },
    },
    mirror_laser_puzzle: {
      id: 'mirror_laser_puzzle',
      type: 'note',
      title: 'Laser Mirror Grid Alignment',
      description: 'Mirror System Log:',
      solution: '',
      data: {
        noteText: 'Laser system state: OPTICAL REFLECTORS SYNCHRONIZED.\nThe laser barrier around the Diamond Pedestal is currently DEACTIVATED! Click the Glass Pedestal to grab the Diamond Key.',
      },
    },
    vault_pin: {
      id: 'vault_pin',
      type: 'keypad',
      title: 'Vault Hieroglyph Security Keypad',
      description: 'Enter the 4-digit code translated from the Rosette Tablet (Ankh-Eye-Scarab-Pyramid).',
      solution: '2583',
      solvedMessage: 'VAULT LOCK DISENGAGED! CONGRATULATIONS ON THE ULTIMATE ESCAPE!',
      hint: 'The translated hieroglyph code is 2583.',
    },
  },
};
