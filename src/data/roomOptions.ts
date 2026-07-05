import {
  Armchair,
  Bath,
  BedDouble,
  CarFront,
  ChefHat,
  DoorOpen,
  Dumbbell,
  House,
  LampDesk,
  Library,
  PackageOpen,
  Refrigerator,
  Shirt,
  Sofa,
  SquareDashedBottomCode,
  Trees,
  Tv,
  Warehouse,
  WashingMachine,
  Wine,
  LucideIcon,
} from 'lucide-react-native';

import { colors } from '@/src/theme/theme';

export type RoomOption = {
  id: string;
  label: string;
  icon: LucideIcon;
  tileColor: string;
  iconColor: string;
};

export const roomOptions: RoomOption[] = [
  { id: 'bedroom', label: 'Bedroom', icon: BedDouble, tileColor: colors.teal, iconColor: colors.tealOnDark },
  { id: 'bathroom', label: 'Bathroom', icon: Bath, tileColor: colors.ochre, iconColor: colors.ochreOnDark },
  { id: 'kitchen', label: 'Kitchen', icon: ChefHat, tileColor: colors.rust, iconColor: colors.rustOnDark },
  { id: 'living-room', label: 'Living Room', icon: Sofa, tileColor: '#6C7A5A', iconColor: '#EEF2E7' },
  { id: 'dining-room', label: 'Dining Room', icon: Wine, tileColor: '#8B5E3C', iconColor: '#F6E8DC' },
  { id: 'laundry-room', label: 'Laundry Room', icon: WashingMachine, tileColor: '#4E6A74', iconColor: '#E3EEF2' },
  { id: 'mudroom', label: 'Mudroom', icon: DoorOpen, tileColor: '#7D6A91', iconColor: '#EEE8F4' },
  { id: 'closet', label: 'Closet', icon: Shirt, tileColor: '#A05D5D', iconColor: '#F7E7E7' },
  { id: 'office', label: 'Office', icon: Library, tileColor: colors.teal, iconColor: colors.tealOnDark },
  { id: 'media-room', label: 'Media Room', icon: Tv, tileColor: colors.ochre, iconColor: colors.ochreOnDark },
  { id: 'garage', label: 'Garage', icon: CarFront, tileColor: colors.rust, iconColor: colors.rustOnDark },
  { id: 'attic', label: 'Attic', icon: Warehouse, tileColor: '#6C7A5A', iconColor: '#EEF2E7' },
  { id: 'basement', label: 'Basement', icon: SquareDashedBottomCode, tileColor: '#8B5E3C', iconColor: '#F6E8DC' },
  { id: 'deck', label: 'Deck', icon: Trees, tileColor: '#4E6A74', iconColor: '#E3EEF2' },
  { id: 'enclosed-porch', label: 'Enclosed Porch', icon: House, tileColor: '#7D6A91', iconColor: '#EEE8F4' },
  { id: 'patio', label: 'Patio', icon: Armchair, tileColor: '#A05D5D', iconColor: '#F7E7E7' },
  { id: 'pantry', label: 'Pantry', icon: Refrigerator, tileColor: colors.teal, iconColor: colors.tealOnDark },
  { id: 'storage-room', label: 'Storage Room', icon: PackageOpen, tileColor: colors.ochre, iconColor: colors.ochreOnDark },
  { id: 'den', label: 'Den', icon: LampDesk, tileColor: colors.rust, iconColor: colors.rustOnDark },
  { id: 'gym', label: 'Home Gym', icon: Dumbbell, tileColor: '#6C7A5A', iconColor: '#EEF2E7' },
];
