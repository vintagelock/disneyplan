import { Center, Container, Paper, rem, Stack, Text, Title } from '@mantine/core';

// Placeholder Section Component
export interface PlaceholderSectionProps {
  title: string;
  description: string;
}

export const PlaceholderSection: React.FC<PlaceholderSectionProps> = ({ title, description }) => (
  <Container size="xl">
    <Paper shadow="sm" p="xl" radius="md" withBorder>
      <Center>
        <Stack align="center" gap="lg">
          <Title order={2}>{title}</Title>
          <Text c="dimmed" ta="center" size="lg">
            {description}
          </Text>
          <Text size={rem(80)}>🚧</Text>
          <Text size="sm" c="dimmed">
            This section will be implemented in the next phase
          </Text>
        </Stack>
      </Center>
    </Paper>
  </Container>
);
