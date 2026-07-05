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
  current: number;
  required: number;
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
  { id: 'tp', roomId: 'primary-bathroom', name: 'Toilet paper', current: 4, required: 6, storage: 'Under sink basket' },
  { id: 'towels', roomId: 'primary-bathroom', name: 'Bath towels', current: 4, required: 4, storage: 'Upper linen shelf' },
  { id: 'soap', roomId: 'primary-bathroom', name: 'Hand soap', current: 1, required: 1, storage: 'Vanity drawer' },
  { id: 'shampoo', roomId: 'primary-bathroom', name: 'Shampoo', current: 1, required: 1, storage: 'Shower ledge' },
  { id: 'pillows', roomId: 'primary-bedroom', name: 'Pillows', current: 2, required: 2, storage: 'On bed' },
  { id: 'sheets', roomId: 'primary-bedroom', name: 'Sheet sets', current: 2, required: 2, storage: 'Closet top shelf' },
  { id: 'coffee-pods', roomId: 'kitchen', name: 'Coffee pods', current: 8, required: 8, storage: 'Pantry left bin' },
  { id: 'paper-towels', roomId: 'kitchen', name: 'Paper towels', current: 2, required: 2, storage: 'Pantry center shelf' },
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

export const propertyInstructions = [
  'Use the laundry closet top shelf for extra towels and paper goods.',
  'Upload final photos for the kitchen, primary bathroom, and primary bedroom.',
  'Text or call the owner only for urgent lock, water, or guest-readiness issues.',
];

export const issuePreview = [
  { id: 'lamp', label: 'Lamp switch broken', room: 'Living Room' },
  { id: 'fan', label: 'Exhaust fan slow', room: 'Primary Bathroom' },
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
