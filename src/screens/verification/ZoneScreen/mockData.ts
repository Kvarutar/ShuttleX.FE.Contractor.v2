import { Zone } from './props';

export const zoneData: Zone[] = [
  {
    id: '1',
    name: 'Ukraine',
    next: [
      {
        id: '1',
        name: 'Kyiv Region',
        next: [
          { id: '1', name: 'Kyiv', next: [] },
          { id: '2', name: 'Bila Tserkva', next: [] },
        ],
      },
      {
        id: '2',
        name: 'Lviv Region',
        next: [
          { id: '1', name: 'Lviv', next: [] },
          { id: '2', name: 'Drohobych', next: [] },
        ],
      },
      {
        id: '3',
        name: 'Odessa Region',
        next: [
          { id: '1', name: 'Odessa', next: [] },
          { id: '2', name: 'Izmail', next: [] },
        ],
      },
      {
        id: '4',
        name: 'Kharkiv Region',
        next: [
          { id: '1', name: 'Kharkiv', next: [] },
          { id: '2', name: 'Izium', next: [] },
        ],
      },
      {
        id: '5',
        name: 'Poltava Region',
        next: [
          { id: '1', name: 'Poltava', next: [] },
          { id: '2', name: 'Kremenchuk', next: [] },
        ],
      },
    ],
  },
];
