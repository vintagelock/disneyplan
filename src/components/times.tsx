import React, { useState, useMemo, useEffect } from 'react';
import {
  Container,
  Title,
  Text,
  Grid,
  Card,
  Badge,
  Group,
  Stack,
  Select,
  Button,
  Loader,
  Alert,
  SimpleGrid,
  Flex,
  Paper,
  Divider,
  ActionIcon,
  Tooltip,
  ThemeIcon,
  Box,
  Center,
} from '@mantine/core';
import {
  Clock as IconClock,
  Pin as IconMapPin,
  Users as IconUsers,
  Calendar as IconCalendar,
  Star as IconStar,
  AlertCircle as IconAlertCircle,
  Check as IconCheck,
  XCircle as IconX,
  PauseCircle as IconPlayerPause,
  RefreshCcw as IconRefresh,
  Building as IconBuildingStore,
  Theater as IconTheater,
  RollerCoaster as IconRollercoaster,
} from 'lucide-react';

const DisneyWaitTimesTest = () => {
  const [selectedPark, setSelectedPark] = useState('ALL');
  const [selectedType, setSelectedType] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // API fetch function
  const getCurrentWaitTimes = async (id) => {
    try {
      const response = await fetch(`https://api.themeparks.wiki/v1/entity/${id}/live`, {
        method: 'GET',
        headers: {
          accept: 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching wait times:', error);
      throw error;
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Walt Disney World Resort ID
        const disneyWorldId = 'e957da41-3552-4cf6-b636-5babc5cbc4e5';
        const data = await getCurrentWaitTimes(disneyWorldId);
        setApiData(data);
        setLastUpdated(new Date());
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Manual refresh function
  const handleRefresh = async () => {
    setLoading(true);
    setError(null);
    try {
      const disneyWorldId = 'e957da41-3552-4cf6-b636-5babc5cbc4e5';
      const data = await getCurrentWaitTimes(disneyWorldId);
      setApiData(data);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Process and organize the data
  const processedData = useMemo(() => {
    if (!apiData || !apiData.liveData) {
      return { grouped: {}, parks: {}, allItems: [] };
    }

    const data = apiData.liveData || [];

    // Group by entity type
    const grouped = data.reduce((acc, item) => {
      const type = item.entityType;
      if (!acc[type]) acc[type] = [];
      acc[type].push(item);
      return acc;
    }, {});

    // Get unique parks
    const parks = data.reduce((acc, item) => {
      if (item.entityType === 'PARK') {
        acc[item.id] = item.name;
      }
      return acc;
    }, {});

    return { grouped, parks, allItems: data };
  }, [apiData]);

  // Filter data based on selections
  const filteredData = useMemo(() => {
    let filtered = processedData.allItems;

    if (selectedPark !== 'ALL') {
      filtered = filtered.filter((item) => item.parkId === selectedPark || item.id === selectedPark);
    }

    if (selectedType !== 'ALL') {
      filtered = filtered.filter((item) => item.entityType === selectedType);
    }

    if (statusFilter !== 'ALL') {
      filtered = filtered.filter((item) => item.status === statusFilter);
    }

    return filtered;
  }, [processedData.allItems, selectedPark, selectedType, statusFilter]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'OPERATING':
        return <IconCheck size={16} />;
      case 'CLOSED':
        return <IconX size={16} />;
      case 'REFURBISHMENT':
        return <IconPlayerPause size={16} />;
      default:
        return <IconAlertCircle size={16} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'OPERATING':
        return 'green';
      case 'CLOSED':
        return 'red';
      case 'REFURBISHMENT':
        return 'yellow';
      default:
        return 'gray';
    }
  };

  const getEntityIcon = (entityType) => {
    switch (entityType) {
      case 'ATTRACTION':
        return <IconRollercoaster size={16} />;
      case 'RESTAURANT':
        return <IconBuildingStore size={16} />;
      case 'SHOW':
        return <IconTheater size={16} />;
      default:
        return <IconMapPin size={16} />;
    }
  };

  const formatWaitTime = (waitTime) => {
    if (waitTime === null || waitTime === undefined) return 'N/A';
    return `${waitTime} min`;
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'N/A';
    return new Date(timeString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const EntityCard = ({ item }) => (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Stack gap="md">
        {/* Header */}
        <Group position="apart" align="flex-start">
          <Box style={{ flex: 1 }}>
            <Group spacing="xs" mb="xs">
              <ThemeIcon size="sm" color="blue" variant="light">
                {getEntityIcon(item.entityType)}
              </ThemeIcon>
              <Title order={4} lineClamp={2}>
                {item.name}
              </Title>
            </Group>

            <Group spacing="xs">
              <Badge size="sm" color="gray" variant="light">
                {item.entityType}
              </Badge>
              {processedData.parks[item.parkId] && (
                <Group spacing={4}>
                  <IconMapPin size={12} />
                  <Text size="xs" c="dimmed">
                    {processedData.parks[item.parkId]}
                  </Text>
                </Group>
              )}
            </Group>
          </Box>

          <Badge leftSection={getStatusIcon(item.status)} color={getStatusColor(item.status)} variant="light">
            {item.status}
          </Badge>
        </Group>

        {/* Wait Times */}
        {item.queue && (
          <SimpleGrid cols={2} spacing="xs">
            {item.queue.STANDBY && (
              <Paper withBorder p="xs">
                <Group spacing="xs" mb={4}>
                  <IconClock size={16} color="var(--mantine-color-blue-6)" />
                  <Text size="sm" fw={500} c="blue">
                    Standby
                  </Text>
                </Group>
                <Text size="lg" fw={700} c="blue">
                  {formatWaitTime(item.queue.STANDBY.waitTime)}
                </Text>
              </Paper>
            )}

            {item.queue.RETURN_TIME && item.queue.RETURN_TIME.state === 'AVAILABLE' && (
              <Paper withBorder p="xs">
                <Group spacing="xs" mb={4}>
                  <IconStar size={16} color="var(--mantine-color-green-6)" />
                  <Text size="sm" fw={500} c="green">
                    Lightning Lane
                  </Text>
                </Group>
                <Text size="sm" c="green">
                  {formatTime(item.queue.RETURN_TIME.returnStart)}
                </Text>
              </Paper>
            )}
          </SimpleGrid>
        )}

        {/* Dining Wait Times */}
        {item.diningAvailability && item.diningAvailability.length > 0 && (
          <Paper withBorder p="xs">
            <Group spacing="xs" mb="xs">
              <IconUsers size={16} color="var(--mantine-color-orange-6)" />
              <Text size="sm" fw={500} c="orange">
                Dining Availability
              </Text>
            </Group>
            <SimpleGrid cols={4} spacing={4}>
              {item.diningAvailability.slice(0, 8).map((dining, idx) => (
                <Text key={idx} size="xs" c="orange">
                  {dining.partySize}p: {formatWaitTime(dining.waitTime)}
                </Text>
              ))}
            </SimpleGrid>
          </Paper>
        )}

        {/* Show Times */}
        {item.showtimes && item.showtimes.length > 0 && (
          <Paper withBorder p="xs">
            <Group spacing="xs" mb="xs">
              <IconCalendar size={16} color="var(--mantine-color-violet-6)" />
              <Text size="sm" fw={500} c="violet">
                Show Times
              </Text>
            </Group>
            <Group spacing={4}>
              {item.showtimes.slice(0, 4).map((show, idx) => (
                <Badge key={idx} size="xs" color="violet" variant="light">
                  {formatTime(show.startTime)}
                </Badge>
              ))}
              {item.showtimes.length > 4 && (
                <Text size="xs" color="violet">
                  +{item.showtimes.length - 4} more
                </Text>
              )}
            </Group>
          </Paper>
        )}

        <Divider />

        {/* Footer */}
        <Group position="apart">
          {item.operatingHours && item.operatingHours.length > 0 && (
            <Text size="xs" c="dimmed">
              <strong>Hours:</strong> {formatTime(item.operatingHours[0].startTime)} -{' '}
              {formatTime(item.operatingHours[0].endTime)}
            </Text>
          )}
          <Text size="xs" c="dimmed">
            Updated: {new Date(item.lastUpdated).toLocaleTimeString()}
          </Text>
        </Group>
      </Stack>
    </Card>
  );

  const entityTypes = ['ALL', 'ATTRACTION', 'RESTAURANT', 'SHOW', 'PARK'];
  const statusOptions = ['ALL', 'OPERATING', 'CLOSED', 'REFURBISHMENT'];

  // Loading state
  if (loading) {
    return (
      <Container size="xl" py="xl">
        <Center style={{ height: 400 }}>
          <Stack align="center" gap="md">
            <Loader size="lg" />
            <Text color="dimmed">Loading Disney World data...</Text>
          </Stack>
        </Center>
      </Container>
    );
  }

  // Error state
  if (error) {
    return (
      <Container size="xl" py="xl">
        <Alert icon={<IconAlertCircle size={16} />} title="Error Loading Data" color="red" withCloseButton={false}>
          <Stack gap="md">
            <Text>{error}</Text>
            <Button color="red" leftSection={<IconRefresh size={16} />} onClick={handleRefresh}>
              Try Again
            </Button>
          </Stack>
        </Alert>
      </Container>
    );
  }

  return (
    <Container size="xl" py="xl">
      {/* Header */}
      <Group position="apart" mb="xl">
        <Stack gap="xs">
          <Title order={1}>{apiData?.name || 'Walt Disney World® Resort'}</Title>
          <Text c="dimmed">Live park data and wait times</Text>
          {lastUpdated && (
            <Text size="sm" c="dimmed">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </Text>
          )}
        </Stack>

        <Tooltip label="Refresh data">
          <ActionIcon size="lg" variant="filled" loading={loading} onClick={handleRefresh}>
            <IconRefresh size={18} />
          </ActionIcon>
        </Tooltip>
      </Group>

      {/* Filters */}
      <Card withBorder mb="xl" p="md">
        <SimpleGrid cols={{ base: 1, md: 3 }} spacing="md">
          <Select
            label="Park"
            value={selectedPark}
            onChange={setSelectedPark}
            data={[
              { value: 'ALL', label: 'All Parks' },
              ...Object.entries(processedData.parks).map(([id, name]) => ({
                value: id,
                label: name,
              })),
            ]}
          />

          <Select
            label="Type"
            value={selectedType}
            onChange={setSelectedType}
            data={entityTypes.map((type) => ({ value: type, label: type }))}
          />

          <Select
            label="Status"
            value={statusFilter}
            onChange={setStatusFilter}
            data={statusOptions.map((status) => ({ value: status, label: status }))}
          />
        </SimpleGrid>
      </Card>

      {/* Results Summary */}
      <Group mb="md">
        <Text c="dimmed">
          Showing {filteredData.length} results
          {selectedPark !== 'ALL' && ` in ${processedData.parks[selectedPark] || 'selected park'}`}
          {selectedType !== 'ALL' && ` • ${selectedType.toLowerCase()}s only`}
          {statusFilter !== 'ALL' && ` • ${statusFilter.toLowerCase()} only`}
        </Text>
      </Group>

      {/* Results Grid */}
      {filteredData.length > 0 ? (
        <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="md">
          {filteredData.map((item) => (
            <EntityCard key={item.id} item={item} />
          ))}
        </SimpleGrid>
      ) : (
        <Paper withBorder p="xl">
          <Center>
            <Stack align="center" gap="md">
              <ThemeIcon size={60} color="gray" variant="light">
                <IconAlertCircle size={30} />
              </ThemeIcon>
              <Title order={3} c="dimmed">
                No results found
              </Title>
              <Text color="dimmed">Try adjusting your filters</Text>
            </Stack>
          </Center>
        </Paper>
      )}
    </Container>
  );
};

export default DisneyWaitTimesTest;
