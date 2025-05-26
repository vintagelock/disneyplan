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
  Select,
  TextInput,
  NumberInput,
  Switch,
  Divider,
  ColorInput,
  SegmentedControl,
  Slider,
  Checkbox,
  ActionIcon,
  Alert,
  Modal,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  Smartphone,
  CreditCard,
  Download,
  Upload,
  Trash2,
  Settings as SettingsIcon,
  Moon,
  Sun,
  Volume2,
  Clock,
  MapPin,
  DollarSign,
  Calendar,
  Users,
  AlertTriangle,
  CheckCircle,
  Info,
} from 'lucide-react';
import type { Trip, PartyMember } from '../types/types';

interface SettingsProps {
  trip: Trip;
  partyMembers: PartyMember[];
  onUpdateTrip?: (trip: Trip) => void;
}

const SettingsPage: React.FC<SettingsProps> = ({ trip, partyMembers, onUpdateTrip }) => {
  const [selectedTab, setSelectedTab] = useState<string>('profile');
  const [deleteModalOpened, { open: openDeleteModal, close: closeDeleteModal }] = useDisclosure(false);

  // Settings state
  const [settings, setSettings] = useState({
    // Profile Settings
    displayName: 'Lewis Family',
    email: 'lewis.family@email.com',
    phone: '+1 (555) 123-4567',
    emergencyContact: 'Jane Lewis - (555) 987-6543',

    // Notification Settings
    pushNotifications: true,
    emailNotifications: true,
    smsNotifications: false,
    waitTimeAlerts: true,
    diningReminders: true,
    reservationUpdates: true,
    weatherAlerts: true,
    parkHoursChanges: true,
    lightningLaneAvailable: true,

    // Display Settings
    theme: 'dark',
    primaryColor: 'blue',
    fontSize: 'medium',
    language: 'en',
    timezone: 'America/New_York',
    currency: 'USD',
    dateFormat: 'MM/dd/yyyy',
    timeFormat: '12h',

    // Planning Preferences
    planningStyle: 'detailed',
    defaultParkStrategy: 'rope-drop',
    autoPlanLightningLane: true,
    preferEarlyDining: true,
    avoidCrowdedDays: true,
    showWaitTimePredictions: true,
    includeWeatherInPlanning: true,
    prioritizeCharacterMeets: false,

    // Budget Settings
    dailyBudget: 500,
    souvenirBudget: 200,
    extraBudget: 100,
    trackSpending: true,
    budgetAlerts: true,
    budgetThreshold: 80,

    // Privacy Settings
    shareLocation: false,
    shareReservations: true,
    allowAnalytics: true,
    publicProfile: false,

    // Advanced Settings
    dataSync: true,
    autoBackup: true,
    offlineMode: false,
    debugMode: false,
    betaFeatures: false,
  });

  const updateSetting = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const renderProfileSettings = () => (
    <Stack gap="lg">
      <Card withBorder p="lg">
        <Title order={4} mb="md">
          Account Information
        </Title>
        <Grid>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <TextInput
              label="Display Name"
              value={settings.displayName}
              onChange={(e) => updateSetting('displayName', e.target.value)}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <TextInput
              label="Email Address"
              type="email"
              value={settings.email}
              onChange={(e) => updateSetting('email', e.target.value)}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <TextInput
              label="Phone Number"
              value={settings.phone}
              onChange={(e) => updateSetting('phone', e.target.value)}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <TextInput
              label="Emergency Contact"
              value={settings.emergencyContact}
              onChange={(e) => updateSetting('emergencyContact', e.target.value)}
            />
          </Grid.Col>
        </Grid>
      </Card>

      <Card withBorder p="lg">
        <Title order={4} mb="md">
          Trip Information
        </Title>
        <Grid>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <TextInput label="Trip Name" value={trip.name} readOnly />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <TextInput label="Party Size" value={`${trip.partySize} guests`} readOnly />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <TextInput label="Start Date" value={trip.startDate.toLocaleDateString()} readOnly />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <TextInput label="End Date" value={trip.endDate.toLocaleDateString()} readOnly />
          </Grid.Col>
        </Grid>
      </Card>
    </Stack>
  );

  const renderNotificationSettings = () => (
    <Stack gap="lg">
      <Card withBorder p="lg">
        <Title order={4} mb="md">
          Notification Channels
        </Title>
        <Stack gap="md">
          <Group justify="space-between">
            <div>
              <Text fw={500}>Push Notifications</Text>
              <Text size="sm" c="dimmed">
                Receive notifications in the app
              </Text>
            </div>
            <Switch
              checked={settings.pushNotifications}
              onChange={(e) => updateSetting('pushNotifications', e.currentTarget.checked)}
            />
          </Group>
          <Group justify="space-between">
            <div>
              <Text fw={500}>Email Notifications</Text>
              <Text size="sm" c="dimmed">
                Receive updates via email
              </Text>
            </div>
            <Switch
              checked={settings.emailNotifications}
              onChange={(e) => updateSetting('emailNotifications', e.currentTarget.checked)}
            />
          </Group>
          <Group justify="space-between">
            <div>
              <Text fw={500}>SMS Notifications</Text>
              <Text size="sm" c="dimmed">
                Receive text message alerts
              </Text>
            </div>
            <Switch
              checked={settings.smsNotifications}
              onChange={(e) => updateSetting('smsNotifications', e.currentTarget.checked)}
            />
          </Group>
        </Stack>
      </Card>

      <Card withBorder p="lg">
        <Title order={4} mb="md">
          Alert Types
        </Title>
        <Stack gap="md">
          <Group justify="space-between">
            <Group gap="xs">
              <Clock size="1rem" />
              <div>
                <Text fw={500}>Wait Time Alerts</Text>
                <Text size="sm" c="dimmed">
                  When wait times drop significantly
                </Text>
              </div>
            </Group>
            <Switch
              checked={settings.waitTimeAlerts}
              onChange={(e) => updateSetting('waitTimeAlerts', e.currentTarget.checked)}
            />
          </Group>
          <Group justify="space-between">
            <Group gap="xs">
              <Calendar size="1rem" />
              <div>
                <Text fw={500}>Dining Reminders</Text>
                <Text size="sm" c="dimmed">
                  Reminders before dining reservations
                </Text>
              </div>
            </Group>
            <Switch
              checked={settings.diningReminders}
              onChange={(e) => updateSetting('diningReminders', e.currentTarget.checked)}
            />
          </Group>
          <Group justify="space-between">
            <Group gap="xs">
              <Bell size="1rem" />
              <div>
                <Text fw={500}>Reservation Updates</Text>
                <Text size="sm" c="dimmed">
                  Changes to your reservations
                </Text>
              </div>
            </Group>
            <Switch
              checked={settings.reservationUpdates}
              onChange={(e) => updateSetting('reservationUpdates', e.currentTarget.checked)}
            />
          </Group>
          <Group justify="space-between">
            <Group gap="xs">
              <MapPin size="1rem" />
              <div>
                <Text fw={500}>Weather Alerts</Text>
                <Text size="sm" c="dimmed">
                  Severe weather warnings
                </Text>
              </div>
            </Group>
            <Switch
              checked={settings.weatherAlerts}
              onChange={(e) => updateSetting('weatherAlerts', e.currentTarget.checked)}
            />
          </Group>
        </Stack>
      </Card>
    </Stack>
  );

  const renderDisplaySettings = () => (
    <Stack gap="lg">
      <Card withBorder p="lg">
        <Title order={4} mb="md">
          Appearance
        </Title>
        <Grid>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <SegmentedControl
              label="Theme"
              value={settings.theme}
              onChange={(value) => updateSetting('theme', value)}
              data={[
                { label: 'Light', value: 'light' },
                { label: 'Dark', value: 'dark' },
                { label: 'Auto', value: 'auto' },
              ]}
              fullWidth
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <ColorInput
              label="Primary Color"
              value={settings.primaryColor}
              onChange={(value) => updateSetting('primaryColor', value)}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Select
              label="Font Size"
              value={settings.fontSize}
              onChange={(value) => updateSetting('fontSize', value)}
              data={[
                { value: 'small', label: 'Small' },
                { value: 'medium', label: 'Medium' },
                { value: 'large', label: 'Large' },
                { value: 'extra-large', label: 'Extra Large' },
              ]}
            />
          </Grid.Col>
        </Grid>
      </Card>

      <Card withBorder p="lg">
        <Title order={4} mb="md">
          Localization
        </Title>
        <Grid>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Select
              label="Language"
              value={settings.language}
              onChange={(value) => updateSetting('language', value)}
              data={[
                { value: 'en', label: 'English' },
                { value: 'es', label: 'Spanish' },
                { value: 'fr', label: 'French' },
                { value: 'pt', label: 'Portuguese' },
              ]}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Select
              label="Timezone"
              value={settings.timezone}
              onChange={(value) => updateSetting('timezone', value)}
              data={[
                { value: 'America/New_York', label: 'Eastern Time' },
                { value: 'America/Chicago', label: 'Central Time' },
                { value: 'America/Denver', label: 'Mountain Time' },
                { value: 'America/Los_Angeles', label: 'Pacific Time' },
              ]}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Select
              label="Currency"
              value={settings.currency}
              onChange={(value) => updateSetting('currency', value)}
              data={[
                { value: 'USD', label: 'US Dollar ($)' },
                { value: 'CAD', label: 'Canadian Dollar ($)' },
                { value: 'EUR', label: 'Euro (€)' },
                { value: 'GBP', label: 'British Pound (£)' },
              ]}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Select
              label="Date Format"
              value={settings.dateFormat}
              onChange={(value) => updateSetting('dateFormat', value)}
              data={[
                { value: 'MM/dd/yyyy', label: 'MM/DD/YYYY' },
                { value: 'dd/MM/yyyy', label: 'DD/MM/YYYY' },
                { value: 'yyyy-MM-dd', label: 'YYYY-MM-DD' },
              ]}
            />
          </Grid.Col>
        </Grid>
      </Card>
    </Stack>
  );

  const renderPlanningSettings = () => (
    <Stack gap="lg">
      <Card withBorder p="lg">
        <Title order={4} mb="md">
          Planning Style
        </Title>
        <Stack gap="md">
          <SegmentedControl
            label="Planning Approach"
            value={settings.planningStyle}
            onChange={(value) => updateSetting('planningStyle', value)}
            data={[
              { label: 'Relaxed', value: 'relaxed' },
              { label: 'Balanced', value: 'balanced' },
              { label: 'Detailed', value: 'detailed' },
              { label: 'Intensive', value: 'intensive' },
            ]}
            fullWidth
          />
          <Text size="sm" c="dimmed">
            {settings.planningStyle === 'relaxed' && 'Focus on major attractions with plenty of downtime'}
            {settings.planningStyle === 'balanced' && 'Mix of planned activities and flexible time'}
            {settings.planningStyle === 'detailed' && 'Comprehensive planning with optimized schedules'}
            {settings.planningStyle === 'intensive' && 'Maximum attractions and experiences per day'}
          </Text>
        </Stack>
      </Card>

      <Card withBorder p="lg">
        <Title order={4} mb="md">
          Park Strategy
        </Title>
        <Stack gap="md">
          <Group justify="space-between">
            <div>
              <Text fw={500}>Auto-plan Lightning Lane</Text>
              <Text size="sm" c="dimmed">
                Automatically suggest Lightning Lane selections
              </Text>
            </div>
            <Switch
              checked={settings.autoPlanLightningLane}
              onChange={(e) => updateSetting('autoPlanLightningLane', e.currentTarget.checked)}
            />
          </Group>
          <Group justify="space-between">
            <div>
              <Text fw={500}>Prefer Early Dining</Text>
              <Text size="sm" c="dimmed">
                Schedule dining reservations earlier in the day
              </Text>
            </div>
            <Switch
              checked={settings.preferEarlyDining}
              onChange={(e) => updateSetting('preferEarlyDining', e.currentTarget.checked)}
            />
          </Group>
          <Group justify="space-between">
            <div>
              <Text fw={500}>Avoid Crowded Days</Text>
              <Text size="sm" c="dimmed">
                Suggest less crowded parks when possible
              </Text>
            </div>
            <Switch
              checked={settings.avoidCrowdedDays}
              onChange={(e) => updateSetting('avoidCrowdedDays', e.currentTarget.checked)}
            />
          </Group>
          <Group justify="space-between">
            <div>
              <Text fw={500}>Show Wait Time Predictions</Text>
              <Text size="sm" c="dimmed">
                Display predicted wait times throughout the day
              </Text>
            </div>
            <Switch
              checked={settings.showWaitTimePredictions}
              onChange={(e) => updateSetting('showWaitTimePredictions', e.currentTarget.checked)}
            />
          </Group>
        </Stack>
      </Card>
    </Stack>
  );

  const renderBudgetSettings = () => (
    <Stack gap="lg">
      <Card withBorder p="lg">
        <Title order={4} mb="md">
          Daily Budget Limits
        </Title>
        <Grid>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <NumberInput
              label="Daily Budget"
              value={settings.dailyBudget}
              onChange={(value) => updateSetting('dailyBudget', value)}
              min={0}
              prefix="$"
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <NumberInput
              label="Souvenir Budget"
              value={settings.souvenirBudget}
              onChange={(value) => updateSetting('souvenirBudget', value)}
              min={0}
              prefix="$"
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <NumberInput
              label="Extra Budget"
              value={settings.extraBudget}
              onChange={(value) => updateSetting('extraBudget', value)}
              min={0}
              prefix="$"
            />
          </Grid.Col>
        </Grid>
      </Card>

      <Card withBorder p="lg">
        <Title order={4} mb="md">
          Budget Tracking
        </Title>
        <Stack gap="md">
          <Group justify="space-between">
            <div>
              <Text fw={500}>Track Spending</Text>
              <Text size="sm" c="dimmed">
                Monitor expenses throughout your trip
              </Text>
            </div>
            <Switch
              checked={settings.trackSpending}
              onChange={(e) => updateSetting('trackSpending', e.currentTarget.checked)}
            />
          </Group>
          <Group justify="space-between">
            <div>
              <Text fw={500}>Budget Alerts</Text>
              <Text size="sm" c="dimmed">
                Receive notifications when approaching budget limits
              </Text>
            </div>
            <Switch
              checked={settings.budgetAlerts}
              onChange={(e) => updateSetting('budgetAlerts', e.currentTarget.checked)}
            />
          </Group>
          <div>
            <Text fw={500} mb="xs">
              Alert Threshold
            </Text>
            <Slider
              value={settings.budgetThreshold}
              onChange={(value) => updateSetting('budgetThreshold', value)}
              min={50}
              max={95}
              step={5}
              marks={[
                { value: 50, label: '50%' },
                { value: 75, label: '75%' },
                { value: 90, label: '90%' },
              ]}
              label={(value) => `${value}%`}
            />
            <Text size="sm" c="dimmed">
              Get alerted when you've spent {settings.budgetThreshold}% of your budget
            </Text>
          </div>
        </Stack>
      </Card>
    </Stack>
  );

  const renderPrivacySettings = () => (
    <Stack gap="lg">
      <Card withBorder p="lg">
        <Title order={4} mb="md">
          Data Sharing
        </Title>
        <Stack gap="md">
          <Group justify="space-between">
            <div>
              <Text fw={500}>Share Location</Text>
              <Text size="sm" c="dimmed">
                Allow location sharing for better recommendations
              </Text>
            </div>
            <Switch
              checked={settings.shareLocation}
              onChange={(e) => updateSetting('shareLocation', e.currentTarget.checked)}
            />
          </Group>
          <Group justify="space-between">
            <div>
              <Text fw={500}>Share Reservations</Text>
              <Text size="sm" c="dimmed">
                Share reservation data with Disney services
              </Text>
            </div>
            <Switch
              checked={settings.shareReservations}
              onChange={(e) => updateSetting('shareReservations', e.currentTarget.checked)}
            />
          </Group>
          <Group justify="space-between">
            <div>
              <Text fw={500}>Analytics</Text>
              <Text size="sm" c="dimmed">
                Help improve the app with usage analytics
              </Text>
            </div>
            <Switch
              checked={settings.allowAnalytics}
              onChange={(e) => updateSetting('allowAnalytics', e.currentTarget.checked)}
            />
          </Group>
          <Group justify="space-between">
            <div>
              <Text fw={500}>Public Profile</Text>
              <Text size="sm" c="dimmed">
                Make your trip visible to other users
              </Text>
            </div>
            <Switch
              checked={settings.publicProfile}
              onChange={(e) => updateSetting('publicProfile', e.currentTarget.checked)}
            />
          </Group>
        </Stack>
      </Card>

      <Alert color="blue" icon={<Info size="1rem" />}>
        <Text size="sm">
          Your privacy is important to us. We only use your data to improve your Disney experience and never sell it to
          third parties.
        </Text>
      </Alert>
    </Stack>
  );

  const renderAdvancedSettings = () => (
    <Stack gap="lg">
      <Card withBorder p="lg">
        <Title order={4} mb="md">
          Data Management
        </Title>
        <Stack gap="md">
          <Group justify="space-between">
            <div>
              <Text fw={500}>Auto Sync</Text>
              <Text size="sm" c="dimmed">
                Automatically sync data across devices
              </Text>
            </div>
            <Switch checked={settings.dataSync} onChange={(e) => updateSetting('dataSync', e.currentTarget.checked)} />
          </Group>
          <Group justify="space-between">
            <div>
              <Text fw={500}>Auto Backup</Text>
              <Text size="sm" c="dimmed">
                Automatically backup your trip data
              </Text>
            </div>
            <Switch
              checked={settings.autoBackup}
              onChange={(e) => updateSetting('autoBackup', e.currentTarget.checked)}
            />
          </Group>
          <Group justify="space-between">
            <div>
              <Text fw={500}>Offline Mode</Text>
              <Text size="sm" c="dimmed">
                Download trip data for offline access
              </Text>
            </div>
            <Switch
              checked={settings.offlineMode}
              onChange={(e) => updateSetting('offlineMode', e.currentTarget.checked)}
            />
          </Group>
        </Stack>
      </Card>

      <Card withBorder p="lg">
        <Title order={4} mb="md">
          Developer Options
        </Title>
        <Stack gap="md">
          <Group justify="space-between">
            <div>
              <Text fw={500}>Debug Mode</Text>
              <Text size="sm" c="dimmed">
                Show debug information
              </Text>
            </div>
            <Switch
              checked={settings.debugMode}
              onChange={(e) => updateSetting('debugMode', e.currentTarget.checked)}
            />
          </Group>
          <Group justify="space-between">
            <div>
              <Text fw={500}>Beta Features</Text>
              <Text size="sm" c="dimmed">
                Enable experimental features
              </Text>
            </div>
            <Switch
              checked={settings.betaFeatures}
              onChange={(e) => updateSetting('betaFeatures', e.currentTarget.checked)}
            />
          </Group>
        </Stack>
      </Card>

      <Card withBorder p="lg">
        <Title order={4} mb="md">
          Data Export & Import
        </Title>
        <Grid>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Button fullWidth leftSection={<Download size="1rem" />} variant="light">
              Export Trip Data
            </Button>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Button fullWidth leftSection={<Upload size="1rem" />} variant="light">
              Import Trip Data
            </Button>
          </Grid.Col>
        </Grid>
      </Card>

      <Card withBorder p="lg" style={{ borderColor: 'var(--mantine-color-red-6)' }}>
        <Title order={4} mb="md" c="red">
          Danger Zone
        </Title>
        <Stack gap="md">
          <Alert color="red" icon={<AlertTriangle size="1rem" />}>
            <Text size="sm">These actions cannot be undone. Please proceed with caution.</Text>
          </Alert>
          <Group>
            <Button color="red" variant="light" leftSection={<Trash2 size="1rem" />}>
              Reset All Settings
            </Button>
            <Button color="red" leftSection={<Trash2 size="1rem" />} onClick={openDeleteModal}>
              Delete Trip
            </Button>
          </Group>
        </Stack>
      </Card>
    </Stack>
  );

  return (
    <Container size="xl">
      <Stack gap="lg">
        <div>
          <Title order={2} mb="md">
            Settings
          </Title>
          <Text c="dimmed" mb="lg">
            Customize your Disney trip planning experience
          </Text>
        </div>

        <Tabs value={selectedTab} onChange={(value) => setSelectedTab(value || 'profile')}>
          <Tabs.List>
            <Tabs.Tab value="profile" leftSection={<User size="0.9rem" />}>
              Profile
            </Tabs.Tab>
            <Tabs.Tab value="notifications" leftSection={<Bell size="0.9rem" />}>
              Notifications
            </Tabs.Tab>
            <Tabs.Tab value="display" leftSection={<Palette size="0.9rem" />}>
              Display
            </Tabs.Tab>
            <Tabs.Tab value="planning" leftSection={<Calendar size="0.9rem" />}>
              Planning
            </Tabs.Tab>
            <Tabs.Tab value="budget" leftSection={<DollarSign size="0.9rem" />}>
              Budget
            </Tabs.Tab>
            <Tabs.Tab value="privacy" leftSection={<Shield size="0.9rem" />}>
              Privacy
            </Tabs.Tab>
            <Tabs.Tab value="advanced" leftSection={<SettingsIcon size="0.9rem" />}>
              Advanced
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="profile" pt="lg">
            {renderProfileSettings()}
          </Tabs.Panel>

          <Tabs.Panel value="notifications" pt="lg">
            {renderNotificationSettings()}
          </Tabs.Panel>

          <Tabs.Panel value="display" pt="lg">
            {renderDisplaySettings()}
          </Tabs.Panel>

          <Tabs.Panel value="planning" pt="lg">
            {renderPlanningSettings()}
          </Tabs.Panel>

          <Tabs.Panel value="budget" pt="lg">
            {renderBudgetSettings()}
          </Tabs.Panel>

          <Tabs.Panel value="privacy" pt="lg">
            {renderPrivacySettings()}
          </Tabs.Panel>

          <Tabs.Panel value="advanced" pt="lg">
            {renderAdvancedSettings()}
          </Tabs.Panel>
        </Tabs>

        {/* Save Settings Button */}
        <Paper withBorder p="md">
          <Group justify="space-between">
            <Text size="sm" c="dimmed">
              Settings are automatically saved as you make changes
            </Text>
            <Group>
              <Button variant="light">Reset to Defaults</Button>
              <Button leftSection={<CheckCircle size="1rem" />}>Save All Changes</Button>
            </Group>
          </Group>
        </Paper>

        {/* Delete Trip Modal */}
        <Modal opened={deleteModalOpened} onClose={closeDeleteModal} title="Delete Trip" size="md">
          <Stack gap="md">
            <Alert color="red" icon={<AlertTriangle size="1rem" />}>
              <Text size="sm">
                This action will permanently delete "{trip.name}" and all associated data including:
              </Text>
              <ul style={{ margin: '0.5rem 0', paddingLeft: '1rem' }}>
                <li>All reservations</li>
                <li>Daily schedules</li>
                <li>Party member information</li>
                <li>Budget tracking data</li>
                <li>Settings and preferences</li>
              </ul>
              <Text size="sm" fw={500}>
                This action cannot be undone.
              </Text>
            </Alert>

            <TextInput
              label="Type the trip name to confirm deletion"
              placeholder="Lewis Family Disney Trip"
              description="You must type the exact trip name to confirm"
            />

            <Group justify="space-between">
              <Button variant="default" onClick={closeDeleteModal}>
                Cancel
              </Button>
              <Button color="red" leftSection={<Trash2 size="1rem" />}>
                Delete Trip Forever
              </Button>
            </Group>
          </Stack>
        </Modal>
      </Stack>
    </Container>
  );
};

export default SettingsPage;
