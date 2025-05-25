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
  Modal,
  Button,
  Select,
  Textarea,
  ActionIcon,
  Divider,
  SimpleGrid,
  ScrollArea,
  Alert,
  TextInput,
} from '@mantine/core';
import { DatePickerInput, TimeInput } from '@mantine/dates';
import { useDisclosure } from '@mantine/hooks';
import {
  Calendar,
  Clock,
  MapPin,
  Utensils,
  Zap,
  Star,
  Plus,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Users,
} from 'lucide-react';
import type { Trip, PartyMember } from '../types/types';

interface DailyEvent {
  id: string;
  time: string;
  title: string;
  type: 'park' | 'dining' | 'lightning-lane' | 'show' | 'hotel' | 'travel' | 'break';
  location: string;
  description?: string;
  partySize?: number;
  confirmationNumber?: string;
  notes?: string;
}

interface DaySchedule {
  date: string;
  dayOfTrip: number;
  park?: string;
  events: DailyEvent[];
  weather?: {
    high: number;
    low: number;
    condition: string;
  };
}

interface DailyScheduleProps {
  trip: Trip;
  partyMembers: PartyMember[];
}

// Sample schedule data for Lewis Family Disney Trip
const mockScheduleData: DaySchedule[] = [
  {
    date: '2025-07-16',
    dayOfTrip: 1,
    park: 'Magic Kingdom',
    weather: { high: 89, low: 76, condition: 'Partly Cloudy' },
    events: [
      {
        id: '1-1',
        time: '3:00 PM',
        title: 'Check-in at Grand Floridian',
        type: 'hotel',
        location: "Disney's Grand Floridian Resort & Spa",
        description: 'Standard Room with Garden View',
        confirmationNumber: 'WDW-GF123456',
      },
      {
        id: '1-2',
        time: '5:00 PM',
        title: 'Magic Kingdom Early Evening',
        type: 'park',
        location: 'Magic Kingdom',
        description: 'Explore Main Street and Fantasyland',
      },
      {
        id: '1-3',
        time: '7:30 PM',
        title: 'Dinner at Grand Floridian Café',
        type: 'dining',
        location: 'Grand Floridian Café',
        partySize: 4,
        confirmationNumber: 'WDW-RES789012',
      },
      {
        id: '1-4',
        time: '9:00 PM',
        title: 'Happily Ever After Fireworks',
        type: 'show',
        location: 'Magic Kingdom',
        description: 'View from Main Street or Castle Hub',
      },
    ],
  },
  {
    date: '2025-07-17',
    dayOfTrip: 2,
    park: 'Magic Kingdom',
    weather: { high: 91, low: 78, condition: 'Sunny' },
    events: [
      {
        id: '2-1',
        time: '8:30 AM',
        title: 'Early Park Entry',
        type: 'park',
        location: 'Magic Kingdom',
        description: 'Rope drop Seven Dwarfs Mine Train',
      },
      {
        id: '2-2',
        time: '9:15 AM',
        title: 'Seven Dwarfs Mine Train',
        type: 'park',
        location: 'Fantasyland',
        description: 'Rope drop priority - shortest wait',
      },
      {
        id: '2-3',
        time: '10:00 AM',
        title: 'Space Mountain Lightning Lane',
        type: 'lightning-lane',
        location: 'Tomorrowland',
        description: 'Return time: 10:00 AM - 11:00 AM',
      },
      {
        id: '2-4',
        time: '12:30 PM',
        title: 'Lunch Break',
        type: 'break',
        location: 'Grand Floridian Resort',
        description: 'Return to hotel for rest and pool time',
      },
      {
        id: '2-5',
        time: '3:00 PM',
        title: 'Festival of Fantasy Parade',
        type: 'show',
        location: 'Main Street U.S.A.',
        description: 'Arrive 30 minutes early for good spots',
      },
      {
        id: '2-6',
        time: '6:30 PM',
        title: 'Be Our Guest Restaurant',
        type: 'dining',
        location: "Beast's Castle, Fantasyland",
        partySize: 4,
        confirmationNumber: 'WDW-BOG345678',
      },
    ],
  },
  {
    date: '2025-07-18',
    dayOfTrip: 3,
    park: 'EPCOT',
    weather: { high: 88, low: 75, condition: 'Scattered Showers' },
    events: [
      {
        id: '3-1',
        time: '8:30 AM',
        title: 'Early Park Entry',
        type: 'park',
        location: 'EPCOT',
        description: 'Head to Future World attractions',
      },
      {
        id: '3-2',
        time: '9:00 AM',
        title: 'Guardians of the Galaxy',
        type: 'lightning-lane',
        location: 'Future World',
        description: 'Individual Lightning Lane purchase',
      },
      {
        id: '3-3',
        time: '11:00 AM',
        title: 'Test Track Lightning Lane',
        type: 'lightning-lane',
        location: 'Future World',
        description: 'Return time: 11:00 AM - 12:00 PM',
      },
      {
        id: '3-4',
        time: '1:00 PM',
        title: 'Space 220 Restaurant',
        type: 'dining',
        location: 'Future World',
        partySize: 4,
        confirmationNumber: 'WDW-SP2456789',
      },
      {
        id: '3-5',
        time: '4:00 PM',
        title: 'World Showcase Exploration',
        type: 'park',
        location: 'World Showcase',
        description: 'Visit pavilions and try snacks',
      },
      {
        id: '3-6',
        time: '9:00 PM',
        title: 'EPCOT Forever',
        type: 'show',
        location: 'World Showcase Lagoon',
        description: 'Fireworks show - find spot 30 min early',
      },
    ],
  },
  {
    date: '2025-07-19',
    dayOfTrip: 4,
    park: 'Hollywood Studios',
    weather: { high: 92, low: 79, condition: 'Hot and Humid' },
    events: [
      {
        id: '4-1',
        time: '8:30 AM',
        title: 'Early Park Entry',
        type: 'park',
        location: 'Hollywood Studios',
        description: 'Head to Rise of the Resistance',
      },
      {
        id: '4-2',
        time: '9:00 AM',
        title: 'Rise of the Resistance',
        type: 'lightning-lane',
        location: "Galaxy's Edge",
        description: 'Individual Lightning Lane - $25/person',
      },
      {
        id: '4-3',
        time: '11:30 AM',
        title: 'Millennium Falcon',
        type: 'park',
        location: "Galaxy's Edge",
        description: 'Pilot the Millennium Falcon',
      },
      {
        id: '4-4',
        time: '1:30 PM',
        title: 'Lunch at Docking Bay 7',
        type: 'dining',
        location: "Galaxy's Edge",
        description: 'Quick service - themed Star Wars food',
      },
      {
        id: '4-5',
        time: '3:00 PM',
        title: 'Tower of Terror',
        type: 'park',
        location: 'Sunset Boulevard',
        description: 'Classic Disney thrill ride',
      },
      {
        id: '4-6',
        time: '8:00 PM',
        title: 'Fantasmic!',
        type: 'show',
        location: 'Hollywood Hills Amphitheater',
        description: 'Arrive 45 minutes early for seating',
      },
    ],
  },
];

const DailyCalendar: React.FC<DailyScheduleProps> = ({ trip, partyMembers }) => {
  const [scheduleData, setScheduleData] = useState<DaySchedule[]>(mockScheduleData);
  const [selectedDate, setSelectedDate] = useState<string>('2025-07-16');
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(new Date('2025-07-16'));
  const [modalOpened, { open: openModal, close: closeModal }] = useDisclosure(false);
  const [editingEvent, setEditingEvent] = useState<DailyEvent | null>(null);
  const [newEvent, setNewEvent] = useState<Partial<DailyEvent>>({
    time: '',
    title: '',
    type: 'park',
    location: '',
    description: '',
  });

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'park':
        return 'blue';
      case 'dining':
        return 'orange';
      case 'lightning-lane':
        return 'yellow';
      case 'show':
        return 'purple';
      case 'hotel':
        return 'green';
      case 'travel':
        return 'gray';
      case 'break':
        return 'cyan';
      default:
        return 'gray';
    }
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'park':
        return <MapPin size="0.8rem" />;
      case 'dining':
        return <Utensils size="0.8rem" />;
      case 'lightning-lane':
        return <Zap size="0.8rem" />;
      case 'show':
        return <Star size="0.8rem" />;
      case 'hotel':
        return <Calendar size="0.8rem" />;
      case 'travel':
        return <Clock size="0.8rem" />;
      case 'break':
        return <Users size="0.8rem" />;
      default:
        return <Clock size="0.8rem" />;
    }
  };

  const getDaysInWeek = (startDate: Date) => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      days.push(date);
    }
    return days;
  };

  const formatDateKey = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const getDaySchedule = (date: Date) => {
    const dateKey = formatDateKey(date);
    return scheduleData.find((day) => day.date === dateKey);
  };

  const isDateInTrip = (date: Date) => {
    return date >= trip.startDate && date <= trip.endDate;
  };

  const openAddEventModal = (date: string) => {
    setEditingEvent(null);
    setNewEvent({
      time: '',
      title: '',
      type: 'park',
      location: '',
      description: '',
    });
    setSelectedDate(date);
    openModal();
  };

  const openEditEventModal = (event: DailyEvent) => {
    setEditingEvent(event);
    setNewEvent(event);
    openModal();
  };

  const saveEvent = () => {
    if (!newEvent.title || !newEvent.time) return;

    const eventData: DailyEvent = {
      id: editingEvent?.id || `${Date.now()}`,
      time: newEvent.time || '',
      title: newEvent.title || '',
      type: newEvent.type || 'park',
      location: newEvent.location || '',
      description: newEvent.description,
      partySize: newEvent.partySize,
      confirmationNumber: newEvent.confirmationNumber,
      notes: newEvent.notes,
    };

    setScheduleData((prev) => {
      return prev.map((day) => {
        if (day.date === selectedDate) {
          let updatedEvents;
          if (editingEvent) {
            updatedEvents = day.events.map((event) => (event.id === editingEvent.id ? eventData : event));
          } else {
            updatedEvents = [...day.events, eventData].sort((a, b) => a.time.localeCompare(b.time));
          }
          return { ...day, events: updatedEvents };
        }
        return day;
      });
    });

    closeModal();
  };

  const deleteEvent = (eventId: string, date: string) => {
    setScheduleData((prev) => {
      return prev.map((day) => {
        if (day.date === date) {
          return { ...day, events: day.events.filter((event) => event.id !== eventId) };
        }
        return day;
      });
    });
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(currentWeekStart.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentWeekStart(newDate);
  };

  const weekDays = getDaysInWeek(currentWeekStart);

  return (
    <Container size="xl">
      <Stack gap="lg">
        <div>
          <Title order={2} mb="md">
            Daily Schedule
          </Title>
          <Text c="dimmed" mb="lg">
            Your day-by-day itinerary for the Lewis Family Disney Trip
          </Text>
        </div>

        {/* Week Navigation */}
        <Paper withBorder p="md">
          <Group justify="space-between">
            <Button variant="light" leftSection={<ChevronLeft size="1rem" />} onClick={() => navigateWeek('prev')}>
              Previous Week
            </Button>
            <Title order={4}>{currentWeekStart.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</Title>
            <Button variant="light" rightSection={<ChevronRight size="1rem" />} onClick={() => navigateWeek('next')}>
              Next Week
            </Button>
          </Group>
        </Paper>

        {/* Calendar Grid */}
        <SimpleGrid cols={7} spacing="md">
          {weekDays.map((date) => {
            const daySchedule = getDaySchedule(date);
            const isInTrip = isDateInTrip(date);
            const isToday = formatDateKey(date) === formatDateKey(new Date());

            return (
              <Card
                key={formatDateKey(date)}
                withBorder
                p="sm"
                h="400px"
                style={{
                  opacity: isInTrip ? 1 : 0.5,
                  borderColor: isToday ? 'var(--mantine-color-blue-6)' : undefined,
                  borderWidth: isToday ? 2 : 1,
                }}
              >
                <Stack gap="xs" h="100%">
                  {/* Date Header */}
                  <div>
                    <Group justify="space-between" mb="xs">
                      <div>
                        <Text fw={500} size="sm">
                          {date.toLocaleDateString('en-US', { weekday: 'short' })}
                        </Text>
                        <Text fw={700} size="lg">
                          {date.getDate()}
                        </Text>
                      </div>
                      {isInTrip && (
                        <ActionIcon size="sm" onClick={() => openAddEventModal(formatDateKey(date))}>
                          <Plus size="0.8rem" />
                        </ActionIcon>
                      )}
                    </Group>

                    {/* Day Info */}
                    {daySchedule && (
                      <Stack gap="xs">
                        {daySchedule.park && (
                          <Badge size="xs" color="blue">
                            Day {daySchedule.dayOfTrip} - {daySchedule.park}
                          </Badge>
                        )}
                        {daySchedule.weather && (
                          <Text size="xs" c="dimmed">
                            {daySchedule.weather.high}°/{daySchedule.weather.low}° {daySchedule.weather.condition}
                          </Text>
                        )}
                      </Stack>
                    )}
                  </div>

                  {/* Events */}
                  <ScrollArea style={{ flex: 1 }}>
                    <Stack gap="xs">
                      {daySchedule?.events.map((event) => (
                        <Card key={event.id} p="xs" withBorder style={{ cursor: 'pointer' }}>
                          <Group gap="xs" justify="space-between">
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <Group gap="xs" mb="xs">
                                <Badge
                                  size="xs"
                                  color={getEventTypeColor(event.type)}
                                  leftSection={getEventTypeIcon(event.type)}
                                >
                                  {event.time}
                                </Badge>
                              </Group>
                              <Text size="xs" fw={500} lineClamp={2}>
                                {event.title}
                              </Text>
                              <Text size="xs" c="dimmed" lineClamp={1}>
                                {event.location}
                              </Text>
                            </div>
                            <Group gap="xs">
                              <ActionIcon size="xs" onClick={() => openEditEventModal(event)}>
                                <Edit size="0.6rem" />
                              </ActionIcon>
                              <ActionIcon
                                size="xs"
                                color="red"
                                onClick={() => deleteEvent(event.id, formatDateKey(date))}
                              >
                                <Trash2 size="0.6rem" />
                              </ActionIcon>
                            </Group>
                          </Group>
                        </Card>
                      ))}
                    </Stack>
                  </ScrollArea>
                </Stack>
              </Card>
            );
          })}
        </SimpleGrid>

        {/* Today's Schedule Detail */}
        {scheduleData.find((day) => day.date === formatDateKey(new Date())) && (
          <Card withBorder p="lg">
            <Title order={3} mb="md">
              Today's Schedule -{' '}
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </Title>
            <Stack gap="md">
              {scheduleData
                .find((day) => day.date === formatDateKey(new Date()))
                ?.events.map((event) => (
                  <Paper key={event.id} withBorder p="md">
                    <Group justify="space-between">
                      <div style={{ flex: 1 }}>
                        <Group mb="xs">
                          <Badge color={getEventTypeColor(event.type)} leftSection={getEventTypeIcon(event.type)}>
                            {event.time}
                          </Badge>
                          <Text fw={500}>{event.title}</Text>
                        </Group>
                        <Text size="sm" c="dimmed" mb="xs">
                          {event.location}
                        </Text>
                        {event.description && (
                          <Text size="sm" mb="xs">
                            {event.description}
                          </Text>
                        )}
                        {event.confirmationNumber && (
                          <Text size="xs" c="dimmed">
                            Confirmation: {event.confirmationNumber}
                          </Text>
                        )}
                      </div>
                    </Group>
                  </Paper>
                ))}
            </Stack>
          </Card>
        )}

        {/* Legend */}
        <Paper withBorder p="md">
          <Title order={4} mb="md">
            Event Types
          </Title>
          <SimpleGrid cols={{ base: 4, md: 7 }}>
            {[
              { type: 'park', label: 'Park Time' },
              { type: 'dining', label: 'Dining' },
              { type: 'lightning-lane', label: 'Lightning Lane' },
              { type: 'show', label: 'Shows' },
              { type: 'hotel', label: 'Hotel' },
              { type: 'travel', label: 'Travel' },
              { type: 'break', label: 'Break' },
            ].map((item) => (
              <Group key={item.type} gap="xs">
                <Badge size="sm" color={getEventTypeColor(item.type)} leftSection={getEventTypeIcon(item.type)}>
                  {item.label}
                </Badge>
              </Group>
            ))}
          </SimpleGrid>
        </Paper>

        {/* Add/Edit Event Modal */}
        <Modal
          opened={modalOpened}
          onClose={closeModal}
          title={editingEvent ? 'Edit Event' : 'Add New Event'}
          size="md"
        >
          <Stack gap="md">
            <TimeInput
              label="Time"
              value={newEvent.time}
              onChange={(event) => setNewEvent({ ...newEvent, time: event.currentTarget.value })}
              required
            />

            <Select
              label="Event Type"
              data={[
                { value: 'park', label: 'Park Time' },
                { value: 'dining', label: 'Dining Reservation' },
                { value: 'lightning-lane', label: 'Lightning Lane' },
                { value: 'show', label: 'Show/Entertainment' },
                { value: 'hotel', label: 'Hotel Activity' },
                { value: 'travel', label: 'Travel/Transportation' },
                { value: 'break', label: 'Break/Rest' },
              ]}
              value={newEvent.type}
              onChange={(value) => setNewEvent({ ...newEvent, type: value as any })}
            />

            <TextInput
              label="Event Title"
              placeholder="Enter event name"
              value={newEvent.title}
              onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              required
            />

            <TextInput
              label="Location"
              placeholder="Enter location"
              value={newEvent.location}
              onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
            />

            <Textarea
              label="Description"
              placeholder="Additional details..."
              value={newEvent.description}
              onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
            />

            {(newEvent.type === 'dining' || newEvent.type === 'lightning-lane') && (
              <TextInput
                label="Confirmation Number"
                placeholder="Enter confirmation number"
                value={newEvent.confirmationNumber}
                onChange={(e) => setNewEvent({ ...newEvent, confirmationNumber: e.target.value })}
              />
            )}

            <Group justify="space-between">
              <Button variant="default" onClick={closeModal}>
                Cancel
              </Button>
              <Button onClick={saveEvent} disabled={!newEvent.title || !newEvent.time}>
                {editingEvent ? 'Update' : 'Add'} Event
              </Button>
            </Group>
          </Stack>
        </Modal>
      </Stack>
    </Container>
  );
};

export default DailyCalendar;
