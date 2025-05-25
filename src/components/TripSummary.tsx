import React from 'react';
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
} from 'lucide-react';
import type { Trip, PartyMember } from '../types/types';

interface TripSummaryProps {
  trip: Trip;
  partyMembers: PartyMember[];
}

// Mock data for summary - in real app this would come from state/API
const mockReservations = {
  dining: [
    { name: 'Be Our Guest Restaurant', date: '2025-07-18', time: '6:30 PM', party: 4 },
    { name: "Chef Mickey's", date: '2025-07-20', time: '8:00 AM', party: 4 },
    { name: 'Space 220 Restaurant', date: '2025-07-22', time: '12:30 PM', party: 4 },
  ],
  hotel: {
    name: "Disney's Grand Floridian Resort & Spa",
    checkIn: '2025-07-16',
    checkOut: '2025-07-30',
    roomType: 'Standard Room',
    nights: 14,
    cost: 11200,
  },
  lightningLane: [
    { name: 'Space Mountain', park: 'Magic Kingdom', time: '11:30 AM', date: '2025-07-18' },
    { name: 'Rise of the Resistance', park: 'Hollywood Studios', time: '2:15 PM', date: '2025-07-19' },
    { name: 'Guardians of the Galaxy', park: 'EPCOT', time: '10:00 AM', date: '2025-07-20' },
  ],
};

const TripSummary: React.FC<TripSummaryProps> = ({ trip, partyMembers }) => {
  const tripLength = Math.ceil((trip.endDate.getTime() - trip.startDate.getTime()) / (1000 * 60 * 60 * 24));
  const daysUntilTrip = Math.ceil((trip.startDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  // Calculate estimated costs
  const ticketCosts = partyMembers.reduce((total, member) => {
    const basePrice = member.age >= 10 ? 109 : 104;
    const multiplier = member.ticketType.includes('Park Hopper') ? 1.6 : 1;
    return total + basePrice * multiplier * tripLength;
  }, 0);

  const totalEstimatedCost = ticketCosts + mockReservations.hotel.cost + 2000; // Adding estimated food/misc

  const itinerary = [
    {
      date: '2025-07-16',
      day: 'Arrival Day',
      activities: ['Check into Grand Floridian', 'Magic Kingdom evening', 'Happily Ever After fireworks'],
    },
    {
      date: '2025-07-17',
      day: 'Magic Kingdom',
      activities: ['Rope drop Seven Dwarfs', 'Be Our Guest dinner', 'Pirates of Caribbean'],
    },
    { date: '2025-07-18', day: 'EPCOT', activities: ['Guardians of Galaxy', 'World Showcase', 'EPCOT Forever'] },
    { date: '2025-07-19', day: 'Hollywood Studios', activities: ['Rise of Resistance', "Galaxy's Edge", 'Fantasmic!'] },
    {
      date: '2025-07-20',
      day: 'Animal Kingdom',
      activities: ['Avatar Flight of Passage', 'Kilimanjaro Safaris', 'Festival of Lion King'],
    },
  ];

  return (
    <Container size="xl">
      <Stack gap="lg">
        <div>
          <Title order={2} mb="md">
            Trip Summary
          </Title>
          <Text c="dimmed" mb="lg">
            Your complete Disney World vacation overview with all reservations and plans
          </Text>
        </div>

        {/* Trip Overview Cards */}
        <SimpleGrid cols={{ base: 2, md: 4 }}>
          <Paper withBorder p="md">
            <Stack align="center" gap="xs">
              <ThemeIcon color="blue" size="lg">
                <Calendar size="1.2rem" />
              </ThemeIcon>
              <Text fw={500} ta="center">
                {tripLength} Days
              </Text>
              <Text size="sm" c="dimmed" ta="center">
                Trip Length
              </Text>
            </Stack>
          </Paper>

          <Paper withBorder p="md">
            <Stack align="center" gap="xs">
              <ThemeIcon color="green" size="lg">
                <Users size="1.2rem" />
              </ThemeIcon>
              <Text fw={500} ta="center">
                {partyMembers.length} Guests
              </Text>
              <Text size="sm" c="dimmed" ta="center">
                Party Size
              </Text>
            </Stack>
          </Paper>

          <Paper withBorder p="md">
            <Stack align="center" gap="xs">
              <ThemeIcon color="orange" size="lg">
                <Utensils size="1.2rem" />
              </ThemeIcon>
              <Text fw={500} ta="center">
                {mockReservations.dining.length}
              </Text>
              <Text size="sm" c="dimmed" ta="center">
                Dining ADRs
              </Text>
            </Stack>
          </Paper>

          <Paper withBorder p="md">
            <Stack align="center" gap="xs">
              <ThemeIcon color="red" size="lg">
                <DollarSign size="1.2rem" />
              </ThemeIcon>
              <Text fw={500} ta="center">
                ${totalEstimatedCost.toLocaleString()}
              </Text>
              <Text size="sm" c="dimmed" ta="center">
                Est. Total Cost
              </Text>
            </Stack>
          </Paper>
        </SimpleGrid>

        {/* Countdown Alert */}
        <Alert icon={<Clock size="1rem" />} title={`${daysUntilTrip} days until your trip!`} color="blue">
          <Stack gap="xs">
            <Text size="sm">Your magical Disney vacation starts {trip.startDate.toLocaleDateString()}</Text>
            <Group gap="md">
              <Text size="xs" c="dimmed">
                Check-in: 3:00 PM
              </Text>
              <Text size="xs" c="dimmed">
                Park Hours: 9:00 AM - 10:00 PM
              </Text>
              <Text size="xs" c="dimmed">
                Early Entry: 8:30 AM
              </Text>
            </Group>
          </Stack>
        </Alert>

        <Grid>
          {/* Hotel Reservation */}
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Card withBorder p="lg" h="100%">
              <Stack gap="md">
                <Group>
                  <ThemeIcon color="purple" size="lg">
                    <HotelIcon size="1.2rem" />
                  </ThemeIcon>
                  <div>
                    <Text fw={500}>Hotel Reservation</Text>
                    <Badge color="green">Confirmed</Badge>
                  </div>
                </Group>

                <Divider />

                <div>
                  <Text fw={500} mb="xs">
                    {mockReservations.hotel.name}
                  </Text>
                  <Stack gap="xs">
                    <Group gap="lg">
                      <div>
                        <Text size="sm" c="dimmed">
                          Check-in
                        </Text>
                        <Text size="sm">{mockReservations.hotel.checkIn}</Text>
                      </div>
                      <div>
                        <Text size="sm" c="dimmed">
                          Check-out
                        </Text>
                        <Text size="sm">{mockReservations.hotel.checkOut}</Text>
                      </div>
                    </Group>
                    <Group gap="lg">
                      <div>
                        <Text size="sm" c="dimmed">
                          Room Type
                        </Text>
                        <Text size="sm">{mockReservations.hotel.roomType}</Text>
                      </div>
                      <div>
                        <Text size="sm" c="dimmed">
                          Total Cost
                        </Text>
                        <Text size="sm" fw={500}>
                          ${mockReservations.hotel.cost.toLocaleString()}
                        </Text>
                      </div>
                    </Group>
                  </Stack>
                </div>
              </Stack>
            </Card>
          </Grid.Col>

          {/* Dining Reservations */}
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Card withBorder p="lg" h="100%">
              <Stack gap="md">
                <Group>
                  <ThemeIcon color="orange" size="lg">
                    <Utensils size="1.2rem" />
                  </ThemeIcon>
                  <div>
                    <Text fw={500}>Dining Reservations</Text>
                    <Badge color="green">{mockReservations.dining.length} confirmed</Badge>
                  </div>
                </Group>

                <Divider />

                <Stack gap="md">
                  {mockReservations.dining.map((reservation, index) => (
                    <div key={index}>
                      <Group justify="space-between">
                        <div>
                          <Text size="sm" fw={500}>
                            {reservation.name}
                          </Text>
                          <Text size="xs" c="dimmed">
                            {reservation.date} at {reservation.time}
                          </Text>
                        </div>
                        <Badge size="sm" variant="light">
                          {reservation.party} guests
                        </Badge>
                      </Group>
                      {index < mockReservations.dining.length - 1 && <Divider />}
                    </div>
                  ))}
                </Stack>
              </Stack>
            </Card>
          </Grid.Col>

          {/* Lightning Lane Summary */}
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Card withBorder p="lg" h="100%">
              <Stack gap="md">
                <Group>
                  <ThemeIcon color="yellow" size="lg">
                    <Zap size="1.2rem" />
                  </ThemeIcon>
                  <div>
                    <Text fw={500}>Lightning Lane Plan</Text>
                    <Badge color="yellow">{mockReservations.lightningLane.length} scheduled</Badge>
                  </div>
                </Group>

                <Divider />

                <Stack gap="md">
                  {mockReservations.lightningLane.map((reservation, index) => (
                    <div key={index}>
                      <Group justify="space-between">
                        <div>
                          <Text size="sm" fw={500}>
                            {reservation.name}
                          </Text>
                          <Text size="xs" c="dimmed">
                            {reservation.park} - {reservation.date}
                          </Text>
                        </div>
                        <Badge size="sm" variant="light">
                          {reservation.time}
                        </Badge>
                      </Group>
                      {index < mockReservations.lightningLane.length - 1 && <Divider />}
                    </div>
                  ))}
                </Stack>
              </Stack>
            </Card>
          </Grid.Col>

          {/* Party Members Summary */}
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Card withBorder p="lg" h="100%">
              <Stack gap="md">
                <Group>
                  <ThemeIcon color="green" size="lg">
                    <Users size="1.2rem" />
                  </ThemeIcon>
                  <div>
                    <Text fw={500}>Party Members</Text>
                    <Badge color="green">{partyMembers.length} travelers</Badge>
                  </div>
                </Group>

                <Divider />

                <Stack gap="sm">
                  {partyMembers.map((member, index) => (
                    <Group key={member.id} justify="space-between">
                      <div>
                        <Text size="sm" fw={500}>
                          {member.name}
                        </Text>
                        <Text size="xs" c="dimmed">
                          Age {member.age} • {member.ticketType}
                        </Text>
                      </div>
                      {member.dietaryRestrictions !== 'None' && (
                        <Badge size="xs" color="orange">
                          {member.dietaryRestrictions}
                        </Badge>
                      )}
                    </Group>
                  ))}
                </Stack>
              </Stack>
            </Card>
          </Grid.Col>
        </Grid>

        {/* Daily Itinerary */}
        <Card withBorder p="lg">
          <Title order={3} mb="md">
            Daily Itinerary Highlights
          </Title>
          <Timeline active={-1} bulletSize={24} lineWidth={2}>
            {itinerary.map((day, index) => (
              <Timeline.Item key={index} bullet={<Calendar size="0.8rem" />} title={day.day} color="blue">
                <Text size="sm" c="dimmed" mb="xs">
                  {day.date}
                </Text>
                <Stack gap="xs">
                  {day.activities.map((activity, actIndex) => (
                    <Text key={actIndex} size="sm">
                      • {activity}
                    </Text>
                  ))}
                </Stack>
              </Timeline.Item>
            ))}
          </Timeline>
        </Card>

        {/* Cost Breakdown */}
        <Card withBorder p="lg">
          <Title order={3} mb="md">
            Cost Breakdown
          </Title>
          <Stack gap="md">
            <Group justify="space-between">
              <Text>Park Tickets ({tripLength} days)</Text>
              <Text fw={500}>${ticketCosts.toLocaleString()}</Text>
            </Group>
            <Group justify="space-between">
              <Text>Hotel ({mockReservations.hotel.nights} nights)</Text>
              <Text fw={500}>${mockReservations.hotel.cost.toLocaleString()}</Text>
            </Group>
            <Group justify="space-between">
              <Text>Food & Dining (estimated)</Text>
              <Text fw={500}>$1,200</Text>
            </Group>
            <Group justify="space-between">
              <Text>Souvenirs & Extras (estimated)</Text>
              <Text fw={500}>$800</Text>
            </Group>
            <Divider />
            <Group justify="space-between">
              <Text fw={500} size="lg">
                Total Estimated Cost
              </Text>
              <Text fw={700} size="xl" c="blue">
                ${totalEstimatedCost.toLocaleString()}
              </Text>
            </Group>
            <Text size="sm" c="dimmed">
              *Estimates include taxes and fees. Actual costs may vary.
            </Text>
          </Stack>
        </Card>

        {/* Important Reminders */}
        <Alert icon={<AlertCircle size="1rem" />} title="Important Reminders" color="orange">
          <Stack gap="xs">
            <Text size="sm">• Download the My Disney Experience app before you go</Text>
            <Text size="sm">• Bring government-issued photo ID for all guests 18+</Text>
            <Text size="sm">• Check park hours and special events before each day</Text>
            <Text size="sm">• Consider purchasing Genie+ on busy park days</Text>
            <Text size="sm">• Arrive 45+ minutes early for character dining</Text>
            <Text size="sm">• Stay hydrated and take breaks during hot weather</Text>
          </Stack>
        </Alert>

        {/* Action Buttons */}
        <Group>
          <Button leftSection={<Download size="1rem" />} variant="light">
            Download Itinerary
          </Button>
          <Button leftSection={<Share size="1rem" />} variant="light">
            Share with Family
          </Button>
          <Button leftSection={<CheckCircle size="1rem" />}>Mark Trip as Complete</Button>
        </Group>
      </Stack>
    </Container>
  );
};

export default TripSummary;
