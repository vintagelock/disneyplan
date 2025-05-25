// src/components/AuthComponent.tsx
import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextInput,
  PasswordInput,
  Button,
  Title,
  Text,
  Anchor,
  Stack,
  Group,
  Alert,
  LoadingOverlay,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconMail, IconLock, IconAlertCircle } from '@tabler/icons-react';
import { useAuth } from '../lib/hooks/useAuth';

interface AuthFormData {
  email: string;
  password: string;
  confirmPassword?: string;
  fullName?: string;
}

const AuthComponent: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const { signIn, signUp } = useAuth();

  const form = useForm<AuthFormData>({
    initialValues: {
      email: '',
      password: '',
      confirmPassword: '',
      fullName: '',
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: (value) => (value.length < 6 ? 'Password must be at least 6 characters' : null),
      confirmPassword: (value, values) => (!isLogin && value !== values.password ? 'Passwords do not match' : null),
      fullName: (value) => (!isLogin && !value ? 'Full name is required' : null),
    },
  });

  const handleSubmit = async (values: AuthFormData) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (isLogin) {
        const { error } = await signIn(values.email, values.password);
        if (error) throw error;
      } else {
        const { error } = await signUp(values.email, values.password);
        if (error) throw error;
        setSuccess('Check your email for a confirmation link!');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError(null);
    setSuccess(null);
    form.reset();
  };

  return (
    <Container size="xs" style={{ paddingTop: '4rem' }}>
      <Paper withBorder shadow="md" p="xl" radius="md" pos="relative">
        <LoadingOverlay visible={loading} />

        <Stack gap="lg">
          <div style={{ textAlign: 'center' }}>
            <Title order={2} mb="xs">
              {isLogin ? 'Welcome Back!' : 'Create Account'}
            </Title>
            <Text c="dimmed" size="sm">
              {isLogin ? 'Sign in to your Disney Trip Planner account' : 'Start planning your magical Disney vacation'}
            </Text>
          </div>

          {error && (
            <Alert icon={<IconAlertCircle size="1rem" />} color="red">
              {error}
            </Alert>
          )}

          {success && <Alert color="green">{success}</Alert>}

          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack gap="md">
              {!isLogin && (
                <TextInput
                  label="Full Name"
                  placeholder="Enter your full name"
                  {...form.getInputProps('fullName')}
                  required={!isLogin}
                />
              )}

              <TextInput
                label="Email"
                placeholder="your@email.com"
                leftSection={<IconMail size="1rem" />}
                {...form.getInputProps('email')}
                required
              />

              <PasswordInput
                label="Password"
                placeholder="Your password"
                leftSection={<IconLock size="1rem" />}
                {...form.getInputProps('password')}
                required
              />

              {!isLogin && (
                <PasswordInput
                  label="Confirm Password"
                  placeholder="Confirm your password"
                  leftSection={<IconLock size="1rem" />}
                  {...form.getInputProps('confirmPassword')}
                  required
                />
              )}

              <Button type="submit" fullWidth size="md" loading={loading}>
                {isLogin ? 'Sign In' : 'Create Account'}
              </Button>
            </Stack>
          </form>

          <div style={{ textAlign: 'center' }}>
            <Text size="sm" c="dimmed">
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
              <Anchor component="button" type="button" onClick={toggleMode}>
                {isLogin ? 'Sign up' : 'Sign in'}
              </Anchor>
            </Text>
          </div>

          {isLogin && (
            <div style={{ textAlign: 'center' }}>
              <Text size="xs" c="dimmed">
                Demo credentials: demo@disney.com / password123
              </Text>
            </div>
          )}
        </Stack>
      </Paper>

      <Paper mt="xl" p="md" withBorder>
        <Stack gap="xs">
          <Text fw={500} size="sm">
            🏰 Disney Trip Planner Features:
          </Text>
          <Text size="xs" c="dimmed">
            • Plan your perfect Disney World vacation
          </Text>
          <Text size="xs" c="dimmed">
            • Track Lightning Lane reservations
          </Text>
          <Text size="xs" c="dimmed">
            • Manage dining reservations
          </Text>
          <Text size="xs" c="dimmed">
            • Daily itinerary planning
          </Text>
          <Text size="xs" c="dimmed">
            • Hotel booking management
          </Text>
          <Text size="xs" c="dimmed">
            • Real-time wait times
          </Text>
        </Stack>
      </Paper>
    </Container>
  );
};

export default AuthComponent;
