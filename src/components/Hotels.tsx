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
  Paper,
  Modal,
  Select,
  NumberInput,
  Tabs,
  Rating,
  Divider,
  ThemeIcon,
  SimpleGrid,
  Alert,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useDisclosure } from '@mantine/hooks';
import {
  Hotel as HotelIcon,
  MapPin,
  Star,
  DollarSign,
  Users,
  Calendar,
  Car,
  Wifi,
  Coffee,
  Waves,
  Utensils,
  Bus,
  Ship,
  Clock,
  Bed,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Heart,
  Camera,
  TreePine,
  Crown,
} from 'lucide-react';
import type { Hotel } from '../types/types';

interface EnhancedHotel extends Hotel {
  category: 'Moderate' | 'Deluxe Villa';
  location: string;
  theme: string;
  description: string;
  roomTypes: Array<{
    name: string;
    maxOccupancy: number;
    size: string;
    amenities: string[];
    pricePerNight: number;
  }>;
  diningOptions: Array<{
    name: string;
    type: 'Table Service' | 'Quick Service' | 'Lounge';
    cuisine: string;
    priceRange: string;
  }>;
  recreation: Array<{
    name: string;
    type: 'Pool' | 'Recreation' | 'Entertainment';
    description: string;
  }>;
  transportation_extra: {
    primary: string;
    destinations: Array<{
      location: string;
      method: string;
      duration: string;
    }>;
  };
  checkInTime: string;
  checkOutTime: string;
  parkingCost: string;
  earlyMagicHours: boolean;
  rating: number;
  totalRooms: number;
  yearOpened: number;
  renovated?: number;
  highlights: string[];
  pros: string[];
  cons: string[];
  bestFor: string[];
}

interface HotelBooking {
  hotelId: string;
  hotelName: string;
  checkIn: Date;
  checkOut: Date;
  roomType: string;
  guests: number;
  nights: number;
  pricePerNight: number;
  totalCost: number;
  status: 'confirmed' | 'pending' | 'cancelled';
  confirmationNumber: string;
}

const disneyHotels: EnhancedHotel[] = [
  {
    id: 'port-orleans-riverside',
    name: "Disney's Port Orleans Resort - Riverside",
    tier: 'Moderate',
    category: 'Moderate',
    location: 'Disney Springs Resort Area',
    theme: 'Southern charm and bayou atmosphere',
    description:
      'Experience the charm of the antebellum South along the Sassagoula River, featuring beautiful magnolia trees, horse-drawn carriage rides, and authentic Southern hospitality.',
    price: '$320/night',
    transportation: 'Boat to Disney Springs, bus to parks',
    amenities: ['Boat Transport', 'Horse-drawn Carriages', 'Multiple Pools', 'Fishing', 'Southern Theming'],
    roomTypes: [
      {
        name: 'Standard Room - Alligator Bayou',
        maxOccupancy: 4,
        size: '314 sq ft',
        amenities: ['Two queen beds', 'Rustic bayou theming', 'Mini-fridge', 'Coffee maker'],
        pricePerNight: 300,
      },
      {
        name: 'Standard Room - Magnolia Bend',
        maxOccupancy: 4,
        size: '314 sq ft',
        amenities: ['Two queen beds', 'Mansion-style theming', 'Mini-fridge', 'Coffee maker'],
        pricePerNight: 320,
      },
      {
        name: 'Preferred Room',
        maxOccupancy: 4,
        size: '314 sq ft',
        amenities: ['Close to amenities', 'Two queen beds', 'Premium location', 'River views available'],
        pricePerNight: 360,
      },
      {
        name: 'Royal Room',
        maxOccupancy: 4,
        size: '314 sq ft',
        amenities: ['Princess and the Frog theming', 'Special décor', 'Two queen beds', 'Kids love the theming'],
        pricePerNight: 380,
      },
    ],
    diningOptions: [
      { name: "Boatwright's Dining Hall", type: 'Table Service', cuisine: 'Southern/Cajun', priceRange: '$$' },
      { name: 'Riverside Mill Food Court', type: 'Quick Service', cuisine: 'American-Southern', priceRange: '$' },
      { name: 'River Roost Lounge', type: 'Lounge', cuisine: 'Appetizers & Drinks', priceRange: '$$' },
      { name: 'Muddy Rivers Pool Bar', type: 'Quick Service', cuisine: 'Pool Snacks', priceRange: '$' },
    ],
    recreation: [
      { name: "Ol' Man Island", type: 'Pool', description: 'Main feature pool with slides and play area' },
      { name: 'Magnolia Bend Quiet Pools', type: 'Pool', description: 'Peaceful pools in mansion area' },
      { name: 'Horse-drawn Carriage Rides', type: 'Recreation', description: 'Romantic carriage rides around resort' },
      { name: 'Fishing Excursions', type: 'Recreation', description: 'Guided fishing trips on Sassagoula River' },
      {
        name: 'Campfire & Movies',
        type: 'Entertainment',
        description: "Nightly campfire with s'mores and Disney movies",
      },
    ],
    transportation_extra: {
      primary: 'Boat/Bus',
      destinations: [
        { location: 'Disney Springs', method: 'Boat', duration: '20 minutes' },
        { location: 'Magic Kingdom', method: 'Bus', duration: '20 minutes' },
        { location: 'EPCOT', method: 'Bus', duration: '15 minutes' },
        { location: 'Hollywood Studios', method: 'Bus', duration: '15 minutes' },
        { location: 'Animal Kingdom', method: 'Bus', duration: '25 minutes' },
      ],
    },
    checkInTime: '3:00 PM',
    checkOutTime: '11:00 AM',
    parkingCost: 'Complimentary',
    earlyMagicHours: true,
    rating: 4.3,
    totalRooms: 2048,
    yearOpened: 1992,
    renovated: 2019,
    highlights: [
      'Boat transportation to Disney Springs',
      'Beautiful Southern and bayou theming',
      'Royal Rooms with Princess and the Frog theme',
      'Horse-drawn carriage rides',
      'Extensive recreation activities',
    ],
    pros: [
      'Charming Southern atmosphere and theming',
      'Scenic boat ride to Disney Springs',
      'Multiple pool areas and recreation',
      'Good value for a moderate resort',
      'Beautiful landscaping and river views',
    ],
    cons: [
      'Large resort - long walks to some areas',
      'Only bus transportation to theme parks',
      'Can be crowded during peak seasons',
      'Some rooms are quite far from amenities',
    ],
    bestFor: [
      'Families who love Southern charm',
      'Disney Springs enthusiasts',
      'Guests wanting extensive recreation',
      'Princess and the Frog fans',
    ],
  },
  {
    id: 'grand-floridian',
    name: "Disney's Grand Floridian Resort & Spa",
    tier: 'Deluxe Villa',
    category: 'Deluxe Villa',
    location: 'Magic Kingdom Resort Area',
    theme: 'Victorian elegance and luxury',
    description:
      'Experience the grandeur of a bygone era at this Victorian-style resort, featuring award-winning dining, a world-class spa, and direct monorail access to Magic Kingdom.',
    price: '$800/night',
    transportation: 'Monorail and boat to Magic Kingdom',
    amenities: ['Spa', 'Fine Dining', 'Beach', 'Monorail Access', 'Wedding Pavilion'],
    roomTypes: [
      {
        name: 'Standard Room',
        maxOccupancy: 5,
        size: '440 sq ft',
        amenities: ['Two queen beds', 'Balcony or patio', 'Mini-fridge', 'Coffee maker'],
        pricePerNight: 800,
      },
      {
        name: 'Club Level Room',
        maxOccupancy: 5,
        size: '440 sq ft',
        amenities: ['Club Level access', 'Concierge service', 'Exclusive lounge', 'Complimentary snacks'],
        pricePerNight: 1200,
      },
      {
        name: 'One-Bedroom Villa',
        maxOccupancy: 8,
        size: '844 sq ft',
        amenities: ['Full kitchen', 'Washer/dryer', 'Living area', 'Master bedroom'],
        pricePerNight: 1500,
      },
      {
        name: 'Grand Villa',
        maxOccupancy: 12,
        size: '2,800 sq ft',
        amenities: ['3 bedrooms', 'Full kitchen', 'Dining room', 'Multiple bathrooms'],
        pricePerNight: 3500,
      },
    ],
    diningOptions: [
      { name: "Victoria & Albert's", type: 'Table Service', cuisine: 'American Fine Dining', priceRange: '$$$$' },
      { name: 'Citricos', type: 'Table Service', cuisine: 'Mediterranean', priceRange: '$$$' },
      { name: "Narcoossee's", type: 'Table Service', cuisine: 'Seafood', priceRange: '$$$' },
      { name: 'Grand Floridian Café', type: 'Table Service', cuisine: 'American', priceRange: '$$' },
      { name: 'Gasparilla Island Grill', type: 'Quick Service', cuisine: 'American', priceRange: '$' },
    ],
    recreation: [
      { name: 'Beach Pool', type: 'Pool', description: 'Zero-entry pool with beach sand bottom' },
      { name: 'Senses Spa', type: 'Recreation', description: 'Full-service spa with treatments' },
      { name: 'Marina', type: 'Recreation', description: 'Boat rentals and watersports' },
      { name: 'Grand Floridian Society Orchestra', type: 'Entertainment', description: 'Live music in the lobby' },
      { name: 'Alice in Wonderland Tea Party', type: 'Entertainment', description: 'Character tea party for children' },
    ],
    transportation_extra: {
      primary: 'Monorail',
      destinations: [
        { location: 'Magic Kingdom', method: 'Monorail', duration: '5 minutes' },
        { location: 'Transportation & Ticket Center', method: 'Monorail', duration: '3 minutes' },
        { location: 'EPCOT', method: 'Bus', duration: '20 minutes' },
        { location: 'Hollywood Studios', method: 'Bus', duration: '25 minutes' },
        { location: 'Animal Kingdom', method: 'Bus', duration: '30 minutes' },
      ],
    },
    checkInTime: '3:00 PM',
    checkOutTime: '11:00 AM',
    parkingCost: '$25/night',
    earlyMagicHours: true,
    rating: 4.6,
    totalRooms: 867,
    yearOpened: 1988,
    renovated: 2013,
    highlights: [
      'Monorail access to Magic Kingdom',
      "Award-winning Victoria & Albert's restaurant",
      'World-class Senses Spa',
      'Victorian elegance and theming',
      'Wedding Pavilion for ceremonies',
    ],
    pros: [
      'Premium location with monorail access',
      'Luxurious accommodations and amenities',
      'Multiple award-winning restaurants',
      'Beautiful Victorian theming throughout',
      'Excellent service and attention to detail',
    ],
    cons: [
      'Very expensive room rates',
      'Can be crowded with wedding parties',
      'Limited quick service dining options',
      'Some rooms face parking areas',
    ],
    bestFor: [
      'Honeymoons and romantic getaways',
      'Special celebrations and anniversaries',
      'Luxury travelers',
      'Adults seeking upscale experiences',
    ],
  },
];

interface HotelsProps {
  partySize?: number;
  tripDates?: { start: Date; end: Date };
}

const Hotels: React.FC<HotelsProps> = ({ partySize = 4, tripDates }) => {
  const [selectedTab, setSelectedTab] = useState<string>('browse');
  const [modalOpened, { open: openModal, close: closeModal }] = useDisclosure(false);
  const [selectedHotel, setSelectedHotel] = useState<EnhancedHotel | null>(null);
  const [bookingModalOpened, { open: openBookingModal, close: closeBookingModal }] = useDisclosure(false);

  // Mock current booking - Port Orleans Riverside
  const [currentBooking, setCurrentBooking] = useState<HotelBooking | null>({
    hotelId: 'port-orleans-riverside',
    hotelName: "Disney's Port Orleans Resort - Riverside",
    checkIn: tripDates?.start || new Date('2025-07-16'),
    checkOut: tripDates?.end || new Date('2025-07-30'),
    roomType: 'Standard Room - Magnolia Bend',
    guests: partySize,
    nights: 14,
    pricePerNight: 320,
    totalCost: 4480,
    status: 'confirmed',
    confirmationNumber: 'WDW-POR456789',
  });

  // Booking form state
  const [booking, setBooking] = useState<Partial<HotelBooking>>({
    checkIn: tripDates?.start || null,
    checkOut: tripDates?.end || null,
    guests: partySize,
    roomType: 'Standard Room',
  });

  const openHotelModal = (hotel: EnhancedHotel) => {
    setSelectedHotel(hotel);
    openModal();
  };

  const openBooking = (hotel: EnhancedHotel) => {
    setSelectedHotel(hotel);
    setBooking({
      ...booking,
      hotelName: hotel.name,
      hotelId: hotel.id,
      roomType: hotel.roomTypes[0].name,
    });
    openBookingModal();
  };

  const confirmBooking = () => {
    if (!selectedHotel || !booking.checkIn || !booking.checkOut) return;

    const nights = Math.ceil((booking.checkOut.getTime() - booking.checkIn.getTime()) / (1000 * 60 * 60 * 24));
    const roomType = selectedHotel.roomTypes.find((room) => room.name === booking.roomType);
    const pricePerNight = roomType?.pricePerNight || selectedHotel.roomTypes[0].pricePerNight;
    const totalCost = nights * pricePerNight;

    const newBooking: HotelBooking = {
      hotelId: selectedHotel.id,
      hotelName: selectedHotel.name,
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
      roomType: booking.roomType || selectedHotel.roomTypes[0].name,
      guests: booking.guests || partySize,
      nights: nights,
      pricePerNight: pricePerNight,
      totalCost: totalCost,
      status: 'confirmed',
      confirmationNumber: `WDW-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    };

    setCurrentBooking(newBooking);
    closeBookingModal();
  };

  const getTransportationIcon = (method: string) => {
    if (method.toLowerCase().includes('monorail')) return <Car size="1rem" />;
    if (method.toLowerCase().includes('boat')) return <Ship size="1rem" />;
    return <Bus size="1rem" />;
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Moderate':
        return 'blue';
      case 'Deluxe Villa':
        return 'grape';
      default:
        return 'gray';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Moderate':
        return <Star size="1.2rem" />;
      case 'Deluxe Villa':
        return <Crown size="1.2rem" />;
      default:
        return <HotelIcon size="1.2rem" />;
    }
  };

  const renderHotelCard = (hotel: EnhancedHotel) => (
    <Card withBorder p="lg" h="100%" style={{ cursor: 'pointer' }} onClick={() => openHotelModal(hotel)}>
      <Stack gap="md" h="100%">
        <div>
          <Group justify="space-between" mb="md">
            <Badge color={getCategoryColor(hotel.category)} size="lg" leftSection={getCategoryIcon(hotel.category)}>
              {hotel.category} Resort
            </Badge>
            <Group gap="xs">
              <Rating value={hotel.rating} readOnly size="sm" />
              <Text size="sm" c="dimmed">
                ({hotel.rating})
              </Text>
            </Group>
          </Group>

          <Title order={3} mb="xs" lineClamp={2}>
            {hotel.name}
          </Title>
          <Text size="sm" c="dimmed" mb="md" lineClamp={3}>
            {hotel.description}
          </Text>

          <Group gap="lg" mb="md">
            <Group gap="xs">
              <MapPin size="0.9rem" />
              <Text size="sm">{hotel.location}</Text>
            </Group>
          </Group>

          <Group gap="xs" mb="md">
            {getTransportationIcon(hotel.transportation.primary)}
            <Text size="sm">{hotel.transportation.primary}</Text>
          </Group>

          <Group mb="md">
            <Group gap="xs">
              <DollarSign size="0.9rem" />
              <Text size="sm" fw={500}>
                From ${hotel.roomTypes[0].pricePerNight}/night
              </Text>
            </Group>
            <Group gap="xs">
              <Users size="0.9rem" />
              <Text size="sm">Up to {hotel.roomTypes[0].maxOccupancy}</Text>
            </Group>
          </Group>

          <div style={{ flex: 1 }}>
            <Text size="sm" fw={500} mb="xs">
              Key Features
            </Text>
            <Stack gap="xs">
              {hotel.highlights.slice(0, 4).map((highlight, index) => (
                <Text key={index} size="sm">
                  • {highlight}
                </Text>
              ))}
            </Stack>
          </div>
        </div>

        <Group>
          <Button
            variant="light"
            onClick={(e) => {
              e.stopPropagation();
              openHotelModal(hotel);
            }}
            style={{ flex: 1 }}
          >
            View Details
          </Button>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              openBooking(hotel);
            }}
            style={{ flex: 1 }}
          >
            Book Now
          </Button>
        </Group>
      </Stack>
    </Card>
  );

  const renderBookingDetails = () => {
    if (!currentBooking) {
      return (
        <Card withBorder p="xl">
          <Stack align="center" gap="md">
            <HotelIcon size="3rem" color="gray" />
            <Text size="lg" c="dimmed">
              No hotel booked yet
            </Text>
            <Text c="dimmed" ta="center">
              Browse hotels and make a reservation to see details here
            </Text>
            <Button onClick={() => setSelectedTab('browse')}>Browse Hotels</Button>
          </Stack>
        </Card>
      );
    }

    return (
      <Stack gap="lg">
        <Card withBorder p="lg">
          <Stack gap="md">
            <Group justify="space-between">
              <div>
                <Text fw={500} size="lg">
                  {currentBooking.hotelName}
                </Text>
                <Text size="sm" c="dimmed">
                  {currentBooking.roomType}
                </Text>
              </div>
              <Badge color="green" size="lg">
                <CheckCircle size="0.8rem" style={{ marginRight: 4 }} />
                Confirmed
              </Badge>
            </Group>

            <Divider />

            <SimpleGrid cols={{ base: 1, sm: 2 }}>
              <div>
                <Text size="sm" c="dimmed">
                  Check-in
                </Text>
                <Group gap="xs">
                  <Calendar size="0.9rem" />
                  <Text fw={500}>{currentBooking.checkIn.toLocaleDateString()}</Text>
                </Group>
                <Text size="xs" c="dimmed">
                  After 3:00 PM
                </Text>
              </div>
              <div>
                <Text size="sm" c="dimmed">
                  Check-out
                </Text>
                <Group gap="xs">
                  <Calendar size="0.9rem" />
                  <Text fw={500}>{currentBooking.checkOut.toLocaleDateString()}</Text>
                </Group>
                <Text size="xs" c="dimmed">
                  Before 11:00 AM
                </Text>
              </div>
              <div>
                <Text size="sm" c="dimmed">
                  Guests
                </Text>
                <Group gap="xs">
                  <Users size="0.9rem" />
                  <Text fw={500}>{currentBooking.guests} guests</Text>
                </Group>
              </div>
              <div>
                <Text size="sm" c="dimmed">
                  Nights
                </Text>
                <Group gap="xs">
                  <Bed size="0.9rem" />
                  <Text fw={500}>{currentBooking.nights} nights</Text>
                </Group>
              </div>
            </SimpleGrid>

            <Divider />

            <Group justify="space-between">
              <div>
                <Text size="sm" c="dimmed">
                  Confirmation Number
                </Text>
                <Text fw={500} style={{ fontFamily: 'monospace' }}>
                  {currentBooking.confirmationNumber}
                </Text>
              </div>
              <div style={{ textAlign: 'right' }}>
                <Text size="sm" c="dimmed">
                  Total Cost
                </Text>
                <Text fw={700} size="lg" c="blue">
                  ${currentBooking.totalCost.toLocaleString()}
                </Text>
              </div>
            </Group>

            <Group>
              <Button variant="light" fullWidth leftSection={<ExternalLink size="1rem" />}>
                Manage Reservation
              </Button>
            </Group>
          </Stack>
        </Card>

        {/* Resort Benefits */}
        <Card withBorder p="lg">
          <Title order={4} mb="md">
            Your Resort Benefits
          </Title>
          <SimpleGrid cols={{ base: 1, md: 2 }}>
            <Stack gap="sm">
              <Group gap="xs">
                <CheckCircle size="1rem" color="green" />
                <Text size="sm">Early Theme Park Entry (30 minutes)</Text>
              </Group>
              <Group gap="xs">
                <CheckCircle size="1rem" color="green" />
                <Text size="sm">Complimentary Disney transportation</Text>
              </Group>
              <Group gap="xs">
                <CheckCircle size="1rem" color="green" />
                <Text size="sm">Complimentary Wi-Fi</Text>
              </Group>
            </Stack>
            <Stack gap="sm">
              <Group gap="xs">
                <CheckCircle size="1rem" color="green" />
                <Text size="sm">Disney Resort ID for charges</Text>
              </Group>
              <Group gap="xs">
                <CheckCircle size="1rem" color="green" />
                <Text size="sm">Package delivery to resort</Text>
              </Group>
              <Group gap="xs">
                <CheckCircle size="1rem" color="green" />
                <Text size="sm">Access to Extra Magic Hours</Text>
              </Group>
            </Stack>
          </SimpleGrid>
        </Card>
      </Stack>
    );
  };

  const renderComparisonGuide = () => (
    <Stack gap="lg">
      <div>
        <Title order={3} mb="md">
          Resort Comparison
        </Title>
        <Text c="dimmed" mb="lg">
          Compare the two featured Disney resort options for your stay
        </Text>
      </div>

      <SimpleGrid cols={{ base: 1, lg: 2 }}>
        {disneyHotels.map((hotel) => (
          <Card key={hotel.id} withBorder p="lg">
            <Stack gap="md">
              <Group>
                <ThemeIcon color={getCategoryColor(hotel.category)} size="xl">
                  {getCategoryIcon(hotel.category)}
                </ThemeIcon>
                <div>
                  <Text fw={500} size="lg">
                    {hotel.name}
                  </Text>
                  <Badge color={getCategoryColor(hotel.category)}>{hotel.category}</Badge>
                </div>
              </Group>

              <Text size="sm">{hotel.description}</Text>

              <div>
                <Text fw={500} mb="xs">
                  Pros
                </Text>
                <Stack gap="xs">
                  {hotel.pros.map((pro, index) => (
                    <Text key={index} size="sm" c="green">
                      ✓ {pro}
                    </Text>
                  ))}
                </Stack>
              </div>

              <div>
                <Text fw={500} mb="xs">
                  Best For
                </Text>
                <Group>
                  {hotel.bestFor.map((item, index) => (
                    <Badge key={index} variant="outline" size="sm">
                      {item}
                    </Badge>
                  ))}
                </Group>
              </div>

              <Divider />

              <Group justify="space-between">
                <Text fw={500}>Starting Price</Text>
                <Text fw={700} c="blue">
                  ${hotel.roomTypes[0].pricePerNight}/night
                </Text>
              </Group>

              <Button onClick={() => openHotelModal(hotel)} fullWidth>
                View Details
              </Button>
            </Stack>
          </Card>
        ))}
      </SimpleGrid>

      <Alert icon={<AlertCircle size="1rem" />} title="Booking Tips" color="blue">
        <Stack gap="xs">
          <Text size="sm">
            • Port Orleans Riverside offers great value with beautiful theming and boat transport to Disney Springs
          </Text>
          <Text size="sm">• Grand Floridian provides luxury accommodations with monorail access to Magic Kingdom</Text>
          <Text size="sm">• Book 11+ months in advance for best availability, especially for holiday periods</Text>
          <Text size="sm">• Consider your transportation preferences - monorail vs. boat vs. bus</Text>
          <Text size="sm">• All Disney resort guests receive Early Theme Park Entry (30 minutes before opening)</Text>
        </Stack>
      </Alert>
    </Stack>
  );

  return (
    <Container size="xl">
      <Stack gap="lg">
        <div>
          <Title order={2} mb="md">
            Disney Resort Hotels
          </Title>
          <Text c="dimmed" mb="lg">
            Choose from two distinct Disney resort experiences for your Lewis Family Disney Trip
          </Text>
        </div>

        <Tabs value={selectedTab} onChange={(value) => setSelectedTab(value || 'browse')}>
          <Tabs.List>
            <Tabs.Tab value="browse" leftSection={<HotelIcon size="0.9rem" />}>
              Browse Hotels
            </Tabs.Tab>
            <Tabs.Tab value="booking" leftSection={<Calendar size="0.9rem" />}>
              My Reservation
            </Tabs.Tab>
            <Tabs.Tab value="compare" leftSection={<Star size="0.9rem" />}>
              Compare Resorts
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="browse" pt="lg">
            <Stack gap="lg">
              <Paper withBorder p="md">
                <Text fw={500} mb="md">
                  Featured Disney Resorts
                </Text>
                <Text size="sm" c="dimmed">
                  We've selected two excellent resort options that offer different experiences and price points for your
                  Disney vacation.
                </Text>
              </Paper>

              {/* Hotels Grid */}
              <Grid>
                {disneyHotels.map((hotel) => (
                  <Grid.Col key={hotel.id} span={{ base: 12, lg: 6 }}>
                    {renderHotelCard(hotel)}
                  </Grid.Col>
                ))}
              </Grid>
            </Stack>
          </Tabs.Panel>

          <Tabs.Panel value="booking" pt="lg">
            <Stack gap="lg">
              <div>
                <Title order={3} mb="md">
                  Your Hotel Reservation
                </Title>
                <Text c="dimmed" mb="lg">
                  View and manage your current hotel booking for the Lewis Family Disney Trip
                </Text>
              </div>
              {renderBookingDetails()}
            </Stack>
          </Tabs.Panel>

          <Tabs.Panel value="compare" pt="lg">
            {renderComparisonGuide()}
          </Tabs.Panel>
        </Tabs>

        {/* Hotel Detail Modal */}
        <Modal opened={modalOpened} onClose={closeModal} title={selectedHotel?.name} size="xl">
          {selectedHotel && (
            <Stack gap="lg">
              <Group>
                <Badge color={getCategoryColor(selectedHotel.category)}>{selectedHotel.category}</Badge>
                <Rating value={selectedHotel.rating} readOnly />
                <Text c="dimmed">
                  ({selectedHotel.rating}) • {selectedHotel.totalRooms} rooms
                </Text>
                <Text c="dimmed">• Opened {selectedHotel.yearOpened}</Text>
              </Group>

              <Text>{selectedHotel.description}</Text>

              <SimpleGrid cols={{ base: 1, md: 2 }}>
                <div>
                  <Text fw={500} mb="xs">
                    Location & Check-in
                  </Text>
                  <Stack gap="xs">
                    <Group gap="xs">
                      <MapPin size="0.8rem" />
                      <Text size="sm">{selectedHotel.location}</Text>
                    </Group>
                    <Group gap="xs">
                      <Clock size="0.8rem" />
                      <Text size="sm">
                        Check-in: {selectedHotel.checkInTime} | Check-out: {selectedHotel.checkOutTime}
                      </Text>
                    </Group>
                    <Group gap="xs">
                      <Car size="0.8rem" />
                      <Text size="sm">Parking: {selectedHotel.parkingCost}</Text>
                    </Group>
                  </Stack>
                </div>
                <div>
                  <Text fw={500} mb="xs">
                    Transportation
                  </Text>
                  <Stack gap="xs">
                    {selectedHotel.transportation.destinations.slice(0, 3).map((dest, index) => (
                      <Group key={index} gap="xs">
                        {getTransportationIcon(dest.method)}
                        <Text size="sm">
                          {dest.location}: {dest.duration}
                        </Text>
                      </Group>
                    ))}
                  </Stack>
                </div>
              </SimpleGrid>

              <Divider />

              {/* Room Types */}
              <div>
                <Text fw={500} mb="md">
                  Room Types & Pricing
                </Text>
                <Stack gap="md">
                  {selectedHotel.roomTypes.map((room, index) => (
                    <Card key={index} withBorder p="md">
                      <Group justify="space-between" mb="sm">
                        <div>
                          <Text fw={500}>{room.name}</Text>
                          <Text size="sm" c="dimmed">
                            {room.size} • Up to {room.maxOccupancy} guests
                          </Text>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <Text fw={700} size="lg">
                            ${room.pricePerNight}
                          </Text>
                          <Text size="xs" c="dimmed">
                            per night
                          </Text>
                        </div>
                      </Group>
                      <Group>
                        {room.amenities.map((amenity, i) => (
                          <Badge key={i} variant="outline" size="sm">
                            {amenity}
                          </Badge>
                        ))}
                      </Group>
                    </Card>
                  ))}
                </Stack>
              </div>

              <Divider />

              {/* Dining */}
              <div>
                <Text fw={500} mb="md">
                  Dining Options
                </Text>
                <SimpleGrid cols={{ base: 1, md: 2 }}>
                  {selectedHotel.diningOptions.map((restaurant, index) => (
                    <Group key={index} justify="space-between">
                      <div>
                        <Text size="sm" fw={500}>
                          {restaurant.name}
                        </Text>
                        <Text size="xs" c="dimmed">
                          {restaurant.type} • {restaurant.cuisine}
                        </Text>
                      </div>
                      <Badge variant="outline" size="sm">
                        {restaurant.priceRange}
                      </Badge>
                    </Group>
                  ))}
                </SimpleGrid>
              </div>

              <Divider />

              {/* Recreation */}
              <div>
                <Text fw={500} mb="md">
                  Recreation & Activities
                </Text>
                <Stack gap="sm">
                  {selectedHotel.recreation.map((activity, index) => (
                    <div key={index}>
                      <Group justify="space-between">
                        <div>
                          <Text size="sm" fw={500}>
                            {activity.name}
                          </Text>
                          <Text size="xs" c="dimmed">
                            {activity.description}
                          </Text>
                        </div>
                        <Badge variant="light" size="sm">
                          {activity.type}
                        </Badge>
                      </Group>
                    </div>
                  ))}
                </Stack>
              </div>

              <Divider />

              {/* Pros and Cons */}
              <SimpleGrid cols={{ base: 1, md: 2 }}>
                <div>
                  <Text fw={500} mb="xs" c="green">
                    Why Choose This Resort
                  </Text>
                  <Stack gap="xs">
                    {selectedHotel.pros.map((pro, index) => (
                      <Text key={index} size="sm" c="green">
                        ✓ {pro}
                      </Text>
                    ))}
                  </Stack>
                </div>
                <div>
                  <Text fw={500} mb="xs" c="orange">
                    Things to Consider
                  </Text>
                  <Stack gap="xs">
                    {selectedHotel.cons.map((con, index) => (
                      <Text key={index} size="sm" c="orange">
                        • {con}
                      </Text>
                    ))}
                  </Stack>
                </div>
              </SimpleGrid>

              <Group>
                <Button variant="light" leftSection={<Heart size="1rem" />}>
                  Add to Favorites
                </Button>
                <Button onClick={() => openBooking(selectedHotel)} leftSection={<Calendar size="1rem" />}>
                  Book This Hotel
                </Button>
              </Group>
            </Stack>
          )}
        </Modal>

        {/* Booking Modal */}
        <Modal opened={bookingModalOpened} onClose={closeBookingModal} title={`Book ${selectedHotel?.name}`} size="md">
          <Stack gap="md">
            <Group>
              <DatePickerInput
                label="Check-in Date"
                value={booking.checkIn}
                onChange={(date) => setBooking({ ...booking, checkIn: date })}
                minDate={new Date()}
                style={{ flex: 1 }}
                required
              />
              <DatePickerInput
                label="Check-out Date"
                value={booking.checkOut}
                onChange={(date) => setBooking({ ...booking, checkOut: date })}
                minDate={booking.checkIn || new Date()}
                style={{ flex: 1 }}
                required
              />
            </Group>

            <Group>
              <Select
                label="Room Type"
                data={
                  selectedHotel?.roomTypes.map((room) => ({
                    value: room.name,
                    label: `${room.name} - ${room.pricePerNight}/night`,
                  })) || []
                }
                value={booking.roomType}
                onChange={(value) => setBooking({ ...booking, roomType: value || 'Standard Room' })}
                style={{ flex: 1 }}
              />
              <NumberInput
                label="Guests"
                value={booking.guests}
                onChange={(value) => setBooking({ ...booking, guests: value || 1 })}
                min={1}
                max={selectedHotel?.roomTypes.find((r) => r.name === booking.roomType)?.maxOccupancy || 8}
                style={{ flex: 1 }}
              />
            </Group>

            {booking.checkIn && booking.checkOut && selectedHotel && (
              <Paper withBorder p="md">
                <Stack gap="xs">
                  <Group justify="space-between">
                    <Text>Nights:</Text>
                    <Text fw={500}>
                      {Math.ceil((booking.checkOut.getTime() - booking.checkIn.getTime()) / (1000 * 60 * 60 * 24))}
                    </Text>
                  </Group>
                  <Group justify="space-between">
                    <Text>Rate per night:</Text>
                    <Text fw={500}>
                      $
                      {selectedHotel.roomTypes.find((r) => r.name === booking.roomType)?.pricePerNight ||
                        selectedHotel.roomTypes[0].pricePerNight}
                    </Text>
                  </Group>
                  <Divider />
                  <Group justify="space-between">
                    <Text fw={500}>Total:</Text>
                    <Text fw={700} size="lg" c="blue">
                      $
                      {(
                        Math.ceil((booking.checkOut.getTime() - booking.checkIn.getTime()) / (1000 * 60 * 60 * 24)) *
                        (selectedHotel.roomTypes.find((r) => r.name === booking.roomType)?.pricePerNight ||
                          selectedHotel.roomTypes[0].pricePerNight)
                      ).toLocaleString()}
                    </Text>
                  </Group>
                </Stack>
              </Paper>
            )}

            <Alert icon={<AlertCircle size="1rem" />} color="blue">
              <Text size="sm">
                Booking includes Early Theme Park Entry, complimentary transportation, and resort benefits.
              </Text>
            </Alert>

            <Group justify="space-between">
              <Button variant="default" onClick={closeBookingModal}>
                Cancel
              </Button>
              <Button onClick={confirmBooking} disabled={!booking.checkIn || !booking.checkOut}>
                Confirm Booking
              </Button>
            </Group>
          </Stack>
        </Modal>
      </Stack>
    </Container>
  );
};

export default Hotels;
