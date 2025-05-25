import React, { useState } from 'react';
import {
  MantineProvider,
  AppShell,
  Text,
  UnstyledButton,
  Group,
  ThemeIcon,
  Box,
  Burger,
  Grid,
  Card,
  Badge,
  Button,
  Stack,
  Title,
  Space,
  Container,
  Paper,
  Center,
  rem
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  Utensils, 
  Hotel, 
  Ticket, 
  Zap, 
  Star,
  Home,
  Settings
} from 'lucide-react';

// TypeScript interfaces
interface Trip {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  partySize: number;
  currentStep: NavigationStep;
}

interface Park {
  id: string;
  name: string;
  icon: string;
  hours?: {
    open: string;
    close: string;
  };
  waitTimes?: Array<{
    attraction: string;
    waitTime: number;
  }>;
}

interface NavigationItem {
  id: NavigationStep;
  label: string;
  icon: React.ElementType;
  color: string;
}

type NavigationStep = 'overview' | 'parks' | 'dining' | 'hotels' | 'lightning' | 'settings';

// Sample data with TypeScript
const sampleTrip: Trip = {
  id: '1',
  name: 'Lewis Family Disney Trip',
  startDate: new Date('2025-07-16'),
  endDate: new Date('2025-08-01'),
  partySize: 4,
  currentStep: 'overview'
};

const parks: Park[] = [
  { 
    id: 'mk', 
    name: 'Magic Kingdom', 
    icon: '🏰',
    hours: { open: '9:00 AM', close: '10:00 PM' }
  },
  { 
    id: 'epcot', 
    name: 'EPCOT', 
    icon: '🌍',
    hours: { open: '9:00 AM', close: '9:00 PM' }
  },
  { 
    id: 'hs', 
    name: 'Hollywood Studios', 
    icon: '🎬',
    hours: { open: '9:00 AM', close: '8:00 PM' }
  },
  { 
    id: 'ak', 
    name: 'Animal Kingdom', 
    icon: '🦁',
    hours: { open: '8:00 AM', close: '7:00 PM' }
  }
];

const navigationItems: NavigationItem[] = [
  { id: 'overview', label: 'Trip Overview', icon: Home, color: 'blue' },
  { id: 'parks', label: 'Parks & Attractions', icon: MapPin, color: 'green' },
  { id: 'dining', label: 'Dining', icon: Utensils, color: 'orange' },
  { id: 'hotels', label: 'Hotels', icon: Hotel, color: 'purple' },
  { id: 'lightning', label: 'Lightning Lane', icon: Zap, color: 'yellow' },
  { id: 'settings', label: 'Settings', icon: Settings, color: 'gray' }
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
      sx={(theme) => ({
        display: 'block',
        width: '100%',
        padding: theme.spacing.xs,
        borderRadius: theme.radius.sm,
        color: active ? theme.colors[color][4] : theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,
        backgroundColor: active 
          ? theme.colorScheme === 'dark' 
            ? theme.colors.dark[6] 
            : theme.colors.gray[0]
          : 'transparent',

        '&:hover': {
          backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
        },
      })}
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
}

const TripOverview: React.FC<TripOverviewProps> = ({ trip }) => {
  const daysUntilTrip = Math.ceil((trip.startDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  const tripLength = Math.ceil((trip.endDate.getTime() - trip.startDate.getTime()) / (1000 * 60 * 60 * 24));

  const statCards = [
    {
      title: 'Trip Dates',
      value: `${trip.startDate.toLocaleDateString()} - ${trip.endDate.toLocaleDateString()}`,
      icon: Calendar,
      color: 'blue'
    },
    {
      title: 'Party Size',
      value: `${trip.partySize} guests`,
      icon: Users,
      color: 'green'
    },
    {
      title: 'Park Days',
      value: `${tripLength} days`,
      icon: Ticket,
      color: 'purple'
    },
    {
      title: 'Reservations',
      value: '3 dining',
      icon: Star,
      color: 'orange'
    }
  ];

  return (
    <Container size="xl">
      <Stack spacing="xl">
        {/* Quick Stats */}
        <div>
          <Title order={2} mb="md">Trip Overview</Title>
          <Grid>
            {statCards.map((stat, index) => (
              <Grid.Col span={12} sm={6} md={3} key={index}>
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
          <Title order={3} mb="md">Walt Disney World Parks</Title>
          <Grid>
            {parks.map((park) => (
              <Grid.Col span={{ base: 12, sm: 6 }} key={park.id}>
                <Card 
                  shadow="sm" 
                  padding="lg" 
                  radius="md" 
                  withBorder
                  sx={{ cursor: 'pointer', transition: 'transform 0.2s' }}
                  onClick={() => {}}
                  style={{ ':hover': { transform: 'translateY(-2px)' } }}
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
          <Title order={3} mb="md">Quick Actions</Title>
          <Grid>
            <Grid.Col span={{ base: 12, sm: 4 }}>
              <Button 
                fullWidth 
                leftSection={<Utensils size="1rem" />}
                color="blue"
                size="md"
                onClick={() => {}}
              >
                Make Dining Reservation
              </Button>
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 4 }}>
              <Button 
                fullWidth 
                leftSection={<Zap size="1rem" />}
                color="grape"
                size="md"
                onClick={() => {}}
              >
                Plan Lightning Lane
              </Button>
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 4 }}>
              <Button 
                fullWidth 
                leftSection={<MapPin size="1rem" />}
                color="green"
                size="md"
                onClick={() => {}}
              >
                View Park Maps
              </Button>
            </Grid.Col>
          </Grid>
        </div>
      </Stack>
    </Container>
  );
};

// Placeholder Section Component
interface PlaceholderSectionProps {
  title: string;
  description: string;
}

const PlaceholderSection: React.FC<PlaceholderSectionProps> = ({ title, description }) => (
  <Container size="xl">
    <Paper shadow="sm" p="xl" radius="md" withBorder>
      <Center>
        <Stack align="center" gap="lg">
          <Title order={2}>{title}</Title>
          <Text c="dimmed" ta="center" size="lg">
            {description}
          </Text>
          <Text size={rem(80)}>🚧</Text>
          <Text size="sm" c="dimmed">
            This section will be implemented in the next phase
          </Text>
        </Stack>
      </Center>
    </Paper>
  </Container>
);

// Main App Component
const DisneyTripPlanner: React.FC = () => {
  const [trip, setTrip] = useState<Trip>(sampleTrip);
  const [opened, { toggle, close }] = useDisclosure(false);

  const handleNavigationChange = (step: NavigationStep): void => {
    setTrip({ ...trip, currentStep: step });
    close(); // Close mobile menu
  };

  const renderContent = (): JSX.Element => {
    switch (trip.currentStep) {
      case 'overview':
        return <TripOverview trip={trip} />;
      case 'parks':
        return <PlaceholderSection title="Parks & Attractions" description="Plan your daily park itineraries and track real-time wait times" />;
      case 'dining':
        return <PlaceholderSection title="Dining Reservations" description="Browse restaurants and manage your dining reservations" />;
      case 'hotels':
        return <PlaceholderSection title="Resort Hotels" description="Compare and book Disney resort accommodations" />;
      case 'lightning':
        return <PlaceholderSection title="Lightning Lane Strategy" description="Optimize your Lightning Lane selections for minimal wait times" />;
      case 'settings':
        return <PlaceholderSection title="Trip Settings" description="Manage your trip preferences and party details" />;
      default:
        return <TripOverview trip={trip} />;
    }
  };

  return (
    <MantineProvider 
    forceColorScheme='dark'
      theme={{
        primaryColor: 'blue',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      <AppShell
        header={{ height: 70 }}
        navbar={{ 
          width: 300, 
          breakpoint: 'sm',
          collapsed: { mobile: !opened }
        }}
        padding="md"
      >
        <AppShell.Header>
          <Group h="100%" px="md" justify="space-between">
            <Group>
              <Burger
                opened={opened}
                onClick={toggle}
                hiddenFrom="sm"
                size="sm"
              />
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
                <Text size="xs" c="dimmed">days to go</Text>
              </div>
              <div style={{ textAlign: 'center' }}>
                <Text size="xl" fw={700} c="green">
                  {Math.ceil((trip.endDate.getTime() - trip.startDate.getTime()) / (1000 * 60 * 60 * 24))}
                </Text>
                <Text size="xs" c="dimmed">days total</Text>
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

        <AppShell.Main>
          {renderContent()}
        </AppShell.Main>
      </AppShell>
    </MantineProvider>
  );
};

export default DisneyTripPlanner;