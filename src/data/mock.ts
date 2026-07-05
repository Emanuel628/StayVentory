import { Bath, BedDouble, Home, LampDesk, LucideIcon, Refrigerator, Sofa, WashingMachine } from 'lucide-react-native';

import { StatusKey } from '@/src/theme/theme';

export type HouseItem = {
  id: string;
  name: string;
  meta: string;
  address: string;
  status: StatusKey;
  icon: LucideIcon;
};

export type RoomItem = {
  id: string;
  houseId: string;
  name: string;
  meta: string;
  status: StatusKey;
  icon: LucideIcon;
  current: number;
  required: number;
};

export type InventoryRow = {
  id: string;
  roomId: string;
  name: string;
  description?: string;
  current: number;
  minRequired: number;
  maxPar: number;
  storage: string;
};

export type CleanerAccessItem = {
  id: string;
  name: string;
  email: string;
  username: string;
  code: string;
  properties: string[];
};

export type RoomInstruction = {
  id: string;
  roomId: string;
  text: string;
};

export type RoomIssue = {
  id: string;
  roomId: string;
  label: string;
};

export const houses: HouseItem[] = [
  {
    id: 'linden-house',
    name: 'The Linden House',
    meta: '4 rooms | 2 issues open',
    address: '1132 Linden Ave, Tampa, FL',
    status: 'attention',
    icon: Home,
  },
  {
    id: 'cedar-retreat',
    name: 'Cedar Retreat',
    meta: '5 rooms | guest-ready',
    address: '87 Cedar Point Rd, Orlando, FL',
    status: 'ready',
    icon: Home,
  },
];

export const rooms: RoomItem[] = [
  {
    id: 'primary-bathroom',
    houseId: 'linden-house',
    name: 'Primary Bathroom',
    meta: '9 tracked items',
    status: 'lowStock',
    icon: Bath,
    current: 4,
    required: 6,
  },
  {
    id: 'primary-bedroom',
    houseId: 'linden-house',
    name: 'Primary Bedroom',
    meta: '7 tracked items',
    status: 'ready',
    icon: BedDouble,
    current: 2,
    required: 2,
  },
  {
    id: 'living-room',
    houseId: 'linden-house',
    name: 'Living Room',
    meta: '6 tracked items',
    status: 'attention',
    icon: LampDesk,
    current: 1,
    required: 2,
  },
  {
    id: 'kitchen',
    houseId: 'cedar-retreat',
    name: 'Kitchen',
    meta: '10 tracked items',
    status: 'ready',
    icon: Refrigerator,
    current: 5,
    required: 5,
  },
  {
    id: 'guest-lounge',
    houseId: 'cedar-retreat',
    name: 'Guest Lounge',
    meta: '5 tracked items',
    status: 'needsCleaning',
    icon: Sofa,
    current: 3,
    required: 4,
  },
  {
    id: 'laundry-room',
    houseId: 'cedar-retreat',
    name: 'Laundry Room',
    meta: '4 tracked items',
    status: 'lowStock',
    icon: WashingMachine,
    current: 1,
    required: 3,
  },
];

export const inventoryByRoom: InventoryRow[] = [
  {
    id: 'tp',
    roomId: 'primary-bathroom',
    name: 'Toilet paper',
    description: 'Guest-facing backup rolls stored below the sink.',
    current: 4,
    minRequired: 6,
    maxPar: 10,
    storage: 'Under sink basket',
  },
  {
    id: 'towels',
    roomId: 'primary-bathroom',
    name: 'Bath towels',
    description: 'Folded and stacked on the top linen shelf.',
    current: 4,
    minRequired: 4,
    maxPar: 8,
    storage: 'Upper linen shelf',
  },
  {
    id: 'soap',
    roomId: 'primary-bathroom',
    name: 'Hand soap',
    current: 1,
    minRequired: 1,
    maxPar: 2,
    storage: 'Vanity drawer',
  },
  {
    id: 'shampoo',
    roomId: 'primary-bathroom',
    name: 'Shampoo',
    description: 'One full-size bottle for guest shower use.',
    current: 1,
    minRequired: 1,
    maxPar: 2,
    storage: 'Shower ledge',
  },
  {
    id: 'pillows',
    roomId: 'primary-bedroom',
    name: 'Pillows',
    current: 2,
    minRequired: 2,
    maxPar: 4,
    storage: 'On bed',
  },
  {
    id: 'sheets',
    roomId: 'primary-bedroom',
    name: 'Sheet sets',
    description: 'Fresh backup set for same-day turnovers.',
    current: 2,
    minRequired: 2,
    maxPar: 3,
    storage: 'Closet top shelf',
  },
  {
    id: 'coffee-pods',
    roomId: 'kitchen',
    name: 'Coffee pods',
    description: 'Mixed medium roast guest supply.',
    current: 8,
    minRequired: 8,
    maxPar: 16,
    storage: 'Pantry left bin',
  },
  {
    id: 'paper-towels',
    roomId: 'kitchen',
    name: 'Paper towels',
    current: 2,
    minRequired: 2,
    maxPar: 4,
    storage: 'Pantry center shelf',
  },
];

export const cleanerAccess: CleanerAccessItem[] = [
  {
    id: 'maya-brooks',
    name: 'Maya Brooks',
    email: 'maya@example.com',
    username: '@mayacleans',
    code: 'LINDEN-4821',
    properties: ['The Linden House'],
  },
  {
    id: 'jordan-lee',
    name: 'Jordan Lee',
    email: 'jordan@example.com',
    username: '@jordan-turnover',
    code: 'CEDAR-9304',
    properties: ['Cedar Retreat', 'The Linden House'],
  },
];

export const roomInstructions: RoomInstruction[] = [
  { id: 'bath-1', roomId: 'primary-bathroom', text: 'Restock guest towels on the upper linen shelf.' },
  { id: 'bath-2', roomId: 'primary-bathroom', text: 'Upload a final photo of the vanity and shower area.' },
  { id: 'bed-1', roomId: 'primary-bedroom', text: 'Make the bed with the backup sheet set if the current set is stained.' },
  { id: 'bed-2', roomId: 'primary-bedroom', text: 'Check both bedside drawers for leftover guest items.' },
  { id: 'living-1', roomId: 'living-room', text: 'Straighten sofa pillows and verify the remote is visible.' },
  { id: 'kitchen-1', roomId: 'kitchen', text: 'Restock coffee pods and wipe appliance fronts.' },
];

export const roomIssues: RoomIssue[] = [
  { id: 'lamp', roomId: 'living-room', label: 'Lamp switch broken' },
  { id: 'fan', roomId: 'primary-bathroom', label: 'Exhaust fan slow' },
  { id: 'soap', roomId: 'primary-bathroom', label: 'Soap dispenser pump sticking' },
];

export const ownerContact = {
  name: 'Emanuel Castro',
  phone: '(813) 555-0142',
  email: 'owner@stayventory.co',
};

export const getHouseById = (id: string) => houses.find((house) => house.id === id) ?? houses[0];
export const getRoomsByHouseId = (houseId: string) => rooms.filter((room) => room.houseId === houseId);
export const getRoomById = (id: string) => rooms.find((room) => room.id === id) ?? rooms[0];
export const getInventoryByRoomId = (roomId: string) => inventoryByRoom.filter((row) => row.roomId === roomId);
export const getInstructionsByRoomId = (roomId: string) => roomInstructions.filter((item) => item.roomId === roomId);
export const getIssuesByRoomId = (roomId: string) => roomIssues.filter((item) => item.roomId === roomId);
