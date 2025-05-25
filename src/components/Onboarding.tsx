import React, { useState } from 'react';
import {
  Container,
  Paper,
  Title,
  Text,
  Button,
  Group,
  Stack,
  NumberInput,
  TextInput,
  Select,
  Grid,
  Card,
  ActionIcon,
  Stepper,
  Divider,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';

import { Plus, Trash2, Calendar, Users, MapPin, CheckCircle } from 'lucide-react';

import type { Trip, PartyMember } from '../types/types';

interface OnboardingProps {
  onComplete: (trip: Trip, partyMembers: PartyMember[]) => void;
}

interface OnboardingData {
  tripName: string;
  startDate: Date | null;
  endDate: Date | null;
  partyMembers: Omit<PartyMember, 'id'>[];
}

const ticketTypes = ['Base Ticket', 'Park Hopper', 'Park Hopper Plus', 'Annual Pass', 'Florida Resident'];

const dietaryOptions = [
  'None',
  'Vegetarian',
  'Vegan',
  'Gluten-Free',
  'Dairy-Free',
  'Nut Allergy',
  'Shellfish Allergy',
  'Other',
];

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [active, setActive] = useState(0);
  const [data, setData] = useState<OnboardingData>({
    tripName: 'Lewis Family Disney Trip',
    startDate: null,
    endDate: null,
    partyMembers: [
      {
        name: '',
        age: 0,
        ticketType: 'Base Ticket',
        dietaryRestrictions: 'None',
        disabilities: false,
      },
    ],
  });

  const addPartyMember = () => {
    setData({
      ...data,
      partyMembers: [
        ...data.partyMembers,
        {
          name: '',
          age: 0,
          ticketType: 'Base Ticket',
          dietaryRestrictions: 'None',
          disabilities: false,
        },
      ],
    });
  };

  const removePartyMember = (index: number) => {
    if (data.partyMembers.length > 1) {
      setData({
        ...data,
        partyMembers: data.partyMembers.filter((_, i) => i !== index),
      });
    }
  };

  const updatePartyMember = (index: number, field: keyof Omit<PartyMember, 'id'>, value: any) => {
    const updated = [...data.partyMembers];
    updated[index] = { ...updated[index], [field]: value };
    setData({ ...data, partyMembers: updated });
  };

  const canContinue = () => {
    switch (active) {
      case 0:
        return data.tripName.trim() !== '' && data.startDate && data.endDate;
      case 1:
        return data.partyMembers.every((member) => member.name.trim() !== '' && member.age > 0);
      case 2:
        return true; // Summary step
      default:
        return false;
    }
  };

  const handleComplete = () => {
    if (!data.startDate || !data.endDate) return;

    const trip: Trip = {
      id: '1',
      name: data.tripName,
      startDate: data.startDate,
      endDate: data.endDate,
      partySize: data.partyMembers.length,
      currentStep: 'overview',
    };

    const partyMembers: PartyMember[] = data.partyMembers.map((member, index) => ({
      ...member,
      id: `member-${index + 1}`,
    }));

    onComplete(trip, partyMembers);
  };

  const renderTripDetails = () => (
    <Stack gap="lg">
      <div>
        <Title order={2} mb="md">
          Let's Plan Your Disney Adventure!
        </Title>
        <Text c="dimmed" mb="xl">
          First, let's get some basic information about your trip.
        </Text>
      </div>

      <TextInput
        label="Trip Name"
        placeholder="Enter a name for your trip"
        value={data.tripName}
        onChange={(e) => setData({ ...data, tripName: e.target.value })}
        required
      />

      <Grid>
        <Grid.Col span={6}>
          <DatePickerInput
            label="Start Date"
            placeholder="Select start date"
            value={data.startDate}
            onChange={(date) => setData({ ...data, startDate: date })}
            minDate={new Date()}
            required
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <DatePickerInput
            label="End Date"
            placeholder="Select end date"
            value={data.endDate}
            onChange={(date) => setData({ ...data, endDate: date })}
            minDate={data.startDate || new Date()}
            required
          />
        </Grid.Col>
      </Grid>

      {data.startDate && data.endDate && (
        <Card withBorder p="md">
          <Group>
            <Calendar size="1.2rem" />
            <div>
              <Text fw={500}>Trip Duration</Text>
              <Text size="sm" c="dimmed">
                {Math.ceil((data.endDate.getTime() - data.startDate.getTime()) / (1000 * 60 * 60 * 24))} days
              </Text>
            </div>
          </Group>
        </Card>
      )}
    </Stack>
  );

  const renderPartyMembers = () => (
    <Stack gap="lg">
      <div>
        <Title order={2} mb="md">
          Who's Coming Along?
        </Title>
        <Text c="dimmed" mb="xl">
          Add details for each person in your party to help personalize your experience.
        </Text>
      </div>

      {data.partyMembers.map((member, index) => (
        <Card key={index} withBorder p="md">
          <Group justify="space-between" mb="md">
            <Text fw={500}>Person {index + 1}</Text>
            {data.partyMembers.length > 1 && (
              <ActionIcon color="red" variant="light" onClick={() => removePartyMember(index)}>
                <Trash2 size="1rem" />
              </ActionIcon>
            )}
          </Group>

          <Grid>
            <Grid.Col span={6}>
              <TextInput
                label="Name"
                placeholder="Enter name"
                value={member.name}
                onChange={(e) => updatePartyMember(index, 'name', e.target.value)}
                required
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <NumberInput
                label="Age"
                placeholder="Enter age"
                min={0}
                max={120}
                value={member.age}
                onChange={(value) => updatePartyMember(index, 'age', value || 0)}
                required
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <Select
                label="Ticket Type"
                data={ticketTypes}
                value={member.ticketType}
                onChange={(value) => updatePartyMember(index, 'ticketType', value || 'Base Ticket')}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <Select
                label="Dietary Restrictions"
                data={dietaryOptions}
                value={member.dietaryRestrictions}
                onChange={(value) => updatePartyMember(index, 'dietaryRestrictions', value || 'None')}
              />
            </Grid.Col>
          </Grid>
        </Card>
      ))}

      <Button leftSection={<Plus size="1rem" />} variant="light" onClick={addPartyMember}>
        Add Another Person
      </Button>
    </Stack>
  );

  const renderSummary = () => (
    <Stack gap="lg">
      <div>
        <Title order={2} mb="md">
          Trip Summary
        </Title>
        <Text c="dimmed" mb="xl">
          Review your trip details before we start planning!
        </Text>
      </div>

      <Card withBorder p="lg">
        <Stack gap="md">
          <Group>
            <Calendar size="1.2rem" />
            <div>
              <Text fw={500}>{data.tripName}</Text>
              <Text size="sm" c="dimmed">
                {data.startDate?.toLocaleDateString()} - {data.endDate?.toLocaleDateString()}
              </Text>
            </div>
          </Group>

          <Divider />

          <Group>
            <Users size="1.2rem" />
            <div>
              <Text fw={500}>Party Members ({data.partyMembers.length})</Text>
              <Text size="sm" c="dimmed">
                {data.partyMembers.map((m) => m.name).join(', ')}
              </Text>
            </div>
          </Group>

          <Divider />

          <Group>
            <MapPin size="1.2rem" />
            <div>
              <Text fw={500}>Walt Disney World Resort</Text>
              <Text size="sm" c="dimmed">
                Orlando, Florida
              </Text>
            </div>
          </Group>
        </Stack>
      </Card>
    </Stack>
  );

  const steps = [
    { label: 'Trip Details', icon: Calendar },
    { label: 'Party Members', icon: Users },
    { label: 'Summary', icon: CheckCircle },
  ];

  return (
    <Container size="md" py="xl">
      <Paper shadow="sm" p="xl" radius="md" withBorder>
        <Stepper active={active} breakpoint="sm" mb="xl">
          {steps.map((step, index) => (
            <Stepper.Step key={index} label={step.label} icon={<step.icon size="1rem" />} allowStepSelect={false} />
          ))}
        </Stepper>

        {active === 0 && renderTripDetails()}
        {active === 1 && renderPartyMembers()}
        {active === 2 && renderSummary()}

        <Group justify="space-between" mt="xl">
          <Button variant="default" onClick={() => setActive(active - 1)} disabled={active === 0}>
            Back
          </Button>

          {active < 2 ? (
            <Button onClick={() => setActive(active + 1)} disabled={!canContinue()}>
              Continue
            </Button>
          ) : (
            <Button onClick={handleComplete} disabled={!canContinue()} leftSection={<CheckCircle size="1rem" />}>
              Start Planning
            </Button>
          )}
        </Group>
      </Paper>
    </Container>
  );
};

export default Onboarding;
