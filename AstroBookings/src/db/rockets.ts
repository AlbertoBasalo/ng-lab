import { RocketDto } from '@models/rocket.dto';

export const ROCKETS_DB: RocketDto[] = [
  {
    id: 'rkt_1',
    agencyId: 'usr_a1',
    name: 'Falcon Heavy',
    capacity: 100,
    range: 'mars',
  },
  {
    id: 'rkt_2',
    agencyId: 'usr_a2',
    name: 'SpaceShipTwo',
    capacity: 6,
    range: 'low_earth',
  },
  {
    id: 'rkt_3',
    agencyId: 'usr_a1',
    name: 'Starship',
    capacity: 100,
    range: 'mars',
  },
  {
    id: 'rkt_4',
    agencyId: 'usr_a3',
    name: 'Luxe Voyager',
    capacity: 8,
    range: 'moon',
  },
  {
    id: 'rkt_5',
    agencyId: 'usr_a3',
    name: 'Stellar Suite',
    capacity: 4,
    range: 'low_earth',
  },
  {
    id: 'rkt_6',
    agencyId: 'usr_a4',
    name: 'EconoRocket',
    capacity: 20,
    range: 'low_earth',
  },
  {
    id: 'rkt_7',
    agencyId: 'usr_a4',
    name: 'BudgetExplorer',
    capacity: 15,
    range: 'moon',
  },
];
