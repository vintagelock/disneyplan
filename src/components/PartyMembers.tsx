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
  Modal,
  TextInput,
  NumberInput,
  Select,
  Checkbox,
  ActionIcon,
  Paper,
  Divider,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Users, Plus, Edit, Trash2, User, Calendar, Utensils, AlertCircle } from 'lucide-react';
import type { PartyMember } from '../types/types';

interface PartyMembersProps {
  partyMembers: PartyMember[];
  onUpdatePartyMembers: (members: PartyMember[]) => void;
}

const ticketTypes = [
  'Base Ticket',
  'Park Hopper',
  'Park Hopper Plus',
  'Annual Pass',
  'Florida Resident',
  'Military Ticket',
];

const dietaryOptions = [
  'None',
  'Vegetarian',
  'Vegan',
  'Gluten-Free',
  'Dairy-Free',
  'Nut Allergy',
  'Shellfish Allergy',
  'Kosher',
  'Halal',
  'Other',
];

const PartyMembers: React.FC<PartyMembersProps> = ({ partyMembers, onUpdatePartyMembers }) => {
  const [modalOpened, { open: openModal, close: closeModal }] = useDisclosure(false);
  const [editingMember, setEditingMember] = useState<PartyMember | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    age: 0,
    ticketType: 'Base Ticket',
    dietaryRestrictions: 'None',
    disabilities: false,
  });

  const openAddModal = () => {
    setEditingMember(null);
    setFormData({
      name: '',
      age: 0,
      ticketType: 'Base Ticket',
      dietaryRestrictions: 'None',
      disabilities: false,
    });
    openModal();
  };

  const openEditModal = (member: PartyMember) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      age: member.age,
      ticketType: member.ticketType,
      dietaryRestrictions: member.dietaryRestrictions,
      disabilities: member.disabilities,
    });
    openModal();
  };

  const handleSave = () => {
    if (!formData.name.trim() || formData.age <= 0) return;

    const memberData: Omit<PartyMember, 'id'> = {
      name: formData.name.trim(),
      age: formData.age,
      ticketType: formData.ticketType,
      dietaryRestrictions: formData.dietaryRestrictions,
      disabilities: formData.disabilities,
    };

    let updatedMembers: PartyMember[];

    if (editingMember) {
      // Update existing member
      updatedMembers = partyMembers.map((member) =>
        member.id === editingMember.id ? { ...memberData, id: editingMember.id } : member,
      );
    } else {
      // Add new member
      const newMember: PartyMember = {
        ...memberData,
        id: `member-${Date.now()}`,
      };
      updatedMembers = [...partyMembers, newMember];
    }

    onUpdatePartyMembers(updatedMembers);
    closeModal();
  };

  const removeMember = (memberId: string) => {
    if (partyMembers.length <= 1) return; // Don't allow removing last member
    const updatedMembers = partyMembers.filter((member) => member.id !== memberId);
    onUpdatePartyMembers(updatedMembers);
  };

  const getAgeCategory = (age: number) => {
    if (age < 3) return { label: 'Infant', color: 'pink' };
    if (age < 10) return { label: 'Child', color: 'blue' };
    if (age < 18) return { label: 'Youth', color: 'green' };
    if (age < 65) return { label: 'Adult', color: 'orange' };
    return { label: 'Senior', color: 'purple' };
  };

  const getTicketPrice = (ticketType: string, age: number) => {
    // Simplified pricing - in real app would be more complex
    const basePrice = age >= 10 ? 109 : 104; // Adult vs child base price

    switch (ticketType) {
      case 'Park Hopper':
        return basePrice + 60;
      case 'Park Hopper Plus':
        return basePrice + 85;
      case 'Annual Pass':
        return age >= 10 ? 1299 : 1199;
      case 'Florida Resident':
        return Math.round(basePrice * 0.85);
      case 'Military Ticket':
        return Math.round(basePrice * 0.9);
      default:
        return basePrice;
    }
  };

  const totalTicketCost = partyMembers.reduce((total, member) => {
    return total + getTicketPrice(member.ticketType, member.age);
  }, 0);

  return (
    <Container size="xl">
      <Stack gap="lg">
        <div>
          <Title order={2} mb="md">
            Party Members
          </Title>
          <Text c="dimmed" mb="lg">
            Manage your travel party details for personalized recommendations and reservations
          </Text>
        </div>

        {/* Summary Card */}
        <Paper withBorder p="lg">
          <Grid>
            <Grid.Col span={{ base: 12, md: 8 }}>
              <Group>
                <Users size="1.5rem" />
                <div>
                  <Text fw={500} size="lg">
                    {partyMembers.length} Total Guests
                  </Text>
                  <Text size="sm" c="dimmed">
                    {partyMembers.filter((m) => m.age >= 18).length} adults,{' '}
                    {partyMembers.filter((m) => m.age < 18).length} children
                  </Text>
                </div>
              </Group>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <div style={{ textAlign: 'right' }}>
                <Text size="sm" c="dimmed">
                  Estimated Ticket Cost
                </Text>
                <Text fw={700} size="xl" c="blue">
                  ${totalTicketCost.toLocaleString()}
                </Text>
              </div>
            </Grid.Col>
          </Grid>
        </Paper>

        {/* Add Member Button */}
        <Button leftSection={<Plus size="1rem" />} onClick={openAddModal} size="md">
          Add Party Member
        </Button>

        {/* Party Members Grid */}
        <Grid>
          {partyMembers.map((member) => {
            const ageCategory = getAgeCategory(member.age);
            const ticketPrice = getTicketPrice(member.ticketType, member.age);

            return (
              <Grid.Col span={{ base: 12, sm: 6, md: 4 }} key={member.id}>
                <Card withBorder p="lg" h="100%">
                  <Stack gap="md" h="100%">
                    <Group justify="space-between">
                      <Group>
                        <User size="1.2rem" />
                        <div>
                          <Text fw={500}>{member.name}</Text>
                          <Badge color={ageCategory.color} size="sm">
                            {ageCategory.label} ({member.age})
                          </Badge>
                        </div>
                      </Group>
                      <Group gap="xs">
                        <ActionIcon variant="light" color="blue" onClick={() => openEditModal(member)}>
                          <Edit size="1rem" />
                        </ActionIcon>
                        {partyMembers.length > 1 && (
                          <ActionIcon variant="light" color="red" onClick={() => removeMember(member.id)}>
                            <Trash2 size="1rem" />
                          </ActionIcon>
                        )}
                      </Group>
                    </Group>

                    <Divider />

                    <div style={{ flex: 1 }}>
                      <Stack gap="sm">
                        <div>
                          <Text size="sm" c="dimmed">
                            Ticket Type
                          </Text>
                          <Text size="sm" fw={500}>
                            {member.ticketType}
                          </Text>
                          <Text size="xs" c="blue">
                            ${ticketPrice}/person
                          </Text>
                        </div>

                        {member.dietaryRestrictions !== 'None' && (
                          <div>
                            <Group gap="xs">
                              <Utensils size="0.8rem" />
                              <Text size="sm" c="dimmed">
                                Dietary Needs
                              </Text>
                            </Group>
                            <Badge color="orange" variant="light" size="sm">
                              {member.dietaryRestrictions}
                            </Badge>
                          </div>
                        )}

                        {member.disabilities && (
                          <div>
                            <Group gap="xs">
                              <AlertCircle size="0.8rem" />
                              <Text size="sm" c="dimmed">
                                Accessibility Services
                              </Text>
                            </Group>
                            <Text size="sm">DAS eligible</Text>
                          </div>
                        )}
                      </Stack>
                    </div>
                  </Stack>
                </Card>
              </Grid.Col>
            );
          })}
        </Grid>

        {/* Tips Section */}
        <Paper withBorder p="lg">
          <Title order={4} mb="md">
            Party Planning Tips
          </Title>
          <Grid>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Stack gap="xs">
                <Text size="sm">• Children under 3 don't need park tickets</Text>
                <Text size="sm">• Consider Park Hopper for stays 4+ days</Text>
                <Text size="sm">• Add dietary restrictions for dining recommendations</Text>
                <Text size="sm">• DAS (Disability Access Service) available at Guest Relations</Text>
              </Stack>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Stack gap="xs">
                <Text size="sm">• Annual Passes may save money for 7+ day trips</Text>
                <Text size="sm">• Florida residents get special discounts</Text>
                <Text size="sm">• Military discounts available with valid ID</Text>
                <Text size="sm">• Photo ID required for guests 18+ at park entry</Text>
              </Stack>
            </Grid.Col>
          </Grid>
        </Paper>

        {/* Add/Edit Member Modal */}
        <Modal
          opened={modalOpened}
          onClose={closeModal}
          title={editingMember ? 'Edit Party Member' : 'Add Party Member'}
          size="md"
        >
          <Stack gap="md">
            <TextInput
              label="Name"
              placeholder="Enter full name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />

            <NumberInput
              label="Age"
              placeholder="Enter age"
              min={0}
              max={120}
              value={formData.age}
              onChange={(value) => setFormData({ ...formData, age: value || 0 })}
              required
            />

            <Select
              label="Ticket Type"
              data={ticketTypes}
              value={formData.ticketType}
              onChange={(value) => setFormData({ ...formData, ticketType: value || 'Base Ticket' })}
            />

            <Select
              label="Dietary Restrictions"
              data={dietaryOptions}
              value={formData.dietaryRestrictions}
              onChange={(value) => setFormData({ ...formData, dietaryRestrictions: value || 'None' })}
            />

            <Checkbox
              label="Requires Disability Access Service (DAS)"
              checked={formData.disabilities}
              onChange={(event) => setFormData({ ...formData, disabilities: event.currentTarget.checked })}
            />

            {formData.age > 0 && (
              <Paper withBorder p="md">
                <Group justify="space-between">
                  <Text size="sm">Estimated ticket cost:</Text>
                  <Text fw={500}>${getTicketPrice(formData.ticketType, formData.age)}</Text>
                </Group>
              </Paper>
            )}

            <Group justify="space-between">
              <Button variant="default" onClick={closeModal}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={!formData.name.trim() || formData.age <= 0}>
                {editingMember ? 'Update' : 'Add'} Member
              </Button>
            </Group>
          </Stack>
        </Modal>
      </Stack>
    </Container>
  );
};

export default PartyMembers;
