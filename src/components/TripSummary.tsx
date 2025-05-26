import React, { useState } from 'react';
import {
  Container,
  Grid,
  Card,
  Title,
  Text,
  Badge,
  Group,
  Stack,
  Paper,
  Divider,
  SimpleGrid,
  ThemeIcon,
  Timeline,
  Button,
  Alert,
  Tabs,
  Progress,
} from '@mantine/core';
import {
  Calendar,
  Users,
  MapPin,
  Utensils,
  Hotel as HotelIcon,
  Zap,
  DollarSign,
  Clock,
  CheckCircle,
  Download,
  Share,
  AlertCircle,
  Star,
  Phone,
  FileText,
  Plane,
} from 'lucide-react';
import type { Trip, PartyMember } from '../types/types';

interface TripSummaryProps {
  trip: Trip;
  partyMembers: PartyMember[];
}

// Mock data for the Lewis Family Disney Trip
const mockData = {
  confirmation: 'WDW-LEWIS-789456',
  hotelReservation: {
    name: "Disney's Port Orleans Resort - Riverside",
    roomType: 'Standard Room - Magnolia Bend',
    checkIn: '2025-07-16',
    checkOut: '2025-07-30',
    nights: 14,
    cost: 4480,
    confirmationNumber: 'WDW-POR456789',
    phone: '(407) 934-6000',
  },
  diningReservations: [
    {
      name: 'Be Our Guest Restaurant',
      date: '2025-07-18',
      time: '6:30 PM',
      party: 4,
      confirmationNumber: 'WDW-BOG345678',
      location: "Beast's Castle, Fantasyland",
    },
    {
      name: "Chef Mickey's",
      date: '2025-07-20',
      time: '8:00 AM',
      party: 4,
      confirmationNumber: 'WDW-CM789012',
      location: "Disney's Contemporary Resort",
    },
    {
      name: 'Space 220 Restaurant',
      date: '2025-07-22',
      time: '12:30 PM',
      party: 4,
      confirmationNumber: 'WDW-SP2456789',
      location: 'EPCOT Future World',
    },
  ],
  lightningLane: [
    { name: 'Space Mountain', park: 'Magic Kingdom', time: '11:30 AM', date: '2025-07-18', type: 'Genie+' },
    {
      name: 'Rise of the Resistance',
      park: 'Hollywood Studios',
      time: '2:15 PM',
      date: '2025-07-19',
      type: 'Individual LL',
      cost: 100,
    },
    {
      name: 'Guardians of the Galaxy',
      park: 'EPCOT',
      time: '10:00 AM',
      date: '2025-07-20',
      type: 'Individual LL',
      cost: 80,
    },
  ],
  costs: {
    tickets: 4536,
    hotel: 4480,
    dining: 1800,
    lightningLane: 180,
    extras: 800,
    total: 11796,
  },
};

const TripSummary: React.FC<TripSummaryProps> = ({ trip, partyMembers }) => {
  const [selectedTab, setSelectedTab] = useState<string>('overview');

  const tripLength = Math.ceil((trip.endDate.getTime() - trip.startDate.getTime()) / (1000 * 60 * 60 * 24));
  const daysUntilTrip = Math.ceil((trip.startDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  const renderOverview = () => (
    <Stack gap="lg">
      {/* Trip Header */}
      <Card withBorder p="xl">
        <Stack gap="md">
          <Group justify="space-between">
            <div>
              <Title order={1} mb="xs">
                Lewis Family Disney Trip
              </Title>
              <Group gap="lg">
                <Group gap="xs">
                  <Calendar size="1rem" />
                  <Text>
                    {trip.startDate.toLocaleDateString()} - {trip.endDate.toLocaleDateString()}
                  </Text>
                </Group>
                <Group gap="xs">
                  <Users size="1rem" />
                  <Text>{partyMembers.length} guests</Text>
                </Group>
              </Group>
            </div>
            <Badge size="xl" color="green">
              Confirmed
            </Badge>
          </Group>

          <Divider />

          <SimpleGrid cols={{ base: 2, md: 4 }}>
            <div style={{ textAlign: 'center' }}>
              <Text size="2xl" fw={700} c="blue">
                {daysUntilTrip}
              </Text>
              <Text size="sm" c="dimmed">
                Days Until Trip
              </Text>
            </div>
            <div style={{ textAlign: 'center' }}>
              <Text size="2xl" fw={700} c="green">
                {tripLength}
              </Text>
              <Text size="sm" c="dimmed">
                Total Days
              </Text>
            </div>
            <div style={{ textAlign: 'center' }}>
              <Text size="2xl" fw={700} c="orange">
                {mockData.diningReservations.length}
              </Text>
              <Text size="sm" c="dimmed">
                Dining ADRs
              </Text>
            </div>
            <div style={{ textAlign: 'center' }}>
              <Text size="2xl" fw={700} c="purple">
                ${mockData.costs.total.toLocaleString()}
              </Text>
              <Text size="sm" c="dimmed">
                Total Cost
              </Text>
            </div>
          </SimpleGrid>
        </Stack>
      </Card>

      {/* Quick Stats Grid */}
      <SimpleGrid cols={{ base: 2, md: 4 }}>
        <Card withBorder p="md">
          <Stack align="center" gap="xs">
            <ThemeIcon color="purple" size="xl">
              <HotelIcon size="1.5rem" />
            </ThemeIcon>
            <Text fw={500}>Hotel</Text>
            <Text size="sm" c="dimmed">
              {mockData.hotelReservation.nights} nights
            </Text>
            <Badge color="green">Confirmed</Badge>
          </Stack>
        </Card>

        <Card withBorder p="md">
          <Stack align="center" gap="xs">
            <ThemeIcon color="orange" size="xl">
              <Utensils size="1.5rem" />
            </ThemeIcon>
            <Text fw={500}>Dining</Text>
            <Text size="sm" c="dimmed">
              {mockData.diningReservations.length} reservations
            </Text>
            <Badge color="green">All Set</Badge>
          </Stack>
        </Card>

        <Card withBorder p="md">
          <Stack align="center" gap="xs">
            <ThemeIcon color="yellow" size="xl">
              <Zap size="1.5rem" />
            </ThemeIcon>
            <Text fw={500}>Lightning Lane</Text>
            <Text size="sm" c="dimmed">
              {mockData.lightningLane.length} planned
            </Text>
            <Badge color="yellow">Ready</Badge>
          </Stack>
        </Card>

        <Card withBorder p="md">
          <Stack align="center" gap="xs">
            <ThemeIcon color="blue" size="xl">
              <Star size="1.5rem" />
            </ThemeIcon>
            <Text fw={500}>Party</Text>
            <Text size="sm" c="dimmed">
              {partyMembers.length} members
            </Text>
            <Badge color="blue">Complete</Badge>
          </Stack>
        </Card>
      </SimpleGrid>
    </Stack>
  );

  const renderHotel = () => (
    <Card withBorder p="lg">
      <Stack gap="md">
        <Group justify="space-between">
          <div>
            <Title order={3}>{mockData.hotelReservation.name}</Title>
            <Text c="dimmed">{mockData.hotelReservation.roomType}</Text>
          </div>
          <Badge color="green" size="lg">
            Confirmed
          </Badge>
        </Group>

        <Divider />

        <SimpleGrid cols={{ base: 1, md: 3 }}>
          <div>
            <Text size="sm" c="dimmed">
              Check-in
            </Text>
            <Text fw={500}>{mockData.hotelReservation.checkIn}</Text>
            <Text size="xs" c="dimmed">
              After 3:00 PM
            </Text>
          </div>
          <div>
            <Text size="sm" c="dimmed">
              Check-out
            </Text>
            <Text fw={500}>{mockData.hotelReservation.checkOut}</Text>
            <Text size="xs" c="dimmed">
              Before 11:00 AM
            </Text>
          </div>
          <div>
            <Text size="sm" c="dimmed">
              Total Cost
            </Text>
            <Text fw={700} size="lg">
              ${mockData.hotelReservation.cost.toLocaleString()}
            </Text>
            <Text size="xs" c="dimmed">
              {mockData.hotelReservation.nights} nights
            </Text>
          </div>
        </SimpleGrid>

        <Paper withBorder p="md">
          <Group gap="xs" mb="sm">
            <Text fw={500}>Confirmation:</Text>
            <Text style={{ fontFamily: 'monospace' }}>{mockData.hotelReservation.confirmationNumber}</Text>
          </Group>
          <Group gap="xs">
            <Phone size="0.8rem" />
            <Text size="sm">{mockData.hotelReservation.phone}</Text>
          </Group>
        </Paper>
      </Stack>
    </Card>
  );

  const renderDining = () => (
    <Stack gap="md">
      {mockData.diningReservations.map((reservation, index) => (
        <Card key={index} withBorder p="lg">
          <Group justify="space-between" mb="md">
            <div>
              <Text fw={500} size="lg">
                {reservation.name}
              </Text>
              <Text c="dimmed">{reservation.location}</Text>
            </div>
            <Badge color="green">Confirmed</Badge>
          </Group>

          <SimpleGrid cols={{ base: 2, md: 4 }} spacing="md">
            <div>
              <Text size="sm" c="dimmed">
                Date
              </Text>
              <Text fw={500}>{reservation.date}</Text>
            </div>
            <div>
              <Text size="sm" c="dimmed">
                Time
              </Text>
              <Text fw={500}>{reservation.time}</Text>
            </div>
            <div>
              <Text size="sm" c="dimmed">
                Party Size
              </Text>
              <Text fw={500}>{reservation.party} guests</Text>
            </div>
            <div>
              <Text size="sm" c="dimmed">
                Confirmation
              </Text>
              <Text fw={500} style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                {reservation.confirmationNumber}
              </Text>
            </div>
          </SimpleGrid>
        </Card>
      ))}
    </Stack>
  );

  const renderLightningLane = () => (
    <Stack gap="md">
      {mockData.lightningLane.map((reservation, index) => (
        <Card key={index} withBorder p="md">
          <Group justify="space-between">
            <div>
              <Group mb="xs">
                <Text fw={500}>{reservation.name}</Text>
                <Badge color={reservation.type === 'Individual LL' ? 'red' : 'blue'}>{reservation.type}</Badge>
              </Group>
              <Group gap="lg">
                <div>
                  <Text size="sm" c="dimmed">
                    Park
                  </Text>
                  <Text size="sm">{reservation.park}</Text>
                </div>
                <div>
                  <Text size="sm" c="dimmed">
                    Date & Time
                  </Text>
                  <Text size="sm">
                    {reservation.date} at {reservation.time}
                  </Text>
                </div>
                {reservation.cost && (
                  <div>
                    <Text size="sm" c="dimmed">
                      Cost
                    </Text>
                    <Text size="sm" fw={500}>
                      ${reservation.cost}
                    </Text>
                  </div>
                )}
              </Group>
            </div>
          </Group>
        </Card>
      ))}
    </Stack>
  );

  const renderCosts = () => (
    <Card withBorder p="lg">
      <Title order={3} mb="md">
        Cost Breakdown
      </Title>
      <Stack gap="md">
        <Group justify="space-between">
          <Text>Park Tickets</Text>
          <Text fw={500}>${mockData.costs.tickets.toLocaleString()}</Text>
        </Group>
        <Group justify="space-between">
          <Text>Hotel Accommodation</Text>
          <Text fw={500}>${mockData.costs.hotel.toLocaleString()}</Text>
        </Group>
        <Group justify="space-between">
          <Text>Dining Reservations</Text>
          <Text fw={500}>${mockData.costs.dining.toLocaleString()}</Text>
        </Group>
        <Group justify="space-between">
          <Text>Lightning Lane</Text>
          <Text fw={500}>${mockData.costs.lightningLane.toLocaleString()}</Text>
        </Group>
        <Group justify="space-between">
          <Text>Extras & Souvenirs</Text>
          <Text fw={500}>${mockData.costs.extras.toLocaleString()}</Text>
        </Group>
        <Divider />
        <Group justify="space-between">
          <Text fw={700} size="lg">
            Total Trip Cost
          </Text>
          <Text fw={700} size="xl" c="blue">
            ${mockData.costs.total.toLocaleString()}
          </Text>
        </Group>
      </Stack>
    </Card>
  );

  const renderParty = () => (
    <Stack gap="md">
      {partyMembers.map((member) => (
        <Card key={member.id} withBorder p="md">
          <Group justify="space-between">
            <div>
              <Text fw={500} size="lg">
                {member.name}
              </Text>
              <Group gap="md">
                <Text size="sm" c="dimmed">
                  Age: {member.age}
                </Text>
                <Text size="sm" c="dimmed">
                  Ticket: {member.ticketType}
                </Text>
                {member.dietaryRestrictions !== 'None' && (
                  <Badge size="sm" color="orange">
                    {member.dietaryRestrictions}
                  </Badge>
                )}
              </Group>
            </div>
          </Group>
        </Card>
      ))}
    </Stack>
  );

  return (
    <Container size="xl">
      <Stack gap="lg">
        <div>
          <Title order={2} mb="md">
            Trip Summary
          </Title>
          <Text c="dimmed" mb="lg">
            Complete overview of your Lewis Family Disney Trip with all reservations and plans
          </Text>
        </div>

        <Tabs value={selectedTab} onChange={(value) => setSelectedTab(value || 'overview')}>
          <Tabs.List>
            <Tabs.Tab value="overview" leftSection={<Star size="0.9rem" />}>
              Overview
            </Tabs.Tab>
            <Tabs.Tab value="hotel" leftSection={<HotelIcon size="0.9rem" />}>
              Hotel
            </Tabs.Tab>
            <Tabs.Tab value="dining" leftSection={<Utensils size="0.9rem" />}>
              Dining
            </Tabs.Tab>
            <Tabs.Tab value="lightning" leftSection={<Zap size="0.9rem" />}>
              Lightning Lane
            </Tabs.Tab>
            <Tabs.Tab value="party" leftSection={<Users size="0.9rem" />}>
              Party
            </Tabs.Tab>
            <Tabs.Tab value="costs" leftSection={<DollarSign size="0.9rem" />}>
              Costs
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="overview" pt="lg">
            {renderOverview()}
          </Tabs.Panel>

          <Tabs.Panel value="hotel" pt="lg">
            {renderHotel()}
          </Tabs.Panel>

          <Tabs.Panel value="dining" pt="lg">
            {renderDining()}
          </Tabs.Panel>

          <Tabs.Panel value="lightning" pt="lg">
            {renderLightningLane()}
          </Tabs.Panel>

          <Tabs.Panel value="party" pt="lg">
            {renderParty()}
          </Tabs.Panel>

          <Tabs.Panel value="costs" pt="lg">
            {renderCosts()}
          </Tabs.Panel>
        </Tabs>

        {/* Important Reminders */}
        <Alert icon={<AlertCircle size="1rem" />} title="Important Reminders" color="blue">
          <Stack gap="xs">
            <Text size="sm">• Download the My Disney Experience app before your trip</Text>
            <Text size="sm">• Bring government-issued photo ID for all guests 18+</Text>
            <Text size="sm">• Arrive 30-45 minutes early for dining reservations</Text>
            <Text size="sm">• Book Individual Lightning Lanes at 7:00 AM sharp</Text>
            <Text size="sm">• Check park hours the night before each day</Text>
          </Stack>
        </Alert>

        {/* Action Buttons */}
        <Group justify="center">
          <Button leftSection={<Download size="1rem" />} variant="light">
            Download Itinerary
          </Button>
          <Button leftSection={<Share size="1rem" />} variant="light">
            Share with Family
          </Button>
          <Button leftSection={<FileText size="1rem" />} variant="light">
            Print Summary
          </Button>
        </Group>

        {/* Master Confirmation */}
        <Alert icon={<CheckCircle size="1rem" />} title="Trip Confirmation" color="green">
          <Text size="sm">
            <strong>Master Confirmation:</strong> {mockData.confirmation}
          </Text>
          <Text size="sm">
            Your Lewis Family Disney Trip is fully confirmed! Have a magical vacation starting in {daysUntilTrip} days.
          </Text>
        </Alert>
      </Stack>
    </Container>
  );
};

export default TripSummary;
