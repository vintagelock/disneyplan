import React, { useState } from 'react';
import {
  Container,
  Grid,
  Card,
  Title,
  Text,
  Button,
  Badge,
  Group,
  Stack,
  Tabs,
  Paper,
  Modal,
  Select,
  NumberInput,
  Timeline,
  ThemeIcon,
  Divider,
  SimpleGrid,
  Progress,
  Alert,
  ActionIcon,
  ScrollArea,
} from '@mantine/core';
import { TimeInput } from '@mantine/dates';
import { useDisclosure } from '@mantine/hooks';
import {
  Zap,
  Clock,
  DollarSign,
  Users,
  Calendar,
  Star,
  AlertCircle,
  CheckCircle,
  MapPin,
  TrendingUp,
  Timer,
  Target,
  Plus,
  Trash2,
  Info,
  Sparkles,
  Crown,
  Heart,
  Shield,
  Utensils,
} from 'lucide-react';

interface LightningLaneAttraction {
  id: string;
  name: string;
  park: string;
  type: 'genie+' | 'individual';
  price?: number;
  currentWait: number;
  lightningWait: number;
  popularity: 'Low' | 'Medium' | 'High' | 'Very High';
  recommendedTime: string;
  tips: string[];
  heightRequirement?: string;
  category: 'Thrill' | 'Family' | 'Show' | 'Character';
  description: string;
}

interface LightningLaneReservation {
  id: string;
  attraction: string;
  park: string;
  timeSlot: string;
  partySize: number;
  status: 'active' | 'used' | 'expired' | 'upcoming';
  type: 'genie+' | 'individual';
  returnTime: string;
  bookingTime: string;
  cost?: number;
}

interface ParkStrategy {
  park: string;
  date: string;
  genieStrategy: {
    ropeDropAttraction: string;
    firstLL: { attraction: string; time: string; reasoning: string };
    secondLL: { attraction: string; time: string; reasoning: string };
    thirdLL: { attraction: string; time: string; reasoning: string };
    lunchBreak: string;
    afternoonPlan: string[];
    eveningShow: string;
  };
  individualLLRecommendations: {
    mustBuy: string[];
    consider: string[];
    skip: string[];
  };
  timeSchedule: Array<{
    time: string;
    activity: string;
    type: 'rope-drop' | 'lightning-lane' | 'standby' | 'dining' | 'break' | 'show';
  }>;
}

const lightningLaneAttractions: LightningLaneAttraction[] = [
  // Magic Kingdom
  {
    id: 'space-mountain',
    name: 'Space Mountain',
    park: 'Magic Kingdom',
    type: 'genie+',
    currentWait: 65,
    lightningWait: 10,
    popularity: 'High',
    recommendedTime: '11:00 AM',
    category: 'Thrill',
    heightRequirement: '44" (112 cm)',
    description: 'Indoor roller coaster through space in complete darkness',
    tips: ['Best to book mid-morning', 'Single rider line available', 'Very popular with teens and adults'],
  },
  {
    id: 'seven-dwarfs',
    name: 'Seven Dwarfs Mine Train',
    park: 'Magic Kingdom',
    type: 'genie+',
    currentWait: 85,
    lightningWait: 15,
    popularity: 'Very High',
    recommendedTime: '9:00 AM',
    category: 'Family',
    heightRequirement: '38" (97 cm)',
    description: 'Family coaster through the Seven Dwarfs diamond mine',
    tips: ['Book immediately at 7 AM', 'Most popular family attraction', 'Great for all ages'],
  },
  {
    id: 'pirates-caribbean',
    name: 'Pirates of the Caribbean',
    park: 'Magic Kingdom',
    type: 'genie+',
    currentWait: 35,
    lightningWait: 8,
    popularity: 'Medium',
    recommendedTime: '2:00 PM',
    category: 'Family',
    description: 'Classic boat ride through pirate battles and treasure',
    tips: ['Good afternoon option', 'Rarely has long waits', 'Great for all ages'],
  },
  {
    id: 'haunted-mansion',
    name: 'Haunted Mansion',
    park: 'Magic Kingdom',
    type: 'genie+',
    currentWait: 45,
    lightningWait: 12,
    popularity: 'High',
    recommendedTime: '1:00 PM',
    category: 'Family',
    description: '999 happy haunts await in this spooky manor',
    tips: ['Not too scary for kids', 'Holiday overlays available', 'Doom Buggy omnimover system'],
  },
  // EPCOT
  {
    id: 'guardians-galaxy',
    name: 'Guardians of the Galaxy: Cosmic Rewind',
    park: 'EPCOT',
    type: 'individual',
    price: 20,
    currentWait: 90,
    lightningWait: 15,
    popularity: 'Very High',
    recommendedTime: '7:00 AM',
    category: 'Thrill',
    heightRequirement: '42" (107 cm)',
    description: 'Indoor roller coaster with rotating vehicles and awesome soundtrack',
    tips: ['Purchase at 7 AM sharp', 'Virtual queue also available', 'One of the most popular attractions'],
  },
  {
    id: 'test-track',
    name: 'Test Track',
    park: 'EPCOT',
    type: 'genie+',
    currentWait: 55,
    lightningWait: 12,
    popularity: 'High',
    recommendedTime: '12:00 PM',
    category: 'Thrill',
    heightRequirement: '40" (102 cm)',
    description: 'Design your own vehicle and test it at high speeds',
    tips: ['Single rider line available', 'Design your car on the app first', 'Popular with car enthusiasts'],
  },
  {
    id: 'frozen-ever-after',
    name: 'Frozen Ever After',
    park: 'EPCOT',
    type: 'genie+',
    currentWait: 75,
    lightningWait: 18,
    popularity: 'Very High',
    recommendedTime: '10:00 AM',
    category: 'Family',
    description: 'Boat ride through the kingdom of Arendelle with Anna and Elsa',
    tips: ['Very popular with young children', 'Located in Norway pavilion', 'Book early in the day'],
  },
  {
    id: 'soarin',
    name: "Soarin' Around the World",
    park: 'EPCOT',
    type: 'genie+',
    currentWait: 40,
    lightningWait: 10,
    popularity: 'Medium',
    recommendedTime: '3:00 PM',
    category: 'Family',
    heightRequirement: '40" (102 cm)',
    description: 'Hang gliding simulation over world landmarks',
    tips: ['Try to sit in the middle section', 'Amazing scents during ride', 'Good for all ages'],
  },
  // Hollywood Studios
  {
    id: 'rise-resistance',
    name: 'Star Wars: Rise of the Resistance',
    park: 'Hollywood Studios',
    type: 'individual',
    price: 25,
    currentWait: 120,
    lightningWait: 20,
    popularity: 'Very High',
    recommendedTime: '7:00 AM',
    category: 'Thrill',
    description: 'Immersive Star Wars experience with multiple ride systems',
    tips: ['Must purchase at 7 AM', 'Most popular attraction at Disney World', 'Epic 18-minute experience'],
  },
  {
    id: 'millennium-falcon',
    name: 'Millennium Falcon: Smugglers Run',
    park: 'Hollywood Studios',
    type: 'genie+',
    currentWait: 50,
    lightningWait: 15,
    popularity: 'Medium',
    recommendedTime: '4:00 PM',
    category: 'Family',
    description: 'Pilot the Millennium Falcon on a smuggling mission',
    tips: ['Better experience as pilot', 'Usually good availability', 'Interactive cockpit experience'],
  },
  {
    id: 'tower-terror',
    name: 'The Twilight Zone Tower of Terror',
    park: 'Hollywood Studios',
    type: 'genie+',
    currentWait: 65,
    lightningWait: 12,
    popularity: 'High',
    recommendedTime: '1:00 PM',
    category: 'Thrill',
    heightRequirement: '40" (102 cm)',
    description: 'Haunted elevator drop tower experience',
    tips: ['Classic Disney thrill ride', 'Great theming and story', 'Multiple drop sequences'],
  },
  // Animal Kingdom
  {
    id: 'avatar-flight',
    name: 'Avatar Flight of Passage',
    park: 'Animal Kingdom',
    type: 'individual',
    price: 18,
    currentWait: 95,
    lightningWait: 25,
    popularity: 'Very High',
    recommendedTime: '7:00 AM',
    category: 'Thrill',
    heightRequirement: '44" (112 cm)',
    description: 'Flying simulation over Pandora on the back of a banshee',
    tips: ['Most popular at Animal Kingdom', 'Incredible immersive experience', 'Worth every penny'],
  },
  {
    id: 'expedition-everest',
    name: 'Expedition Everest',
    park: 'Animal Kingdom',
    type: 'genie+',
    currentWait: 55,
    lightningWait: 15,
    popularity: 'High',
    recommendedTime: '11:00 AM',
    category: 'Thrill',
    heightRequirement: '44" (112 cm)',
    description: 'Roller coaster through the Himalayas with the Yeti',
    tips: ['Backwards section included', 'Great mountain theming', 'Single rider line available'],
  },
  {
    id: 'kilimanjaro-safaris',
    name: 'Kilimanjaro Safaris',
    park: 'Animal Kingdom',
    type: 'genie+',
    currentWait: 40,
    lightningWait: 10,
    popularity: 'Medium',
    recommendedTime: '5:00 PM',
    category: 'Family',
    description: 'Safari adventure through African savanna with live animals',
    tips: ['Animals more active in evening', 'Different experience each time', 'Bring camera with zoom'],
  },
];

const parkStrategies: ParkStrategy[] = [
  {
    park: 'Magic Kingdom',
    date: '2025-07-18',
    genieStrategy: {
      ropeDropAttraction: 'Seven Dwarfs Mine Train',
      firstLL: {
        attraction: 'Space Mountain',
        time: '11:00 AM',
        reasoning: 'Popular thrill ride, book after using rope drop attraction',
      },
      secondLL: {
        attraction: 'Haunted Mansion',
        time: '1:00 PM',
        reasoning: 'Good availability, family-friendly option after lunch',
      },
      thirdLL: {
        attraction: 'Pirates of the Caribbean',
        time: '4:00 PM',
        reasoning: 'Later in day when standby lines are longer',
      },
      lunchBreak: 'Be Our Guest Restaurant (12:30 PM)',
      afternoonPlan: ['Jungle Cruise (standby)', "It's a Small World", 'Dumbo'],
      eveningShow: 'Happily Ever After (9:00 PM)',
    },
    individualLLRecommendations: {
      mustBuy: [],
      consider: [],
      skip: ['All - Magic Kingdom has no Individual Lightning Lanes'],
    },
    timeSchedule: [
      { time: '8:30 AM', activity: 'Enter park (Early Entry)', type: 'rope-drop' },
      { time: '8:30 AM', activity: 'Rope drop Seven Dwarfs Mine Train', type: 'rope-drop' },
      { time: '9:15 AM', activity: 'Book Space Mountain LL', type: 'lightning-lane' },
      { time: '9:30 AM', activity: 'Big Thunder Mountain (standby)', type: 'standby' },
      { time: '11:00 AM', activity: 'Space Mountain (Lightning Lane)', type: 'lightning-lane' },
      { time: '11:30 AM', activity: 'Book Haunted Mansion LL', type: 'lightning-lane' },
      { time: '12:30 PM', activity: 'Lunch at Be Our Guest', type: 'dining' },
      { time: '1:30 PM', activity: 'Haunted Mansion (Lightning Lane)', type: 'lightning-lane' },
      { time: '2:00 PM', activity: 'Book Pirates LL', type: 'lightning-lane' },
      { time: '4:00 PM', activity: 'Pirates of Caribbean (Lightning Lane)', type: 'lightning-lane' },
      { time: '9:00 PM', activity: 'Happily Ever After', type: 'show' },
    ],
  },
  {
    park: 'EPCOT',
    date: '2025-07-19',
    genieStrategy: {
      ropeDropAttraction: "Remy's Ratatouille Adventure",
      firstLL: {
        attraction: 'Test Track',
        time: '12:00 PM',
        reasoning: 'Popular attraction, good mid-day option',
      },
      secondLL: {
        attraction: 'Frozen Ever After',
        time: '2:00 PM',
        reasoning: 'Very popular, avoid long afternoon waits',
      },
      thirdLL: {
        attraction: "Soarin'",
        time: '5:00 PM',
        reasoning: 'End of day when crowds are heavy',
      },
      lunchBreak: 'Space 220 Restaurant (1:00 PM)',
      afternoonPlan: ['World Showcase tour', 'Living with the Land', 'The Seas'],
      eveningShow: 'EPCOT Forever (9:00 PM)',
    },
    individualLLRecommendations: {
      mustBuy: ['Guardians of the Galaxy: Cosmic Rewind'],
      consider: [],
      skip: [],
    },
    timeSchedule: [
      { time: '7:00 AM', activity: 'Purchase Guardians Individual LL', type: 'lightning-lane' },
      { time: '8:30 AM', activity: 'Enter park (Early Entry)', type: 'rope-drop' },
      { time: '8:30 AM', activity: "Rope drop Remy's Ratatouille", type: 'rope-drop' },
      { time: '9:30 AM', activity: 'Guardians (Individual Lightning Lane)', type: 'lightning-lane' },
      { time: '10:30 AM', activity: 'Book Test Track LL', type: 'lightning-lane' },
      { time: '12:00 PM', activity: 'Test Track (Lightning Lane)', type: 'lightning-lane' },
      { time: '1:00 PM', activity: 'Lunch at Space 220', type: 'dining' },
      { time: '2:30 PM', activity: 'Frozen Ever After (Lightning Lane)', type: 'lightning-lane' },
      { time: '5:00 PM', activity: "Soarin' (Lightning Lane)", type: 'lightning-lane' },
      { time: '9:00 PM', activity: 'EPCOT Forever', type: 'show' },
    ],
  },
];

interface LightningLaneProps {
  partySize?: number;
}

const LightningLane: React.FC<LightningLaneProps> = ({ partySize = 4 }) => {
  const [selectedTab, setSelectedTab] = useState<string>('attractions');
  const [selectedPark, setSelectedPark] = useState<string>('Magic Kingdom');
  const [reservations, setReservations] = useState<LightningLaneReservation[]>([
    {
      id: '1',
      attraction: 'Space Mountain',
      park: 'Magic Kingdom',
      timeSlot: '11:30 AM - 12:30 PM',
      returnTime: '11:30 AM',
      bookingTime: '9:15 AM',
      partySize: 4,
      status: 'active',
      type: 'genie+',
    },
    {
      id: '2',
      attraction: 'Guardians of the Galaxy: Cosmic Rewind',
      park: 'EPCOT',
      timeSlot: '2:15 PM - 3:15 PM',
      returnTime: '2:15 PM',
      bookingTime: '7:00 AM',
      partySize: 4,
      status: 'upcoming',
      type: 'individual',
      cost: 80,
    },
  ]);

  const [modalOpened, { open: openModal, close: closeModal }] = useDisclosure(false);
  const [selectedAttraction, setSelectedAttraction] = useState<LightningLaneAttraction | null>(null);
  const [purchaseModalOpened, { open: openPurchaseModal, close: closePurchaseModal }] = useDisclosure(false);

  const filteredAttractions = lightningLaneAttractions.filter((attraction) => attraction.park === selectedPark);

  const currentStrategy = parkStrategies.find((strategy) => strategy.park === selectedPark);

  const getPopularityColor = (popularity: string) => {
    switch (popularity) {
      case 'Low':
        return 'green';
      case 'Medium':
        return 'yellow';
      case 'High':
        return 'orange';
      case 'Very High':
        return 'red';
      default:
        return 'gray';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'green';
      case 'upcoming':
        return 'blue';
      case 'used':
        return 'gray';
      case 'expired':
        return 'red';
      default:
        return 'gray';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Thrill':
        return <Zap size="1rem" />;
      case 'Family':
        return <Users size="1rem" />;
      case 'Show':
        return <Star size="1rem" />;
      case 'Character':
        return <Heart size="1rem" />;
      default:
        return <MapPin size="1rem" />;
    }
  };

  const getSavingsAmount = (currentWait: number, lightningWait: number) => {
    return currentWait - lightningWait;
  };

  const openAttractionModal = (attraction: LightningLaneAttraction) => {
    setSelectedAttraction(attraction);
    openModal();
  };

  const purchaseLightningLane = (attraction: LightningLaneAttraction) => {
    setSelectedAttraction(attraction);
    openPurchaseModal();
  };

  const confirmPurchase = () => {
    if (!selectedAttraction) return;

    const newReservation: LightningLaneReservation = {
      id: Date.now().toString(),
      attraction: selectedAttraction.name,
      park: selectedAttraction.park,
      timeSlot: `${selectedAttraction.recommendedTime} - ${getEndTime(selectedAttraction.recommendedTime)}`,
      returnTime: selectedAttraction.recommendedTime,
      bookingTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      partySize: partySize,
      status: 'upcoming',
      type: selectedAttraction.type,
      cost: selectedAttraction.price ? selectedAttraction.price * partySize : undefined,
    };

    setReservations([...reservations, newReservation]);
    closePurchaseModal();
  };

  const getEndTime = (startTime: string) => {
    const [time, period] = startTime.split(' ');
    const [hours, minutes] = time.split(':');
    let hour = parseInt(hours);
    if (period === 'PM' && hour !== 12) hour += 12;
    if (period === 'AM' && hour === 12) hour = 0;
    hour += 1;
    if (hour > 12) {
      hour -= 12;
      return `${hour}:${minutes} PM`;
    }
    return `${hour}:${minutes} ${period}`;
  };

  const renderAttractionCard = (attraction: LightningLaneAttraction) => (
    <Card key={attraction.id} withBorder p="md" style={{ cursor: 'pointer' }}>
      <Stack gap="md">
        <Group justify="space-between">
          <div style={{ flex: 1 }}>
            <Group mb="xs">
              <Text fw={500} size="lg">
                {attraction.name}
              </Text>
              <Badge color={attraction.type === 'individual' ? 'red' : 'blue'} variant="light">
                {attraction.type === 'individual' ? 'Individual LL' : 'Genie+'}
              </Badge>
            </Group>

            <Group gap="md" mb="sm">
              <Badge color={getPopularityColor(attraction.popularity)} size="sm">
                {attraction.popularity} Demand
              </Badge>
              <Badge color="gray" variant="light" leftSection={getCategoryIcon(attraction.category)} size="sm">
                {attraction.category}
              </Badge>
              {attraction.heightRequirement && (
                <Badge color="orange" variant="outline" size="sm">
                  {attraction.heightRequirement}
                </Badge>
              )}
            </Group>

            <Text size="sm" c="dimmed" mb="md">
              {attraction.description}
            </Text>

            <SimpleGrid cols={3} spacing="md" mb="md">
              <Paper withBorder p="sm" ta="center">
                <Text size="xl" fw={700} c="red">
                  {attraction.currentWait}
                </Text>
                <Text size="xs" c="dimmed">
                  Standby Wait
                </Text>
              </Paper>
              <Paper withBorder p="sm" ta="center">
                <Text size="xl" fw={700} c="blue">
                  {attraction.lightningWait}
                </Text>
                <Text size="xs" c="dimmed">
                  Lightning Lane
                </Text>
              </Paper>
              <Paper withBorder p="sm" ta="center">
                <Text size="xl" fw={700} c="green">
                  {getSavingsAmount(attraction.currentWait, attraction.lightningWait)}
                </Text>
                <Text size="xs" c="dimmed">
                  Minutes Saved
                </Text>
              </Paper>
            </SimpleGrid>

            {attraction.type === 'individual' && attraction.price && (
              <Group gap="xs" mb="sm">
                <DollarSign size="0.8rem" />
                <Text size="sm" fw={500}>
                  ${attraction.price} per person
                </Text>
                <Text size="xs" c="dimmed">
                  (${attraction.price * partySize} total)
                </Text>
              </Group>
            )}

            <Group gap="xs">
              <Target size="0.8rem" />
              <Text size="sm" c="dimmed">
                Best time: {attraction.recommendedTime}
              </Text>
            </Group>
          </div>
        </Group>

        <Group>
          <Button variant="light" onClick={() => openAttractionModal(attraction)} style={{ flex: 1 }}>
            View Details
          </Button>
          <Button onClick={() => purchaseLightningLane(attraction)} style={{ flex: 1 }}>
            {attraction.type === 'individual' ? 'Purchase' : 'Select Time'}
          </Button>
        </Group>
      </Stack>
    </Card>
  );

  const renderReservations = () => (
    <Stack gap="lg">
      <div>
        <Title order={3} mb="md">
          Your Lightning Lane Reservations
        </Title>
        <Text c="dimmed" mb="lg">
          Manage your current Lightning Lane reservations and return times
        </Text>
      </div>

      {reservations.length === 0 ? (
        <Card withBorder p="xl">
          <Stack align="center" gap="md">
            <Zap size="3rem" color="gray" />
            <Text size="lg" c="dimmed">
              No reservations yet
            </Text>
            <Text c="dimmed" ta="center">
              Purchase Genie+ or Individual Lightning Lanes to skip the lines
            </Text>
            <Button onClick={() => setSelectedTab('attractions')}>Browse Attractions</Button>
          </Stack>
        </Card>
      ) : (
        <Stack gap="md">
          {reservations.map((reservation) => (
            <Card key={reservation.id} withBorder p="lg">
              <Group justify="space-between" mb="md">
                <div style={{ flex: 1 }}>
                  <Group mb="xs">
                    <Text fw={500} size="lg">
                      {reservation.attraction}
                    </Text>
                    <Badge color={reservation.type === 'individual' ? 'red' : 'blue'}>
                      {reservation.type === 'individual' ? 'Individual LL' : 'Genie+'}
                    </Badge>
                    <Badge color={getStatusColor(reservation.status)}>{reservation.status}</Badge>
                  </Group>

                  <SimpleGrid cols={{ base: 2, md: 4 }} spacing="lg">
                    <div>
                      <Group gap="xs">
                        <MapPin size="0.8rem" />
                        <Text size="sm" c="dimmed">
                          Park
                        </Text>
                      </Group>
                      <Text size="sm" fw={500}>
                        {reservation.park}
                      </Text>
                    </div>
                    <div>
                      <Group gap="xs">
                        <Clock size="0.8rem" />
                        <Text size="sm" c="dimmed">
                          Return Time
                        </Text>
                      </Group>
                      <Text size="sm" fw={500}>
                        {reservation.timeSlot}
                      </Text>
                    </div>
                    <div>
                      <Group gap="xs">
                        <Users size="0.8rem" />
                        <Text size="sm" c="dimmed">
                          Party Size
                        </Text>
                      </Group>
                      <Text size="sm" fw={500}>
                        {reservation.partySize} guests
                      </Text>
                    </div>
                    {reservation.cost && (
                      <div>
                        <Group gap="xs">
                          <DollarSign size="0.8rem" />
                          <Text size="sm" c="dimmed">
                            Cost
                          </Text>
                        </Group>
                        <Text size="sm" fw={500}>
                          ${reservation.cost}
                        </Text>
                      </div>
                    )}
                  </SimpleGrid>

                  <Group gap="md" mt="sm">
                    <Text size="xs" c="dimmed">
                      Booked at: {reservation.bookingTime}
                    </Text>
                    {reservation.status === 'active' && (
                      <Badge color="green" variant="light" size="sm">
                        Ready to use now!
                      </Badge>
                    )}
                  </Group>
                </div>

                <ActionIcon color="red" variant="light" size="lg">
                  <Trash2 size="1rem" />
                </ActionIcon>
              </Group>
            </Card>
          ))}
        </Stack>
      )}

      {/* Current Spending Summary */}
      <Paper withBorder p="lg">
        <Title order={4} mb="md">
          Lightning Lane Spending Summary
        </Title>
        <SimpleGrid cols={{ base: 1, md: 3 }}>
          <div>
            <Text size="sm" c="dimmed">
              Genie+ Purchases
            </Text>
            <Text fw={700} size="lg">
              {reservations.filter((r) => r.type === 'genie+').length} reservations
            </Text>
          </div>
          <div>
            <Text size="sm" c="dimmed">
              Individual Lightning Lanes
            </Text>
            <Text fw={700} size="lg">
              ${reservations.filter((r) => r.type === 'individual').reduce((sum, r) => sum + (r.cost || 0), 0)}
            </Text>
          </div>
          <div>
            <Text size="sm" c="dimmed">
              Total Time Saved
            </Text>
            <Text fw={700} size="lg" c="green">
              ~{reservations.length * 45} minutes
            </Text>
          </div>
        </SimpleGrid>
      </Paper>
    </Stack>
  );

  const renderStrategy = () => {
    if (!currentStrategy) {
      return (
        <Alert icon={<AlertCircle size="1rem" />} title="No strategy available" color="yellow">
          Strategy recommendations are available for Magic Kingdom and EPCOT.
        </Alert>
      );
    }

    return (
      <Stack gap="lg">
        <div>
          <Title order={3} mb="md">
            Lightning Lane Strategy for {selectedPark}
          </Title>
          <Text c="dimmed" mb="lg">
            Optimized plan to maximize your Lightning Lane usage and minimize wait times
          </Text>
        </div>

        {/* Individual Lightning Lane Recommendations */}
        {currentStrategy.individualLLRecommendations.mustBuy.length > 0 && (
          <Alert icon={<Star size="1rem" />} title="Individual Lightning Lane Recommendations" color="red">
            <Stack gap="sm">
              <div>
                <Text fw={500} size="sm" c="red">
                  Must Buy:
                </Text>
                <Text size="sm">{currentStrategy.individualLLRecommendations.mustBuy.join(', ')}</Text>
              </div>
              {currentStrategy.individualLLRecommendations.consider.length > 0 && (
                <div>
                  <Text fw={500} size="sm" c="orange">
                    Consider:
                  </Text>
                  <Text size="sm">{currentStrategy.individualLLRecommendations.consider.join(', ')}</Text>
                </div>
              )}
            </Stack>
          </Alert>
        )}

        {/* Timeline Strategy */}
        <Card withBorder p="lg">
          <Title order={4} mb="md">
            Recommended Daily Timeline
          </Title>
          <Timeline active={-1} bulletSize={24} lineWidth={2}>
            {currentStrategy.timeSchedule.map((item, index) => (
              <Timeline.Item
                key={index}
                bullet={
                  item.type === 'rope-drop' ? (
                    <Timer size="0.8rem" />
                  ) : item.type === 'lightning-lane' ? (
                    <Zap size="0.8rem" />
                  ) : item.type === 'dining' ? (
                    <Utensils size="0.8rem" />
                  ) : item.type === 'show' ? (
                    <Star size="0.8rem" />
                  ) : (
                    <Clock size="0.8rem" />
                  )
                }
                title={item.time}
                color={
                  item.type === 'rope-drop'
                    ? 'blue'
                    : item.type === 'lightning-lane'
                    ? 'yellow'
                    : item.type === 'dining'
                    ? 'orange'
                    : item.type === 'show'
                    ? 'purple'
                    : 'gray'
                }
              >
                <Text size="sm">{item.activity}</Text>
              </Timeline.Item>
            ))}
          </Timeline>
        </Card>

        {/* Detailed Strategy Breakdown */}
        <SimpleGrid cols={{ base: 1, md: 2 }}>
          <Card withBorder p="lg">
            <Title order={4} mb="md">
              Lightning Lane Priority
            </Title>
            <Stack gap="md">
              <div>
                <Text fw={500} mb="xs">
                  1st Lightning Lane - {currentStrategy.genieStrategy.firstLL.time}
                </Text>
                <Text size="sm" c="blue" fw={500}>
                  {currentStrategy.genieStrategy.firstLL.attraction}
                </Text>
                <Text size="xs" c="dimmed">
                  {currentStrategy.genieStrategy.firstLL.reasoning}
                </Text>
              </div>
              <div>
                <Text fw={500} mb="xs">
                  2nd Lightning Lane - {currentStrategy.genieStrategy.secondLL.time}
                </Text>
                <Text size="sm" c="blue" fw={500}>
                  {currentStrategy.genieStrategy.secondLL.attraction}
                </Text>
                <Text size="xs" c="dimmed">
                  {currentStrategy.genieStrategy.secondLL.reasoning}
                </Text>
              </div>
              <div>
                <Text fw={500} mb="xs">
                  3rd Lightning Lane - {currentStrategy.genieStrategy.thirdLL.time}
                </Text>
                <Text size="sm" c="blue" fw={500}>
                  {currentStrategy.genieStrategy.thirdLL.attraction}
                </Text>
                <Text size="xs" c="dimmed">
                  {currentStrategy.genieStrategy.thirdLL.reasoning}
                </Text>
              </div>
            </Stack>
          </Card>

          <Card withBorder p="lg">
            <Title order={4} mb="md">
              Additional Recommendations
            </Title>
            <Stack gap="md">
              <div>
                <Text fw={500} mb="xs">
                  Rope Drop Strategy
                </Text>
                <Text size="sm">{currentStrategy.genieStrategy.ropeDropAttraction}</Text>
                <Text size="xs" c="dimmed">
                  Arrive 30-45 minutes before park opening
                </Text>
              </div>
              <div>
                <Text fw={500} mb="xs">
                  Lunch Break
                </Text>
                <Text size="sm">{currentStrategy.genieStrategy.lunchBreak}</Text>
                <Text size="xs" c="dimmed">
                  Avoid peak crowd times
                </Text>
              </div>
              <div>
                <Text fw={500} mb="xs">
                  Afternoon Attractions
                </Text>
                <Text size="sm">{currentStrategy.genieStrategy.afternoonPlan.join(', ')}</Text>
                <Text size="xs" c="dimmed">
                  Lower wait times during breaks
                </Text>
              </div>
              <div>
                <Text fw={500} mb="xs">
                  Evening Show
                </Text>
                <Text size="sm">{currentStrategy.genieStrategy.eveningShow}</Text>
                <Text size="xs" c="dimmed">
                  Perfect end to your magical day
                </Text>
              </div>
            </Stack>
          </Card>
        </SimpleGrid>

        <Alert icon={<Info size="1rem" />} title="Pro Tips" color="blue">
          <Stack gap="xs">
            <Text size="sm">• Book your first Lightning Lane at 7:00 AM (resort guests) or park opening</Text>
            <Text size="sm">• You can book your next Lightning Lane after using your current one OR after 2 hours</Text>
            <Text size="sm">• Individual Lightning Lanes sell out quickly - purchase at 7:00 AM sharp</Text>
            <Text size="sm">• Consider rope drop strategy for the most popular attractions</Text>
            <Text size="sm">• Lightning Lanes are most valuable during peak hours (11 AM - 7 PM)</Text>
          </Stack>
        </Alert>
      </Stack>
    );
  };

  const renderPricing = () => (
    <Stack gap="lg">
      <div>
        <Title order={3} mb="md">
          Lightning Lane Pricing & Value
        </Title>
        <Text c="dimmed" mb="lg">
          Understanding the cost and value of Disney's Lightning Lane options
        </Text>
      </div>

      <SimpleGrid cols={{ base: 1, md: 2 }}>
        <Card withBorder p="xl">
          <Stack gap="md">
            <Group justify="center">
              <ThemeIcon color="blue" size="xl">
                <Zap size="1.5rem" />
              </ThemeIcon>
            </Group>

            <div style={{ textAlign: 'center' }}>
              <Text fw={500} size="xl">
                Disney Genie+
              </Text>
              <Text size="sm" c="dimmed" mb="md">
                Multi-attraction Lightning Lane access
              </Text>
              <Text size="2xl" fw={700} c="blue">
                $29
              </Text>
              <Text size="sm" c="dimmed">
                per person/day
              </Text>
            </div>

            <Divider />

            <div>
              <Text fw={500} mb="xs">
                What's Included:
              </Text>
              <Stack gap="xs">
                <Group gap="xs">
                  <CheckCircle size="0.8rem" color="green" />
                  <Text size="sm">Lightning Lane access to 20+ attractions</Text>
                </Group>
                <Group gap="xs">
                  <CheckCircle size="0.8rem" color="green" />
                  <Text size="sm">One reservation at a time</Text>
                </Group>
                <Group gap="xs">
                  <CheckCircle size="0.8rem" color="green" />
                  <Text size="sm">Book next after using current</Text>
                </Group>
                <Group gap="xs">
                  <CheckCircle size="0.8rem" color="green" />
                  <Text size="sm">PhotoPass downloads included</Text>
                </Group>
              </Stack>
            </div>

            <Paper withBorder p="md" style={{ backgroundColor: 'var(--mantine-color-blue-0)' }}>
              <Text size="sm" fw={500} ta="center">
                Best Value: Save 2-3 hours of waiting time
              </Text>
              <Text size="xs" ta="center" c="dimmed">
                Break-even: Skip 2 long lines per day
              </Text>
            </Paper>
          </Stack>
        </Card>

        <Card withBorder p="xl">
          <Stack gap="md">
            <Group justify="center">
              <ThemeIcon color="red" size="xl">
                <Crown size="1.5rem" />
              </ThemeIcon>
            </Group>

            <div style={{ textAlign: 'center' }}>
              <Text fw={500} size="xl">
                Individual Lightning Lane
              </Text>
              <Text size="sm" c="dimmed" mb="md">
                Skip lines at the most popular attractions
              </Text>
              <Text size="2xl" fw={700} c="red">
                $15-$25
              </Text>
              <Text size="sm" c="dimmed">
                per person, per attraction
              </Text>
            </div>

            <Divider />

            <div>
              <Text fw={500} mb="xs">
                Key Features:
              </Text>
              <Stack gap="xs">
                <Group gap="xs">
                  <Star size="0.8rem" color="gold" />
                  <Text size="sm">Access to highest-demand attractions</Text>
                </Group>
                <Group gap="xs">
                  <Star size="0.8rem" color="gold" />
                  <Text size="sm">Purchase separately from Genie+</Text>
                </Group>
                <Group gap="xs">
                  <Star size="0.8rem" color="gold" />
                  <Text size="sm">Limited availability - sells out fast</Text>
                </Group>
                <Group gap="xs">
                  <Star size="0.8rem" color="gold" />
                  <Text size="sm">Book up to 2 per day per attraction</Text>
                </Group>
              </Stack>
            </div>

            <Paper withBorder p="md" style={{ backgroundColor: 'var(--mantine-color-red-0)' }}>
              <Text size="sm" fw={500} ta="center">
                Premium Experience: Skip 60-120 minute waits
              </Text>
              <Text size="xs" ta="center" c="dimmed">
                Best for: Must-do attractions with long waits
              </Text>
            </Paper>
          </Stack>
        </Card>
      </SimpleGrid>

      {/* Cost Calculator */}
      <Card withBorder p="lg">
        <Title order={4} mb="md">
          Cost Calculator for Your Party
        </Title>
        <SimpleGrid cols={{ base: 1, md: 3 }}>
          <Paper withBorder p="md">
            <Stack align="center" gap="xs">
              <Text fw={500} c="blue">
                Genie+ (Per Day)
              </Text>
              <Text size="xl" fw={700}>
                ${29 * partySize}
              </Text>
              <Text size="sm" c="dimmed">
                For {partySize} guests
              </Text>
            </Stack>
          </Paper>
          <Paper withBorder p="md">
            <Stack align="center" gap="xs">
              <Text fw={500} c="red">
                Individual LL (Average)
              </Text>
              <Text size="xl" fw={700}>
                ${20 * partySize}
              </Text>
              <Text size="sm" c="dimmed">
                Per attraction
              </Text>
            </Stack>
          </Paper>
          <Paper withBorder p="md">
            <Stack align="center" gap="xs">
              <Text fw={500} c="green">
                Potential Savings
              </Text>
              <Text size="xl" fw={700}>
                3+ hours
              </Text>
              <Text size="sm" c="dimmed">
                Of waiting time
              </Text>
            </Stack>
          </Paper>
        </SimpleGrid>
      </Card>

      {/* Money-Saving Tips */}
      <Paper withBorder p="lg">
        <Title order={4} mb="md">
          💰 Money-Saving Tips
        </Title>
        <SimpleGrid cols={{ base: 1, md: 2 }}>
          <Stack gap="xs">
            <Text size="sm" fw={500} c="green">
              When to Buy Genie+:
            </Text>
            <Text size="sm">• Crowded days (holidays, weekends)</Text>
            <Text size="sm">• When you want to do many attractions</Text>
            <Text size="sm">• If you're staying multiple days</Text>
            <Text size="sm">• When you can't rope drop</Text>
          </Stack>
          <Stack gap="xs">
            <Text size="sm" fw={500} c="orange">
              When to Skip:
            </Text>
            <Text size="sm">• Low crowd days</Text>
            <Text size="sm">• If you only want 1-2 attractions</Text>
            <Text size="sm">• When you can arrive at rope drop</Text>
            <Text size="sm">• If you're not in a hurry</Text>
          </Stack>
        </SimpleGrid>
      </Paper>

      {/* Individual Lightning Lane by Park */}
      <Card withBorder p="lg">
        <Title order={4} mb="md">
          Individual Lightning Lane Attractions by Park
        </Title>
        <SimpleGrid cols={{ base: 1, md: 2 }}>
          <div>
            <Text fw={500} mb="sm">
              Magic Kingdom
            </Text>
            <Text size="sm" c="dimmed">
              No Individual Lightning Lanes available
            </Text>
          </div>
          <div>
            <Text fw={500} mb="sm">
              EPCOT
            </Text>
            <Stack gap="xs">
              <Group justify="space-between">
                <Text size="sm">Guardians of the Galaxy</Text>
                <Text size="sm" fw={500}>
                  $20
                </Text>
              </Group>
            </Stack>
          </div>
          <div>
            <Text fw={500} mb="sm">
              Hollywood Studios
            </Text>
            <Stack gap="xs">
              <Group justify="space-between">
                <Text size="sm">Rise of the Resistance</Text>
                <Text size="sm" fw={500}>
                  $25
                </Text>
              </Group>
            </Stack>
          </div>
          <div>
            <Text fw={500} mb="sm">
              Animal Kingdom
            </Text>
            <Stack gap="xs">
              <Group justify="space-between">
                <Text size="sm">Avatar Flight of Passage</Text>
                <Text size="sm" fw={500}>
                  $18
                </Text>
              </Group>
            </Stack>
          </div>
        </SimpleGrid>
      </Card>
    </Stack>
  );

  return (
    <Container size="xl">
      <Stack gap="lg">
        <div>
          <Title order={2} mb="md">
            Lightning Lane Strategy
          </Title>
          <Text c="dimmed" mb="lg">
            Skip the lines with Disney Genie+ and Individual Lightning Lane purchases
          </Text>
        </div>

        <Tabs value={selectedTab} onChange={(value) => setSelectedTab(value || 'attractions')}>
          <Tabs.List>
            <Tabs.Tab value="attractions" leftSection={<Zap size="0.9rem" />}>
              Lightning Lanes
            </Tabs.Tab>
            <Tabs.Tab value="reservations" leftSection={<Calendar size="0.9rem" />}>
              My Reservations
            </Tabs.Tab>
            <Tabs.Tab value="strategy" leftSection={<Target size="0.9rem" />}>
              Daily Strategy
            </Tabs.Tab>
            <Tabs.Tab value="pricing" leftSection={<DollarSign size="0.9rem" />}>
              Pricing Guide
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="attractions" pt="lg">
            <Stack gap="lg">
              {/* Park Selector */}
              <Paper withBorder p="md">
                <Group>
                  <Select
                    label="Select Park"
                    data={['Magic Kingdom', 'EPCOT', 'Hollywood Studios', 'Animal Kingdom']}
                    value={selectedPark}
                    onChange={(value) => setSelectedPark(value || 'Magic Kingdom')}
                    style={{ flex: 1 }}
                  />
                  <div style={{ flex: 1 }}>
                    <Text size="sm" c="dimmed">
                      {filteredAttractions.length} Lightning Lane attractions available
                    </Text>
                  </div>
                </Group>
              </Paper>

              {/* Quick Stats */}
              <SimpleGrid cols={{ base: 2, md: 4 }}>
                <Paper withBorder p="md" ta="center">
                  <Text fw={700} size="lg" c="blue">
                    {filteredAttractions.filter((a) => a.type === 'genie+').length}
                  </Text>
                  <Text size="sm" c="dimmed">
                    Genie+ Attractions
                  </Text>
                </Paper>
                <Paper withBorder p="md" ta="center">
                  <Text fw={700} size="lg" c="red">
                    {filteredAttractions.filter((a) => a.type === 'individual').length}
                  </Text>
                  <Text size="sm" c="dimmed">
                    Individual LL
                  </Text>
                </Paper>
                <Paper withBorder p="md" ta="center">
                  <Text fw={700} size="lg" c="green">
                    {Math.round(
                      filteredAttractions.reduce((sum, a) => sum + (a.currentWait - a.lightningWait), 0) /
                        filteredAttractions.length,
                    )}
                  </Text>
                  <Text size="sm" c="dimmed">
                    Avg. Time Saved
                  </Text>
                </Paper>
                <Paper withBorder p="md" ta="center">
                  <Text fw={700} size="lg" c="orange">
                    $
                    {filteredAttractions
                      .filter((a) => a.type === 'individual')
                      .reduce((sum, a) => sum + (a.price || 0), 0)}
                  </Text>
                  <Text size="sm" c="dimmed">
                    Total ILL Cost
                  </Text>
                </Paper>
              </SimpleGrid>

              {/* Attractions Grid */}
              <Grid>
                {filteredAttractions.map((attraction) => (
                  <Grid.Col key={attraction.id} span={{ base: 12, md: 6 }}>
                    {renderAttractionCard(attraction)}
                  </Grid.Col>
                ))}
              </Grid>
            </Stack>
          </Tabs.Panel>

          <Tabs.Panel value="reservations" pt="lg">
            {renderReservations()}
          </Tabs.Panel>

          <Tabs.Panel value="strategy" pt="lg">
            <Stack gap="lg">
              <Paper withBorder p="md">
                <Select
                  label="Select Park for Strategy"
                  data={['Magic Kingdom', 'EPCOT', 'Hollywood Studios', 'Animal Kingdom']}
                  value={selectedPark}
                  onChange={(value) => setSelectedPark(value || 'Magic Kingdom')}
                />
              </Paper>
              {renderStrategy()}
            </Stack>
          </Tabs.Panel>

          <Tabs.Panel value="pricing" pt="lg">
            {renderPricing()}
          </Tabs.Panel>
        </Tabs>

        {/* Attraction Detail Modal */}
        <Modal opened={modalOpened} onClose={closeModal} title={selectedAttraction?.name} size="lg">
          {selectedAttraction && (
            <Stack gap="md">
              <Group>
                <Badge color={selectedAttraction.type === 'individual' ? 'red' : 'blue'}>
                  {selectedAttraction.type === 'individual' ? 'Individual Lightning Lane' : 'Genie+'}
                </Badge>
                <Badge color={getPopularityColor(selectedAttraction.popularity)}>
                  {selectedAttraction.popularity} Demand
                </Badge>
                <Badge color="gray" variant="light" leftSection={getCategoryIcon(selectedAttraction.category)}>
                  {selectedAttraction.category}
                </Badge>
              </Group>

              <Text>{selectedAttraction.description}</Text>

              <SimpleGrid cols={2}>
                <Paper withBorder p="md">
                  <Stack align="center" gap="xs">
                    <Clock size="1.5rem" />
                    <Text size="xl" fw={700}>
                      {selectedAttraction.currentWait} min
                    </Text>
                    <Text size="sm" c="dimmed">
                      Standby Wait
                    </Text>
                  </Stack>
                </Paper>
                <Paper withBorder p="md">
                  <Stack align="center" gap="xs">
                    <Zap size="1.5rem" color="blue" />
                    <Text size="xl" fw={700} c="blue">
                      {selectedAttraction.lightningWait} min
                    </Text>
                    <Text size="sm" c="dimmed">
                      Lightning Lane
                    </Text>
                  </Stack>
                </Paper>
              </SimpleGrid>

              {selectedAttraction.heightRequirement && (
                <Alert icon={<Shield size="1rem" />} color="orange">
                  Height Requirement: {selectedAttraction.heightRequirement}
                </Alert>
              )}

              {selectedAttraction.type === 'individual' && selectedAttraction.price && (
                <Paper withBorder p="md">
                  <Group justify="space-between">
                    <Text>Price per person:</Text>
                    <Text fw={700} size="lg">
                      ${selectedAttraction.price}
                    </Text>
                  </Group>
                  <Group justify="space-between">
                    <Text>Total for {partySize} guests:</Text>
                    <Text fw={700} size="lg" c="red">
                      ${selectedAttraction.price * partySize}
                    </Text>
                  </Group>
                </Paper>
              )}

              <div>
                <Text fw={500} mb="xs">
                  Recommended booking time: {selectedAttraction.recommendedTime}
                </Text>
                <Text size="sm" c="green" fw={500}>
                  💡 You'll save {getSavingsAmount(selectedAttraction.currentWait, selectedAttraction.lightningWait)}{' '}
                  minutes in line!
                </Text>
              </div>

              <Divider />

              <div>
                <Text fw={500} mb="xs">
                  Tips & Recommendations
                </Text>
                <Stack gap="xs">
                  {selectedAttraction.tips.map((tip, index) => (
                    <Text key={index} size="sm">
                      • {tip}
                    </Text>
                  ))}
                </Stack>
              </div>

              <Button fullWidth onClick={() => purchaseLightningLane(selectedAttraction)}>
                {selectedAttraction.type === 'individual' ? 'Purchase Lightning Lane' : 'Select Return Time'}
              </Button>
            </Stack>
          )}
        </Modal>

        {/* Purchase Modal */}
        <Modal
          opened={purchaseModalOpened}
          onClose={closePurchaseModal}
          title={`${selectedAttraction?.type === 'individual' ? 'Purchase' : 'Book'} Lightning Lane`}
          size="md"
        >
          {selectedAttraction && (
            <Stack gap="md">
              <Group>
                <div style={{ flex: 1 }}>
                  <Text fw={500} size="lg">
                    {selectedAttraction.name}
                  </Text>
                  <Text size="sm" c="dimmed">
                    {selectedAttraction.park}
                  </Text>
                </div>
                <Badge color={selectedAttraction.type === 'individual' ? 'red' : 'blue'} size="lg">
                  {selectedAttraction.type === 'individual' ? 'Individual LL' : 'Genie+'}
                </Badge>
              </Group>

              {selectedAttraction.type === 'individual' && selectedAttraction.price && (
                <Alert icon={<DollarSign size="1rem" />} color="red">
                  <Group justify="space-between">
                    <Text size="sm">Total cost for {partySize} guests:</Text>
                    <Text fw={700} size="lg">
                      ${selectedAttraction.price * partySize}
                    </Text>
                  </Group>
                </Alert>
              )}

              <Paper withBorder p="md">
                <Group justify="space-between" mb="xs">
                  <Text fw={500}>Return Time Window</Text>
                  <Text fw={500} c="blue">
                    {selectedAttraction.recommendedTime}
                  </Text>
                </Group>
                <Text size="sm" c="dimmed">
                  You can return anytime during this hour-long window
                </Text>
              </Paper>

              <Group>
                <NumberInput label="Party Size" value={partySize} min={1} max={10} style={{ flex: 1 }} />
              </Group>

              <SimpleGrid cols={2}>
                <div>
                  <Text size="sm" c="dimmed">
                    Current Wait
                  </Text>
                  <Text fw={500}>{selectedAttraction.currentWait} minutes</Text>
                </div>
                <div>
                  <Text size="sm" c="dimmed">
                    Lightning Lane Wait
                  </Text>
                  <Text fw={500} c="blue">
                    {selectedAttraction.lightningWait} minutes
                  </Text>
                </div>
              </SimpleGrid>

              <Alert icon={<CheckCircle size="1rem" />} color="green">
                <Text size="sm">
                  You'll save approximately{' '}
                  {getSavingsAmount(selectedAttraction.currentWait, selectedAttraction.lightningWait)} minutes of
                  waiting time!
                </Text>
              </Alert>

              <Group justify="space-between">
                <Button variant="default" onClick={closePurchaseModal}>
                  Cancel
                </Button>
                <Button onClick={confirmPurchase}>
                  {selectedAttraction.type === 'individual' ? 'Purchase' : 'Book'} Lightning Lane
                </Button>
              </Group>
            </Stack>
          )}
        </Modal>
      </Stack>
    </Container>
  );
};

export default LightningLane;
