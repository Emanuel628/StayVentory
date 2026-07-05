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

export type RoomOption = {
  id: string;
  label: string;
  icon: LucideIcon;
};

export const roomOptions: RoomOption[] = [
  { id: 'bedroom', label: 'Bedroom', icon: BedDouble },
  { id: 'bathroom', label: 'Bathroom', icon: Bath },
  { id: 'kitchen', label: 'Kitchen', icon: ChefHat },
  { id: 'living-room', label: 'Living Room', icon: Sofa },
  { id: 'dining-room', label: 'Dining Room', icon: Wine },
  { id: 'laundry-room', label: 'Laundry Room', icon: WashingMachine },
  { id: 'mudroom', label: 'Mudroom', icon: DoorOpen },
  { id: 'closet', label: 'Closet', icon: Shirt },
  { id: 'office', label: 'Office', icon: Library },
  { id: 'media-room', label: 'Media Room', icon: Tv },
  { id: 'garage', label: 'Garage', icon: CarFront },
  { id: 'attic', label: 'Attic', icon: Warehouse },
  { id: 'basement', label: 'Basement', icon: SquareDashedBottomCode },
  { id: 'deck', label: 'Deck', icon: Trees },
  { id: 'enclosed-porch', label: 'Enclosed Porch', icon: House },
  { id: 'patio', label: 'Patio', icon: Armchair },
  { id: 'pantry', label: 'Pantry', icon: Refrigerator },
  { id: 'storage-room', label: 'Storage Room', icon: PackageOpen },
  { id: 'den', label: 'Den', icon: LampDesk },
  { id: 'gym', label: 'Home Gym', icon: Dumbbell },
];
