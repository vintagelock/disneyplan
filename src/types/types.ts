export type NavigationStep =
  | 'overview'
  | 'party'
  | 'parks'
  | 'dining'
  | 'hotels'
  | 'lightning'
  | 'summary'
  | 'settings';

// TypeScript interfaces
export interface Trip {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  partySize: number;
  currentStep: NavigationStep;
}

export interface PartyMember {
  id: string;
  name: string;
  age: number;
  ticketType: string;
  dietaryRestrictions: string;
  disabilities: boolean;
}

export interface Park {
  id: string;
  name: string;
  icon: string;
  description: string;
  hours?: {
    open: string;
    close: string;
  };
  waitTimes?: Array<{
    attraction: string;
    waitTime: number;
  }>;
  topAttractions: string[];
  shows: string[];
}

export interface Restaurant {
  id: string;
  name: string;
  type: string;
  cuisine: string;
  park: string;
  price: string;
  rating: number;
}

export interface Hotel {
  id: string;
  name: string;
  tier: string;
  price: string;
  transportation: string;
  amenities: string[];
}

export interface NavigationItem {
  id: NavigationStep;
  label: string;
  icon: React.ElementType;
  color: string;
}

export interface OnboardingProps {
  onComplete: (trip: Trip, partyMembers: PartyMember[]) => void;
}

export interface OnboardingData {
  tripName: string;
  startDate: Date | null;
  endDate: Date | null;
  partyMembers: Omit<PartyMember, 'id'>[];
}

export const ticketTypes = ['Base Ticket', 'Park Hopper', 'Park Hopper Plus', 'Annual Pass', 'Florida Resident'];

export const dietaryOptions = [
  'None',
  'Vegetarian',
  'Vegan',
  'Gluten-Free',
  'Dairy-Free',
  'Nut Allergy',
  'Shellfish Allergy',
  'Other',
];

export interface Attraction {
  id: string;
  name: string;
  waitTime: number;
  type: 'thrill' | 'family' | 'show' | 'character';
  height?: string;
  lightning: boolean;
  description: string;
  tips: string[];
}

export interface Show {
  id: string;
  name: string;
  times: string[];
  duration: string;
  description: string;
  recommendedArrival: string;
}

export interface ParksProps {
  selectedDate?: Date;
}
