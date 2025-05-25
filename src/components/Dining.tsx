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
  TextInput,
  NumberInput,
  Textarea,
  ActionIcon,
  Rating,
  Divider,
  Image,
} from '@mantine/core';
import { DatePickerInput, TimeInput } from '@mantine/dates';
import { useDisclosure } from '@mantine/hooks';
import {
  Utensils,
  Clock,
  MapPin,
  Star,
  DollarSign,
  Users,
  Calendar,
  Phone,
  Heart,
  AlertCircle,
  ChefHat,
} from 'lucide-react';
import type { Restaurant } from '../types/types';

interface EnhancedRestaurant extends Restaurant {
  location: string;
  hours: string;
  reservationDifficulty: 'Easy' | 'Moderate' | 'Hard' | 'Very Hard';
  priceRange: string;
  specialties: string[];
  atmosphere: string;
  diningPlan: boolean;
  characters?: string[];
  image?: string;
}

interface Reservation {
  id: string;
  restaurant: string;
  date: Date;
  time: string;
  partySize: number;
  notes: string;
  status: 'confirmed' | 'pending' | 'cancelled';
}

const enhancedRestaurants: EnhancedRestaurant[] = [
  {
    id: 'bog',
    name: 'Be Our Guest Restaurant',
    type: 'Table Service',
    cuisine: 'French',
    park: 'Magic Kingdom',
    location: "Beast's Castle, Fantasyland",
    price: '$$$$',
    priceRange: '$35-$65 per adult',
    rating: 4.5,
    hours: '11:30 AM - 9:30 PM',
    reservationDifficulty: 'Very Hard',
    specialties: ['Braised Pork Shoulder', 'Pan-seared Chicken', 'Ratatouille'],
    atmosphere: "Elegant castle dining in Beast's enchanted castle",
    diningPlan: true,
    image: '/api/placeholder/400/200',
  },
  {
    id: 'ohana',
    name: 'Ohana',
    type: 'Table Service',
    cuisine: 'Polynesian',
    park: 'Polynesian Village Resort',
    location: "Disney's Polynesian Village Resort",
    price: '$$$',
    priceRange: '$45-$65 per adult',
    rating: 4.7,
    hours: '7:30 AM - 11:00 AM, 5:00 PM - 10:00 PM',
    reservationDifficulty: 'Hard',
    specialties: ['Grilled Skewers', 'Bread Pudding', 'Polynesian-style Family Feast'],
    atmosphere: 'Fun family-style dining with Polynesian entertainment',
    diningPlan: true,
    characters: ['Lilo', 'Stitch', 'Mickey', 'Pluto'],
    image: '/api/placeholder/400/200',
  },
  {
    id: 'chef-mickey',
    name: "Chef Mickey's",
    type: 'Character Dining',
    cuisine: 'American',
    park: 'Contemporary Resort',
    location: "Disney's Contemporary Resort",
    price: '$',
    priceRange: '$42-$62 per adult',
    rating: 4.3,
    hours: '7:00 AM - 11:30 AM, 5:00 PM - 9:30 PM',
    reservationDifficulty: 'Hard',
    specialties: ['Mickey Waffles', 'Prime Rib', 'Character Interactions'],
    atmosphere: 'Lively buffet with Disney characters visiting tables',
    diningPlan: true,
    characters: ['Mickey Mouse', 'Minnie Mouse', 'Donald Duck', 'Goofy', 'Pluto'],
    image: '/api/placeholder/400/200',
  },
  {
    id: 'space220',
    name: 'Space 220 Restaurant',
    type: 'Table Service',
    cuisine: 'Contemporary American',
    park: 'EPCOT',
    location: 'Future World, EPCOT',
    price: '$$',
    priceRange: '$55-$79 per adult',
    rating: 4.6,
    hours: '11:30 AM - 3:55 PM, 5:30 PM - 9:00 PM',
    reservationDifficulty: 'Very Hard',
    specialties: ['Space-themed dishes', 'Stellar views', 'Unique atmosphere'],
    atmosphere: 'Dining 220 miles above Earth with stunning space views',
    diningPlan: true,
    image: '/api/placeholder/400/200',
  },
  {
    id: 'dole-whip',
    name: 'Dole Whip Stand',
    type: 'Quick Service',
    cuisine: 'Snacks',
    park: 'Magic Kingdom',
    location: 'Adventureland',
    price: '$',
    priceRange: '$4-$8 per item',
    rating: 4.8,
    hours: '9:00 AM - Park Close',
    reservationDifficulty: 'Easy',
    specialties: ['Dole Whip', 'Dole Whip Float', 'Pineapple Treats'],
    atmosphere: 'Casual outdoor snack location',
    diningPlan: false,
    image: '/api/placeholder/400/200',
  },
  {
    id: 'flame-tree',
    name: 'Flame Tree Barbecue',
    type: 'Quick Service',
    cuisine: 'BBQ',
    park: 'Animal Kingdom',
    location: 'Discovery Island',
    price: '$',
    priceRange: '$12-$18 per meal',
    rating: 4.4,
    hours: '11:00 AM - Park Close',
    reservationDifficulty: 'Easy',
    specialties: ['Ribs', 'Pulled Pork', 'BBQ Platter'],
    atmosphere: 'Outdoor seating with water views',
    diningPlan: true,
    image: '/api/placeholder/400/200',
  },
  {
    id: 'topolino',
    name: "Topolino's Terrace",
    type: 'Character Dining',
    cuisine: 'Italian',
    park: "Disney's Riviera Resort",
    location: "Disney's Riviera Resort",
    price: '$$',
    priceRange: '$42-$62 per adult',
    rating: 4.5,
    hours: '7:30 AM - 11:15 AM',
    reservationDifficulty: 'Hard',
    specialties: ['Character Breakfast', 'Italian Cuisine', 'Rooftop Views'],
    atmosphere: 'Elegant rooftop dining with character interactions',
    diningPlan: true,
    characters: ['Mickey Mouse', 'Minnie Mouse', 'Donald Duck', 'Daisy Duck'],
    image: '/api/placeholder/400/200',
  },
];

const diningPlans = [
  {
    name: 'Disney Quick-Service Dining Plan',
    price: '$57 per adult/day',
    includes: ['2 Quick-Service meals', '2 Snacks', '1 Resort refillable mug'],
    description: 'Perfect for families who prefer quick, casual dining',
  },
  {
    name: 'Disney Dining Plan',
    price: '$78 per adult/day',
    includes: ['1 Table-Service meal', '1 Quick-Service meal', '2 Snacks', '1 Resort refillable mug'],
    description: 'Great balance of table and quick service dining',
  },
  {
    name: 'Disney Deluxe Dining Plan',
    price: '$119 per adult/day',
    includes: ['3 meals (Table or Quick-Service)', '2 Snacks', '1 Resort refillable mug'],
    description: 'For food lovers who want maximum flexibility and premium dining',
  },
];

interface DiningProps {
  partySize?: number;
}

const Dining: React.FC<DiningProps> = ({ partySize = 4 }) => {
  const [selectedTab, setSelectedTab] = useState<string>('browse');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedPark, setSelectedPark] = useState<string>('all');
  const [reservations, setReservations] = useState<Reservation[]>([
    {
      id: '1',
      restaurant: 'Be Our Guest Restaurant',
      date: new Date('2025-07-18'),
      time: '6:30 PM',
      partySize: 4,
      notes: 'Anniversary dinner',
      status: 'confirmed',
    },
    {
      id: '2',
      restaurant: "Chef Mickey's",
      date: new Date('2025-07-20'),
      time: '8:00 AM',
      partySize: 4,
      notes: 'Character breakfast for kids',
      status: 'confirmed',
    },
  ]);

  const [modalOpened, { open: openModal, close: closeModal }] = useDisclosure(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState<EnhancedRestaurant | null>(null);
  const [reservationModalOpened, { open: openReservationModal, close: closeReservationModal }] = useDisclosure(false);

  // New reservation form state
  const [newReservation, setNewReservation] = useState({
    date: null as Date | null,
    time: '',
    partySize: partySize,
    notes: '',
  });

  const filteredRestaurants = enhancedRestaurants.filter((restaurant) => {
    if (selectedType !== 'all' && restaurant.type !== selectedType) return false;
    if (selectedPark !== 'all' && restaurant.park !== selectedPark) return false;
    return true;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'green';
      case 'Moderate':
        return 'yellow';
      case 'Hard':
        return 'orange';
      case 'Very Hard':
        return 'red';
      default:
        return 'gray';
    }
  };

  const openRestaurantModal = (restaurant: EnhancedRestaurant) => {
    setSelectedRestaurant(restaurant);
    openModal();
  };

  const makeReservation = (restaurant: EnhancedRestaurant) => {
    setSelectedRestaurant(restaurant);
    openReservationModal();
  };

  const confirmReservation = () => {
    if (!selectedRestaurant || !newReservation.date || !newReservation.time) return;

    const reservation: Reservation = {
      id: Date.now().toString(),
      restaurant: selectedRestaurant.name,
      date: newReservation.date,
      time: newReservation.time,
      partySize: newReservation.partySize,
      notes: newReservation.notes,
      status: 'pending',
    };

    setReservations([...reservations, reservation]);
    closeReservationModal();
    setNewReservation({ date: null, time: '', partySize: partySize, notes: '' });
  };

  const renderRestaurantCard = (restaurant: EnhancedRestaurant) => (
    <Card key={restaurant.id} withBorder p="md" style={{ cursor: 'pointer' }}>
      <Stack gap="md">
        <Group justify="space-between">
          <div style={{ flex: 1 }}>
            <Group mb="xs">
              <Text fw={500} size="lg">
                {restaurant.name}
              </Text>
              <Rating value={restaurant.rating} readOnly size="sm" />
            </Group>

            <Group gap="md" mb="xs">
              <Badge color="blue" variant="light">
                {restaurant.type}
              </Badge>
              <Badge color="green" variant="light">
                {restaurant.cuisine}
              </Badge>
              <Badge color={getDifficultyColor(restaurant.reservationDifficulty)} variant="light">
                {restaurant.reservationDifficulty}
              </Badge>
            </Group>

            <Group gap="lg" mb="sm">
              <Group gap="xs">
                <MapPin size="0.8rem" />
                <Text size="sm" c="dimmed">
                  {restaurant.location}
                </Text>
              </Group>
              <Group gap="xs">
                <DollarSign size="0.8rem" />
                <Text size="sm" c="dimmed">
                  {restaurant.priceRange}
                </Text>
              </Group>
            </Group>

            <Text size="sm" c="dimmed" mb="sm">
              {restaurant.atmosphere}
            </Text>

            {restaurant.characters && (
              <Group gap="xs" mb="sm">
                <Users size="0.8rem" />
                <Text size="sm">Characters: {restaurant.characters.join(', ')}</Text>
              </Group>
            )}

            <Group gap="xs">
              <Clock size="0.8rem" />
              <Text size="sm" c="dimmed">
                {restaurant.hours}
              </Text>
            </Group>
          </div>
        </Group>

        <Group>
          <Button variant="light" onClick={() => openRestaurantModal(restaurant)}>
            View Details
          </Button>
          {restaurant.type !== 'Quick Service' && (
            <Button onClick={() => makeReservation(restaurant)}>Make Reservation</Button>
          )}
        </Group>
      </Stack>
    </Card>
  );

  const renderReservations = () => (
    <Stack gap="lg">
      <div>
        <Title order={3} mb="md">
          Your Dining Reservations
        </Title>
        <Text c="dimmed" mb="lg">
          Manage your confirmed and pending dining reservations
        </Text>
      </div>

      {reservations.length === 0 ? (
        <Card withBorder p="xl">
          <Stack align="center" gap="md">
            <Utensils size="3rem" color="gray" />
            <Text size="lg" c="dimmed">
              No reservations yet
            </Text>
            <Text c="dimmed" ta="center">
              Browse restaurants and make reservations to see them here
            </Text>
          </Stack>
        </Card>
      ) : (
        <Stack gap="md">
          {reservations.map((reservation) => (
            <Card key={reservation.id} withBorder p="md">
              <Group justify="space-between">
                <div>
                  <Text fw={500} mb="xs">
                    {reservation.restaurant}
                  </Text>
                  <Group gap="lg">
                    <Group gap="xs">
                      <Calendar size="0.8rem" />
                      <Text size="sm">{reservation.date.toLocaleDateString()}</Text>
                    </Group>
                    <Group gap="xs">
                      <Clock size="0.8rem" />
                      <Text size="sm">{reservation.time}</Text>
                    </Group>
                    <Group gap="xs">
                      <Users size="0.8rem" />
                      <Text size="sm">{reservation.partySize} guests</Text>
                    </Group>
                  </Group>
                  {reservation.notes && (
                    <Text size="sm" c="dimmed" mt="xs">
                      {reservation.notes}
                    </Text>
                  )}
                </div>
                <Badge color={reservation.status === 'confirmed' ? 'green' : 'yellow'}>{reservation.status}</Badge>
              </Group>
            </Card>
          ))}
        </Stack>
      )}
    </Stack>
  );

  const renderDiningPlans = () => (
    <Stack gap="lg">
      <div>
        <Title order={3} mb="md">
          Disney Dining Plans
        </Title>
        <Text c="dimmed" mb="lg">
          Compare dining plans to find the best value for your party
        </Text>
      </div>

      <Grid>
        {diningPlans.map((plan, index) => (
          <Grid.Col key={index} span={{ base: 12, md: 4 }}>
            <Card withBorder p="lg" h="100%">
              <Stack gap="md">
                <div>
                  <Text fw={500} size="lg" mb="xs">
                    {plan.name}
                  </Text>
                  <Text size="xl" fw={700} c="blue">
                    {plan.price}
                  </Text>
                </div>

                <Divider />

                <div>
                  <Text fw={500} mb="xs">
                    Includes:
                  </Text>
                  <Stack gap="xs">
                    {plan.includes.map((item, i) => (
                      <Text key={i} size="sm">
                        • {item}
                      </Text>
                    ))}
                  </Stack>
                </div>

                <Text size="sm" c="dimmed">
                  {plan.description}
                </Text>

                <Button variant="light" fullWidth>
                  Calculate Savings
                </Button>
              </Stack>
            </Card>
          </Grid.Col>
        ))}
      </Grid>
    </Stack>
  );

  return (
    <Container size="xl">
      <Stack gap="lg">
        <div>
          <Title order={2} mb="md">
            Dining Reservations
          </Title>
          <Text c="dimmed" mb="lg">
            Discover amazing restaurants and manage your dining reservations
          </Text>
        </div>

        <Tabs value={selectedTab} onChange={(value) => setSelectedTab(value || 'browse')}>
          <Tabs.List>
            <Tabs.Tab value="browse" leftSection={<Utensils size="0.9rem" />}>
              Browse Restaurants
            </Tabs.Tab>
            <Tabs.Tab value="reservations" leftSection={<Calendar size="0.9rem" />}>
              My Reservations
            </Tabs.Tab>
            <Tabs.Tab value="plans" leftSection={<ChefHat size="0.9rem" />}>
              Dining Plans
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="browse" pt="lg">
            <Stack gap="lg">
              {/* Filters */}
              <Paper withBorder p="md">
                <Group>
                  <Select
                    label="Restaurant Type"
                    data={[
                      { value: 'all', label: 'All Types' },
                      { value: 'Table Service', label: 'Table Service' },
                      { value: 'Quick Service', label: 'Quick Service' },
                      { value: 'Character Dining', label: 'Character Dining' },
                    ]}
                    value={selectedType}
                    onChange={(value) => setSelectedType(value || 'all')}
                  />
                  <Select
                    label="Location"
                    data={[
                      { value: 'all', label: 'All Locations' },
                      { value: 'Magic Kingdom', label: 'Magic Kingdom' },
                      { value: 'EPCOT', label: 'EPCOT' },
                      { value: 'Hollywood Studios', label: 'Hollywood Studios' },
                      { value: 'Animal Kingdom', label: 'Animal Kingdom' },
                      { value: 'Disney Springs', label: 'Disney Springs' },
                      { value: 'Resort Hotels', label: 'Resort Hotels' },
                    ]}
                    value={selectedPark}
                    onChange={(value) => setSelectedPark(value || 'all')}
                  />
                </Group>
              </Paper>

              {/* Restaurant Grid */}
              <Grid>
                {filteredRestaurants.map((restaurant) => (
                  <Grid.Col key={restaurant.id} span={{ base: 12, md: 6 }}>
                    {renderRestaurantCard(restaurant)}
                  </Grid.Col>
                ))}
              </Grid>
            </Stack>
          </Tabs.Panel>

          <Tabs.Panel value="reservations" pt="lg">
            {renderReservations()}
          </Tabs.Panel>

          <Tabs.Panel value="plans" pt="lg">
            {renderDiningPlans()}
          </Tabs.Panel>
        </Tabs>

        {/* Restaurant Detail Modal */}
        <Modal opened={modalOpened} onClose={closeModal} title={selectedRestaurant?.name} size="lg">
          {selectedRestaurant && (
            <Stack gap="md">
              <Group>
                <Badge color="blue" variant="light">
                  {selectedRestaurant.type}
                </Badge>
                <Badge color="green" variant="light">
                  {selectedRestaurant.cuisine}
                </Badge>
                <Rating value={selectedRestaurant.rating} readOnly />
              </Group>

              <Text>{selectedRestaurant.atmosphere}</Text>

              <Group gap="lg">
                <div>
                  <Text size="sm" c="dimmed">
                    Location
                  </Text>
                  <Text>{selectedRestaurant.location}</Text>
                </div>
                <div>
                  <Text size="sm" c="dimmed">
                    Price Range
                  </Text>
                  <Text>{selectedRestaurant.priceRange}</Text>
                </div>
                <div>
                  <Text size="sm" c="dimmed">
                    Hours
                  </Text>
                  <Text>{selectedRestaurant.hours}</Text>
                </div>
              </Group>

              {selectedRestaurant.characters && (
                <div>
                  <Text size="sm" c="dimmed" mb="xs">
                    Character Appearances
                  </Text>
                  <Text>{selectedRestaurant.characters.join(', ')}</Text>
                </div>
              )}

              <div>
                <Text size="sm" c="dimmed" mb="xs">
                  Specialties
                </Text>
                <Group>
                  {selectedRestaurant.specialties.map((specialty, index) => (
                    <Badge key={index} variant="outline">
                      {specialty}
                    </Badge>
                  ))}
                </Group>
              </div>

              <Group>
                <Badge color={getDifficultyColor(selectedRestaurant.reservationDifficulty)}>
                  {selectedRestaurant.reservationDifficulty} to book
                </Badge>
                {selectedRestaurant.diningPlan && (
                  <Badge color="green" variant="light">
                    Dining Plan Accepted
                  </Badge>
                )}
              </Group>

              {selectedRestaurant.type !== 'Quick Service' && (
                <Button fullWidth onClick={() => makeReservation(selectedRestaurant)}>
                  Make Reservation
                </Button>
              )}
            </Stack>
          )}
        </Modal>

        {/* Reservation Modal */}
        <Modal
          opened={reservationModalOpened}
          onClose={closeReservationModal}
          title={`Make Reservation - ${selectedRestaurant?.name}`}
          size="md"
        >
          <Stack gap="md">
            <DatePickerInput
              label="Date"
              placeholder="Select date"
              value={newReservation.date}
              onChange={(date) => setNewReservation({ ...newReservation, date })}
              minDate={new Date()}
              required
            />

            <TimeInput
              label="Preferred Time"
              value={newReservation.time}
              onChange={(event) => setNewReservation({ ...newReservation, time: event.currentTarget.value })}
              required
            />

            <NumberInput
              label="Party Size"
              value={newReservation.partySize}
              onChange={(value) => setNewReservation({ ...newReservation, partySize: value || 1 })}
              min={1}
              max={20}
              required
            />

            <Textarea
              label="Special Requests"
              placeholder="Allergies, celebration, seating preferences..."
              value={newReservation.notes}
              onChange={(event) => setNewReservation({ ...newReservation, notes: event.currentTarget.value })}
            />

            <Group justify="space-between">
              <Button variant="default" onClick={closeReservationModal}>
                Cancel
              </Button>
              <Button onClick={confirmReservation} disabled={!newReservation.date || !newReservation.time}>
                Confirm Reservation
              </Button>
            </Group>
          </Stack>
        </Modal>
      </Stack>
    </Container>
  );
};

export default Dining;
