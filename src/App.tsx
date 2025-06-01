import React, { useEffect, useState } from 'react';
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
  Alert,
  LoadingOverlay,
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
  CalendarDays,
  AlertCircleIcon,
  LogInIcon,
} from 'lucide-react';

// Types
import type { Trip, Park, Hotel, Restaurant, NavigationItem, PartyMember, NavigationStep } from './types/types';


// Components
import { PlaceholderSection } from './components/PlaceHolder';
import Onboarding from './components/Onboarding';
import Parks from './components/Parks';
import Dining from './components/Dining';
import Hotels from './components/Hotels';
import LightningLane from './components/LightningLane';
import PartyMembers from './components/PartyMembers';
import DailyCalendar from './components/DailyCalendar';
import SettingsPage from './components/SettingsPage';
import AuthComponent from './components/AuthComponent';
import TripSummary from './components/TripSummary';

// Supabase imports
import { useAuth } from './lib/hooks/useAuth';
import { useTrip } from './lib/hooks/useTrip';
import { tripsApi } from './lib/api/trips';
import { partyMembersApi } from './lib/api/PartyMembers';

// Sample data with TypeScript
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

const navigationItems: NavigationItem[] = [
  { id: 'overview', label: 'Trip Overview', icon: Home, color: 'blue' },
  { id: 'calendar', label: 'Daily Calendar', icon: CalendarDays, color: 'violet' },
  { id: 'party', label: 'Party Members', icon: Users, color: 'green' },
  { id: 'parks', label: 'Parks & Attractions', icon: MapPin, color: 'brown' },
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
        <ThemeIcon color={color} variant="light" size={32} radius="sm">
          <Icon size="24px" />
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
}

const TripOverview: React.FC<TripOverviewProps> = ({ trip, partyMembers }) => {
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

        {/* Party Members */}
        <div>
          <Title order={3} mb="md">
            Party Members
          </Title>
          <Grid>
            {partyMembers.map((member) => (
              <Grid.Col span={{ base: 12, sm: 6, md: 4 }} key={member.id}>
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                  <Stack gap="xs">
                    <Group>
                      <Text fw={500}>{member.name}</Text>
                      <Badge variant="light">{member.age} years old</Badge>
                    </Group>
                    <Text size="sm" c="dimmed">
                      {member.ticketType}
                    </Text>
                    {member.dietaryRestrictions !== 'None' && (
                      <Badge size="sm" color="orange">
                        {member.dietaryRestrictions}
                      </Badge>
                    )}
                  </Stack>
                </Card>
              </Grid.Col>
            ))}
          </Grid>
        </div>

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
  const [isOnboardingComplete, setIsOnboardingComplete] = useState<boolean>(false);
  const [trip, setTrip] = useState<Trip | null>(null);
  const [partyMembers, setPartyMembers] = useState<PartyMember[]>([]);
  const [opened, { toggle, close }] = useDisclosure(false);

  const handleOnboardingComplete = (newTrip: Trip, newPartyMembers: PartyMember[]) => {
    setTrip(newTrip);
    setPartyMembers(newPartyMembers);
    setIsOnboardingComplete(true);
  };

  const handleNavigationChange = (step: NavigationStep): void => {
    if (trip) {
      setTrip({ ...trip, currentStep: step });
      close(); // Close mobile menu
    }
  };

  const handlePartyMembersUpdate = (updatedMembers: PartyMember[]) => {
    setPartyMembers(updatedMembers);
    if (trip) {
      setTrip({ ...trip, partySize: updatedMembers.length });
    }
  };

  const renderContent = (): React.ReactNode => {
    if (!trip || !isOnboardingComplete) {
      return null;
    }

    switch (trip.currentStep) {
      case 'overview':
        return <TripOverview trip={trip} partyMembers={partyMembers} />;
      case 'calendar':
        return <DailyCalendar trip={trip} partyMembers={partyMembers} />;
      case 'party':
        return <PartyMembers partyMembers={partyMembers} onUpdatePartyMembers={handlePartyMembersUpdate} />;
      case 'parks':
        return <Parks selectedDate={trip.startDate} />;
      case 'dining':
        return <Dining partySize={trip.partySize} />;
      case 'hotels':
        return <Hotels partySize={trip.partySize} tripDates={{ start: trip.startDate, end: trip.endDate }} />;
      case 'lightning':
        return <LightningLane partySize={trip.partySize} />;
      case 'summary':
        return <TripSummary trip={trip} partyMembers={partyMembers} />;
      case 'settings':
        return <SettingsPage trip={trip} partyMembers={partyMembers} onUpdateTrip={setTrip} />;
      default:
        return <TripOverview trip={trip} partyMembers={partyMembers} />;
    }
  };

  // Show onboarding if not completed
  if (!isOnboardingComplete) {
    {
      console.log('Show onboarding as not complete');
    }
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  {
    console.log('Show main appshell');
  }

  // Show main app after onboarding
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
                {trip?.name}
              </Text>
              <Group gap="lg" visibleFrom="xs">
                <Group gap="xs">
                  <Calendar size="1rem" />
                  <Text size="sm" c="dimmed">
                    {trip?.startDate.toLocaleDateString()} - {trip?.endDate.toLocaleDateString()}
                  </Text>
                </Group>
                <Group gap="xs">
                  <Users size="1rem" />
                  <Text size="sm" c="dimmed">
                    {trip?.partySize} guests
                  </Text>
                </Group>
              </Group>
            </div>
          </Group>

          <Group gap="xl" visibleFrom="md">
            <div style={{ textAlign: 'center' }}>
              <Text size="xl" fw={700} c="blue">
                {trip ? Math.ceil((trip.startDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : 0}
              </Text>
              <Text size="xs" c="dimmed">
                days to go
              </Text>
            </div>
            <div style={{ textAlign: 'center' }}>
              <Text size="xl" fw={700} c="green">
                {trip ? Math.ceil((trip.endDate.getTime() - trip.startDate.getTime()) / (1000 * 60 * 60 * 24)) : 0}
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
              active={trip?.currentStep === item.id}
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

export const SupabaseDisneyTripPlanner: React.FC = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const [currentTripId, setCurrentTripId] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<NavigationStep>('overview');
  const [opened, { toggle, close }] = useDisclosure(false);
  const [error, setError] = useState<string | null>(null);

  const { trip, loading: tripLoading, error: tripError } = useTrip(currentTripId || '');

  // Load user's most recent trip on mount
  useEffect(() => {
    async function loadUserTrip() {
      if (user && !currentTripId) {
        try {
          const trips = await tripsApi.getTrips();
          if (trips && trips.length > 0) {
            setCurrentTripId(trips[0].id);
            setCurrentStep(trips[0].current_step as NavigationStep);
          }
        } catch (err) {
          console.error('Error loading trips:', err);
          setError('Failed to load trips');
        }
      }
    }

    loadUserTrip();
  }, [user, currentTripId]);

  const handleNavigationChange = async (step: NavigationStep) => {
    if (currentTripId) {
      try {
        await tripsApi.updateTrip(currentTripId, { current_step: step });
        setCurrentStep(step);
        close(); // Close mobile menu
      } catch (err) {
        console.error('Error updating trip step:', err);
      }
    }
  };

  const handleTripCreate = async (tripData: any, partyMembersData: any[]) => {
    if (!user) return;

    try {
      // Create trip
      const newTrip = await tripsApi.createTrip({
        user_id: user.id,
        name: tripData.name,
        start_date: tripData.startDate.toISOString().split('T')[0],
        end_date: tripData.endDate.toISOString().split('T')[0],
        party_size: partyMembersData.length,
        current_step: 'overview',
      });

      // Create party members
      const partyMemberPromises = partyMembersData.map((member, index) =>
        partyMembersApi.addPartyMember({
          trip_id: newTrip.id,
          name: member.name,
          age: member.age,
          ticket_type: member.ticketType,
          dietary_restrictions: member.dietaryRestrictions,
          disabilities: member.disabilities,
          sort_order: index,
        }),
      );

      await Promise.all(partyMemberPromises);

      setCurrentTripId(newTrip.id);
      setCurrentStep('overview');
    } catch (err) {
      console.error('Error creating trip:', err);
      setError('Failed to create trip');
    }
  };

  const renderContent = (): React.ReactNode => {
    if (!trip && !tripLoading) {
      return <Onboarding onComplete={handleTripCreate} />;
    }

    if (tripLoading) {
      return <LoadingOverlay visible />;
    }

    if (tripError) {
      return (
        <Container size="md">
          <Alert icon={<AlertCircleIcon size="1rem" />} title="Error" color="red">
            Failed to load trip data. Please try refreshing the page.
          </Alert>
        </Container>
      );
    }

    switch (currentStep) {
      case 'overview':
        return <TripOverview trip={trip} />;
      case 'calendar':
        return <DailyCalendar trip={trip} partyMembers={trip?.party_members || []} />;
      case 'party':
        return (
          <PartyMembers
            partyMembers={trip?.party_members || []}
            onUpdatePartyMembers={async (updatedMembers) => {
              // Update party members in database
              // This would need more detailed implementation
              console.log('Update party members:', updatedMembers);
            }}
          />
        );
      case 'parks':
        return <Parks selectedDate={trip ? new Date(trip.start_date) : new Date()} />;
      case 'dining':
        return <Dining partySize={trip?.party_size || 4} />;
      case 'hotels':
        return (
          <Hotels
            partySize={trip?.party_size || 4}
            tripDates={
              trip
                ? {
                    start: new Date(trip.start_date),
                    end: new Date(trip.end_date),
                  }
                : undefined
            }
          />
        );
      case 'lightning':
        return <LightningLane partySize={trip?.party_size || 4} />;
      case 'summary':
        return (
          <PlaceholderSection
            title="Trip Summary"
            description="Review all your reservations, plans, and important trip details"
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

  // Show loading screen while checking auth
  if (authLoading) {
    return <LoadingOverlay visible />;
  }

  // Show auth component if not logged in
  if (!user) {
    return <AuthComponent />;
  }

  // Show error if there's an app-level error
  if (error) {
    return (
      <Container size="md" style={{ paddingTop: '2rem' }}>
        <Alert icon={<AlertCircleIcon size="1rem" />} title="Error" color="red">
          {error}
        </Alert>
      </Container>
    );
  }

  // Show onboarding if no trip exists
  if (!trip && !tripLoading) {
    return <Onboarding onComplete={handleTripCreate} />;
  }

  // Show main app after authentication and trip loading
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
                {trip?.name || 'Lewis Family Disney Trip'}
              </Text>
              <Group gap="lg" visibleFrom="xs">
                <Group gap="xs">
                  <Calendar size="1rem" />
                  <Text size="sm" c="dimmed">
                    {trip
                      ? `${new Date(trip.start_date).toLocaleDateString()} - ${new Date(
                          trip.end_date,
                        ).toLocaleDateString()}`
                      : ''}
                  </Text>
                </Group>
                <Group gap="xs">
                  <Users size="1rem" />
                  <Text size="sm" c="dimmed">
                    {trip?.party_size || 0} guests
                  </Text>
                </Group>
              </Group>
            </div>
          </Group>

          <Group gap="xl" visibleFrom="md">
            <div style={{ textAlign: 'center' }}>
              <Text size="xl" fw={700} c="blue">
                {trip
                  ? Math.max(
                      0,
                      Math.ceil((new Date(trip.start_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)),
                    )
                  : 0}
              </Text>
              <Text size="xs" c="dimmed">
                days to go
              </Text>
            </div>
            <div style={{ textAlign: 'center' }}>
              <Text size="xl" fw={700} c="green">
                {trip
                  ? Math.ceil(
                      (new Date(trip.end_date).getTime() - new Date(trip.start_date).getTime()) / (1000 * 60 * 60 * 24),
                    )
                  : 0}
              </Text>
              <Text size="xs" c="dimmed">
                days total
              </Text>
            </div>
            <Button variant="subtle" leftSection={<LogInIcon size="1rem" />} onClick={signOut}>
              Sign Out
            </Button>
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
              active={currentStep === item.id}
              onClick={() => handleNavigationChange(item.id)}
            />
          ))}
        </Stack>
      </AppShell.Navbar>

      <AppShell.Main>{renderContent()}</AppShell.Main>
    </AppShell>
  );
};
