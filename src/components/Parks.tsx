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
  Divider,
} from '@mantine/core';

import { useDisclosure } from '@mantine/hooks';
import { Clock, MapPin, Star, Users, Zap, Camera, Music, Utensils, Ruler as Height, Baby } from 'lucide-react';

import type { Park, ParksProps, Attraction, Show } from '../types/types';

const enhancedParks: (Park & {
  attractions: Attraction[];
  shows_extra: Show[];
  tips: string[];
  photoSpots: string[];
})[] = [
  {
    id: 'mk',
    name: 'Magic Kingdom',
    icon: '🏰',
    description: 'The most magical place on earth with classic Disney attractions and characters',
    hours: { open: '9:00 AM', close: '10:00 PM' },
    topAttractions: ['Space Mountain', 'Pirates of the Caribbean', 'Haunted Mansion', 'Big Thunder Mountain'],
    shows: ['Happily Ever After', 'Festival of Fantasy Parade'],
    attractions: [
      {
        id: 'space-mountain',
        name: 'Space Mountain',
        waitTime: 45,
        type: 'thrill',
        height: '44" (112 cm)',
        lightning: true,
        description: 'An indoor roller coaster through space in complete darkness',
        tips: ['Best to ride early morning or late evening', 'Single rider line available'],
      },
      {
        id: 'pirates',
        name: 'Pirates of the Caribbean',
        waitTime: 25,
        type: 'family',
        lightning: false,
        description: 'Boat ride through pirate battles and treasure',
        tips: ['Great for all ages', 'Can get wet from splashes'],
      },
      {
        id: 'haunted-mansion',
        name: 'Haunted Mansion',
        waitTime: 35,
        type: 'family',
        lightning: true,
        description: '999 happy haunts await in this spooky manor',
        tips: ['Not too scary for kids', 'Holiday overlay during Halloween/Christmas'],
      },
      {
        id: 'big-thunder',
        name: 'Big Thunder Mountain Railroad',
        waitTime: 30,
        type: 'thrill',
        height: '40" (102 cm)',
        lightning: true,
        description: 'Wildest ride in the wilderness through an old mining town',
        tips: ['Great views of the park', 'Single rider line available'],
      },
    ],
    shows_extra: [
      {
        id: 'happily-ever-after',
        name: 'Happily Ever After',
        times: ['9:00 PM'],
        duration: '18 minutes',
        description: 'Spectacular fireworks show with projections on Cinderella Castle',
        recommendedArrival: '45 minutes early',
      },
      {
        id: 'festival-fantasy',
        name: 'Festival of Fantasy Parade',
        times: ['3:00 PM'],
        duration: '12 minutes',
        description: 'Colorful parade featuring Disney characters and floats',
        recommendedArrival: '30 minutes early',
      },
    ],
    tips: [
      'Arrive at rope drop for shortest wait times',
      'Use mobile order for quick service dining',
      'Download wait times on the My Disney Experience app',
      'FastPass+ available for select attractions',
    ],
    photoSpots: [
      'Cinderella Castle',
      'Partners Statue (Walt & Mickey)',
      'Dumbo the Flying Elephant',
      'Tangled Restroom Area',
    ],
  },
  {
    id: 'epcot',
    name: 'EPCOT',
    icon: '🌍',
    description: 'Future World and World Showcase celebrating innovation and culture',
    hours: { open: '9:00 AM', close: '9:00 PM' },
    topAttractions: ['Guardians of the Galaxy', 'Test Track', "Soarin'", 'Frozen Ever After'],
    shows: ['EPCOT Forever', 'Voices of Liberty'],
    attractions: [
      {
        id: 'guardians',
        name: 'Guardians of the Galaxy: Cosmic Rewind',
        waitTime: 60,
        type: 'thrill',
        height: '42" (107 cm)',
        lightning: true,
        description: 'Indoor roller coaster with rotating vehicles and awesome soundtrack',
        tips: ['Virtual queue required', 'One of the most popular attractions'],
      },
      {
        id: 'test-track',
        name: 'Test Track',
        waitTime: 40,
        type: 'thrill',
        height: '40" (102 cm)',
        lightning: true,
        description: 'Design your own vehicle and test it at high speeds',
        tips: ['Single rider line available', 'Design your car on the app beforehand'],
      },
      {
        id: 'soarin',
        name: "Soarin' Around the World",
        waitTime: 35,
        type: 'family',
        height: '40" (102 cm)',
        lightning: true,
        description: 'Hang gliding simulation over world landmarks',
        tips: ['Try to sit in the middle section', 'Amazing views and scents'],
      },
      {
        id: 'frozen',
        name: 'Frozen Ever After',
        waitTime: 50,
        type: 'family',
        lightning: true,
        description: 'Boat ride through the kingdom of Arendelle',
        tips: ['Very popular with young children', 'Located in Norway pavilion'],
      },
    ],
    shows_extra: [
      {
        id: 'epcot-forever',
        name: 'EPCOT Forever',
        times: ['9:00 PM'],
        duration: '12 minutes',
        description: 'Fireworks spectacular celebrating EPCOT',
        recommendedArrival: '30 minutes early',
      },
    ],
    tips: [
      'World Showcase opens at 11 AM',
      'Drink around the world in World Showcase',
      'Festival seasons offer special food and entertainment',
      'Great for adults and families',
    ],
    photoSpots: ['Spaceship Earth', 'World Showcase Pavilions', 'Imagination Fountain', 'Morocco Pavilion'],
  },
];

const Parks: React.FC<ParksProps> = ({ selectedDate }) => {
  const [selectedPark, setSelectedPark] = useState<string>('mk');
  const [modalOpened, { open: openModal, close: closeModal }] = useDisclosure(false);
  const [selectedAttraction, setSelectedAttraction] = useState<Attraction | null>(null);

  const currentPark = enhancedParks.find((park) => park.id === selectedPark);

  const getWaitColor = (waitTime: number) => {
    if (waitTime <= 15) return 'green';
    if (waitTime <= 30) return 'yellow';
    if (waitTime <= 60) return 'orange';
    return 'red';
  };

  const openAttractionModal = (attraction: Attraction) => {
    setSelectedAttraction(attraction);
    openModal();
  };

  return (
    <Container size="xl">
      <Stack gap="lg">
        <div>
          <Title order={2} mb="md">
            Parks & Attractions
          </Title>
          <Text c="dimmed" mb="lg">
            Explore Walt Disney World's four theme parks and plan your perfect day
          </Text>
        </div>

        <Tabs value={selectedPark} onChange={(value) => setSelectedPark(value || 'mk')}>
          <Tabs.List>
            {enhancedParks.map((park) => (
              <Tabs.Tab key={park.id} value={park.id} leftSection={<span>{park.icon}</span>}>
                {park.name}
              </Tabs.Tab>
            ))}
          </Tabs.List>

          {enhancedParks.map((park) => (
            <Tabs.Panel key={park.id} value={park.id} pt="lg">
              <Grid>
                {/* Park Info */}
                <Grid.Col span={12}>
                  <Paper withBorder p="lg" radius="md">
                    <Group justify="space-between" mb="md">
                      <div>
                        <Group>
                          <Text size="2rem">{park.icon}</Text>
                          <div>
                            <Title order={3}>{park.name}</Title>
                            <Text c="dimmed">{park.description}</Text>
                          </div>
                        </Group>
                      </div>
                      <Badge color="blue" size="lg" leftSection={<Clock size="0.9rem" />}>
                        {park.hours?.open} - {park.hours?.close}
                      </Badge>
                    </Group>
                  </Paper>
                </Grid.Col>

                {/* Attractions */}
                <Grid.Col span={{ base: 12, md: 8 }}>
                  <Title order={4} mb="md">
                    Attractions
                  </Title>
                  <Stack gap="md">
                    {park.attractions.map((attraction) => (
                      <Card
                        key={attraction.id}
                        withBorder
                        p="md"
                        style={{ cursor: 'pointer' }}
                        onClick={() => openAttractionModal(attraction)}
                      >
                        <Group justify="space-between">
                          <div style={{ flex: 1 }}>
                            <Group mb="xs">
                              <Text fw={500}>{attraction.name}</Text>
                              {attraction.lightning && (
                                <Badge color="yellow" size="sm" leftSection={<Zap size="0.7rem" />}>
                                  Lightning Lane
                                </Badge>
                              )}
                              <Badge color={attraction.type === 'thrill' ? 'red' : 'blue'} variant="light" size="sm">
                                {attraction.type}
                              </Badge>
                            </Group>
                            <Text size="sm" c="dimmed" mb="xs">
                              {attraction.description}
                            </Text>
                            {attraction.height && (
                              <Group gap="xs">
                                <Height size="0.8rem" />
                                <Text size="xs" c="dimmed">
                                  Height: {attraction.height}
                                </Text>
                              </Group>
                            )}
                          </div>
                          <div style={{ textAlign: 'center' }}>
                            <Text fw={700} size="lg" c={getWaitColor(attraction.waitTime)}>
                              {attraction.waitTime}
                            </Text>
                            <Text size="xs" c="dimmed">
                              minutes
                            </Text>
                          </div>
                        </Group>
                      </Card>
                    ))}
                  </Stack>
                </Grid.Col>

                {/* Shows & Tips */}
                <Grid.Col span={{ base: 12, md: 4 }}>
                  <Stack gap="lg">
                    {/* Shows */}
                    <div>
                      <Title order={4} mb="md">
                        Shows & Entertainment
                      </Title>
                      <Stack gap="md">
                        {park.shows_extra.map((show) => (
                          <Card key={show.id} withBorder p="md">
                            <Group mb="xs">
                              <Music size="1rem" />
                              <Text fw={500}>{show.name}</Text>
                            </Group>
                            <Text size="sm" c="dimmed" mb="xs">
                              {show.description}
                            </Text>
                            <Group gap="lg">
                              <div>
                                <Text size="xs" c="dimmed">
                                  Show Times
                                </Text>
                                <Text size="sm">{show.times.join(', ')}</Text>
                              </div>
                              <div>
                                <Text size="xs" c="dimmed">
                                  Duration
                                </Text>
                                <Text size="sm">{show.duration}</Text>
                              </div>
                            </Group>
                          </Card>
                        ))}
                      </Stack>
                    </div>

                    {/* Tips */}
                    <div>
                      <Title order={4} mb="md">
                        Park Tips
                      </Title>
                      <Card withBorder p="md">
                        <Stack gap="xs">
                          {park.tips.map((tip, index) => (
                            <Text key={index} size="sm">
                              • {tip}
                            </Text>
                          ))}
                        </Stack>
                      </Card>
                    </div>

                    {/* Photo Spots */}
                    <div>
                      <Title order={4} mb="md">
                        Photo Spots
                      </Title>
                      <Card withBorder p="md">
                        <Stack gap="xs">
                          {park.photoSpots.map((spot, index) => (
                            <Group key={index} gap="xs">
                              <Camera size="0.8rem" />
                              <Text size="sm">{spot}</Text>
                            </Group>
                          ))}
                        </Stack>
                      </Card>
                    </div>
                  </Stack>
                </Grid.Col>
              </Grid>
            </Tabs.Panel>
          ))}
        </Tabs>

        {/* Attraction Detail Modal */}
        <Modal opened={modalOpened} onClose={closeModal} title={selectedAttraction?.name} size="lg">
          {selectedAttraction && (
            <Stack gap="md">
              <Group>
                <Badge color={getWaitColor(selectedAttraction.waitTime)} size="lg">
                  {selectedAttraction.waitTime} min wait
                </Badge>
                {selectedAttraction.lightning && (
                  <Badge color="yellow" leftSection={<Zap size="0.7rem" />}>
                    Lightning Lane Available
                  </Badge>
                )}
                <Badge color={selectedAttraction.type === 'thrill' ? 'red' : 'blue'} variant="light">
                  {selectedAttraction.type}
                </Badge>
              </Group>

              <Text>{selectedAttraction.description}</Text>

              {selectedAttraction.height && (
                <Group>
                  <Height size="1rem" />
                  <Text>Height Requirement: {selectedAttraction.height}</Text>
                </Group>
              )}

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

              <Button fullWidth>Add to My Plans</Button>
            </Stack>
          )}
        </Modal>
      </Stack>
    </Container>
  );
};

export default Parks;
