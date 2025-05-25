import React, { useState } from 'react';
import {
  AppShell,
  Text,
  UnstyledButton,
  Group,
  ThemeIcon,
  Burger,
  Grid,
  Card,
  Badge,
  Button,
  Stack,
  Title,
  Container,
  Paper,
  Center,
  Image,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  Utensils,
  Hotel as HotelIcon,
  Ticket,
  Zap,
  Star,
  Home,
  Settings,
} from 'lucide-react';

// Types
import type { Trip, Park, Hotel, Restaurant, NavigationItem, PartyMember, NavigationStep } from './types/types';

// Components
import { PlaceholderSection } from './components/PlaceHolder';

// Sample data with TypeScript
const sampleTrip: Trip = {
  id: '1',
  name: 'Lewis Family Disney Trip',
  startDate: new Date('2025-07-16'),
  endDate: new Date('2025-07-30'),
  partySize: 4,
  currentStep: 'overview',
};

const parks: Park[] = [
  {
    id: 'mk',
    name: 'Magic Kingdom',
    icon: '🏰',
    description: 'The most magical place on earth',
    hours: { open: '9:00 AM', close: '10:00 PM' },
    topAttractions: ['Space Mountain', 'Pirates of the Caribbean', 'Haunted Mansion', 'Big Thunder Mountain'],
    shows: ['Happily Ever After', 'Festival of Fantasy Parade'],
  },
  {
    id: 'epcot',
    name: 'EPCOT',
    icon: '🌍',
    description: 'Future World and World Showcase',
    hours: { open: '9:00 AM', close: '9:00 PM' },
    topAttractions: ['Guardians of the Galaxy', 'Test Track', "Soarin'", 'Frozen Ever After'],
    shows: ['EPCOT Forever', 'Voices of Liberty'],
  },
  {
    id: 'hs',
    name: 'Hollywood Studios',
    icon: '🎬',
    description: 'Movies, TV, music and theater',
    hours: { open: '9:00 AM', close: '8:00 PM' },
    topAttractions: ['Rise of the Resistance', 'Millennium Falcon', 'Tower of Terror', "Rock 'n' Roller Coaster"],
    shows: ['Fantasmic!', 'Indiana Jones Stunt Spectacular'],
  },
  {
    id: 'ak',
    name: 'Animal Kingdom',
    icon: '🦁',
    description: 'Adventure, thrills and the magic of nature',
    hours: { open: '8:00 AM', close: '7:00 PM' },
    topAttractions: ['Avatar Flight of Passage', 'Expedition Everest', 'Kilimanjaro Safaris', "Na'vi River Journey"],
    shows: ['Rivers of Light', 'Festival of the Lion King'],
  },
];

const hotels: Hotel[] = [
  {
    id: 'gf',
    name: 'Grand Floridian Resort & Spa',
    tier: 'Deluxe Villa',
    price: '$800/night',
    transportation: 'Monorail to Magic Kingdom',
    amenities: ['Spa', 'Fine Dining', 'Beach', 'Monorail Access'],
  },
  {
    id: 'poly',
    name: 'Polynesian Village Resort',
    tier: 'Deluxe',
    price: '$650/night',
    transportation: 'Monorail to Magic Kingdom',
    amenities: ['Beach', 'Luau', 'Monorail Access', 'Dole Whips'],
  },
  {
    id: 'cont',
    name: 'Contemporary Resort',
    tier: 'Deluxe',
    price: '$600/night',
    transportation: 'Walking to Magic Kingdom',
    amenities: ['Walking Distance', "Chef Mickey's", 'Top of the World Lounge'],
  },
  {
    id: 'akl',
    name: 'Animal Kingdom Lodge',
    tier: 'Deluxe',
    price: '$500/night',
    transportation: 'Bus to all parks',
    amenities: ['Animal Views', 'African Cuisine', 'Cultural Activities'],
  },
  {
    id: 'pofq',
    name: 'Port Orleans French Quarter',
    tier: 'Moderate',
    price: '$300/night',
    transportation: 'Boat to Disney Springs',
    amenities: ['Boat Transport', 'Beignets', 'Pool', 'Compact Size'],
  },
  {
    id: 'cb',
    name: 'Caribbean Beach Resort',
    tier: 'Moderate',
    price: '$280/night',
    transportation: 'Skyliner to EPCOT/Hollywood Studios',
    amenities: ['Skyliner Access', 'Beach Pool', 'Pirate Ship Pool'],
  },
];

const restaurants: Restaurant[] = [
  {
    id: 'bog',
    name: 'Be Our Guest',
    type: 'Table Service',
    cuisine: 'French',
    park: 'Magic Kingdom',
    price: '$$$$',
    rating: 4.5,
  },
  {
    id: 'ohana',
    name: 'Ohana',
    type: 'Table Service',
    cuisine: 'Polynesian',
    park: 'Polynesian Resort',
    price: '$$$',
    rating: 4.7,
  },
  {
    id: 'chef',
    name: "Chef Mickey's",
    type: 'Character Dining',
    cuisine: 'American',
    park: 'Contemporary Resort',
    price: '$$$',
    rating: 4.3,
  },
  {
    id: 'space220',
    name: 'Space 220',
    type: 'Table Service',
    cuisine: 'Contemporary',
    park: 'EPCOT',
    price: '$$$$',
    rating: 4.6,
  },
  {
    id: 'dole',
    name: 'Dole Whip Stand',
    type: 'Quick Service',
    cuisine: 'Snacks',
    park: 'Magic Kingdom',
    price: '$',
    rating: 4.8,
  },
  {
    id: 'flame',
    name: 'Flame Tree Barbecue',
    type: 'Quick Service',
    cuisine: 'BBQ',
    park: 'Animal Kingdom',
    price: '$$',
    rating: 4.4,
  },
];

const navigationItems: NavigationItem[] = [
  { id: 'overview', label: 'Trip Overview', icon: Home, color: 'blue' },
  { id: 'party', label: 'Party Members', icon: Users, color: 'green' },
  { id: 'parks', label: 'Parks & Attractions', icon: MapPin, color: 'green' },
  { id: 'dining', label: 'Dining', icon: Utensils, color: 'orange' },
  { id: 'hotels', label: 'Hotels', icon: HotelIcon, color: 'purple' },
  { id: 'lightning', label: 'Lightning Lane', icon: Zap, color: 'yellow' },
  { id: 'summary', label: 'Trip Summary', icon: Star, color: 'pink' },
  { id: 'settings', label: 'Settings', icon: Settings, color: 'gray' },
];

// Navigation Link Component
interface NavLinkProps {
  icon: React.ElementType;
  color: string;
  label: string;
  active?: boolean;
  onClick(): void;
}

const NavLink: React.FC<NavLinkProps> = ({ icon: Icon, color, label, active, onClick }) => {
  return (
    <UnstyledButton
      onClick={onClick}
      p="xs"
      style={{
        display: 'block',
        width: '100%',
        borderRadius: '8px',
        backgroundColor: active ? 'var(--mantine-color-dark-6)' : 'transparent',
        color: active ? `var(--mantine-color-${color}-4)` : 'var(--mantine-color-dark-0)',
        transition: 'background-color 0.2s ease',
      }}
      onMouseEnter={(e) => {
        if (!active) {
          e.currentTarget.style.backgroundColor = 'var(--mantine-color-dark-6)';
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          e.currentTarget.style.backgroundColor = 'transparent';
        }
      }}
    >
      <Group>
        <ThemeIcon color={color} variant="light">
          <Icon size="1rem" />
        </ThemeIcon>
        <Text size="sm">{label}</Text>
      </Group>
    </UnstyledButton>
  );
};

// Trip Overview Component
interface TripOverviewProps {
  trip: Trip;
  partyMembers: PartyMember[];
  selectedParks: string[];
  selectedHotel: string | null;
}

const TripOverview: React.FC<TripOverviewProps> = ({ trip }) => {
  const daysUntilTrip = Math.ceil((trip.startDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  const tripLength = Math.ceil((trip.endDate.getTime() - trip.startDate.getTime()) / (1000 * 60 * 60 * 24));

  const statCards = [
    {
      title: 'Trip Dates',
      value: `${trip.startDate.toLocaleDateString()} - ${trip.endDate.toLocaleDateString()}`,
      icon: Calendar,
      color: 'blue',
    },
    {
      title: 'Party Size',
      value: `${trip.partySize} guests`,
      icon: Users,
      color: 'green',
    },
    {
      title: 'Park Days',
      value: `${tripLength} days`,
      icon: Ticket,
      color: 'purple',
    },

    {
      title: 'Reservations',
      value: '3 dining',
      icon: Star,
      color: 'orange',
    },
  ];

  return (
    <Container size="xl">
      <Stack gap="xl">
        {/* Quick Stats */}
        <div>
          <Title order={2} mb="md">
            Trip Overview
          </Title>
          <Grid>
            {statCards.map((stat, index) => (
              <Grid.Col span={{ base: 12, sm: 6, md: 3 }} key={index}>
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                  <Group justify="apart" mb="xs">
                    <ThemeIcon color={stat.color} size="lg" radius="md">
                      <stat.icon size="1.2rem" />
                    </ThemeIcon>
                    <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                      {stat.title}
                    </Text>
                  </Group>
                  <Text fw={500} size="sm">
                    {stat.value}
                  </Text>
                </Card>
              </Grid.Col>
            ))}
          </Grid>
        </div>

        {/* Countdown */}
        <Paper shadow="sm" p="xl" radius="md" withBorder>
          <Center>
            <Stack align="center" gap="xs">
              <Title order={1} c="blue">
                {daysUntilTrip}
              </Title>
              <Text size="lg" c="dimmed">
                days until your magical vacation!
              </Text>
            </Stack>
          </Center>
        </Paper>

        {/* Parks Overview */}
        <div>
          <Title order={3} mb="md">
            Walt Disney World Parks
          </Title>
          <Grid>
            {parks.map((park) => (
              <Grid.Col span={{ base: 12, sm: 6 }} key={park.id}>
                <Card
                  shadow="sm"
                  padding="lg"
                  radius="md"
                  withBorder
                  style={{
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                    ':hover': { transform: 'translateY(-2px)' },
                  }}
                  onClick={() => {}}
                >
                  <Group justify="apart" mb="xs">
                    <Group>
                      <Text size="xl">{park.icon}</Text>
                      <div>
                        <Text fw={500}>{park.name}</Text>
                        <Text size="xs" c="dimmed">
                          Click to plan your day
                        </Text>
                      </div>
                    </Group>
                    <Badge color="blue" variant="light" leftSection={<Clock size="0.8rem" />}>
                      {park.hours?.open} - {park.hours?.close}
                    </Badge>
                  </Group>
                </Card>
              </Grid.Col>
            ))}
          </Grid>
        </div>

        {/* Quick Actions */}
        <div>
          <Title order={3} mb="md">
            Quick Actions
          </Title>
          <Grid>
            <Grid.Col span={{ base: 12, sm: 4 }}>
              <Button fullWidth leftSection={<Utensils size="1rem" />} color="blue" size="md" onClick={() => {}}>
                Make Dining Reservation
              </Button>
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 4 }}>
              <Button fullWidth leftSection={<Zap size="1rem" />} color="grape" size="md" onClick={() => {}}>
                Plan Lightning Lane
              </Button>
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 4 }}>
              <Button fullWidth leftSection={<MapPin size="1rem" />} color="green" size="md" onClick={() => {}}>
                View Park Maps
              </Button>
            </Grid.Col>
          </Grid>
        </div>
      </Stack>
    </Container>
  );
};

// Main App Component
const DisneyTripPlanner: React.FC = () => {
  const [trip, setTrip] = useState<Trip>(sampleTrip);
  const [opened, { toggle, close }] = useDisclosure(false);

  const handleNavigationChange = (step: NavigationStep): void => {
    setTrip({ ...trip, currentStep: step });
    close(); // Close mobile menu
  };

  const renderContent = (): React.ReactNode => {
    switch (trip.currentStep) {
      case 'overview':
        return <TripOverview trip={trip} />;
      case 'party':
        return <PlaceholderSection title="Party" description="Setup who will be joining you for your trip" />;
      case 'parks':
        return (
          <PlaceholderSection
            title="Parks & Attractions"
            description="Plan your daily park itineraries and track real-time wait times"
          />
        );
      case 'dining':
        return (
          <PlaceholderSection
            title="Dining Reservations"
            description="Browse restaurants and manage your dining reservations"
          />
        );
      case 'hotels':
        return <PlaceholderSection title="Resort Hotels" description="Compare and book Disney resort accommodations" />;
      case 'lightning':
        return (
          <PlaceholderSection
            title="Lightning Lane Strategy"
            description="Optimize your Lightning Lane selections for minimal wait times"
          />
        );
      case 'settings':
        return (
          <PlaceholderSection title="Trip Settings" description="Manage your trip preferences and party details" />
        );
      default:
        return <TripOverview trip={trip} />;
    }
  };

  return (
    <AppShell
      header={{ height: 70 }}
      navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
            <div>
              <Text size="xl" fw={600}>
                {trip.name}
              </Text>
              <Group gap="lg" visibleFrom="xs">
                <Group gap="xs">
                  <Calendar size="1rem" />
                  <Text size="sm" c="dimmed">
                    {trip.startDate.toLocaleDateString()} - {trip.endDate.toLocaleDateString()}
                  </Text>
                </Group>
                <Group gap="xs">
                  <Users size="1rem" />
                  <Text size="sm" c="dimmed">
                    {trip.partySize} guests
                  </Text>
                </Group>
              </Group>
            </div>
          </Group>

          <Group gap="xl" visibleFrom="md">
            <div style={{ textAlign: 'center' }}>
              <Text size="xl" fw={700} c="blue">
                {Math.ceil((trip.startDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}
              </Text>
              <Text size="xs" c="dimmed">
                days to go
              </Text>
            </div>
            <div style={{ textAlign: 'center' }}>
              <Text size="xl" fw={700} c="green">
                {Math.ceil((trip.endDate.getTime() - trip.startDate.getTime()) / (1000 * 60 * 60 * 24))}
              </Text>
              <Text size="xs" c="dimmed">
                days total
              </Text>
            </div>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <Group mb="md">
          <Text size="lg" fw={500} c="blue">
            Disney Planner
          </Text>
        </Group>
        <Stack gap="xs">
          {navigationItems.map((item) => (
            <NavLink
              key={item.id}
              {...item}
              active={trip.currentStep === item.id}
              onClick={() => handleNavigationChange(item.id)}
            />
          ))}
        </Stack>
      </AppShell.Navbar>

      <AppShell.Main>{renderContent()}</AppShell.Main>
    </AppShell>
  );
};

export default DisneyTripPlanner;
